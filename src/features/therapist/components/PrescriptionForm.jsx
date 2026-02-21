import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Editor from 'react-simple-wysiwyg';
import { useLanguage } from '../../../contexts';
import { patientService } from '../../../services/patientService';
import { prescriptionService } from '../../../services/prescriptionService';
import { useToast } from '../../../components/ui';
import { EXERCISE_METADATA } from '../../../constants/exerciseData';
import { useLazyGetPrescriptionByIdQuery } from '../../../services/api/prescriptionsApi';
import { useSendTherapistReplyMutation } from '../../../services/api/patientsApi';

export function PrescriptionForm({ isOpen, onCancel, onSubmit, initialValues, requestData }) {
  const { t } = useLanguage();
  const toast = useToast();
  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      patientName: '',
      patientId: '',
      symptoms: '',
      nextAppointmentDate: '',
      exercises: []
    }
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        patientName: initialValues.patient?.full_name || '',
        patientId: initialValues.patient_id || initialValues.patient?.id || '',
        symptoms: initialValues.symptoms || '',
        nextAppointmentDate: initialValues.next_appointment_date ? new Date(initialValues.next_appointment_date).toISOString().split('T')[0] : '',
        exercises: initialValues.exercises || []
      });
      setSearchTerm(initialValues.patient?.full_name || '');
    }
  }, [initialValues, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises"
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New states for reply functionality
  const [replyText, setReplyText] = useState('');
  const [updatePrescription, setUpdatePrescription] = useState(false);
  const [fetchedPrescription, setFetchedPrescription] = useState(null);
  
  // Lazy query for fetching prescription by ID
  const [getPrescription, { isLoading: isLoadingPrescription }] = useLazyGetPrescriptionByIdQuery();
  
  // Mutation for sending therapist reply
  const [sendReply] = useSendTherapistReplyMutation();

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoadingPatients(true);
      try {
        const token = localStorage.getItem('token');
        const data = await patientService.getPatients(token);
        // Store full patient objects instead of just names
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Fallback to empty array on error
        setPatients([]);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => {
    const name = p.full_name || p.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handlePatientSelect = (patient, field) => {
    const patientName = patient.full_name || patient.name;
    field.onChange(patientName);
    setValue('patientId', patient.id);
    setSearchTerm(patientName);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e, field) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredPatients.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredPatients[selectedIndex]) {
          handlePatientSelect(filteredPatients[selectedIndex], field);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Fetch prescription when "Yes" is selected - using prescription ID
  useEffect(() => {
    if (updatePrescription && requestData?.prescriptionId && !fetchedPrescription) {
      const fetchPrescription = async () => {
        try {
          const result = await getPrescription(requestData.prescriptionId).unwrap();
          if (result) {
            setFetchedPrescription(result);
            // Populate form with fetched prescription data
            reset({
              patientName: result.patient?.full_name || '',
              patientId: result.patient_id || result.patient?.id || '',
              symptoms: result.symptoms || '',
              nextAppointmentDate: result.next_appointment_date ? new Date(result.next_appointment_date).toISOString().split('T')[0] : '',
              exercises: result.exercises || []
            });
            setSearchTerm(result.patient?.full_name || '');
          }
        } catch (error) {
          console.error('Failed to fetch prescription:', error);
          toast.error('Failed to load prescription data');
        }
      };
      fetchPrescription();
    }
  }, [updatePrescription, requestData, fetchedPrescription, getPrescription, reset, toast]);


  const handleFormSubmit = async (data) => {
    console.log("Form Data:", data);

    setIsSubmitting(true);
    try {
      // Scenario 1: Reply to patient request
      if (requestData) {
        // Validate reply text
        if (!replyText || !replyText.trim()) {
          toast.error("Please enter a reply");
          setIsSubmitting(false);
          return;
        }

        // Send reply to patient
        await sendReply({ 
          requestId: requestData.id, 
          reply: replyText 
        }).unwrap();
        
        console.log("✅ Reply sent successfully");

        // If "Yes" to update prescription, also update the prescription
        if (updatePrescription) {
          // Validate prescription fields
          if (!data.patientId) {
            toast.error("Please select a patient");
            setIsSubmitting(false);
            return;
          }

          if (!data.symptoms || data.symptoms.trim() === '') {
            toast.error("Please enter symptoms and diagnosis");
            setIsSubmitting(false);
            return;
          }

          if (!data.exercises || data.exercises.length === 0) {
            toast.error("Please add at least one exercise");
            setIsSubmitting(false);
            return;
          }

          const token = localStorage.getItem('token');
          const prescriptionData = {
            patient_id: data.patientId,
            symptoms: data.symptoms,
            next_appointment_date: data.nextAppointmentDate,
            exercises: data.exercises,
          };

          // Update prescription using the fetched prescription ID
          if (fetchedPrescription?.id) {
            await prescriptionService.updatePrescription(fetchedPrescription.id, prescriptionData, token);
            console.log("✅ Prescription updated successfully");
            toast.success("Reply sent and prescription updated successfully!");
          }
        } else {
          toast.success("Reply sent successfully!");
        }

        // Call parent onSubmit
        if (onSubmit) onSubmit({ reply: replyText, prescriptionUpdated: updatePrescription });
        
        // Reset form and states
        reset({
          patientName: '',
          patientId: '',
          symptoms: '',
          nextAppointmentDate: '',
          exercises: []
        });
        setReplyText('');
        setUpdatePrescription(false);
        setFetchedPrescription(null);
        setSearchTerm('');
        
      } else {
        // Scenario 2: Regular prescription create/update (no request data)
        // Validate required fields
        if (!data.patientId) {
          toast.error("Please select a patient");
          setIsSubmitting(false);
          return;
        }

        if (!data.symptoms || data.symptoms.trim() === '') {
          toast.error("Please enter symptoms and diagnosis");
          setIsSubmitting(false);
          return;
        }

        if (!data.exercises || data.exercises.length === 0) {
          toast.error("Please add at least one exercise");
          setIsSubmitting(false);
          return;
        }

        const token = localStorage.getItem('token');
        const prescriptionData = {
          patient_id: data.patientId,
          symptoms: data.symptoms,
          next_appointment_date: data.nextAppointmentDate,
          exercises: data.exercises,
        };

        let response;
        if (initialValues && initialValues.id) {
          response = await prescriptionService.updatePrescription(initialValues.id, prescriptionData, token);
          toast.success("Prescription updated successfully!");
        } else {
          response = await prescriptionService.createPrescription(prescriptionData, token);
          toast.success("Prescription created successfully!");
        }

        // Call the parent onSubmit if provided
        if (onSubmit) onSubmit(response);
        
        // Reset form
        reset({
          patientName: '',
          patientId: '',
          symptoms: '',
          nextAppointmentDate: '',
          exercises: []
        });
        setSearchTerm('');
      }

    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error.message || "Failed to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">
            {requestData ? 'Reply to Patient Request' : (initialValues?.id ? 'Update Prescription' : 'Create Prescription')}
          </h3>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Reply Section - Only show when requestData exists */}
            {requestData && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Side: Patient Request Details - Compact */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-text-muted dark:text-slate-400 mb-2">Patient Request</p>
                    
                    <div className="text-sm space-y-1">
                      <p className="text-text-primary dark:text-slate-200">
                        <span className="font-semibold text-xs text-text-muted dark:text-slate-400">Reason:</span> {requestData.reason}
                      </p>
                      
                      {requestData.exerciseName && (
                        <p className="text-text-primary dark:text-slate-200">
                          <span className="font-semibold text-xs text-text-muted dark:text-slate-400">Exercise:</span> {requestData.exerciseName}
                        </p>
                      )}
                      
                      {requestData.notes && (
                        <p className="text-text-primary dark:text-slate-200 line-clamp-2">
                          <span className="font-semibold text-xs text-text-muted dark:text-slate-400">Details:</span> {requestData.notes}
                        </p>
                      )}
                      
                      {(requestData.painLocation || requestData.painLevel) && (
                        <p className="text-text-primary dark:text-slate-200">
                          <span className="font-semibold text-xs text-text-muted dark:text-slate-400">Pain:</span> 
                          {requestData.painLocation && <> {requestData.painLocation}</>}
                          {requestData.painLevel && <> (Level {requestData.painLevel}/10)</>}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Reply and Update Inputs */}
                  <div className="space-y-3">
                    {/* Reply Textarea */}
                    <div>
                      <label className="block text-xs font-medium text-text-body dark:text-slate-200 mb-1">
                        Reply *
                      </label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type reply..."
                        className="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows={2}
                        required
                      />
                    </div>

                    {/* Update Prescription Toggle */}
                    <div>
                      <label className="block text-xs font-medium text-text-body dark:text-slate-200 mb-1">
                        Update Prescription?
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setUpdatePrescription(false)}
                          className={`flex-1 py-2 text-sm rounded-lg font-medium transition ${
                            !updatePrescription
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 dark:bg-slate-700 text-text-primary dark:text-slate-200'
                          }`}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpdatePrescription(true)}
                          className={`flex-1 py-2 text-sm rounded-lg font-medium transition ${
                            updatePrescription
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 dark:bg-slate-700 text-text-primary dark:text-slate-200'
                          }`}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prescription Form - Show always if no requestData, or if updatePrescription is true */}
            {(!requestData || updatePrescription) && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Search - Autocomplete */}
              <div className="relative">
                <label className="block text-text-body dark:text-slate-200 font-medium mb-2">
                  Patient Name
                </label>
                <Controller
                  name="patientName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowSuggestions(true);
                          setSelectedIndex(-1);
                          field.onChange(e.target.value);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => {
                          // Delay to allow click on dropdown item
                          setTimeout(() => {
                            setShowSuggestions(false);
                            setSelectedIndex(-1);
                          }, 200);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, field)}
                        placeholder={isLoadingPatients ? "Loading patients..." : "Search patient..."}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                        autoComplete="off"
                      />
                      {showSuggestions && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, index) => (
                              <div
                                key={index}
                                onMouseDown={(e) => {
                                  // Prevent default to avoid blurring the input immediately if needed, 
                                  // but mainly we want to capture the click before blur
                                  e.preventDefault(); 
                                  handlePatientSelect(patient, field);
                                }}
                                className={`px-4 py-2 cursor-pointer text-text-primary dark:text-slate-200 transition-colors ${index === selectedIndex
                                    ? 'bg-primary/10 dark:bg-primary/20'
                                    : 'hover:bg-gray-100 dark:hover:bg-slate-600'
                                  }`}
                              >
                                {patient.full_name || patient.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-text-muted dark:text-slate-400">
                              No patients found
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                />
                {/* Hidden field for patient ID */}
                <input type="hidden" {...register('patientId')} />
              </div>

              {/* Next Appointment Date */}
              <div>
                <label className="block text-text-body dark:text-slate-200 font-medium mb-2">
                  Next Appointment Date
                </label>
                <input
                  type="date"
                  {...register('nextAppointmentDate')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Symptoms */}
              <div className="flex flex-col h-full">
                <label className="block text-text-body dark:text-slate-200 font-medium mb-2">
                  Symptoms & Diagnosis
                </label>
                <div className="flex-1 bg-white dark:bg-slate-700 rounded-lg text-text-primary dark:text-slate-200 overflow-hidden [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 mb-4">
                  <Controller
                    name="symptoms"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        value={field.value}
                        onChange={field.onChange}
                        containerProps={{ style: { height: '100%', minHeight: '300px', border: 'none' } }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Right Column: Exercises */}
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-text-body dark:text-slate-200 font-medium">
                    Prescribed Exercises
                  </label>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700/50 relative group">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title="Remove Exercise"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      <div className="space-y-4 mb-4">
                        {/* Row 1: Exercise Name */}
                        <div>
                          <label className="block text-xs font-medium text-text-muted dark:text-slate-400 mb-1">Exercise</label>
                          <select
                            {...register(`exercises.${index}.name`)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-text-primary dark:text-white focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select...</option>
                            {Object.entries(EXERCISE_METADATA).map(([key, data]) => (
                              <option key={key} value={key}>
                                {data.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Row 2: Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-text-muted dark:text-slate-400 mb-1">Reps</label>
                            <input
                              type="text"
                              {...register(`exercises.${index}.reps`)}
                              placeholder="e.g. 3x10"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-text-primary dark:text-white focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          
                          <div className="min-w-0">
                            <label className="block text-xs font-medium text-text-muted dark:text-slate-400 mb-1">Frequency</label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                {...register(`exercises.${index}.frequencyValue`)}
                                placeholder="3"
                                min="1"
                                className="w-16 flex-shrink-0 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-text-primary dark:text-white focus:ring-2 focus:ring-primary"
                              />
                              <select
                                {...register(`exercises.${index}.frequencyPeriod`)}
                                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-text-primary dark:text-white focus:ring-2 focus:ring-primary"
                              >
                                <option value="">Select...</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <label className="block text-xs font-medium text-text-muted dark:text-slate-400 mb-1">Duration</label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                {...register(`exercises.${index}.durationValue`)}
                                placeholder="2"
                                min="1"
                                className="w-16 flex-shrink-0 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-text-primary dark:text-white focus:ring-2 focus:ring-primary"
                              />
                              <select
                                {...register(`exercises.${index}.durationUnit`)}
                                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-text-primary dark:text-white focus:ring-2 focus:ring-primary"
                              >
                                <option value="">Select...</option>
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conditional Rep Condition for Toe Touch */}
                      {watch(`exercises.${index}.name`) === 'toe_touch' && (
                        <div className="mb-4">
                          <label className="block text-xs font-medium text-text-muted dark:text-slate-400 mb-1">Rep Condition</label>
                          <input
                            type="text"
                            {...register(`exercises.${index}.rep_condition`)}
                            placeholder="e.g. Keep knees straight"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-text-muted dark:text-slate-400 mb-1">Notes</label>
                        <div className="bg-white dark:bg-slate-700 rounded-lg text-text-primary dark:text-slate-200 overflow-hidden [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                          <div className="bg-white dark:bg-slate-700 rounded-lg text-text-primary dark:text-slate-200 overflow-hidden">
                            <Controller
                              name={`exercises.${index}.notes`}
                              control={control}
                              defaultValue="1. "
                              render={({ field }) => (
                                <textarea
                                  {...field}
                                  rows={3}
                                  className="w-full px-3 py-2 border-none bg-transparent focus:ring-0 resize-none text-sm"
                                  placeholder="1. "
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const start = e.target.selectionStart;
                                      const end = e.target.selectionEnd;
                                      const value = field.value || '';
                                      const before = value.substring(0, start);
                                      const after = value.substring(end);

                                      // Find the number of the current line
                                      const currentLine = before.split('\n').pop();
                                      const match = currentLine.match(/^(\d+)\./);
                                      const nextNum = match ? parseInt(match[1]) + 1 : 1;

                                      const newValue = before + `\n${nextNum}. ` + after;
                                      field.onChange(newValue);

                                      // Restore cursor position (need setTimeout to wait for render)
                                      setTimeout(() => {
                                        e.target.selectionStart = e.target.selectionEnd = start + nextNum.toString().length + 3;
                                      }, 0);
                                    }
                                  }}
                                  onFocus={(e) => {
                                    if (!field.value) {
                                      field.onChange("1. ");
                                    }
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => append({ name: '', reps: '', frequency: '', durationValue: '', durationUnit: '', notes: '' })}
                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-text-muted dark:text-slate-400 font-medium hover:border-primary hover:text-primary transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Exercise
                  </button>
                </div>
              </div>
            </div>
            </>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 text-text-primary dark:text-slate-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {requestData && updatePrescription ? 'Updating...' : (initialValues?.id ? 'Updating...' : 'Creating...')}
                  </>
                ) : (
                  requestData && updatePrescription ? 'Update Prescription' : (requestData ? 'Send Reply' : (initialValues?.id ? 'Update Prescription' : 'Create Prescription'))
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../../../contexts";
import { PrescriptionForm } from "../PrescriptionForm";
import { prescriptionService } from "../../../../services/prescriptionService";
import { patientService } from "../../../../services/patientService";
import { ConfirmModal } from "../../../../components/ui/ConfirmModal";
import html2pdf from 'html2pdf.js';

export function PrescriptionsSection() {
  const { t } = useLanguage();
  const location = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [todayExercisesMap, setTodayExercisesMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPrescription, setEditingPrescription] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);

  // View Mode State
  const [viewMode, setViewMode] = useState('details'); // 'details', 'reports', 'single_report'
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Check for navigation state to open a specific prescription
  useEffect(() => {
    // In a section component, useLocation might need to be imported or props passed. 
    // Assuming we can use useLocation here since it's inside Router context.
    if (location.state?.openPrescriptionId && prescriptions.length > 0) {
      const targetId = location.state.openPrescriptionId;
      const found = prescriptions.find(p => p.id === targetId || p.prescription_id === targetId);
      if (found) {
        setSelectedPrescription(found);
        setViewMode('details');
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, prescriptions]);

  const fetchPrescriptions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch prescriptions and patients in parallel to handle "Unknown" names
      const [prescriptionsData, patientsData] = await Promise.all([
        prescriptionService.getPrescriptions(token),
        patientService.getPatients(token).catch(err => {
          console.warn("Failed to fetch patients list for cross-referencing", err);
          return [];
        })
      ]);

      console.log("Therapist Prescriptions (raw):", prescriptionsData);
      console.log("Patients Data (for lookup):", patientsData);

      // Create a map for quick lookup: patientId -> patientData
      const patientsMap = {};
      if (Array.isArray(patientsData)) {
        patientsData.forEach(p => {
          const pId = p.id || p.patient_id;
          if (pId) patientsMap[pId] = p;
        });
      }

      // Merge patient details if missing in prescription
      const mergedPrescriptions = Array.isArray(prescriptionsData) ? prescriptionsData.map(pres => {
        // Identify patient ID either from the nested object or the root property
        const patientId = pres.patient?.id || pres.patient_id;
        
        // If we have an ID and the name is missing/unknown, try to fill it from patientsMap
        if (patientId && patientsMap[patientId]) {
          const knownPatient = patientsMap[patientId];
          
          // Clone patient object or create new if null
          const patientObj = pres.patient ? { ...pres.patient } : { id: patientId };
          
          // Fill missing or "Unknown" fields
          if (!patientObj.full_name || patientObj.full_name === 'Unknown') {
            patientObj.full_name = knownPatient.full_name || knownPatient.name;
          }
          if (!patientObj.email) {
            patientObj.email = knownPatient.email;
          }
          
          return { ...pres, patient: patientObj };
        }
        
        return pres;
      }) : [];

      console.log("Therapist Prescriptions (merged):", mergedPrescriptions);
      setPrescriptions(mergedPrescriptions);

      // Fetch today exercises for unique patients
      try {
        const uniquePatientIds = [...new Set(mergedPrescriptions.map(p => p.patient?.id).filter(Boolean))];
        if (uniquePatientIds.length > 0) {
          const exercisesMap = {};
          await Promise.all(uniquePatientIds.map(async (pid) => {
            try {
              const res = await patientService.getTodayExercises(pid, token);
              if (res.exercises) {
                exercisesMap[pid] = res.exercises;
              }
            } catch (e) {
              console.warn(`Failed to fetch exercises for patient ${pid}`, e);
            }
          }));
          setTodayExercisesMap(exercisesMap);
        }
      } catch (e) {
        console.warn("Error fetching today exercises", e);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError(err.message || "Failed to load prescriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrescriptionCreated = (data) => {
    console.log("Prescription Created/Updated:", data);
    setShowCreateForm(false);
    setEditingPrescription(null); // Clear editing state
    fetchPrescriptions(); // Refresh the list
  };

  const handleEdit = (prescription, e) => {
    e.stopPropagation(); // Prevent opening details view
    setEditingPrescription(prescription);
    setShowCreateForm(true);
  };

  const handleDeleteClick = (prescription, e) => {
    e.stopPropagation();
    setPrescriptionToDelete(prescription);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!prescriptionToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await prescriptionService.deletePrescription(prescriptionToDelete.id, token);

      // Refresh list
      fetchPrescriptions();

      // Clear selection if deleted item was selected
      if (selectedPrescription?.id === prescriptionToDelete.id) {
        setSelectedPrescription(null);
      }

      // Close modal
      setIsDeleteModalOpen(false);
      setPrescriptionToDelete(null);
    } catch (err) {
      console.error("Error deleting prescription", err);
      // You might want to show a toast here in a real app
    }
  };

  const getReportPreview = (htmlContent) => {
    if (!htmlContent) return "No report";
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).slice(0, 5).join(' ');
    return words + (text.split(/\s+/).length > 5 ? '...' : '');
  };

  const handleDownloadReport = (report) => {
    const content = report.html_report || report.report;
    if (!content) return;

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; color: #333;">
        <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Session Report</h1>
        <div class="report-content">
          ${content}
        </div>
        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #888;">
          Generated by Healify
        </div>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `session-report-${new Date(report.created_at || new Date()).toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Main List Area */}
      <div className={`flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-transparent dark:border-cyan-900 overflow-hidden flex flex-col transition-all duration-300 ${selectedPrescription ? 'w-2/3' : 'w-full'}`}>
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300">
              {t('therapistDashboard.prescriptions.activePrescriptions')}
            </h2>
            {!showCreateForm && (
              <button
                onClick={() => {
                  setEditingPrescription(null);
                  setShowCreateForm(true);
                }}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('therapistDashboard.prescriptions.createPrescription')}
              </button>
            )}
          </div>
        </div>

        {showCreateForm ? (
          <div className="p-6 overflow-y-auto">
            <PrescriptionForm
              isOpen={showCreateForm}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingPrescription(null);
              }}
              onSubmit={handlePrescriptionCreated}
              initialValues={editingPrescription}
            />
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="animate-spin h-10 w-10 text-primary dark:text-cyan-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-text-muted dark:text-slate-400">Loading prescriptions...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error Loading Prescriptions</p>
                  <p className="text-text-muted dark:text-slate-400 text-sm">{error}</p>
                </div>
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-text-muted dark:text-slate-400">No prescriptions found</p>
                  <p className="text-sm text-text-muted dark:text-slate-500 mt-2">Create your first prescription to get started</p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white dark:bg-slate-800 z-10">
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="py-4 px-4 text-sm font-semibold text-text-muted dark:text-slate-400">Patient</th>
                    <th className="py-4 px-4 text-sm font-semibold text-text-muted dark:text-slate-400">Symptoms</th>
                    <th className="py-4 px-4 text-sm font-semibold text-text-muted dark:text-slate-400">Exercises</th>

                    <th className="py-4 px-4 text-sm font-semibold text-text-muted dark:text-slate-400">Reports</th>
                    <th className="py-4 px-4 text-sm font-semibold text-text-muted dark:text-slate-400">Progress</th>
                    <th className="py-4 px-4 text-sm font-semibold text-text-muted dark:text-slate-400">Created Date</th>
                    <th className="py-4 px-4 text-sm font-semibold text-text-muted dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr
                      key={prescription.id}
                      className={`border-b border-gray-100 dark:border-slate-700/50 transition-colors cursor-pointer
                        ${selectedPrescription?.id === prescription.id
                          ? 'bg-primary/5 dark:bg-cyan-900/30'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                        }`}
                      onClick={() => {
                        setSelectedPrescription(prescription);
                        setViewMode('details');
                      }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xs">
                            {prescription.patient?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'PT'}
                          </div>
                          <div>
                            <div className="text-text-primary dark:text-slate-200 font-medium">
                              {prescription.patient?.full_name || 'Unknown'}
                            </div>
                            <div className="text-xs text-text-muted dark:text-slate-400">
                              {prescription.patient?.email || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <div
                          className="text-sm text-text-primary dark:text-slate-300 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: prescription.symptoms?.substring(0, 100) + (prescription.symptoms?.length > 100 ? '...' : '') || 'No symptoms'
                          }}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {prescription.exercises?.length > 0 ? (
                            <>
                              <div className="font-semibold text-text-primary dark:text-slate-200">
                                {prescription.exercises.length} Exercise{prescription.exercises.length > 1 ? 's' : ''}
                              </div>
                              <div className="text-xs text-text-muted dark:text-slate-400">
                                {prescription.exercises.slice(0, 2).map((ex, i) => (
                                  <div key={i}>• {ex.name}</div>
                                ))}
                                {prescription.exercises.length > 2 && (
                                  <div>+ {prescription.exercises.length - 2} more</div>
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-text-muted dark:text-slate-400">No exercises</span>
                          )}
                        </div>
                      </td>
                      {/* <td className="py-4 px-4">
                        {(() => {
                           // Use todayExercisesMap with patient ID
                           const patientExercises = todayExercisesMap[prescription.patient?.id] || [];
                           const todays = patientExercises.filter(e => e.prescription_id === prescription.id);
                           
                           if (todays.length === 0) return <span className="text-xs text-text-muted dark:text-slate-500">No tasks today</span>;
                           
                           return (
                             <div className="space-y-1">
                               {todays.slice(0, 3).map((ex, i) => (
                                 <div key={i} className="flex items-center gap-2 text-xs">
                                   <span className={`w-2 h-2 rounded-full ${ex.status === 'completed' ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`}></span>
                                   <span className={`${ex.status === 'completed' ? 'text-green-600 dark:text-green-400 line-through' : 'text-text-primary dark:text-slate-300'}`}>
                                     {ex.exercise_name?.replace(/_/g, ' ')}
                                   </span>
                                 </div>
                               ))}
                               {todays.length > 3 && (
                                  <span className="text-xs text-text-muted dark:text-slate-500 block pl-4">+ {todays.length - 3} more</span>
                               )}
                             </div>
                           );
                        })()}
                      </td> */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-gray-500 dark:text-slate-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="font-semibold text-text-primary dark:text-slate-200">
                            {prescription.reports?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="w-full max-w-[100px]">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-text-muted dark:text-slate-400">Progress</span>
                            <span className="text-xs font-semibold text-primary dark:text-cyan-400">{Math.ceil(prescription.progress_percentage || 0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1.5">
                            <div
                              className="bg-primary dark:bg-cyan-500 h-1.5 rounded-full"
                              style={{ width: `${Math.ceil(prescription.progress_percentage || 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-text-primary dark:text-slate-300">
                          {prescription.created_at ? new Date(prescription.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-text-muted dark:text-slate-500">
                          {prescription.created_at ? new Date(prescription.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPrescription(prescription);
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleEdit(prescription, e)}
                            className="p-2 text-primary dark:text-cyan-400 hover:bg-primary/10 dark:hover:bg-cyan-900/30 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(prescription, e)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Details Panel */}
      {selectedPrescription && !showCreateForm && (
        <div className="w-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-transparent dark:border-cyan-900 overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-300">
          <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-lg text-text-primary dark:text-cyan-300">Prescription Details</h3>
            <button
              onClick={() => setSelectedPrescription(null)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-text-muted dark:text-slate-400"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {viewMode === 'details' ? (
              <div className="space-y-6">
                {/* Patient Information */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xl">
                    {selectedPrescription.patient?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'PT'}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary dark:text-slate-200 text-lg">{selectedPrescription.patient?.full_name || 'Unknown Patient'}</h4>
                    <p className="text-sm text-text-muted dark:text-slate-400">{selectedPrescription.patient?.email || 'No email'}</p>
                  </div>
                </div>

                {/* Today's Tasks Section in Details */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Today's Task
                  </h5>
                  <div className="space-y-2">
                    {(() => {
                      const patientExercises = todayExercisesMap[selectedPrescription.patient?.id] || [];
                      const todays = patientExercises.filter(e => e.prescription_id === selectedPrescription.id);

                      if (todays.length > 0) {
                        return todays.map((ex, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900/20">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${ex.status === 'completed' ? 'bg-green-100 border-green-500 dark:bg-green-900/30' : 'bg-gray-50 border-gray-300 dark:bg-slate-700 dark:border-slate-500'}`}>
                                {ex.status === 'completed' && <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${ex.status === 'completed' ? 'text-gray-500 line-through dark:text-slate-500' : 'text-gray-800 dark:text-slate-200'}`}>
                                  {ex.exercise_name?.replace(/_/g, ' ')}
                                </p>
                                <p className="text-xs text-text-muted dark:text-slate-400">{ex.reps} reps • {ex.session}</p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${ex.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                              {ex.status === 'completed' ? 'Done' : 'Pending'}
                            </span>
                          </div>
                        ));
                      } else {
                        return <p className="text-sm text-text-muted dark:text-slate-400 italic">No specific tasks scheduled for today.</p>;
                      }
                    })()}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Progress Section */}
                  <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-text-primary dark:text-slate-300">Overall Progress</span>
                      <span className="text-sm font-bold text-primary dark:text-cyan-400">{Math.ceil(selectedPrescription.progress_percentage || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3">
                      <div
                        className="bg-primary dark:bg-cyan-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.ceil(selectedPrescription.progress_percentage || 0)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-text-muted dark:text-slate-400 mt-2 text-center">
                      Based on completed sessions vs. prescribed target
                    </p>
                  </div>

                  {/* Symptoms */}
                  <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
                    <span className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">Symptoms</span>
                    <div
                      className="mt-1 text-text-primary dark:text-slate-200 font-medium prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedPrescription.symptoms || 'No symptoms listed' }}
                    />
                  </div>

                  {/* Next Appointment */}
                  {selectedPrescription.next_appointment_date && (
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
                      <span className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">Next Appointment</span>
                      <div className="mt-1 text-text-primary dark:text-slate-200 font-medium">
                        {new Date(selectedPrescription.next_appointment_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Exercises */}
                  <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
                    <span className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">Prescribed Exercises</span>
                    <div className="mt-2 space-y-3">
                      {selectedPrescription.exercises?.length > 0 ? selectedPrescription.exercises.map((exercise, index) => (
                        <div key={index} className="border-l-2 border-primary dark:border-cyan-500 pl-3">
                          <div className="font-semibold text-text-primary dark:text-slate-200">{exercise.name}</div>
                          <div className="text-sm text-text-muted dark:text-slate-400 mt-1">
                            {exercise.reps && <span>{exercise.reps} reps</span>}
                            {exercise.frequencyValue && exercise.frequencyPeriod && (
                              <span> • {exercise.frequencyValue}x {exercise.frequencyPeriod}</span>
                            )}
                            {exercise.durationValue && exercise.durationUnit && (
                              <span> • {exercise.durationValue} {exercise.durationUnit}</span>
                            )}
                          </div>
                          {exercise.notes && (
                            <div className="text-xs text-text-muted dark:text-slate-500 mt-1 whitespace-pre-line">
                              {exercise.notes}
                            </div>
                          )}
                        </div>
                      )) : <p className="text-sm text-text-muted dark:text-slate-400">No exercises assigned</p>}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
                      <span className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">Created</span>
                      <p className="mt-1 text-text-primary dark:text-slate-200">
                        {selectedPrescription.created_at ? new Date(selectedPrescription.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
                      <span className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">Prescription ID</span>
                      <p className="mt-1 text-text-primary dark:text-slate-200 text-xs truncate">{selectedPrescription.prescription_id || selectedPrescription.id}</p>
                    </div>
                  </div>

                  {/* Reports Card */}
                  <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 transition" onClick={() => setViewMode('reports')}>
                    <div>
                      <span className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">Reports</span>
                      <p className="mt-1 text-text-primary dark:text-slate-200 font-medium">{selectedPrescription.reports?.length || 0} Reports Available</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm">
                      <svg className="w-5 h-5 text-gray-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : viewMode === 'reports' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setViewMode('details')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="font-bold text-text-primary dark:text-slate-200">Session Reports</h3>
                </div>

                {selectedPrescription.reports && selectedPrescription.reports.length > 0 ? (
                  [...selectedPrescription.reports]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((report, idx) => (
                      <div key={report.id || idx} className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-600">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-text-primary dark:text-slate-200">
                              {new Date(report.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-text-muted dark:text-slate-400">
                              {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
                            Available
                          </div>
                        </div>
                        {report.analysis_data && (
                          <div className="mt-2 text-sm text-text-muted dark:text-slate-400">
                            {(() => {
                              try {
                                const analysis = typeof report.analysis_data === 'string' ? JSON.parse(report.analysis_data) : report.analysis_data;
                                return `Duration: ${analysis.duration_minutes || '?'} min • Accuracy: ${Math.ceil(analysis.average_accuracy || 0)}%`;
                              } catch (e) { return ''; }
                            })()}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setViewMode('single_report');
                          }}
                          className="mt-3 w-full py-2 text-sm text-primary dark:text-cyan-400 font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                        >
                          View Report
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="text-center p-8 text-text-muted dark:text-slate-400">
                    No reports available for this prescription.
                  </div>
                )}
              </div>
            ) : (
              // Single Report View
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => {
                      setViewMode('reports');
                      setSelectedReport(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary dark:text-slate-200">Session Report</h3>
                    {selectedReport && (
                      <p className="text-xs text-text-muted dark:text-slate-400">
                        {new Date(selectedReport.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {selectedReport && (
                    <button
                      onClick={() => handleDownloadReport(selectedReport)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                      title="Download PDF"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl overflow-hidden">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedReport?.html_report || selectedReport?.report || "<div class='text-center text-gray-500'>No HTML content available</div>" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Fixed Actions Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex gap-3">
              <button
                onClick={(e) => handleEdit(selectedPrescription, e)}
                className="flex-1 py-3 bg-primary hover:bg-primary-dark dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/20"
              >
                Edit Prescription
              </button>
              <button className="flex-1 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-text-primary dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors">
                Message Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPrescriptionToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Prescription"
        message={`Are you sure you want to delete the prescription for ${prescriptionToDelete?.patient?.full_name || 'this patient'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

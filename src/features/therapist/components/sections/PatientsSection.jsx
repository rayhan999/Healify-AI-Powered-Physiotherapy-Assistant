import React, { useState } from "react";
import { useLanguage } from "../../../../contexts";
import { useToast } from "../../../../components/ui";
import { useGetPatientsQuery, useUpdatePatientMutation, useDeletePatientMutation, useInvitePatientMutation } from "../../../../services/api/patientsApi";

export function PatientsSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userExists, setUserExists] = useState(null); // null = not checked, true = exists, false = doesn't exist

  const [updatePatient] = useUpdatePatientMutation();
  const [deletePatient] = useDeletePatientMutation();
  const [invitePatient] = useInvitePatientMutation();

  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    age: "",
    gender: "",
    condition: "",
    patient_id: "",
  });


  // Fetch real patient data from API
  const { data: apiPatients, isLoading: loadingPatients, refetch } = useGetPatientsQuery();

  // Map API data to component format
  const [patients, setPatients] = useState([]);

  // Update patients when API data changes
  React.useEffect(() => {
    if (apiPatients && Array.isArray(apiPatients)) {
      const mappedPatients = apiPatients.map((patient) => ({
        id: patient.id || patient.patient_id,
        name: patient.full_name || "N/A",
        email: patient.email || "N/A",
        phone: patient.phone || "N/A",
        age: patient.age || 0,
        date_of_birth: patient.date_of_birth || "",
        gender: patient.gender || "N/A",
        injury: patient.condition || "N/A",
      }));
      setPatients(mappedPatients);
    }
  }, [apiPatients]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.injury.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });



  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleAssignExercise = (patient) => {
    setSelectedPatient(patient);
    setShowAssignModal(true);
  };

  const handleEditPatient = (patient) => {
    // Format date_of_birth to YYYY-MM-DD for date input
    let dateOfBirth = "";

    if (patient.date_of_birth) {
      // If date is already in YYYY-MM-DD format, use it directly
      if (/^\d{4}-\d{2}-\d{2}$/.test(patient.date_of_birth)) {
        dateOfBirth = patient.date_of_birth;
      } else {
        // Otherwise, parse and format it
        const date = new Date(patient.date_of_birth);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          dateOfBirth = `${year}-${month}-${day}`;
        }
      }
    } else if (patient.age) {
      // Calculate approximate DOB from age if DOB not available
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - patient.age;
      dateOfBirth = `${birthYear}-01-01`;
    }

    setNewPatient({
      name: patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      date_of_birth: dateOfBirth,
      age: patient.age ? patient.age.toString() : "",
      gender: patient.gender || "",
      condition: patient.injury || "",
      patient_id: patient.id || "",
    });
    setIsEditMode(true);
    setShowAddPatientModal(true);
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;

    setIsLoading(true);
    try {
      const result = await deletePatient(patientToDelete.id).unwrap();
      console.log("Delete successful:", result);

      // Close modal and clear state first
      setShowDeleteModal(false);
      setPatientToDelete(null);

      // Then show success message and refetch
      toast.success(`Patient ${patientToDelete.name} deleted successfully!`);
      refetch();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error(error?.data?.message || "Failed to delete patient. Please try again.");
      // Keep modal open on error so user can try again or cancel
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;

    // If email is being changed (and there was a previous email with data), clear other fields
    if (newPatient.email && newEmail !== newPatient.email && (newPatient.name || newPatient.phone)) {
      setNewPatient({
        name: "",
        email: newEmail,
        phone: "",
        date_of_birth: "",
        age: "",
        gender: "",
        condition: "",
        patient_id: "",
      });
    } else {
      setNewPatient({ ...newPatient, email: newEmail });
    }
  };

  const handleDOBChange = (e) => {
    const dob = e.target.value;
    let calculatedAge = "";

    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = age >= 0 ? age.toString() : "";
    }

    setNewPatient({
      ...newPatient,
      date_of_birth: dob,
      age: calculatedAge
    });
  };

  const handleEmailBlur = async () => {
    if (!newPatient.email) return;

    console.log("📧 Checking email:", newPatient.email);
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/check-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          email: newPatient.email,
          role: 'patient'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📧 Email check response:", data);

        if (data.exists && data.user) {
          console.log("✅ User exists - auto-filling data");
          setUserExists(true);
          setNewPatient(prev => ({
            ...prev,
            name: data.user.full_name || prev.name,
            patient_id: data.user.id || prev.patient_id,
            phone: data.user.phone || prev.phone,
            date_of_birth: data.user.date_of_birth || prev.date_of_birth,
            gender: data.user.gender || prev.gender,
            // email is already set
          }));
          toast.success("User found! Details auto-filled.");
        } else {
          console.log("❌ User NOT found - will send invitation");
          setUserExists(false);
          toast.info("User not found. An invitation will be sent when you add this patient.");
        }
      }
    } catch (error) {
      console.error("❌ Error checking email:", error);
      setUserExists(null);
      // specific error handling if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.email || !newPatient.condition) {
      toast.error("Please fill in all required fields (Name, Email, Condition)");
      return;
    }

    // Check if user exists (if not already checked)
    let emailExists = userExists;
    if (userExists === null) {
      console.log("⚠️ Email not checked yet, checking now...");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/check-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            email: newPatient.email,
            role: 'patient'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          emailExists = data.exists && data.user ? true : false;
          setUserExists(emailExists);
          console.log("📧 Email check result:", emailExists ? "exists" : "doesn't exist");
        }
      } catch (error) {
        console.error("❌ Error checking email:", error);
        emailExists = false; // Assume new user if check fails
      }
    }

    // Calculate age from date of birth
    let age = null;
    if (newPatient.date_of_birth) {
      const today = new Date();
      const birthDate = new Date(newPatient.date_of_birth);
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    const payload = {
      patient_id: newPatient.patient_id || null,
      full_name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone || "",
      date_of_birth: newPatient.date_of_birth || null,
      age: age,
      gender: newPatient.gender ? newPatient.gender.toLowerCase() : "",
      condition: newPatient.condition,
    };

    setIsLoading(true);
    try {
      if (isEditMode && newPatient.patient_id) {
        // Update existing patient using RTK mutation
        await updatePatient({ id: newPatient.patient_id, ...payload }).unwrap();

        // Close modal and reset state first
        setShowAddPatientModal(false);
        setIsEditMode(false);
        setUserExists(null);
        setNewPatient({
          name: "",
          email: "",
          phone: "",
          date_of_birth: "",
          age: "",
          gender: "",
          condition: "",
          patient_id: "",
        });

        // Then show success and refetch
        toast.success(`Patient ${newPatient.name} updated successfully!`);
        refetch();
      } else {
        // Create new patient using fetch
        const response = await fetch(`${import.meta.env.VITE_API_URL}/patients/`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to add patient");
        }

        const data = await response.json();

        // Add the patient to local state with the response data
        const patientToAdd = {
          id: data.id || patients.length + 1,
          name: data.full_name || newPatient.name,
          email: data.email || newPatient.email,
          phone: data.phone || "N/A",
          age: data.age || 0,
          gender: data.gender || "N/A",
          injury: data.condition || newPatient.condition,
        };

        setPatients([...patients, patientToAdd]);

        // Debug: Check email existence
        console.log("🔍 Debug - emailExists:", emailExists);
        console.log("🔍 Debug - Patient created with ID:", data.id);

        // Note: The backend should handle sending invitation emails when creating a patient
        // We don't call invitePatient here because it creates a duplicate patient

        // Close modal and reset state (moved outside if-else to avoid duplication)
        setShowAddPatientModal(false);
        setIsEditMode(false);
        setUserExists(null);
        setNewPatient({
          name: "",
          email: "",
          phone: "",
          date_of_birth: "",
          age: "",
          gender: "",
          condition: "",
          patient_id: "",
        });

        // Show success message
        toast.success(`Patient ${newPatient.name} added successfully!`);

        // Refetch to update the list
        refetch();
      }
    } catch (error) {

      console.error("Error saving patient:", error);
      toast.error(error.message || "Failed to save patient. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary dark:text-cyan-300">{t('therapistDashboard.patientManagement.title')}</h1>
            <p className="text-text-muted dark:text-slate-300 mt-1">{t('therapistDashboard.patientManagement.subtitle')}</p>
          </div>

          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('therapistDashboard.patientManagement.addNewPatient')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted dark:text-slate-400 text-sm mb-1">{t('therapistDashboard.patientManagement.totalPatients')}</p>
              <p className="text-3xl font-bold text-text-primary dark:text-cyan-300">{patients.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted dark:text-slate-400 text-sm mb-1">{t('therapistDashboard.patientManagement.active')}</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {patients.filter(p => p.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted dark:text-slate-400 text-sm mb-1">{t('therapistDashboard.patientManagement.needAttention')}</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {patients.filter(p => p.status === "needs attention").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted dark:text-slate-400 text-sm mb-1">{t('therapistDashboard.patientManagement.completed')}</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {patients.filter(p => p.status === "completed").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={t('therapistDashboard.patientManagement.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-400"
              />
              <svg className="w-5 h-5 text-gray-400 dark:text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>


        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 dark:bg-slate-700 border-b dark:border-slate-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">Gender/Age</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-700 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-healify-light-cyan rounded-full flex items-center justify-center text-white font-bold">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary dark:text-slate-200">{patient.name}</p>
                        <p className="text-sm text-text-muted dark:text-slate-400">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-primary dark:text-slate-200">{patient.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-primary dark:text-slate-200">{patient.gender}, {patient.age}y</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-text-primary dark:text-slate-200">{patient.injury}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                        title="Edit Patient"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(patient)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                        title="Delete Patient"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-text-muted dark:text-slate-400">No patients found</p>
          </div>
        )}
      </div>

      {selectedPatient && !showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-slate-600 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300">Patient Details</h2>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <svg className="w-6 h-6 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-healify-light-cyan rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">{selectedPatient.name}</h3>
                  <p className="text-text-muted dark:text-slate-400">{selectedPatient.email}</p>
                  <p className="text-text-muted dark:text-slate-400">{selectedPatient.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-text-primary dark:text-slate-200 mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-gray-500 dark:text-slate-400 block text-xs">Email</span>
                    <span className="text-text-primary dark:text-slate-200 break-all">{selectedPatient.email}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-gray-500 dark:text-slate-400 block text-xs">Phone</span>
                    <span className="text-text-primary dark:text-slate-200">{selectedPatient.phone}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-gray-500 dark:text-slate-400 block text-xs">Age</span>
                    <span className="text-text-primary dark:text-slate-200">{selectedPatient.age} years</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-gray-500 dark:text-slate-400 block text-xs">Gender</span>
                    <span className="text-text-primary dark:text-slate-200">{selectedPatient.gender}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-slate-400 block text-xs">Condition/Injury</span>
                    <span className="text-text-primary dark:text-slate-200">{selectedPatient.injury}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition">
                  View Full Report
                </button>
                <button
                  onClick={() => {
                    setShowAssignModal(true);
                  }}
                  className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Assign Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300">Assign Exercise</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedPatient(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <p className="text-text-muted mb-4">Assign exercise to {selectedPatient.name}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Exercise Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Shoulder Exercises</option>
                    <option>Knee Exercises</option>
                    <option>Back Exercises</option>
                    <option>Hip Exercises</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Exercise Name</label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Shoulder Rotation</option>
                    <option>Arm Raises</option>
                    <option>Wall Push-ups</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Sets</label>
                    <input
                      type="number"
                      defaultValue="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Reps</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Frequency (per week)</label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Add special instructions or notes..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedPatient(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition">
                  Assign Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300">
                  {isEditMode ? "Edit Patient" : "Add New Patient"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddPatientModal(false);
                    setIsEditMode(false);
                    setNewPatient({
                      name: "",
                      email: "",
                      phone: "",
                      date_of_birth: "",
                      age: "",
                      gender: "",
                      condition: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary dark:text-slate-200 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={newPatient.email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      placeholder="patient@email.com"
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary dark:text-slate-200 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    placeholder="Enter patient's full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary dark:text-slate-200 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newPatient.date_of_birth}
                      onChange={handleDOBChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary dark:text-slate-200 mb-2">
                      Age
                    </label>
                    <input
                      type="text"
                      value={newPatient.age}
                      disabled
                      placeholder="Auto-calculated"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-600 text-text-primary dark:text-slate-200 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary dark:text-slate-200 mb-2">
                      Gender
                    </label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary dark:text-slate-200 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+358 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary dark:text-slate-200 mb-2">
                    Condition/Injury <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newPatient.condition}
                    onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe the patient's condition or injury..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddPatientModal(false);
                    setNewPatient({
                      name: "",
                      email: "",
                      phone: "",
                      date_of_birth: "",
                      age: "",
                      gender: "",
                      condition: "",
                    });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPatient}
                  className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
                >
                  {isEditMode ? "Save Changes" : "Add Patient"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && patientToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-center text-text-primary dark:text-cyan-300 mb-2">
                Delete Patient
              </h3>

              <p className="text-center text-text-muted dark:text-slate-300 mb-6">
                Are you sure you want to delete <span className="font-semibold text-text-primary dark:text-slate-200">{patientToDelete.name}</span>? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPatientToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

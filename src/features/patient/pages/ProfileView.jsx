import React, { useState, useEffect } from "react";
import { useLanguage, useAuth } from "../../../contexts";
import { useToast, LoadingSpinner } from "../../../components/ui";
import { userService } from "../../../services/userService";

export default function ProfileView() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const toast = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    address: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: ""
    },
    medicalHistory: {
      allergies: "",
      medications: "",
      conditions: "",
      surgeries: ""
    }
  });
  
  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      // Get user ID from user context
      if (!user?.id) {
        throw new Error("User ID not found");
      }
      
      // Fetch user profile data
      const userData = await userService.getProfile(token, user.id);
      
      const profile = {
        fullName: userData.full_name || user?.full_name || "",
        email: userData.email || user?.email || "",
        phone: userData.phone || "",
        dateOfBirth: userData.date_of_birth || "",
        gender: userData.gender || "",
        height: userData.height || "",
        weight: userData.weight || "",
        address: userData.address || "",
        emergencyContact: userData.emergency_contact || {
          name: "",
          relationship: "",
          phone: ""
        },
        medicalHistory: userData.medical_history || {
          allergies: "",
          medications: "",
          conditions: "",
          surgeries: ""
        }
      };
      
      setProfileData(profile);
      setFormData(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      // Get user ID from user context
      if (!user?.id) {
        throw new Error("User ID not found");
      }
      
      await userService.updateProfile(token, user.id, {
        full_name: formData.fullName,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        address: formData.address,
        emergency_contact: formData.emergencyContact,
        medical_history: formData.medicalHistory
      });
      
      setProfileData(formData);
      setIsEditing(false);
      toast.success(t('patientDashboard.profile.updateSuccess') || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t('patientDashboard.profile.updateError') || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300">
            {t('patientDashboard.profile.title') || 'My Profile'}
          </h2>
          <p className="text-text-muted dark:text-slate-400 mt-1">
            {t('patientDashboard.profile.subtitle') || 'Manage your personal and medical information'}
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('common.edit') || 'Edit Profile'}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition disabled:opacity-50"
            >
              {t('common.cancel') || 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>{t('common.saving') || 'Saving...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('common.save') || 'Save Changes'}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-transparent dark:border-cyan-900">
        <h3 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          {t('patientDashboard.profile.personalInfo') || 'Personal Information'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.fullName') || 'Full Name'} <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.fullName || '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.emailAddress') || 'Email Address'} <span className="text-red-500">*</span>
            </label>
            <p className="text-text-muted dark:text-slate-400 px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              {profileData.email}
            </p>
            <p className="text-xs text-text-muted dark:text-slate-500 mt-1">
              {t('patientDashboard.profile.emailNote') || 'Email cannot be changed here'}
            </p>
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.phoneNumber') || 'Phone Number'}
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.phone || '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.dateOfBirth') || 'Date of Birth'}
            </label>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.age') || 'Age'}
            </label>
            <p className="text-text-muted dark:text-slate-400 px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              {calculateAge(formData.dateOfBirth)} {t('patientDashboard.profile.years') || 'years'}
            </p>
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.gender') || 'Gender'}
            </label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="male">{t('patientDashboard.profile.genderOptions.male') || 'Male'}</option>
                <option value="female">{t('patientDashboard.profile.genderOptions.female') || 'Female'}</option>
                <option value="other">{t('patientDashboard.profile.genderOptions.other') || 'Other'}</option>
                <option value="prefer_not_to_say">{t('patientDashboard.profile.genderOptions.preferNotToSay') || 'Prefer not to say'}</option>
              </select>
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3 capitalize">
                {profileData.gender?.replace('_', ' ') || '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.height') || 'Height'} (cm)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.height ? `${profileData.height} cm` : '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.weight') || 'Weight'} (kg)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.weight ? `${profileData.weight} kg` : '-'}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.address') || 'Address'}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.address || '-'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-transparent dark:border-cyan-900">
        <h3 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          {t('patientDashboard.profile.emergencyContact') || 'Emergency Contact'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.contactName') || 'Contact Name'}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.emergencyContact.name || '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.relationship') || 'Relationship'}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.emergencyContact.relationship || '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.contactPhone') || 'Phone Number'}
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleInputChange}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 font-medium px-4 py-3">
                {profileData.emergencyContact.phone || '-'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-transparent dark:border-cyan-900">
        <h3 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          {t('patientDashboard.profile.medicalHistory') || 'Medical History'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.allergies') || 'Allergies'}
            </label>
            {isEditing ? (
              <textarea
                name="medicalHistory.allergies"
                value={formData.medicalHistory.allergies}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="List any allergies..."
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 px-4 py-3 min-h-[80px]">
                {profileData.medicalHistory.allergies || '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.medications') || 'Current Medications'}
            </label>
            {isEditing ? (
              <textarea
                name="medicalHistory.medications"
                value={formData.medicalHistory.medications}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="List current medications..."
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 px-4 py-3 min-h-[80px]">
                {profileData.medicalHistory.medications || '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.conditions') || 'Medical Conditions'}
            </label>
            {isEditing ? (
              <textarea
                name="medicalHistory.conditions"
                value={formData.medicalHistory.conditions}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="List any medical conditions..."
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 px-4 py-3 min-h-[80px]">
                {profileData.medicalHistory.conditions || '-'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-body dark:text-slate-300 font-medium mb-2">
              {t('patientDashboard.profile.surgeries') || 'Past Surgeries'}
            </label>
            {isEditing ? (
              <textarea
                name="medicalHistory.surgeries"
                value={formData.medicalHistory.surgeries}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="List past surgeries..."
              />
            ) : (
              <p className="text-text-primary dark:text-slate-200 px-4 py-3 min-h-[80px]">
                {profileData.medicalHistory.surgeries || '-'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

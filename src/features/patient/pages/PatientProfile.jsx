import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppNavBar } from "../../../components/layout";
import { useToast } from "../../../components/ui";

export default function PatientProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [patientData, setPatientData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+358 123 456 789",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    address: "123 Health Street, Helsinki, Finland",
    emergencyContact: "+358 987 654 321",

    height: "175",
    weight: "70",
    bloodType: "O+",
    allergies: "None",
    medications: "None",
    medicalConditions: "Previous shoulder injury (2023)",
    injuries: "Rotator cuff strain - recovering",

    assignedTherapist: {
      name: "Dr. Sarah Williams",
      specialty: "Sports Physiotherapy",
      phone: "+358 111 222 333",
      email: "dr.williams@healify.com",
      photo: null,
    },

    totalSessions: 24,
    completedExercises: 156,
    currentStreak: 7,
    joinDate: "2024-01-15",
    recoveryProgress: 75,
  });

  const [formData, setFormData] = useState(patientData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setPatientData(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData(patientData);
    setIsEditing(false);
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    const heightInMeters = parseInt(formData.height) / 100;
    const weightInKg = parseInt(formData.weight);
    const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <AppNavBar userType="patient" userName={`${patientData.firstName} ${patientData.lastName}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/patient-dashboard")}
            className="flex items-center gap-2 text-text-muted dark:text-slate-400 hover:text-primary dark:hover:text-cyan-300 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-cyan-300">My Profile</h1>
              <p className="text-text-muted dark:text-slate-400 mt-1">Manage your personal and medical information</p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary to-healify-light-cyan rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Total Sessions</p>
                <p className="text-3xl font-bold">{patientData.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Completed Exercises</p>
                <p className="text-3xl font-bold">{patientData.completedExercises}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Current Streak</p>
                <p className="text-3xl font-bold">{patientData.currentStreak} days</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Recovery Progress</p>
                <p className="text-3xl font-bold">{patientData.recoveryProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">
                      {new Date(patientData.dateOfBirth).toLocaleDateString()} ({calculateAge(patientData.dateOfBirth)} years)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.gender}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.address}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Emergency Contact</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.emergencyContact}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300">Medical Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Height (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.height} cm</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Weight (kg)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.weight} kg</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Blood Type</label>
                  {isEditing ? (
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.bloodType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">BMI</label>
                  <p className="text-text-primary dark:text-slate-200 font-medium">{calculateBMI()}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Allergies</label>
                  {isEditing ? (
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.allergies}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Current Medications</label>
                  {isEditing ? (
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.medications}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Medical Conditions</label>
                  {isEditing ? (
                    <textarea
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.medicalConditions}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-300 mb-2">Current Injuries</label>
                  {isEditing ? (
                    <textarea
                      name="injuries"
                      value={formData.injuries}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-text-primary dark:text-slate-200 font-medium">{patientData.injuries}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-healify-light-cyan/20 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300">Assigned Therapist</h2>
              </div>

              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-healify-light-cyan rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                  {patientData.assignedTherapist.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-bold text-text-primary dark:text-cyan-300">{patientData.assignedTherapist.name}</h3>
                <p className="text-sm text-text-muted dark:text-slate-400">{patientData.assignedTherapist.specialty}</p>
              </div>

              <div className="space-y-3 pt-4 border-t dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-text-body dark:text-slate-200">{patientData.assignedTherapist.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-text-body dark:text-slate-200">{patientData.assignedTherapist.email}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/messages")}
                className="w-full mt-4 px-4 py-2 bg-primary/10 dark:bg-cyan-900/30 text-primary dark:text-cyan-300 font-semibold rounded-lg hover:bg-primary/20 dark:hover:bg-cyan-900/50 transition"
              >
                Message Therapist
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300">Recovery Progress</h2>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text-muted dark:text-slate-300">Overall Progress</span>
                  <span className="text-sm font-bold text-primary dark:text-cyan-300">{patientData.recoveryProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-healify-light-cyan h-3 rounded-full transition-all duration-500"
                    style={{ width: `${patientData.recoveryProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t dark:border-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted dark:text-slate-400">Member Since</span>
                  <span className="text-sm font-medium text-text-primary dark:text-slate-200">
                    {new Date(patientData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted dark:text-slate-400">Total Sessions</span>
                  <span className="text-sm font-medium text-text-primary dark:text-slate-200">{patientData.totalSessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted dark:text-slate-400">Exercises Completed</span>
                  <span className="text-sm font-medium text-text-primary dark:text-slate-200">{patientData.completedExercises}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/patient-dashboard", { state: { activeTab: "progress" } })}
                className="w-full mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
              >
                View Detailed Report
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-text-primary dark:text-cyan-300 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/patient-dashboard")}
                  className="w-full px-4 py-2 text-left text-text-body dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate("/patient-settings")}
                  className="w-full px-4 py-2 text-left text-text-body dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <button
                  onClick={() => navigate("/patient-help-support")}
                  className="w-full px-4 py-2 text-left text-text-body dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help & Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

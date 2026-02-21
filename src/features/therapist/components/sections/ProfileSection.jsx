import React from "react";
import { useOutletContext } from "react-router-dom";

export function ProfileSection({ data }) {
  const { therapistData } = useOutletContext() || { therapistData: data };
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          Professional Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-body font-medium mb-2">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              defaultValue={data.name}
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Professional Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              defaultValue="Doctor of Physical Therapy (DPT)"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Specialty <span className="text-red-500">*</span></label>
            <select className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Physiotherapy Specialist</option>
              <option>Sports Physiotherapy</option>
              <option>Orthopedic Physiotherapy</option>
              <option>Neurological Physiotherapy</option>
              <option>Pediatric Physiotherapy</option>
              <option>Geriatric Physiotherapy</option>
            </select>
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">License Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              defaultValue="PT-12345-NY"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Years of Experience <span className="text-red-500">*</span></label>
            <input
              type="number"
              defaultValue="12"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">License Expiry Date</label>
            <input
              type="date"
              defaultValue="2027-12-31"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-text-body font-medium mb-2">Professional Bio</label>
            <textarea
              rows={4}
              defaultValue="Experienced physiotherapist specializing in musculoskeletal rehabilitation and sports injury recovery. Passionate about helping patients achieve their recovery goals through evidence-based treatment and personalized exercise programs."
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-body font-medium mb-2">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              defaultValue="sarah.johnson@healify.com"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Phone Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              defaultValue="+1 (555) 234-5678"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Alternative Phone</label>
            <input
              type="tel"
              placeholder="Optional"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Office Phone</label>
            <input
              type="tel"
              defaultValue="+1 (555) 800-9000"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-text-body font-medium mb-2">Office Address</label>
            <input
              type="text"
              defaultValue="450 Medical Plaza, Suite 302, New York, NY 10016"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          Education & Certifications
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-text-body font-medium mb-2">Education</label>
            <textarea
              rows={3}
              defaultValue="Doctor of Physical Therapy (DPT) - Columbia University, 2013&#10;Bachelor of Science in Kinesiology - University of California, 2010"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Certifications & Specializations</label>
            <textarea
              rows={4}
              defaultValue="• Certified Orthopedic Manual Therapist (COMT)&#10;• Sports Physical Therapy Certification (SCS)&#10;• Dry Needling Certification&#10;• McKenzie Method Certified (MDT)"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Professional Memberships</label>
            <input
              type="text"
              defaultValue="APTA (American Physical Therapy Association), AAOMPT"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          Areas of Expertise
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Lower Back Pain",
            "Sports Injuries",
            "Post-Surgery Rehab",
            "Shoulder Injuries",
            "Knee Injuries",
            "Posture Correction",
            "Chronic Pain Management",
            "Arthritis Management",
            "Balance & Gait Training",
            "Neck Pain",
            "Hip Injuries",
            "Manual Therapy"
          ].map((expertise, index) => (
            <label key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-primary/10 transition">
              <input type="checkbox" defaultChecked={index < 6} className="accent-primary w-5 h-5" />
              <span className="text-sm text-text-primary dark:text-cyan-300">{expertise}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          Work Schedule & Availability
        </h3>

        <div className="space-y-4">
          {[
            { day: "Monday", start: "09:00", end: "17:00", active: true },
            { day: "Tuesday", start: "09:00", end: "17:00", active: true },
            { day: "Wednesday", start: "09:00", end: "17:00", active: true },
            { day: "Thursday", start: "09:00", end: "17:00", active: true },
            { day: "Friday", start: "09:00", end: "15:00", active: true },
            { day: "Saturday", start: "10:00", end: "14:00", active: false },
            { day: "Sunday", start: "10:00", end: "14:00", active: false },
          ].map((schedule, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <input type="checkbox" defaultChecked={schedule.active} className="accent-primary w-5 h-5" />
              <span className="w-28 font-medium text-text-primary dark:text-cyan-300">{schedule.day}</span>
              <input
                type="time"
                defaultValue={schedule.start}
                className="border border-border dark:border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-text-muted dark:text-slate-400">to</span>
              <input
                type="time"
                defaultValue={schedule.end}
                className="border border-border dark:border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-body font-medium mb-2">Max Patients Per Day</label>
            <input
              type="number"
              defaultValue="8"
              className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Session Duration (minutes)</label>
            <select className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
              <option>30 minutes</option>
              <option selected>45 minutes</option>
              <option>60 minutes</option>
              <option>90 minutes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Consultation Rates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-body font-medium mb-2">Initial Consultation</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400">$</span>
              <input
                type="number"
                defaultValue="150"
                className="w-full border border-border dark:border-slate-600 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Follow-up Session</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400">$</span>
              <input
                type="number"
                defaultValue="100"
                className="w-full border border-border dark:border-slate-600 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Virtual Consultation</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400">$</span>
              <input
                type="number"
                defaultValue="75"
                className="w-full border border-border dark:border-slate-600 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-body font-medium mb-2">Home Visit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400">$</span>
              <input
                type="number"
                defaultValue="200"
                className="w-full border border-border dark:border-slate-600 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          Preferences & Settings
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-body font-medium mb-2">Language</label>
              <select className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            <div>
              <label className="block text-text-body font-medium mb-2">Timezone</label>
              <select className="w-full border border-border dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                <option>EST (UTC-5)</option>
                <option>CST (UTC-6)</option>
                <option>MST (UTC-7)</option>
                <option>PST (UTC-8)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
            <h4 className="font-bold text-text-primary mb-4">Notification Preferences</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <input type="checkbox" defaultChecked className="accent-primary w-5 h-5" />
                <div>
                  <p className="font-medium text-text-primary dark:text-cyan-300">Email Notifications</p>
                  <p className="text-sm text-text-muted dark:text-slate-400">Receive updates via email</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <input type="checkbox" defaultChecked className="accent-primary w-5 h-5" />
                <div>
                  <p className="font-medium text-text-primary dark:text-cyan-300">Patient Pain Alerts</p>
                  <p className="text-sm text-text-muted dark:text-slate-400">Immediate notifications for high pain reports</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <input type="checkbox" defaultChecked className="accent-primary w-5 h-5" />
                <div>
                  <p className="font-medium text-text-primary dark:text-cyan-300">Session Completion Alerts</p>
                  <p className="text-sm text-text-muted dark:text-slate-400">Notify when patients complete exercises</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <input type="checkbox" defaultChecked className="accent-primary w-5 h-5" />
                <div>
                  <p className="font-medium text-text-primary dark:text-cyan-300">AI Alternative Exercise Suggestions</p>
                  <p className="text-sm text-text-muted dark:text-slate-400">Get notified when AI suggests alternatives</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <input type="checkbox" className="accent-primary w-5 h-5" />
                <div>
                  <p className="font-medium text-text-primary dark:text-cyan-300">Weekly Analytics Report</p>
                  <p className="text-sm text-text-muted dark:text-slate-400">Receive patient progress summary</p>
                </div>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
            <h4 className="font-bold text-text-primary mb-4">Accepting New Patients</h4>
            <label className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-primary w-6 h-6" />
              <div>
                <p className="font-medium text-green-900">Currently Accepting New Patients</p>
                <p className="text-sm text-green-700">Your profile will be visible to new patient registrations</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save All Changes
        </button>
        <button className="px-8 py-4 bg-gray-200 dark:bg-slate-700 text-text-primary font-bold rounded-xl hover:bg-gray-300 transition flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
      </div>
    </div>
  );
}

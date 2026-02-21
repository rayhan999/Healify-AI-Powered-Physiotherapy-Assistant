import { baseApi } from './baseApi';

export const prescriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all prescriptions
    getPrescriptions: builder.query({
      query: () => '/prescriptions',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Prescriptions', id })),
              { type: 'Prescriptions', id: 'LIST' },
            ]
          : [{ type: 'Prescriptions', id: 'LIST' }],
    }),

    // Create prescription
    createPrescription: builder.mutation({
      query: (prescriptionData) => ({
        url: '/prescriptions',
        method: 'POST',
        body: prescriptionData,
      }),
      invalidatesTags: [{ type: 'Prescriptions', id: 'LIST' }],
    }),

    // Update prescription (for future use)
    updatePrescription: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/prescriptions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Prescriptions', id },
        { type: 'Prescriptions', id: 'LIST' },
      ],
    }),

    // Delete prescription (for future use)
    deletePrescription: builder.mutation({
      query: (id) => ({
        url: `/prescriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Prescriptions', id: 'LIST' }],
    }),

    // Get prescription by ID
    getPrescriptionById: builder.query({
      query: (prescriptionId) => `/prescriptions/${prescriptionId}`,
      providesTags: (result, error, prescriptionId) => [
        { type: 'Prescriptions', id: prescriptionId }
      ],
    }),

    // Get active prescription by patient ID
    getPatientPrescription: builder.query({
      query: (patientId) => `/prescriptions/patient/${patientId}`,
      providesTags: (result, error, patientId) => [
        { type: 'Prescriptions', id: patientId }
      ],
    }),

    // Get patient history
    getPatientHistory: builder.query({
      query: (userId) => `/prescriptions/patient/${userId}/history`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'History', id })),
              { type: 'History', id: 'LIST' },
            ]
          : [{ type: 'History', id: 'LIST' }],
    }),

    // Save session report
    saveReport: builder.mutation({
      query: ({ prescriptionId, html_data, analysis_data }) => ({
        url: `/prescriptions/${prescriptionId || 'none'}/reports`,
        method: 'POST',
        body: { html_data, analysis_data },
      }),
      invalidatesTags: [{ type: 'History', id: 'LIST' }],
    }),

    // Analyze session (Gemini)
    analyzeSession: builder.mutation({
      query: (data) => ({
        url: '/api/gemini/analyze-session',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPrescriptionsQuery,
  useLazyGetPrescriptionsQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useGetPrescriptionByIdQuery,
  useLazyGetPrescriptionByIdQuery,
  useGetPatientPrescriptionQuery,
  useLazyGetPatientPrescriptionQuery,
  useGetPatientHistoryQuery,
  useSaveReportMutation,
  useAnalyzeSessionMutation,
} = prescriptionsApi;

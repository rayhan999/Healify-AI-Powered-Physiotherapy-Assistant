import { baseApi } from './baseApi';

export const patientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all patients
    getPatients: builder.query({
      query: () => '/patients',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Patients', id })),
              { type: 'Patients', id: 'LIST' },
            ]
          : [{ type: 'Patients', id: 'LIST' }],
    }),

    // Get patient by ID (for future use)
    getPatientById: builder.query({
      query: (id) => `/patients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Patients', id }],
    }),

    // Get patient requests (pain reports / change requests)
    getPatientRequests: builder.query({
      query: () => '/patients/requests',
      providesTags: ['PatientRequests'],
    }),

    // Get therapist's patient requests (filtered by therapist ID)
    getTherapistRequests: builder.query({
      query: (therapistId) => `/patients/requests?therapistId=${therapistId}`,
      providesTags: ['TherapistRequests'],
    }),

    // Submit patient request (pain report / change request)
    submitPatientRequest: builder.mutation({
      query: (requestData) => ({
        url: '/patients/requests',
        method: 'POST',
        body: requestData,
      }),
      // Invalidate requests list when a new request is submitted
      invalidatesTags: ['PatientRequests', 'TherapistRequests'],
    }),

    // Send therapist reply to a request
    sendTherapistReply: builder.mutation({
      query: ({ requestId, reply, isAvoided }) => {
        const body = {};
        if (reply) body.therapistReply = reply;
        if (isAvoided !== undefined) body.isAvoided = isAvoided;
        
        return {
          url: `/patients/requests/${requestId}`,
          method: 'PUT',
          body,
        };
      },
      // Invalidate both patient and therapist request lists
      invalidatesTags: ['PatientRequests', 'TherapistRequests'],
    }),

    // Get today's exercises for a patient
    getTodayExercises: builder.query({
      query: (patientId) => `/patients/${patientId}/today-exercises`,
      providesTags: (result, error, patientId) => [
        { type: 'TodayExercises', id: patientId }
      ],
    }),

    // Update patient
    updatePatient: builder.mutation({
      query: ({ id, ...patientData }) => ({
        url: `/patients/${id}`,
        method: 'PUT',
        body: patientData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Patients', id },
        { type: 'Patients', id: 'LIST' },
      ],
    }),

    // Delete patient
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Patients', id: 'LIST' }],
    }),

    // Send patient invitation
    invitePatient: builder.mutation({
      query: (invitationData) => ({
        url: '/patients/invite',
        method: 'POST',
        body: invitationData,
      }),
      invalidatesTags: [{ type: 'Patients', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPatientsQuery,
  useLazyGetPatientsQuery,
  useGetPatientByIdQuery,
  useLazyGetPatientByIdQuery,
  useGetPatientRequestsQuery,
  useGetTherapistRequestsQuery,
  useSubmitPatientRequestMutation,
  useSendTherapistReplyMutation,
  useGetTodayExercisesQuery,
  useLazyGetTodayExercisesQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useInvitePatientMutation,
} = patientsApi;


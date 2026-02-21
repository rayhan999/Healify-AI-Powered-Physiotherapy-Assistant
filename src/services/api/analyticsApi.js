import { baseApi } from './baseApi';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTherapistDashboard: builder.query({
      query: () => '/analytics/therapist-dashboard',
      providesTags: ['TherapistDashboard'],
    }),
    getPatientDashboard: builder.query({
      query: () => '/analytics/patient-dashboard',
      providesTags: ['PatientDashboard'],
    }),
  }),
});

export const {
  useGetTherapistDashboardQuery,
  useGetPatientDashboardQuery,
} = analyticsApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: (() => {
    const url = import.meta.env.VITE_API_URL;
    // Automatically upgrade to HTTPS in production or if current page is HTTPS
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url?.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  })(),
  prepareHeaders: (headers) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If we have a token, include it in the headers
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Set content type
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
});

const baseQueryWithLogout = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Handle 401 Unauthorized
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return result;
};

// Base API configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogout,
  // Define tag types for cache invalidation
  tagTypes: ['Auth', 'Patients', 'Prescriptions', 'Exercises', 'Conversations', 'Messages', 'History', 'TodayExercises', 'PatientRequests', 'TherapistRequests', 'TherapistDashboard', 'PatientDashboard'],
  // Endpoints will be injected by individual API slices
  endpoints: () => ({}),
});

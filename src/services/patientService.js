const API_URL = import.meta.env.VITE_API_URL;

export const patientService = {
  async getPatients(token) {
    const response = await fetch(`${API_URL}/patients`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    return response.json();
  },

  async getTodayExercises(patientId, token) {
    const response = await fetch(`${API_URL}/patients/${patientId}/today-exercises`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store, must-revalidate", // Force fresh data
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch today's exercises");
    }

    return response.json();
  },
};

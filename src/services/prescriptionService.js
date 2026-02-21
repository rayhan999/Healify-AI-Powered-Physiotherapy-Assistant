const API_URL = import.meta.env.VITE_API_URL;

const authenticatedFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  return response;
};

export const prescriptionService = {
  async getPrescriptions(token) {
    const response = await authenticatedFetch(`${API_URL}/prescriptions`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch prescriptions");
    }

    return response.json();
  },

  async getPatientHistory(userId, token) {
    const response = await authenticatedFetch(`${API_URL}/prescriptions/patient/${userId}/history`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch history");
    }

    return response.json();
  },

  async createPrescription(prescriptionData, token) {
    const response = await authenticatedFetch(`${API_URL}/prescriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(prescriptionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create prescription");
    }

    return response.json();
  },
  async saveReport(prescriptionId, htmlData, analysisData, token) {
    const response = await authenticatedFetch(`${API_URL}/prescriptions/${prescriptionId}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        html_data: htmlData,
        analysis_data: analysisData
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save report");
    }

    return response.json();
  },

  async updatePrescription(id, prescriptionData, token) {
    const response = await authenticatedFetch(`${API_URL}/prescriptions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(prescriptionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update prescription");
    }

    return response.json();
  },

  async deletePrescription(id, token) {
    const response = await authenticatedFetch(`${API_URL}/prescriptions/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete prescription");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  },
};

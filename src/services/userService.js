const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  // Force HTTPS if serving page over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && envUrl.startsWith('http://')) {
    return envUrl.replace('http://', 'https://');
  }
  return envUrl;
};

const API_BASE_URL = getApiUrl();

console.log("import.meta.env.VITE_API_URL", API_BASE_URL, import.meta.env.VITE_API_URL);

export const userService = {
  async getProfile(token, userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  async updateProfile(token, userId, profileData) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },

  async uploadProfilePicture(token, file) {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await fetch(`${API_BASE_URL}/auth/me/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }

    return response.json();
  },

  async deleteProfilePicture(token) {
    const response = await fetch(`${API_BASE_URL}/auth/me/profile-picture`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete profile picture');
    }

    return response.json();
  },
};

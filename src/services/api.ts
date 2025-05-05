
// API service for interacting with the backend

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Item-related API calls
export const fetchAllItems = async () => {
  const response = await fetch(`${API_BASE_URL}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
};

export const fetchItemById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }
  return response.json();
};

export const createItem = async (itemData: any) => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });
  if (!response.ok) {
    throw new Error('Failed to create item');
  }
  return response.json();
};

export const updateItemStatus = async (id: string, status: string) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update item status');
  }
  return response.json();
};

// User-related API calls
export const userLogin = async (email: string, name: string, dob: string) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, dob }),
  });
  if (!response.ok) {
    throw new Error('Failed to login/register');
  }
  return response.json();
};

export const fetchUserItems = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch user items');
  }
  return response.json();
};

// Admin-related API calls
export const adminLogin = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/admins/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Failed to login as admin');
  }
  return response.json();
};

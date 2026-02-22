// Use environment variable or fallback to localhost
import { getAuthToken } from './auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  token_type?: string;
  message?: string;
  detail?: string;
  user?: {
    id: string;
    email: string;
  };
}

export class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        throw new APIError(401, 'Invalid email or password. Please check your credentials.');
      } else if (response.status === 404) {
        throw new APIError(404, 'User not found. Please sign up first.');
      }
      throw new APIError(response.status, data.message || data.detail || 'Failed to sign in');
    }

    // Backend returns access_token, normalize it to token for consistency
    if (data.access_token && !data.token) {
      data.token = data.access_token;
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
    }
    // Re-throw APIError as-is
    if (error instanceof APIError) {
      throw error;
    }
    // Handle other errors
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function signUp(credentials: SignUpRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 400) {
        throw new APIError(400, data.message || 'Invalid signup data. Please check your information.');
      } else if (response.status === 409) {
        throw new APIError(409, 'An account with this email already exists. Please sign in instead.');
      }
      throw new APIError(response.status, data.message || data.detail || 'Failed to create account');
    }

    // Normalize access_token to token if needed
    if (data.access_token && !data.token) {
      data.token = data.access_token;
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
    }
    // Re-throw APIError as-is
    if (error instanceof APIError) {
      throw error;
    }
    // Handle other errors
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

// Re-export auth functions from auth.ts
export { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated } from './auth';

// Organization interfaces and functions
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  slug?: string;
  description?: string;
}

export async function createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/organizations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, responseData.message || responseData.detail || 'Failed to create organization');
  }

  return responseData;
}

export async function getOrganizations(): Promise<Organization[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/organizations`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to fetch organizations');
  }

  // Ensure we return an array
  return Array.isArray(data) ? data : [];
}

// Project interfaces and functions
export interface Project {
  id: string;
  name: string;
  slug: string;
  region: string;
  plan: string;
  organizationId?: string;
  anonKey?: string;
  serviceKey?: string;
  databaseName?: string;
  postgrestUrl?: string;
  realtimeUrl?: string;
  storageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  organizationId: string;
  region: string;
}

export interface ProjectKeys {
  anon_key: string;
  service_key: string;
  postgrest_url: string;
}

export async function createProject(projectData: CreateProjectRequest): Promise<Project> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/organizations/${projectData.organizationId}/projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: projectData.name,
      description: projectData.description,
      region: projectData.region,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to create project');
  }

  return data;
}

export async function getProjects(organizationId?: string): Promise<Project[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  // Build URL with organization-scoped projects endpoint
  if (!organizationId) {
    // If no org ID, fallback to global list if exists, otherwise return empty
    // Backend currently only supports org-scoped list
    return [];
  }

  const url = `${API_BASE_URL}/api/organizations/${organizationId}/projects`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to fetch projects');
  }

  // Backend returns {projects: [...], total: number}
  if (data.projects && Array.isArray(data.projects)) {
    return data.projects;
  }
  // Fallback if API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getProjectKeys(projectId: string): Promise<ProjectKeys> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/keys`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to fetch project keys');
  }

  return data;
}

export const API_BASE_URL = 'http://192.168.1.113:8000';

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
  const response = await fetch(`${API_BASE_URL}/auth/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to sign in');
  }

  // Backend returns access_token, normalize it to token for consistency
  if (data.access_token && !data.token) {
    data.token = data.access_token;
  }

  return data;
}

export async function signUp(credentials: SignUpRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to create account');
  }

  // Normalize access_token to token if needed
  if (data.access_token && !data.token) {
    data.token = data.access_token;
  }

  return data;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Organization interfaces and functions
export interface Organization {
  id: string;
  name: string;
  created_at?: string;
}

export interface CreateOrganizationRequest {
  name: string;
}

export async function createOrganization(name: string): Promise<Organization> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/organizations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to create organization');
  }

  return data;
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
  organizationId: string;
  created_at?: string;
}

export interface CreateProjectRequest {
  name: string;
  slug: string;
  region: string;
  plan: string;
  organizationId: string;
}

export interface ProjectKeys {
  anon_key: string;
  service_key: string;
  postgrest_url: string;
}

export async function createProject(projectData: CreateProjectRequest): Promise<Project> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to create project');
  }

  return data;
}

export async function getProjects(): Promise<Project[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || data.detail || 'Failed to fetch projects');
  }

  // Ensure we return an array
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

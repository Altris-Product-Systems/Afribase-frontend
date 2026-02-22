
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    user_name?: string;
  };
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  token_type?: string;
  message?: string;
  detail?: string;
  user?: User;
}

// ─── Per-Project Auth Config ──────────────────────────────────────────────

export interface OAuthProviderConfig {
  enabled: boolean;
  clientId: string;
  secret?: string;
  redirectUri?: string;
}

export interface ProviderSummary {
  enabled: boolean;
  clientId: string;
  secretSet: boolean;
  redirectUri: string;
}

export interface ProjectAuthConfig {
  emailEnabled: boolean;
  emailAutoConfirm: boolean;
  phoneEnabled: boolean;
  google: OAuthProviderConfig;
  github: OAuthProviderConfig;
  facebook: OAuthProviderConfig;
  apple: OAuthProviderConfig;
  twitter: OAuthProviderConfig;
  discord: OAuthProviderConfig;
}

export interface AuthConfigResponse {
  emailEnabled: boolean;
  emailAutoConfirm: boolean;
  phoneEnabled: boolean;
  providers: Record<string, ProviderSummary>;
  sdkSnippet: {
    javascript: string;
    dart: string;
  };
}

export interface UpdateAuthConfigRequest {
  emailEnabled?: boolean;
  emailAutoConfirm?: boolean;
  phoneEnabled?: boolean;
  google?: OAuthProviderConfig;
  github?: OAuthProviderConfig;
  facebook?: OAuthProviderConfig;
  apple?: OAuthProviderConfig;
  twitter?: OAuthProviderConfig;
  discord?: OAuthProviderConfig;
}

export interface ProjectUser {
  id: string;
  email: string;
  phone: string;
  confirmedAt?: string;
  lastSignInAt?: string;
  appMetadata?: string;
  userMetadata?: string;
  createdAt: string;
  provider: string;
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

export async function getUser(): Promise<User> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, data.error || data.message || 'Failed to fetch user');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export function signInWithGitHub(): void {
  const redirectTo = `${window.location.origin}/auth/callback`;
  const githubUrl = `${API_BASE_URL}/auth/authorize?provider=github&redirect_to=${encodeURIComponent(redirectTo)}`;
  window.location.href = githubUrl;
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

// Import auth functions from auth.ts
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated } from './auth';

// Re-export auth functions from auth.ts
export { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated };

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

export interface MemberResponse {
  user: User;
  role: 'owner' | 'admin' | 'member';
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'member';
}

export interface CreateOrganizationRequest {
  name: string;
  slug?: string;
  description?: string;
}

export async function getOrganizationMembers(orgId: string): Promise<MemberResponse[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/organizations/${orgId}/members`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new APIError(response.status, data.error || 'Failed to fetch members');
    }
    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'Unexpected error fetching members');
  }
}

export async function inviteOrganizationMember(orgId: string, request: InviteMemberRequest): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/organizations/${orgId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new APIError(response.status, data.error || 'Failed to invite member');
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'Unexpected error inviting member');
  }
}

export async function removeOrganizationMember(orgId: string, userId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/organizations/${orgId}/members/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new APIError(response.status, data.error || 'Failed to remove member');
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'Unexpected error removing member');
  }
}

export async function createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
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
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function getOrganizations(): Promise<Organization[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/organizations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || data.detail || data.error || `Error ${response.status}`;
      throw new APIError(response.status, `[${response.status}] ${errorMessage}`);
    }

    // Ensure we return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

// Project interfaces and functions
export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  region: string;
  plan: string;
  organizationId?: string;
  anonKey?: string;
  serviceKey?: string;
  databaseName?: string;
  postgrestUrl?: string;
  realtimeUrl?: string;
  storageUrl?: string;
  authUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  organizationId: string;
  region: string;
  databasePassword?: string;
  enableDataApi?: boolean;
  enableRls?: boolean;
}

export interface ProjectKeys {
  anon_key: string;
  service_key: string;
  postgrest_url: string;
}

export async function createProject(projectData: CreateProjectRequest): Promise<Project> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
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
        databasePassword: projectData.databasePassword,
        enableDataApi: projectData.enableDataApi,
        enableRls: projectData.enableRls,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, data.message || data.detail || 'Failed to create project');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function getProjects(organizationId?: string): Promise<Project[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    // Build URL: if organizationId is provided, use organization-scoped endpoint,
    // otherwise use the global projects endpoint for the current user.
    const url = organizationId
      ? `${API_BASE_URL}/api/organizations/${organizationId}/projects`
      : `${API_BASE_URL}/api/projects`;

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
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function getProjectKeys(projectId: string): Promise<ProjectKeys> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
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
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function getProject(projectId: string): Promise<Project> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, data.error || data.message || data.detail || 'Failed to fetch project');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

// ─── Update Project ────────────────────────────────────────────────────────
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export async function updateProject(projectId: string, data: UpdateProjectRequest): Promise<Project> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, responseData.error || responseData.message || 'Failed to update project');
    }

    return responseData;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

// ─── Delete Project ────────────────────────────────────────────────────────
export async function deleteProject(projectId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      throw new APIError(response.status, responseData.error || responseData.message || 'Failed to delete project');
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

// ─── Run SQL Query ─────────────────────────────────────────────────────────
export interface QueryResult {
  columns?: string[];
  rows?: Record<string, unknown>[];
  rowCount?: number;
  error?: string;
  [key: string]: unknown;
}

export async function runProjectQuery(projectId: string, query: string): Promise<QueryResult> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, data.error || data.message || 'Query failed');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

// ─── List Project Tables ───────────────────────────────────────────────────
export interface ColumnInfo {
  name: string;
  type: string;
  nullable?: boolean;
  default?: string;
}

export interface TableInfo {
  name: string;
  schema?: string;
  rowCount?: number;
  sizeBytes?: number;
  columns?: ColumnInfo[];
  [key: string]: unknown;
}

export async function getProjectTables(projectId: string): Promise<TableInfo[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/tables`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, data.error || data.message || 'Failed to fetch tables');
    }

    const rawTables = Array.isArray(data) ? data : (data.tables ?? []);
    return rawTables.map((t: any) => {
      if (typeof t === 'string') {
        const parts = t.split('.');
        if (parts.length === 2) {
          return { schema: parts[0], name: parts[1] };
        }
        return { name: t };
      }
      return t;
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function deleteProjectTable(projectId: string, schema: string, table: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/tables/${schema}/${table}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new APIError(response.status, data.error || data.message || 'Failed to delete table');
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

// ─── Get Project Usage ─────────────────────────────────────────────────────
export interface ProjectUsage {
  databaseSize?: number;
  databaseSizeLimit?: number;
  egressBytes?: number;
  egressBytesLimit?: number;
  realtimeConnections?: number;
  realtimeConnectionsLimit?: number;
  monthlyActiveUsers?: number;
  monthlyActiveUsersLimit?: number;
  storageSize?: number;
  storageSizeLimit?: number;
  [key: string]: unknown;
}

export async function getProjectUsage(projectId: string): Promise<ProjectUsage> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/usage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, data.error || data.message || 'Failed to fetch usage');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

// ─── Project Auth Configuration ────────────────────────────────────────────

export async function getAuthConfig(projectId: string): Promise<AuthConfigResponse> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/auth/config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const textResponse = await response.text();
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch {
      throw new APIError(response.status, `Non-JSON response (status ${response.status}): ${textResponse.slice(0, 50)}...`);
    }

    if (!response.ok) {
      throw new APIError(response.status, data.error || data.message || 'Failed to fetch auth config');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Connect failed at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function updateAuthConfig(projectId: string, data: UpdateAuthConfigRequest): Promise<AuthConfigResponse> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/auth/config`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, responseData.error || responseData.message || 'Failed to update auth config');
    }

    return responseData;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Connect failed at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function updateAuthProvider(
  projectId: string,
  provider: string,
  data: OAuthProviderConfig
): Promise<AuthConfigResponse> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/auth/providers/${provider}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, responseData.error || responseData.message || 'Failed to update provider');
    }

    return responseData;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Connect failed at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

export async function getProjectUsers(projectId: string): Promise<ProjectUser[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/auth/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const textResponse = await response.text();
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch {
      throw new APIError(response.status, `Non-JSON response (status ${response.status}): ${textResponse.slice(0, 50)}...`);
    }

    if (!response.ok) {
      throw new APIError(response.status, data.error || data.message || 'Failed to fetch project users');
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Connect failed at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred. Please try again.');
  }
}

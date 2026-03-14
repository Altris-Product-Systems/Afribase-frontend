
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.useafribase.app';

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

export interface SmtpConfig {
  enabled: boolean;
  host: string;
  port: number;
  user: string;
  pass?: string;
  adminEmail: string;
  senderName: string;
  maxFrequency: string;
}

export interface EmailTemplate {
  subject: string;
  content: string;
}

export interface EmailTemplatesConfig {
  invite: EmailTemplate;
  confirmation: EmailTemplate;
  recovery: EmailTemplate;
  magicLink: EmailTemplate;
  emailChange: EmailTemplate;
}

export interface ProjectAuthConfig {
  emailEnabled: boolean;
  emailAutoConfirm: boolean;
  magicLinkEnabled: boolean;
  phoneEnabled: boolean;
  smsEnabled: boolean;
  anonymousEnabled: boolean;
  smtp: SmtpConfig;
  templates: EmailTemplatesConfig;
  google: OAuthProviderConfig;
  github: OAuthProviderConfig;
  gitlab: OAuthProviderConfig;
  facebook: OAuthProviderConfig;
  apple: OAuthProviderConfig;
  twitter: OAuthProviderConfig;
  discord: OAuthProviderConfig;
  twitch: OAuthProviderConfig;
  slack: OAuthProviderConfig;
  linkedin: OAuthProviderConfig;
  notion: OAuthProviderConfig;
  zoom: OAuthProviderConfig;
  bitbucket: OAuthProviderConfig;
  snapchat: OAuthProviderConfig;
  figma: OAuthProviderConfig;
  flyio: OAuthProviderConfig;
  workos: OAuthProviderConfig;
  kakao: OAuthProviderConfig;
  keycloak: OAuthProviderConfig;
  azuread: OAuthProviderConfig;
  customOAuth?: Record<string, OAuthProviderConfig>;
  mfa: {
    enabled: boolean;
    totpEnabled: boolean;
    recoveryEnabled: boolean;
  };
  saml: { enabled: boolean };
  web3: { enabled: boolean };
  hooks: {
    customAccessToken?: string;
    preSignUp?: string;
    postSignUp?: string;
    mfaChallenge?: string;
  };
  rateLimitPerMinute: number;
  auditLoggingEnabled: boolean;
}

// ─── Background Jobs ─────────────────────────────────────────────────────────

export type JobStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'retrying' | 'dead';

export interface Job {
  id: string;
  projectId: string;
  name: string;
  payload: any;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  error?: string;
  runAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnqueueJobRequest {
  name: string;
  payload: any;
  runAt?: string;
  maxAttempts?: number;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
}

// ─── Env Config ──────────────────────────────────────────────────────────────

export interface EnvConfig {
  key: string;
  value: string;
  updatedAt: string;
}

export interface SetEnvConfigRequest {
  key: string;
  value: string;
}

// ─── Project Transfer ────────────────────────────────────────────────────────

export interface TransferProjectRequest {
  targetUserId?: string;
  targetOrgId?: string;
}

// ─── Org Roles ───────────────────────────────────────────────────────────────

export type OrgRole = 'owner' | 'admin' | 'developer' | 'billing' | 'viewer' | 'member';

// OrgMember is defined below with rich user detail

export interface UpdateOrgMemberRoleRequest {
  role: OrgRole;
}

export interface SmtpSummary {
  enabled: boolean;
  host: string;
  port: number;
  user: string;
  passSet: boolean;
  adminEmail: string;
  senderName: string;
  maxFrequency: string;
}

export interface AuthConfigResponse {
  emailEnabled: boolean;
  emailAutoConfirm: boolean;
  magicLinkEnabled: boolean;
  phoneEnabled: boolean;
  smsEnabled: boolean;
  anonymousEnabled: boolean;
  smtp: SmtpSummary;
  templates: EmailTemplatesConfig;
  providers: Record<string, ProviderSummary>;
  mfa: {
    enabled: boolean;
    totpEnabled: boolean;
    recoveryEnabled: boolean;
  };
  saml: { enabled: boolean };
  web3: { enabled: boolean };
  hooks: {
    customAccessToken?: string;
    preSignUp?: string;
    postSignUp?: string;
    mfaChallenge?: string;
  };
  rateLimitPerMinute: number;
  auditLoggingEnabled: boolean;
  sdkSnippet: {
    javascript: string;
    dart: string;
    swift: string;
    kotlin: string;
    python: string;
  };
}

export interface OrgMember {
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  };
  role: OrgRole;
  joinedAt: string;
}

export interface UpdateAuthConfigRequest {
  emailEnabled?: boolean;
  emailAutoConfirm?: boolean;
  magicLinkEnabled?: boolean;
  phoneEnabled?: boolean;
  smsEnabled?: boolean;
  anonymousEnabled?: boolean;
  smtp?: Partial<SmtpConfig>;
  templates?: Partial<EmailTemplatesConfig>;
  google?: OAuthProviderConfig;
  github?: OAuthProviderConfig;
  gitlab?: OAuthProviderConfig;
  facebook?: OAuthProviderConfig;
  apple?: OAuthProviderConfig;
  twitter?: OAuthProviderConfig;
  discord?: OAuthProviderConfig;
  twitch?: OAuthProviderConfig;
  slack?: OAuthProviderConfig;
  linkedin?: OAuthProviderConfig;
  notion?: OAuthProviderConfig;
  zoom?: OAuthProviderConfig;
  bitbucket?: OAuthProviderConfig;
  snapchat?: OAuthProviderConfig;
  figma?: OAuthProviderConfig;
  flyio?: OAuthProviderConfig;
  workos?: OAuthProviderConfig;
  kakao?: OAuthProviderConfig;
  keycloak?: OAuthProviderConfig;
  azuread?: OAuthProviderConfig;
  customOAuth?: Record<string, OAuthProviderConfig>;
  mfa?: {
    enabled?: boolean;
    totpEnabled?: boolean;
    recoveryEnabled?: boolean;
  };
  saml?: { enabled?: boolean };
  web3?: { enabled?: boolean };
  hooks?: {
    customAccessToken?: string;
    preSignUp?: string;
    postSignUp?: string;
    mfaChallenge?: string;
  };
  rateLimitPerMinute?: number;
  auditLoggingEnabled?: boolean;
}

export interface ProjectIdentity {
  identity_id: string;
  id: string; // provider_id
  user_id: string;
  identity_data: any;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email?: string;
}

export interface ProjectUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string;
  email_confirmed_at?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata: any;
  user_metadata: any;
  identities: ProjectIdentity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  banned_until?: string;
  deleted_at?: string;
}

export interface ListProjectUsersResponse {
  aud: string;
  users: ProjectUser[];
}

// ── No-Code Integrations ─────────────────────────────────────────────────────

export interface APIKey {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  keyPrefix: string;
  scope: 'read' | 'read_write' | 'admin';
  allowedOrigins: string;
  allowedTables: string;
  rateLimit: number;
  expiresAt?: string;
  lastUsedAt?: string;
  requestCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAPIKeyRequest {
  name: string;
  scope?: string;
  allowedOrigins?: string;
  allowedTables?: string;
  rateLimit?: number;
  expiresInDays?: number;
}

export interface APIKeyResponse {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  keyPrefix: string;
  scope: string;
  isActive: boolean;
  key: string; // Plain key
}

export interface EmbedConfig {
  id: string;
  projectId: string;
  enabled: boolean;
  allowedOrigins: string;
  brandColor: string;
  logoUrl?: string;
  appName?: string;
  enableSignUp: boolean;
  enableOAuth: boolean;
  oauthProviders?: string;
  enableMagicLink: boolean;
  redirectUrl?: string;
  customCss?: string;
  theme: 'dark' | 'light' | 'auto';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmbedConfigRequest {
  enabled?: boolean;
  allowedOrigins?: string;
  brandColor?: string;
  logoUrl?: string;
  appName?: string;
  enableSignUp?: boolean;
  enableOAuth?: boolean;
  oauthProviders?: string;
  enableMagicLink?: boolean;
  redirectUrl?: string;
  customCss?: string;
  theme?: string;
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
      // console.error('Login failed response:', { status: response.status, data });

      // GoTrue often uses 'msg' or 'error_description' for errors
      const errorMsg = data.msg || data.message || data.error_description || data.detail || data.error;

      // Handle specific error cases
      if (response.status === 401 || (response.status === 400 && errorMsg?.includes('invalid_grant'))) {
        throw new APIError(401, 'Invalid email or password. Please check your credentials.');
      } else if (response.status === 404) {
        throw new APIError(404, 'User not found. Please sign up first.');
      }

      throw new APIError(response.status, errorMsg || 'Failed to sign in. Please check your credentials.');
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

// Request deduplication promises
let userPromise: Promise<User> | null = null;
let organizationsPromise: Promise<Organization[]> | null = null;

export async function getUser(): Promise<User> {
  if (userPromise) return userPromise;

  userPromise = (async () => {
    const token = getAuthToken();
    if (!token) throw new APIError(401, 'Not authenticated');

    try {
      const response = await apiFetch(`${API_BASE_URL}/api/user`, {
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
    } finally {
      // Clear the promise after a short delay to deduplicate concurrent calls
      // but allow fresh fetches soon after
      setTimeout(() => { userPromise = null; }, 1000);
    }
  })();

  return userPromise;
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
      // console.error('Signup failed response:', { status: response.status, data });
      // DEBUG: Log the full data object to see all fields
      // console.log('DEBUG: Full signup error data:', data);

      // Handle specific error cases with better message extraction
      // GoTrue often uses 'msg' or 'error_description'
      const errorMsg = data.msg || data.message || data.error_description || data.detail || data.error || (data.errors ? JSON.stringify(data.errors) : null);
      const errorCode = data.error_code || data.code;

      if (response.status === 400) {
        throw new APIError(400, errorMsg || 'Invalid signup data. Please check your information.');
      } else if (response.status === 409 || (response.status === 422 && (errorMsg?.includes('already registered') || errorCode === 'user_already_exists'))) {
        throw new APIError(409, 'An account with this email already exists. Please sign in instead.');
      } else if (response.status === 422) {
        throw new APIError(422, errorMsg || 'Validation failed. The password might be too weak or the email is invalid.');
      }

      throw new APIError(response.status, errorMsg || 'Failed to create account. Please try again later.');
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
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated, handleUnauthorized } from './auth';

// Re-export auth functions from auth.ts
export { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated };

/**
 * Drop-in replacement for fetch() that automatically handles 401 responses
 * by clearing the auth token and redirecting to the sign-in page.
 * Use this for all authenticated API requests.
 */
async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401) {
    // Clone the response so callers can still read it if needed
    handleUnauthorized();
  }
  return response;
}

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
  role: OrgRole;
}

export interface InviteMemberRequest {
  email: string;
  role: OrgRole;
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
    const response = await apiFetch(`${API_BASE_URL}/api/organizations/${orgId}/members`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/organizations/${orgId}/members`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/organizations/${orgId}/members/${userId}`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/organizations`, {
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
  if (organizationsPromise) return organizationsPromise;

  organizationsPromise = (async () => {
    const token = getAuthToken();
    if (!token) throw new APIError(401, 'Not authenticated');

    try {
      const response = await apiFetch(`${API_BASE_URL}/api/organizations`, {
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
    } finally {
      // Clear the promise after a short delay to deduplicate concurrent calls
      setTimeout(() => { organizationsPromise = null; }, 1000);
    }
  })();

  return organizationsPromise;
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
  databasePassword: string; // required by backend (min=8)
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
    const response = await apiFetch(`${API_BASE_URL}/api/organizations/${projectData.organizationId}/projects`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/keys`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}`, {
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

export async function pauseProject(projectId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/pause`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new APIError(response.status, data.error || 'Failed to pause project');
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred.');
  }
}

export async function reactivateProject(projectId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/reactivate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new APIError(response.status, data.error || 'Failed to reactivate project');
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred.');
  }
}

export async function deleteOrganization(orgId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await apiFetch(`${API_BASE_URL}/api/organizations/${orgId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new APIError(response.status, data.error || data.message || 'Failed to delete organization');
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, `Cannot connect to server at ${API_BASE_URL}.`);
    }
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'An unexpected error occurred.');
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/query`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/tables`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/tables/${schema}/${table}`, {
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
  db_size: string;
  db_size_limit: string;
  row_count: number;
  bandwidth: string;
  bandwidth_limit: string;
  storage: string;
  storage_limit: string;
  auth_users: number;
  auth_users_limit: number;
  [key: string]: unknown;
}

export async function getProjectUsage(projectId: string): Promise<ProjectUsage> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  try {
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/usage`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/config`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/config`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/providers/${provider}`, {
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
    const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/users`, {
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

    if (data && data.users && Array.isArray(data.users)) {
      return data.users;
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

export interface CreateProjectUserRequest {
  email: string;
  password: string;
  user_metadata?: Record<string, unknown>;
  confirm?: boolean;
}

export async function createProjectUser(projectId: string, payload: CreateProjectUserRequest): Promise<ProjectUser> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/users`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create user');
  return data;
}

export async function banProjectUser(projectId: string, userId: string, banDuration: string): Promise<ProjectUser> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/users/${userId}/ban`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ban_duration: banDuration }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to ban user');
  return data;
}

export async function deleteProjectUser(projectId: string, userId: string, softDelete = false): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ should_soft_delete: softDelete }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete user');
  }
}

// ─── Storage Configuration & Management ─────────────────────────────────────

export interface StorageBucket {
  id: string;
  name: string;
  public: boolean;
  fileSizeLimit?: number;
  allowedMimeTypes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StorageObject {
  name: string;
  bucket_id: string;
  owner?: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: Record<string, any>;
}

export async function getStorageBuckets(projectId: string): Promise<StorageBucket[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/storage/buckets`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch buckets');
  return data;
}

export async function createStorageBucket(projectId: string, name: string, isPublic: boolean): Promise<StorageBucket> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/storage/buckets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, public: isPublic, id: name })
  });

  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create bucket');
  return data;
}

export async function deleteStorageBucket(projectId: string, bucketId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/storage/buckets/${bucketId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete bucket');
  }
}

export async function emptyStorageBucket(projectId: string, bucketId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/storage/buckets/${bucketId}/empty`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to empty bucket');
  }
}

export async function getStorageObjects(projectId: string, bucketId: string, prefix: string = '', limit: number = 100, offset: number = 0): Promise<{ objects: StorageObject[], total: number }> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const url = new URL(`${API_BASE_URL}/api/projects/${projectId}/storage/buckets/${bucketId}/objects/list`);
  url.searchParams.append('prefix', prefix);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  // Using POST per supabase API spec for listing
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prefix, limit, offset })
  });

  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch objects');

  // Normalize responses where sometimes it directly returns an array and sometimes {objects, total}
  if (Array.isArray(data)) {
    return { objects: data, total: data.length };
  }
  return data;
}

export async function deleteStorageObject(projectId: string, bucketId: string, objectPath: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  // objectPath might contain slashes so we make sure it's fully appended to the path as wildcard param handles it
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/storage/buckets/${bucketId}/object/${objectPath}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete object');
  }
}

// ─── Edge Functions Configuration & Management ──────────────────────────────

export interface EdgeFunction {
  id: string;
  name: string;
  slug: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deployment {
  id: string;
  version: number;
  status: string;
  createdAt: string;
}

export async function getEdgeFunctions(projectId: string): Promise<EdgeFunction[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/functions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch edge functions');
  return data;
}

export async function createEdgeFunction(projectId: string, name: string): Promise<EdgeFunction> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/functions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create edge function');
  return data;
}

export async function deleteEdgeFunction(projectId: string, functionId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/functions/${functionId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete edge function');
  }
}

export async function getFunctionDeployments(projectId: string, functionId: string): Promise<Deployment[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');

  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/functions/${functionId}/deployments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch deployments');
  return data;
}

// ─── Platform APIs ────────────────────────────────────────

// Database Migrations
export async function getDatabaseMigrations(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/migrations`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch migrations');
  return data || [];
}

export async function createDatabaseMigration(projectId: string, name: string, sql: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/migrations`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, sql })
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create migration');
  return data;
}

export interface SupabaseMigrationRequest {
  source_project_ref: string;
  service_role_key: string;
  supabase_url?: string;
  import_schema?: boolean;
  import_data?: boolean;
  import_auth_users?: boolean;
  import_rls?: boolean;
  import_storage?: boolean;
}

export interface DeepLinkConfig {
  id: string;
  projectId: string;
  enabled: boolean;
  iosBundleId: string;
  iosTeamId: string;
  iosAppStoreId: string;
  androidPackage: string;
  androidSha256Fingerprint: string;
  customScheme: string;
  redirectUrls: string[];
  defaultRedirectUrl: string;
  magicLinkTemplate: string;
  oauthCallbackUrl: string;
  passwordResetUrl: string;
  emailConfirmUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeepLinkConfigRequest {
  enabled: boolean;
  iosBundleId: string;
  iosTeamId: string;
  iosAppStoreId: string;
  androidPackage: string;
  androidSha256Fingerprint: string;
  customScheme: string;
  redirectUrls: string[];
  defaultRedirectUrl: string;
  magicLinkTemplate: string;
  oauthCallbackUrl: string;
  passwordResetUrl: string;
  emailConfirmUrl: string;
}

export interface RLSPolicy {
  name: string;
  schema: string;
  table: string;
  command: 'ALL' | 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  roles: string;
  using?: string;
  withCheck?: string;
  permissive?: boolean;
}

export interface TableRLSStatus {
  schema: string;
  table: string;
  rlsEnabled: boolean;
}

// ─── RLS Policies ──────────────────────────────────────────

export async function listRLSStatus(projectId: string): Promise<TableRLSStatus[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/rls`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch RLS status');
  return Array.isArray(data) ? data : [];
}

export async function enableRLS(projectId: string, payload: { schema: string; table: string; enable: boolean }): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/rls`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to update RLS status');
  }
}

export async function listPolicies(projectId: string, schema: string, table: string): Promise<RLSPolicy[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/policies?schema=${schema}&table=${table}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch policies');
  return Array.isArray(data) ? data : [];
}

export async function createPolicy(projectId: string, policy: RLSPolicy): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/policies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policy)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to create policy');
  }
}

export async function deletePolicy(projectId: string, payload: { name: string; schema: string; table: string }): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/policies`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete policy');
  }
}

export interface MigrationJob {
  id: string;
  project_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_step: string;
  progress: number;
  error_message?: string;
  steps: Record<string, { status: string; message?: string }>;
}

export async function startSupabaseMigration(projectId: string, req: SupabaseMigrationRequest): Promise<MigrationJob> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/migrate/from-supabase`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req)
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to start migration');
  return data;
}

export async function getMigrationJobStatus(projectId: string, jobId: string): Promise<MigrationJob> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/migrate/jobs/${jobId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch migration job status');
  return data;
}

// Project Logs — LogQueryRequest: { service, level, search, since, until, limit }
export async function queryProjectLogs(projectId: string, service: string, limit: number = 50): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/logs/query`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ service, limit })
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch logs');
  return Array.isArray(data) ? data : [];
}

// Cron Jobs
export async function getCronJobs(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/cron/jobs`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch cron jobs');
  return data || [];
}

export async function createCronJob(projectId: string, name: string, schedule: string, command: string, database = 'postgres'): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/cron/jobs`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, schedule, command, database })
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create cron job');
  return data;
}

export async function deleteCronJob(projectId: string, jobId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/cron/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete cron job');
  }
}

// ─── SQL Editor ──────────────────────────────────────────────────────────────
export async function executeSql(projectId: string, query: string): Promise<{ results: any[]; execution_time: string }> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/sql`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'SQL execution failed');
  return data;
}

// ─── Schema / Tables ─────────────────────────────────────────────────────────
export async function getSchemaTables(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/schema/tables`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch tables');
  return Array.isArray(data) ? data : data.tables || [];
}

export async function getSchemaVisualization(projectId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/schema/visualize`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch schema');
  return data;
}

// ─── Database Backups ─────────────────────────────────────────────────────────
export async function listBackups(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/backups`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch backups');
  return Array.isArray(data) ? data : [];
}

export async function createBackup(projectId: string, type = 'manual'): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/backups`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create backup');
  return data;
}

export async function deleteBackup(projectId: string, backupId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/backups/${backupId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete backup');
  }
}

export async function restoreBackup(projectId: string, backupId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/backups/${backupId}/restore`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to restore backup');
  return data;
}

// ─── Database Branches ────────────────────────────────────────────────────────
export async function listBranches(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/branches`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to list branches');
  return Array.isArray(data) ? data : [];
}

export async function createBranch(projectId: string, name: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/branches`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create branch');
  return data;
}

export async function deleteBranch(projectId: string, branchId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/branches/${branchId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete branch');
  }
}

// ─── Database Webhooks ────────────────────────────────────────────────────────
export async function listWebhooks(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/webhooks`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch webhooks');
  return Array.isArray(data) ? data : [];
}

export async function createWebhook(projectId: string, payload: { name: string; table: string; schema?: string; events: string[]; url: string; method?: string }): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/webhooks`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ schema: 'public', method: 'POST', ...payload }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create webhook');
  return data;
}

export async function deleteWebhook(projectId: string, webhookId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/webhooks/${webhookId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete webhook');
  }
}

// ─── Read Replicas ────────────────────────────────────────────────────────────
export async function listReplicas(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/replicas`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to list replicas');
  return Array.isArray(data) ? data : [];
}

export async function createReplica(projectId: string, name: string, region: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/replicas`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, region }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create replica');
  return data;
}

export async function deleteReplica(projectId: string, replicaId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/replicas/${replicaId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete replica');
  }
}

// ─── Vault / Secrets ──────────────────────────────────────────────────────────
export async function listVaultSecrets(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/security/vault/secrets`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch secrets');
  return Array.isArray(data) ? data : [];
}

export async function createVaultSecret(projectId: string, name: string, value: string, description?: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/security/vault/secrets`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, value, description }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create secret');
  return data;
}

export async function deleteVaultSecret(projectId: string, secretId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/security/vault/secrets/${secretId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete secret');
  }
}

// ─── SSO / SAML ───────────────────────────────────────────────────────────────
export async function listSSOProviders(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/sso`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to list SSO providers');
  return Array.isArray(data) ? data : [];
}

export async function createSSOProvider(projectId: string, payload: { type: string; metadataUrl?: string; metadataXml?: string; domains?: string[] }): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/sso`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create SSO provider');
  return data;
}

export async function deleteSSOProvider(projectId: string, providerId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/auth/sso/${providerId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete SSO provider');
  }
}

// ─── Custom Domains ───────────────────────────────────────────────────────────
export async function listCustomDomains(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/domains`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to list domains');
  return data.domains || [];
}

export async function addCustomDomain(projectId: string, domain: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/domains`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to add domain');
  return data;
}

export async function verifyCustomDomain(projectId: string, domainId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/domains/${domainId}/verify`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to verify domain');
  return data;
}

export async function removeCustomDomain(projectId: string, domainId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/domains/${domainId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to remove domain');
  }
}

// ─── Network Restrictions ─────────────────────────────────────────────────────
export async function getNetworkRestrictions(projectId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/network/restrictions`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch network restrictions');
  return data;
}

export async function updateNetworkRestrictions(projectId: string, payload: { enabled: boolean; allowList?: any; denyList?: any }): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/network/restrictions`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update network restrictions');
  return data;
}

// ─── Connection Pooler ────────────────────────────────────────────────────────
export async function getPoolConfig(projectId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/pooler/config`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch pool config');
  return data;
}

export async function updatePoolConfig(projectId: string, payload: { enabled?: boolean; poolMode?: string; defaultPoolSize?: number; maxClientConnections?: number }): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/pooler/config`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update pool config');
  return data;
}

export async function getPoolStats(projectId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/pooler/stats`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch pool stats');
  return data;
}

// ─── Realtime Config ──────────────────────────────────────────────────────────
export async function getRealtimeConfig(projectId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/realtime/config`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch realtime config');
  return data;
}

export async function updateRealtimeConfig(projectId: string, payload: { replayEnabled?: boolean; retentionMinutes?: number; maxEventsPerSec?: number }): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/realtime/config`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update realtime config');
  return data;
}

// ─── Log Drains ───────────────────────────────────────────────────────────────
export async function listLogDrains(projectId: string): Promise<any[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/log-drains`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to list log drains');
  return Array.isArray(data) ? data : [];
}

export async function createLogDrain(projectId: string, payload: { name: string; type: string; config: Record<string, any>; sources: string[] }): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/log-drains`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create log drain');
  return data;
}

export async function deleteLogDrain(projectId: string, drainId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/log-drains/${drainId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete log drain');
  }
}

// ─── AI / pgvector ────────────────────────────────────────────────────────────
export async function getAIConfig(projectId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/ai/config`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch AI config');
  return data;
}

export async function updateAIConfig(projectId: string, payload: { pgvectorEnabled?: boolean; defaultModel?: string; openaiKey?: string }): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/ai/config`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update AI config');
  return data;
}

// ─── GraphQL Config ───────────────────────────────────────────────────────────
export async function getGraphQLConfig(projectId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/graphql`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch GraphQL config');
  return data;
}

export async function updateGraphQLConfig(projectId: string, payload: { enabled?: boolean; maxDepth?: number; defaultLimit?: number }): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/database/graphql`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update GraphQL config');
  return data;
}

// ─── Type Generator ───────────────────────────────────────────────────────────
export async function generateTypeScript(projectId: string): Promise<string> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/generators/typescript`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to generate types');
  }
  return response.text();
}

// ─── Developer Forum ───────────────────────────────────────────────────────────

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  sortOrder: number;
  postCount: number;
  createdAt: string;
}

export interface ForumTag {
  id: string;
  name: string;
  slug: string;
}

export interface ForumPostAuthor {
  id: string;
  email: string;
  fullName: string;
}

export interface ForumPost {
  id: string;
  author: ForumPostAuthor;
  category: ForumCategory;
  title: string;
  slug: string;
  content: string;
  status: 'open' | 'closed' | 'resolved' | 'pinned';
  isPinned: boolean;
  viewCount: number;
  upVotes: number;
  downVotes: number;
  commentCount: number;
  tags: ForumTag[];
  lastReplyAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPostListResponse {
  posts: ForumPost[];
  total: number;
}

export interface ForumComment {
  id: string;
  postId: string;
  author: ForumPostAuthor;
  parentId?: string;
  content: string;
  upVotes: number;
  downVotes: number;
  isAccepted: boolean;
  replies?: ForumComment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateForumPostRequest {
  categoryId: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateForumPostRequest {
  title?: string;
  content?: string;
  status?: 'open' | 'closed' | 'resolved';
}

export interface CreateForumCommentRequest {
  content: string;
  parentId?: string;
}

export interface ForumListPostsParams {
  category?: string;
  tag?: string;
  status?: string;
  search?: string;
  sort?: 'latest' | 'oldest' | 'most_votes' | 'most_comments' | 'most_views';
  limit?: number;
  offset?: number;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function listForumCategories(): Promise<ForumCategory[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/categories`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch categories');
  return data;
}

export async function createForumCategory(req: { name: string; description?: string; color?: string; icon?: string; sortOrder?: number }): Promise<ForumCategory> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/categories`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create category');
  return data;
}

export async function updateForumCategory(categoryId: string, req: { name?: string; description?: string; color?: string; icon?: string; sortOrder?: number }): Promise<ForumCategory> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/categories/${categoryId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update category');
  return data;
}

export async function deleteForumCategory(categoryId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete category');
  }
}

// ── Tags ──────────────────────────────────────────────────────────────────────

export async function listForumTags(): Promise<ForumTag[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/tags`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch tags');
  return data;
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export async function listForumPosts(params: ForumListPostsParams = {}): Promise<ForumPostListResponse> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const qs = new URLSearchParams();
  if (params.category) qs.set('category', params.category);
  if (params.tag) qs.set('tag', params.tag);
  if (params.status) qs.set('status', params.status);
  if (params.search) qs.set('search', params.search);
  if (params.sort) qs.set('sort', params.sort);
  if (params.limit !== undefined) qs.set('limit', String(params.limit));
  if (params.offset !== undefined) qs.set('offset', String(params.offset));
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts?${qs}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch posts');
  return data;
}

export async function getForumPost(postId: string): Promise<ForumPost> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts/${postId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Post not found');
  return data;
}

export async function createForumPost(req: CreateForumPostRequest): Promise<ForumPost> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create post');
  return data;
}

export async function updateForumPost(postId: string, req: UpdateForumPostRequest): Promise<ForumPost> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update post');
  return data;
}

export async function deleteForumPost(postId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts/${postId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete post');
  }
}

export async function voteForumPost(postId: string, voteType: 'up' | 'down'): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts/${postId}/vote`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ voteType }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to vote');
  }
}

export async function pinForumPost(postId: string, pin: boolean): Promise<ForumPost> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts/${postId}/pin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pin }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to pin post');
  return data;
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function listForumComments(postId: string, limit = 50, offset = 0): Promise<{ comments: ForumComment[]; total: number }> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts/${postId}/comments?limit=${limit}&offset=${offset}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch comments');
  return data;
}

export async function createForumComment(postId: string, req: CreateForumCommentRequest): Promise<ForumComment> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to post comment');
  return data;
}

export async function updateForumComment(commentId: string, content: string): Promise<ForumComment> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update comment');
  return data;
}

export async function deleteForumComment(commentId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete comment');
  }
}

export async function acceptForumComment(postId: string, commentId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/posts/${postId}/comments/${commentId}/accept`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to accept comment');
  }
}

export async function voteForumComment(commentId: string, voteType: 'up' | 'down'): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/forum/comments/${commentId}/vote`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ voteType }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to vote on comment');
  }
}


// ── No-Code API Keys ─────────────────────────────────────────────────────────

export async function getAPIKeys(projectId: string): Promise<APIKey[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/api-keys`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch API keys');
  return data.keys || [];
}

export async function createAPIKey(projectId: string, req: CreateAPIKeyRequest): Promise<APIKeyResponse> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/api-keys`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to create API key');
  return data;
}

export async function deleteAPIKey(projectId: string, keyId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/api-keys/${keyId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete API key');
  }
}

export async function revokeAPIKey(projectId: string, keyId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/api-keys/${keyId}/revoke`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to revoke API key');
  }
}

// ── Embeddable Auth ───────────────────────────────────────────────────────────

export async function getEmbedConfig(projectId: string): Promise<EmbedConfig> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/embed/config`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch embed config');
  return data;
}

export async function updateEmbedConfig(projectId: string, req: UpdateEmbedConfigRequest): Promise<EmbedConfig> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/embed/config`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update embed config');
  return data;
}

export async function getEmbedScript(projectId: string): Promise<{ script: string }> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/embed/script`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch embed script');
  return { script: data.snippet || data.script };
}

// ── Deep Linking ─────────────────────────────────────────────────────────────

export async function getDeepLinkConfig(projectId: string): Promise<DeepLinkConfig> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/deeplinks/config`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Deep link config not found');
  return data;
}

export async function upsertDeepLinkConfig(projectId: string, req: DeepLinkConfigRequest): Promise<DeepLinkConfig> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/deeplinks/config`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to update deep link config');
  return data;
}

export async function deleteDeepLinkConfig(projectId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/deeplinks/config`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete deep link config');
  }
}
// ── Background Jobs ─────────────────────────────────────────────────────────

export async function listJobs(projectId: string, status?: string): Promise<JobListResponse> {
  const token = getAuthToken();
  const url = status 
    ? `${API_BASE_URL}/api/projects/${projectId}/jobs?status=${status}` 
    : `${API_BASE_URL}/api/projects/${projectId}/jobs`;
  const response = await apiFetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to list jobs');
  return data;
}

export async function enqueueJob(projectId: string, req: EnqueueJobRequest): Promise<Job> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/jobs`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to enqueue job');
  return data;
}

export async function retryJob(projectId: string, jobId: string): Promise<Job> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/jobs/${jobId}/retry`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to retry job');
  return data;
}

export async function cancelJob(projectId: string, jobId: string): Promise<void> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to cancel job');
  }
}

// ── Env Config ──────────────────────────────────────────────────────────────

export async function listEnvConfig(projectId: string): Promise<EnvConfig[]> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/config`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to list config');
  return data;
}

export async function setEnvConfig(projectId: string, req: SetEnvConfigRequest): Promise<EnvConfig> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/config`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to set config');
  return data;
}

export async function deleteEnvConfig(projectId: string, key: string): Promise<void> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/config/${key}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to delete config');
  }
}

// ── Project Transfer ────────────────────────────────────────────────────────

export async function transferProject(projectId: string, req: TransferProjectRequest): Promise<void> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/transfer`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to transfer project');
  }
}

export async function listOrgMembers(orgId: string): Promise<OrgMember[]> {
  const token = getAuthToken();
  if (!token) throw new APIError(401, 'Not authenticated');
  const response = await apiFetch(`${API_BASE_URL}/api/organizations/${orgId}/members`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch members');
  return data;
}

// ── Org Member Roles ────────────────────────────────────────────────────────

export async function updateOrgMemberRole(orgId: string, userId: string, role: OrgRole): Promise<void> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/organizations/${orgId}/members/${userId}/role`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.error || 'Failed to update member role');
  }
}

// ── API Docs ────────────────────────────────────────────────────────────────

export async function getProjectAPIDocs(projectId: string): Promise<any> {
  const token = getAuthToken();
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/api-docs`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new APIError(response.status, data.error || 'Failed to fetch API docs');
  return data;
}

import type { Need, Organization, User } from '../types';

export class ApiClient {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    return this.request<Organization[]>('/organizations');
  }

  async getOrganization(slug: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/${slug}`);
  }

  // Needs
  async getNeeds(filters?: {
    organization?: string;
    location?: string;
    category?: string;
    status?: string;
  }): Promise<Need[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const queryString = params.toString();
    return this.request<Need[]>(`/needs${queryString ? `?${queryString}` : ''}`);
  }

  async getNeedsByOrganization(orgSlug: string): Promise<Need[]> {
    return this.request<Need[]>(`/needs/org/${orgSlug}`);
  }

  async claimNeed(needId: string): Promise<Need> {
    return this.request<Need>(`/needs/${needId}/claim`, {
      method: 'POST',
    });
  }

  async createNeed(need: Omit<Need, 'id' | 'createdAt' | 'status'>): Promise<Need> {
    return this.request<Need>('/needs', {
      method: 'POST',
      body: JSON.stringify(need),
    });
  }

  async updateNeed(needId: string, updates: Partial<Need>): Promise<Need> {
    return this.request<Need>(`/needs/${needId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteNeed(needId: string): Promise<void> {
    return this.request<void>(`/needs/${needId}`, {
      method: 'DELETE',
    });
  }

  // User operations
  async getUserProfile(): Promise<User> {
    return this.request<User>('/user/profile');
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getUserNeeds(): Promise<Need[]> {
    return this.request<Need[]>('/user/needs');
  }

  async getUserClaims(): Promise<Need[]> {
    return this.request<Need[]>('/user/claims');
  }
}

export const apiClient = new ApiClient();
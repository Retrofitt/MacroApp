import type { ApiResponse } from '../types/auth';
import type { TDEEResult, UserProfile } from '../types/user';

const API_BASE_URL = '/api';

export const userService = {
  getProfile: async (): Promise<ApiResponse<{ profile: UserProfile; tdeeResult: TDEEResult }>> => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to fetch user profile.',
      };
    }
  },

  updateProfile: async (
    profileData: Partial<UserProfile>
  ): Promise<ApiResponse<{ profile: UserProfile; tdeeResult: TDEEResult }>> => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });
      return await res.json();
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update user profile.',
      };
    }
  },
};

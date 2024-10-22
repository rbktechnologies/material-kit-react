
// api.ts
import { getApiBaseURL } from '../get-api-base-url';
import { getAccessToken, removeTokens, refreshAccessToken } from './tokenService';

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
  const accessToken = getAccessToken();
  const authOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let response = await fetch(`${getApiBaseURL()}${url}`, authOptions);

  if (response.status === 401) {
    try {
      const newAccessToken = await refreshAccessToken();
      authOptions.headers = {
        ...authOptions.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      response = await fetch(`${getApiBaseURL}${url}`, authOptions);
    } catch (error) {
      console.error('Refresh token failed', error);
      removeTokens();
      window.location.href = '/auth/sign-in'; // Replace with your login route
      throw error;
    }
  }

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response;
};

export default fetchWithAuth;

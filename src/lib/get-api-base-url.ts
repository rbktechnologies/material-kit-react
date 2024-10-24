

export function getApiBaseURL(): string {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';
    return url.endsWith('/') ? url : `${url}/`;
  }
  
//'use server';
// Production API endpoint
export const API_BASE_URL = 'https://broker.kumail.ng/api.php';

export type ApiError = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

function extractErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return 'Request failed.';

  const anyPayload = payload as any;
  if (typeof anyPayload.message === 'string' && anyPayload.message.trim()) return anyPayload.message;
  if (typeof anyPayload.error === 'string' && anyPayload.error.trim()) return anyPayload.error;

  const errors = anyPayload.errors;
  if (errors && typeof errors === 'object') {
    const firstKey = Object.keys(errors)[0];
    const firstVal = (errors as any)[firstKey];
    if (typeof firstVal === 'string') return firstVal;
    if (Array.isArray(firstVal) && typeof firstVal[0] === 'string') return firstVal[0];
  }

  return 'Request failed.';
}

export async function apiPostJson<TResponse>(
  path: string,
  body: unknown,
  opts?: { token?: string, action?: string }
): Promise<TResponse> {
  const url = opts?.action ? `${API_BASE_URL}?action=${opts.action}` : `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  let payload: unknown = null;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    payload = await res.json().catch(() => null);
  } else {
    payload = await res.text().catch(() => null);
  }

  if (!res.ok || (payload && (payload as any).success === false)) {
    const message = (payload && (payload as any).error) || extractErrorMessage(payload);
    throw new Error(message);
  }

  return payload as TResponse;
}

export async function apiGetJson<TResponse>(
  path: string,
  opts?: { token?: string, action?: string }
): Promise<TResponse> {
  const url = opts?.action ? `${API_BASE_URL}?action=${opts.action}` : `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
  });

  let payload: unknown = null;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    payload = await res.json().catch(() => null);
  } else {
    payload = await res.text().catch(() => null);
  }

  if (!res.ok || (payload && (payload as any).success === false)) {
    const message = (payload && (payload as any).error) || extractErrorMessage(payload);
    throw new Error(message);
  }

  return payload as TResponse;
}

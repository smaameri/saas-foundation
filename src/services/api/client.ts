export type ApiErrorBody = {
  code?: string;
  message: string;
  details?: { path: string[]; message: string }[];
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: ApiErrorBody
  ) {
    super(body.message);
  }
}

export class ApiClient {
  constructor(private basePath = "/api") {}

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.basePath}${path}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : {},
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "An unexpected error occurred." }));
      throw new ApiError(res.status, error);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  get<T>(path: string) {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>("POST", path, body);
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>("PATCH", path, body);
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>("PUT", path, body);
  }

  delete(path: string) {
    return this.request<void>("DELETE", path);
  }
}

export const apiClient = new ApiClient();

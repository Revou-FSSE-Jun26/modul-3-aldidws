import type { AuthResponse, User } from "./types";

const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "https://revo-otoshop.onrender.com";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

async function authFetch<T>(path: string, init: RequestInit): Promise<T> {
  const url = `${AUTH_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new AuthError(
      `Unable to connect to the Auth API at ${url}.`,
      0,
    );
  }

  const data = (await res.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!res.ok) {
    const message =
      (data && data.message) ?? `Request failed with status ${res.status}.`;
    throw new AuthError(message, res.status);
  }

  return data as T;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { name, email, password, confirmPassword } = input;
  return authFetch<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      confirm_password: confirmPassword,
    }),
  });
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  return authFetch<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getMe(token: string): Promise<User> {
  const data = await authFetch<{ user: User }>("/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}

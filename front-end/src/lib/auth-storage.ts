import type { AuthUser, LoginResponseDto, Role } from "@/types/auth";

const TOKEN_KEY = "ic_token";
const USER_KEY = "ic_user";
const EXPIRES_AT_KEY = "ic_expires_at";

const isBrowser = typeof window !== "undefined";

function readFromEitherStorage(key: string): string | null {
  if (!isBrowser) return null;
  // Session (non-remembered) sessions take priority if both somehow exist
  return sessionStorage.getItem(key) ?? localStorage.getItem(key);
}

export function getToken(): string | null {
if (isExpired()) {
    clearSession();
    return null;
  }
  return readFromEitherStorage(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = readFromEitherStorage(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function getExpiresAt(): number | null {
  const raw = readFromEitherStorage(EXPIRES_AT_KEY);
  return raw ? Number(raw) : null;
}

export function isExpired(): boolean {
  const expiresAt = getExpiresAt();
  return expiresAt !== null && Date.now() >= expiresAt;
}

function normalizeRole(raw: string): Role {
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === "admin") return "Admin";
  if (cleaned === "staff") return "Staff";
  if (cleaned === "member") return "Member";
  throw new Error(`Unrecognized role from server: "${raw}"`);
}

export function setSession(dto: LoginResponseDto, rememberMe: boolean) {
  if (!isBrowser) return;
  if (!dto.accessToken || !dto.role) {
    throw new Error("Login response is missing accessToken or role.");
  }

  const user: AuthUser = {
  id: dto.id,
  email: dto.email,
  fullName: dto.fullName,
  role: normalizeRole(dto.role),
  imageUrl: dto.imageUrl, 
};

  const storage = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  // Clear whichever storage we're NOT using, so a stale session can't linger there
  other.removeItem(TOKEN_KEY);
  other.removeItem(USER_KEY);
  other.removeItem(EXPIRES_AT_KEY);

  storage.setItem(TOKEN_KEY, dto.accessToken);
  storage.setItem(USER_KEY, JSON.stringify(user));

  if (dto.expiresIn != null) {
    storage.setItem(EXPIRES_AT_KEY, String(Date.now() + dto.expiresIn* 60 * 1000));
  } else {
    storage.removeItem(EXPIRES_AT_KEY);
  }
}

export function clearSession() {
  if (!isBrowser) return;
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(EXPIRES_AT_KEY);
  }
}

function getActiveStorage(): Storage | null {
  if (!isBrowser) return null;
  if (sessionStorage.getItem(USER_KEY)) return sessionStorage;
  if (localStorage.getItem(USER_KEY)) return localStorage;
  return null;
}

export function updateStoredUser(patch: Partial<AuthUser>): AuthUser | null {
  const storage = getActiveStorage();
  const current = getStoredUser();
  if (!storage || !current) return null;

  const updated: AuthUser = { ...current, ...patch };
  storage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}
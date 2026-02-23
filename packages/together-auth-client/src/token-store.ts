const STORAGE_KEY = "__together_tokens__";
const PKCE_KEY = "__together_pkce__";
const STATE_KEY = "__together_state__";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredTokens {
  accessToken: string;
  /** unix epoch ms */
  expiresAt: number;
  refreshToken?: string;
  idToken?: string;
}

// ─── In-memory cache ──────────────────────────────────────────────────────────

let _tokens: StoredTokens | null = null;

// ─── Token persistence ────────────────────────────────────────────────────────

function readStorage<T>(key: string): T | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function removeStorage(key: string): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(key);
  } catch {}
}

// ─── Token store API ──────────────────────────────────────────────────────────

export function storeTokens(tokens: StoredTokens): void {
  _tokens = tokens;
  writeStorage(STORAGE_KEY, tokens);
}

export function getStoredTokens(): StoredTokens | null {
  if (_tokens) return _tokens;
  const persisted = readStorage<StoredTokens>(STORAGE_KEY);
  if (persisted) {
    _tokens = persisted;
    return _tokens;
  }
  return null;
}

export function clearTokens(): void {
  _tokens = null;
  removeStorage(STORAGE_KEY);
}

export function isTokenExpired(
  tokens: StoredTokens,
  /** Buffer to treat token as expired before actual expiry (ms) */
  bufferMs = 30_000
): boolean {
  return Date.now() >= tokens.expiresAt - bufferMs;
}

// ─── PKCE / state ephemeral store ─────────────────────────────────────────────
// These only need to survive the OAuth redirect round-trip.

export function savePKCE(codeVerifier: string): void {
  writeStorage(PKCE_KEY, codeVerifier);
}

export function loadPKCE(): string | null {
  return readStorage<string>(PKCE_KEY);
}

export function clearPKCE(): void {
  removeStorage(PKCE_KEY);
}

export function saveState(state: string): void {
  writeStorage(STATE_KEY, state);
}

export function loadState(): string | null {
  return readStorage<string>(STATE_KEY);
}

export function clearState(): void {
  removeStorage(STATE_KEY);
}

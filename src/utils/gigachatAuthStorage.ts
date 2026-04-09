const KEY_B64 = 'gigachat_credentials_b64';
const KEY_ID = 'gigachat_client_id';
const KEY_SECRET = 'gigachat_client_secret';

export interface StoredGigaChatAuth {
  b64: string;
  clientId: string;
  clientSecret: string;
}

export function readGigaChatAuthFromStorage(): StoredGigaChatAuth {
  try {
    return {
      b64: (localStorage.getItem(KEY_B64) ?? '').trim(),
      clientId: (localStorage.getItem(KEY_ID) ?? '').trim(),
      clientSecret: (localStorage.getItem(KEY_SECRET) ?? '').trim()
    };
  } catch {
    return { b64: '', clientId: '', clientSecret: '' };
  }
}

export function writeGigaChatAuthToStorage(auth: StoredGigaChatAuth): void {
  try {
    if (auth.b64) {
      localStorage.setItem(KEY_B64, auth.b64.trim());
    } else {
      localStorage.removeItem(KEY_B64);
    }
    if (auth.clientId) {
      localStorage.setItem(KEY_ID, auth.clientId.trim());
    } else {
      localStorage.removeItem(KEY_ID);
    }
    if (auth.clientSecret) {
      localStorage.setItem(KEY_SECRET, auth.clientSecret.trim());
    } else {
      localStorage.removeItem(KEY_SECRET);
    }
  } catch {
    /* квота / приватный режим */
  }
}

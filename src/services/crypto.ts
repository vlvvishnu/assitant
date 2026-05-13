const encoder = new TextEncoder()
const decoder = new TextDecoder()

async function keyFromPassphrase(passphrase: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase) as BufferSource, 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 210_000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptSecret(value: string, passphrase: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await keyFromPassphrase(passphrase, salt)
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, encoder.encode(value) as BufferSource))
  return btoa(JSON.stringify({ salt: Array.from(salt), iv: Array.from(iv), ciphertext: Array.from(ciphertext) }))
}

export async function decryptSecret(payload: string, passphrase: string) {
  const parsed = JSON.parse(atob(payload)) as { salt: number[]; iv: number[]; ciphertext: number[] }
  const key = await keyFromPassphrase(passphrase, new Uint8Array(parsed.salt))
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(parsed.iv) as BufferSource }, key, new Uint8Array(parsed.ciphertext) as BufferSource)
  return decoder.decode(plaintext)
}

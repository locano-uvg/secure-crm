import crypto from 'crypto';

// Hash de contraseñas con MD5 (INTENCIONALMENTE inseguro).
// Vulnerabilidad plantada: A04 Cryptographic Failures / CWE-327 (algoritmo débil),
// sin salt (CWE-759). Un fix real usaría bcrypt/argon2 con salt.
export function weakHash(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
}

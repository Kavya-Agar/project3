import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { AUTH } from '../config.js';
import { forbidden, unauthorized } from '../utils/httpError.js';

const googleClient = new OAuth2Client(AUTH.GOOGLE_CLIENT_ID);

export const isManagerEmail = (email) => AUTH.MANAGER_EMAILS.includes(email.toLowerCase());

// Verifies a Google ID token and returns the signed-in user's profile.
export async function verifyGoogleCredential(credential) {
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: AUTH.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw unauthorized('Invalid Google credential');
  }
  if (!payload?.email || !payload.email_verified) throw unauthorized('Email is not verified');
  if (!isManagerEmail(payload.email)) throw forbidden('This account is not a manager');
  return { email: payload.email, name: payload.name ?? payload.email };
}

export const issueSession = (user) =>
  jwt.sign(user, AUTH.SESSION_SECRET, { expiresIn: AUTH.SESSION_TTL });

export function verifySession(token) {
  try {
    return jwt.verify(token, AUTH.SESSION_SECRET);
  } catch {
    throw unauthorized('Session expired');
  }
}

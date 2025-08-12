import { HttpRequest } from "@azure/functions";

export interface AuthUser {
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims: Array<{
    typ: string;
    val: string;
  }>;
  identityProvider: string;
}

export function getAuthUser(req: HttpRequest): AuthUser | null {
  const authHeader = req.headers['x-ms-client-principal'];
  
  if (!authHeader) {
    return null;
  }
  
  try {
    const encoded = Buffer.from(authHeader, 'base64');
    const decoded = encoded.toString('ascii');
    return JSON.parse(decoded) as AuthUser;
  } catch (error) {
    console.error('Error parsing auth header:', error);
    return null;
  }
}

export function requireAuth(req: HttpRequest): AuthUser {
  const user = getAuthUser(req);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function getUserEmail(user: AuthUser): string {
  const emailClaim = user.claims.find(c => c.typ === 'email' || c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress');
  return emailClaim?.val || user.userDetails;
}

export function getUserName(user: AuthUser): string {
  const nameClaim = user.claims.find(c => c.typ === 'name' || c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name');
  return nameClaim?.val || user.userDetails;
}
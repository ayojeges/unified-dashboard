// Shared user store for demo purposes
// In production, use a real database!

interface User {
  email: string;
  password: string;
  name: string;
  verified: boolean;
  verifyToken?: string;
}

// Global stores that persist across API routes
export const users = new Map<string, User>();
export const verifyTokens = new Map<string, string>(); // token -> email

// Helper functions
export function getUser(email: string): User | undefined {
  return users.get(email.toLowerCase());
}

export function createUser(email: string, password: string, name: string, verified = false, verifyToken?: string): User {
  const user: User = {
    email: email.toLowerCase(),
    password,
    name,
    verified,
    verifyToken
  };
  users.set(email.toLowerCase(), user);
  if (verifyToken) {
    verifyTokens.set(verifyToken, email.toLowerCase());
  }
  return user;
}

export function verifyUser(token: string): User | null {
  const email = verifyTokens.get(token);
  if (!email) return null;
  
  const user = users.get(email);
  if (!user) return null;
  
  user.verified = true;
  delete user.verifyToken;
  verifyTokens.delete(token);
  
  return user;
}

export function userExists(email: string): boolean {
  return users.has(email.toLowerCase());
}

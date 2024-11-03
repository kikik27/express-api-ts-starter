export interface safeUser {
  id: string;
  email: string;
  name: string;
  role: string;
  verified_at: Date | null;
}

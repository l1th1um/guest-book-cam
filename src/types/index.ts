export interface GuestEntry {
  name: string;
  graduationYear: string;
  email: string;
  message: string;
  photo: string | null;
}

export interface FormErrors {
  name?: string;
  graduationYear?: string;
  email?: string;
  message?: string;
  photo?: string;
}
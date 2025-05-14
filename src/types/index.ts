export interface GuestEntry {
  name: string;
  tahun_lulus: string;
  email: string;
  message: string;
  photo: string | null;
}

export interface FormErrors {
  name?: string;
  tahun_lulus?: string;
  email?: string;
  message?: string;
  photo?: string;
}
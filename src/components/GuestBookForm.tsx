import React, { useState } from 'react';
import { Mail, User, Calendar, Send } from 'lucide-react';
import WebcamCapture from './WebcamCapture';
import { GuestEntry, FormErrors } from '../types';
import { queueEmail } from '../services/emailService';

const GuestBookForm: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState<GuestEntry>({
    name: '',
    graduationYear: '',
    email: '',
    message: '',
    photo: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }

    if (!formData.graduationYear) {
      newErrors.graduationYear = 'Tahun Lulus Harus Diisi';
    } else {
      const year = parseInt(formData.graduationYear, 10);
      if (isNaN(year) || year < 1900 || year > currentYear + 10) {
        newErrors.graduationYear = 'Masukkan tahun yang valid';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Cek Kembali Email Anda';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Pesan dan Kesan harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormFilled = (): boolean => {
    return !!(
      formData.name.trim() &&
      formData.graduationYear.trim() &&
      formData.email.trim() &&
      formData.message.trim()
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handlePhotoCapture = (photoDataUrl: string) => {
    setFormData({
      ...formData,
      photo: photoDataUrl || null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await queueEmail(formData);
      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({
          name: '',
          graduationYear: '',
          email: '',
          message: '',
          photo: null
        });
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Terima Kasih!</h2>
          <p className="text-gray-600 mb-4">
            Pesan anda telah kami simpan. Terima Kasih
          </p>
          {formData.photo && (
            <div className="mt-6 inline-block">
              <img
                src={formData.photo}
                alt="Your photo"
                className="h-32 w-auto rounded-lg shadow-md mx-auto"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-5/12 p-8 bg-white">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Asep Gorbachev"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="graduationYear"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tahun Lulus
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="graduationYear"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.graduationYear ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {errors.graduationYear && (
                <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="asep_gorbachev@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pesan dan Kesan
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className={`block w-full px-3 py-2 rounded-lg border ${
                  errors.message ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Berikan pesan dan kesanmu!"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormFilled()}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isSubmitting || !isFormFilled()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                } transition-colors duration-300`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Kirim
                  </>
                )}
              </button>
              {!isFormFilled() && (
                <p className="mt-2 text-xs text-center text-gray-500">
                  Isi semua isian form
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 bg-gray-50 p-8 border-l border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Berikan senyum terbaikmu
          </h3>
          <WebcamCapture
            onCapture={handlePhotoCapture}
            photoDataUrl={formData.photo}
            isFormFilled={isFormFilled()}
          />
        </div>
      </div>
    </form>
  );
};

export default GuestBookForm;
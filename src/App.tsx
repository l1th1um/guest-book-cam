import React from 'react';
import GuestBookForm from './components/GuestBookForm';
import { GraduationCap } from 'lucide-react';

function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)), url('https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-blue-600 text-white p-3 rounded-full mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            REUNI IKASA 2025
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            One Soul, One Goal, One Family.
          </p>
        </header>

        <main className="animate-fade-in">
          <GuestBookForm />
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} IKASA.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
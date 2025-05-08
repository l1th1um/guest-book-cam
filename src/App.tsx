import React from 'react';
import GuestBookForm from './components/GuestBookForm';
import { GraduationCap } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-blue-600 text-white p-3 rounded-full mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Digital Guest Book
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Sign our guest book by adding your details and taking a photo to commemorate your visit.
          </p>
        </header>
        
        <main className="animate-fade-in">
          <GuestBookForm />
        </main>
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Digital Guest Book. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
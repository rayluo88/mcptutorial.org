'use client';

import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // If we scrolled more than 300px, show the button
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 rounded-full bg-blue-600 p-2 text-white shadow-lg transition hover:bg-blue-700"
      aria-label="Back to top"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
}

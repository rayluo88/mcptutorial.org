'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-0 z-10 flex w-full flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-auto lg:w-72 lg:border-r lg:border-gray-800">
      <div className="flex h-14 items-center px-4 py-4 lg:h-auto">
        <Link
          href="/"
          className="group flex w-full items-center gap-x-2.5"
          onClick={() => setIsOpen(false)}
        >
          <div className="h-7 w-7 rounded-full border border-white/30 group-hover:border-white/50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full stroke-[1.5] text-white/70 group-hover:text-white/90"
            >
              <path
                d="M6 12a6 6 0 1 1 12 0c0 2.6-1.5 4.6-3 6l-3 3-3-3c-1.5-1.4-3-3.4-3-6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="font-semibold tracking-wide text-gray-400 group-hover:text-gray-50">
            MCP Learning
          </h3>
        </Link>
      </div>
      <button
        type="button"
        className="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium text-gray-100 group-hover:text-gray-400">
          Menu
        </div>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-gray-400"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-gray-400"
          >
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        )}
      </button>

      <div
        className={clsx('overflow-y-auto lg:static lg:block', {
          'fixed inset-x-0 bottom-0 top-14 mt-px bg-black': isOpen,
          hidden: !isOpen,
        })}
      >
        <nav className="space-y-6 px-2 py-5">
          <div>
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
              <div>Main</div>
            </div>
            <div>
              <Link
                href="/mcp"
                className={clsx(
                  'block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300',
                  {
                    'text-gray-400 hover:bg-gray-800': pathname !== '/mcp',
                    'bg-gray-800 text-white': pathname === '/mcp',
                  },
                )}
                onClick={() => setIsOpen(false)}
              >
                MCP Home
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

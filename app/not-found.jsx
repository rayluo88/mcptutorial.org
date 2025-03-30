import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <h2 className="text-lg font-bold text-white">Section Not Found</h2>
      <p className="text-gray-400">
        Could not find requested section or resource
      </p>
      <Link
        href="/mcp"
        className="inline-block rounded bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-500"
      >
        Return to MCP Home
      </Link>
    </div>
  );
}

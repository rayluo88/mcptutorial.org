import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  // Redirect to MCP page
  redirect('/mcp');

  /* Alternative approach without redirect:
  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <h1 className="text-xl font-medium text-gray-300">MCP Learning</h1>
        
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-px shadow-lg shadow-black/20">
          <Link
            href="/mcp"
            className="block rounded-lg bg-gray-900 p-5 hover:bg-gray-800 transition"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Model Context Protocol (MCP)
            </h2>
            <p className="text-gray-300">
              A comprehensive guide to understanding and implementing the Model Context Protocol (MCP), 
              the new standard for AI applications to access contextual information.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
  */
}

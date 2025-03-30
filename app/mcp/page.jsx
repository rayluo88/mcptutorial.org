import { getMCPContent } from '../../lib/mcp';
import Link from 'next/link';

export const metadata = {
  title: 'MCP Learning - Model Context Protocol',
  description:
    'A comprehensive guide to understanding and implementing the Model Context Protocol (MCP)',
};

export default async function MCPHomePage() {
  const sections = await getMCPContent();

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Understanding and Implementing the Model Context Protocol (MCP)
        </h1>
        <p className="text-lg text-gray-300">
          A comprehensive guide to learning Model Context Protocol (MCP), an
          open standard for AI applications to access contextual information.
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              {section.id}. {section.title}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.subsections.map((subsection) => (
                <Link
                  key={subsection.id}
                  href={`/mcp/${subsection.id}`}
                  className="block rounded-lg bg-gray-800 p-4 transition hover:bg-gray-700"
                >
                  <h3 className="font-medium text-white">
                    {subsection.id} {subsection.title.replace(':', '')}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

import {
  getSubsectionById,
  getSectionById,
  getAllSubsections,
} from '../../../lib/mcp';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const subsection = await getSubsectionById(params.id);

  if (!subsection) {
    return {
      title: 'Not Found',
    };
  }

  const section = await getSectionById(subsection.parentId);

  return {
    title: `${subsection.id} ${subsection.title} | MCP Learning`,
    description: `Learn about ${subsection.title} in the Model Context Protocol`,
  };
}

export default async function SubsectionPage({ params }) {
  const subsection = await getSubsectionById(params.id);

  if (!subsection) {
    notFound();
  }

  const section = await getSectionById(subsection.parentId);

  // Get all subsections to determine previous and next
  const allSubsections = await getAllSubsections();
  console.log('Total subsections found:', allSubsections.length);

  // Sort subsections by ID to ensure correct order
  const sortedSubsections = [...allSubsections].sort((a, b) => {
    const [aMajor, aMinor] = a.id.split('.').map(Number);
    const [bMajor, bMinor] = b.id.split('.').map(Number);

    if (aMajor !== bMajor) return aMajor - bMajor;
    return aMinor - bMinor;
  });

  // Find the current subsection index
  const currentIndex = sortedSubsections.findIndex(
    (sub) => sub.id === subsection.id,
  );
  console.log(
    'Current subsection index:',
    currentIndex,
    'for ID:',
    subsection.id,
  );

  // Get previous and next subsections if they exist
  const prevSubsection =
    currentIndex > 0 ? sortedSubsections[currentIndex - 1] : null;
  const nextSubsection =
    currentIndex < sortedSubsections.length - 1
      ? sortedSubsections[currentIndex + 1]
      : null;

  console.log(
    'Prev subsection:',
    prevSubsection ? `${prevSubsection.id} - ${prevSubsection.title}` : 'None',
  );
  console.log(
    'Next subsection:',
    nextSubsection ? `${nextSubsection.id} - ${nextSubsection.title}` : 'None',
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-700 pb-4">
        <div className="text-sm text-gray-400">
          <Link href="/mcp" className="hover:text-gray-300">
            Home
          </Link>{' '}
          / Section {subsection.parentId}: {section?.title}
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white">
          {subsection.id} {subsection.title}
        </h1>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        {subsection.content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="flex justify-between border-t border-gray-700 pt-4">
        {prevSubsection ? (
          <Link
            href={`/mcp/${prevSubsection.id}`}
            className="text-blue-400 hover:text-blue-300"
          >
            ← {prevSubsection.id} {prevSubsection.title}
          </Link>
        ) : (
          <div></div>
        )}

        <Link href="/mcp" className="text-blue-400 hover:text-blue-300">
          Back to All Sections
        </Link>

        {nextSubsection ? (
          <Link
            href={`/mcp/${nextSubsection.id}`}
            className="text-blue-400 hover:text-blue-300"
          >
            {nextSubsection.id} {nextSubsection.title} →
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

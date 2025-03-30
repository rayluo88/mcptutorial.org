import { MCPSection, MCPSubSection } from './mcp-types';

// Cache for data
let sectionsCache: MCPSection[] | null = null;
let subsectionsCache: MCPSubSection[] | null = null;

// Helper to get the base URL
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return '';
  }
  // SSR should use the site URL
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
}

export async function getMCPContent(): Promise<MCPSection[]> {
  if (sectionsCache) return sectionsCache;

  try {
    const response = await fetch(`${getBaseUrl()}/api/mcp/sections`);
    if (!response.ok) throw new Error('Failed to fetch sections');

    const data = await response.json();
    sectionsCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching MCP content:', error);
    return [];
  }
}

export async function getAllSubsections(): Promise<MCPSubSection[]> {
  if (subsectionsCache) return subsectionsCache;

  try {
    const response = await fetch(`${getBaseUrl()}/api/mcp/subsections`);
    if (!response.ok) throw new Error('Failed to fetch subsections');

    const data = await response.json();
    subsectionsCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching subsections:', error);
    return [];
  }
}

export async function getSubsectionById(
  id: string,
): Promise<MCPSubSection | undefined> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/mcp/subsections/${id}`);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error('Failed to fetch subsection');

    return await response.json();
  } catch (error) {
    console.error(`Error fetching subsection ${id}:`, error);
    return undefined;
  }
}

export async function getSectionById(
  id: string,
): Promise<MCPSection | undefined> {
  const sections = await getMCPContent();
  return sections.find((section) => section.id === id);
}

export function formatContent(content: string): string {
  // Return the content as is, since we're using react-markdown to render it
  return content;
}

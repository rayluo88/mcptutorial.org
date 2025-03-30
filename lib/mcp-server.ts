import fs from 'fs';
import path from 'path';
import { MCPSection, MCPSubSection } from './mcp-types';

export function getMCPContentFromFile(): MCPSection[] {
  try {
    const filePath = path.join(process.cwd(), 'MCP_Learning_Outline.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const sections: MCPSection[] = [];
    let currentSection: MCPSection | null = null;
    let currentContent = '';

    const lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match section titles with ## (e.g., "## 1. Introduction to Model Context Protocol (MCP)")
      const sectionMatch = line.match(/^##\s+(\d+)\.?\s+(.+?)$/);

      if (sectionMatch) {
        // If we have a previous section, add it to our sections array
        if (currentSection) {
          sections.push(currentSection);
        }

        const id = sectionMatch[1];
        const title = sectionMatch[2];

        currentSection = {
          id,
          title,
          subsections: [],
        };
        currentContent = '';
        continue;
      }

      // Match subsection titles with ### (e.g., "### 1.1 Core Purpose and High-Level Benefits:")
      const subsectionMatch = line.match(/^###\s+(\d+\.\d+)\s+(.+?)$/);

      if (subsectionMatch && currentSection) {
        // If we have accumulated content, add it to the previous subsection
        if (currentContent.trim() && currentSection.subsections.length > 0) {
          currentSection.subsections[
            currentSection.subsections.length - 1
          ].content = currentContent.trim();
        }

        const id = subsectionMatch[1];
        const title = subsectionMatch[2];

        currentSection.subsections.push({
          id,
          title,
          content: '',
          parentId: currentSection.id,
        });

        currentContent = '';
        continue;
      }

      // Accumulate content for the current subsection
      if (currentSection && currentSection.subsections.length > 0) {
        currentContent += line + '\n';
      }
    }

    // Add the last subsection's content
    if (
      currentSection &&
      currentSection.subsections.length > 0 &&
      currentContent.trim()
    ) {
      currentSection.subsections[
        currentSection.subsections.length - 1
      ].content = currentContent.trim();
    }

    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    // Log all generated subsection IDs for debugging
    console.log(
      'Available subsection IDs:',
      sections.flatMap((s) => s.subsections.map((ss: MCPSubSection) => ss.id)),
    );

    return sections;
  } catch (error) {
    console.error('Error reading MCP file:', error);
    return [];
  }
}

export function getAllSubsectionsFromFile(): MCPSubSection[] {
  const sections = getMCPContentFromFile();
  return sections.flatMap((section) => section.subsections);
}

export function getSubsectionByIdFromFile(
  id: string,
): MCPSubSection | undefined {
  const allSubsections = getAllSubsectionsFromFile();
  console.log('Server: Looking for subsection with ID:', id);
  console.log(
    'Server: All available IDs:',
    allSubsections.map((s) => s.id),
  );

  // First try exact match
  let subsection = allSubsections.find((subsection) => subsection.id === id);

  if (!subsection) {
    console.log('Server: Exact match not found, trying trimmed IDs');
    // Try trimming whitespace
    subsection = allSubsections.find(
      (subsection) => subsection.id.trim() === id.trim(),
    );
  }

  console.log('Server: Found subsection?', subsection ? 'Yes' : 'No');
  return subsection;
}

export function getSectionByIdFromFile(id: string): MCPSection | undefined {
  return getMCPContentFromFile().find((section) => section.id === id);
}

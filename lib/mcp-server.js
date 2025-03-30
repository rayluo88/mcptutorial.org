const fs = require('fs');
const path = require('path');

function getMCPContentFromFile() {
  try {
    const filePath = path.join(process.cwd(), 'MCP_Learning_Outline.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    console.log('File loaded, size:', fileContent.length, 'bytes');

    const sections = [];
    let currentSection = null;
    let currentSubsection = null;
    let currentContent = '';

    const lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match section titles with ## (e.g., "## 1. Introduction to Model Context Protocol (MCP)")
      const sectionMatch = line.match(/^##\s+(\d+)\.?\s+(.+?)$/);

      if (sectionMatch) {
        // If we have accumulated content for a previous subsection, save it
        if (currentSubsection) {
          currentSubsection.content = currentContent.trim();
          currentContent = '';
        }

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
        currentSubsection = null;
        continue;
      }

      // Match subsection titles with ### (e.g., "### 1.1 Core Purpose and High-Level Benefits:")
      const subsectionMatch = line.match(/^###\s+(\d+\.\d+)\s+(.+?)$/);

      if (subsectionMatch && currentSection) {
        // If we have accumulated content for a previous subsection, save it
        if (currentSubsection) {
          currentSubsection.content = currentContent.trim();
        }

        const id = subsectionMatch[1];
        const title = subsectionMatch[2];

        currentSubsection = {
          id,
          title,
          content: '',
          parentId: currentSection.id,
        };

        currentSection.subsections.push(currentSubsection);
        currentContent = '';
        continue;
      }

      // Accumulate content for the current subsection
      if (currentSubsection) {
        currentContent += line + '\n';
      }
    }

    // Don't forget to add the last subsection's content
    if (currentSubsection) {
      currentSubsection.content = currentContent.trim();
    }

    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    // Verify that all subsections have content
    let emptySubsections = 0;
    sections.forEach((section) => {
      section.subsections.forEach((subsection) => {
        if (!subsection.content || subsection.content.length === 0) {
          console.log(`Warning: Empty content for subsection ${subsection.id}`);
          emptySubsections++;
        }
      });
    });
    console.log(
      `Found ${emptySubsections} empty subsections out of ${sections.flatMap((s) => s.subsections).length} total`,
    );

    // Log all generated subsection IDs for debugging
    console.log(
      'Available subsection IDs:',
      sections.flatMap((s) => s.subsections.map((ss) => ss.id)),
    );

    return sections;
  } catch (error) {
    console.error('Error reading MCP file:', error);
    return [];
  }
}

function getAllSubsectionsFromFile() {
  const sections = getMCPContentFromFile();
  const allSubsections = sections.flatMap((section) => section.subsections);
  console.log(
    `Server: getAllSubsectionsFromFile returning ${allSubsections.length} subsections`,
  );
  return allSubsections;
}

function getSubsectionByIdFromFile(id) {
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

  // Add debug information about the content
  if (subsection) {
    console.log('Server: Content length:', subsection.content.length);
    console.log(
      'Server: Content preview:',
      subsection.content.substring(0, 100),
    );
  }

  return subsection;
}

function getSectionByIdFromFile(id) {
  return getMCPContentFromFile().find((section) => section.id === id);
}

module.exports = {
  getMCPContentFromFile,
  getAllSubsectionsFromFile,
  getSubsectionByIdFromFile,
  getSectionByIdFromFile,
};

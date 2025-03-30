const express = require('express');
const path = require('path');
const fs = require('fs');
const marked = require('marked');

// Import our MCP parsing function
const {
  getMCPContentFromFile,
  getAllSubsectionsFromFile,
  getSubsectionByIdFromFile,
} = require('./lib/mcp-server');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Helper function to generate navigation HTML
function generateNavigation(sections, currentSubsectionId = null) {
  let navHtml = `
    <div class="navigation">
      <div class="nav-header">
        <h2>MCP Learning</h2>
      </div>
      <nav>
  `;

  sections.forEach((section) => {
    navHtml += `
      <div class="nav-section">
        <div class="nav-section-title">${section.id}. ${section.title}</div>
        <ul class="nav-subsections">
    `;

    section.subsections.forEach((subsection) => {
      const isActive = subsection.id === currentSubsectionId;
      navHtml += `
        <li>
          <a href="/subsection/${subsection.id}" class="nav-link ${isActive ? 'active' : ''}">
            ${subsection.id} ${subsection.title}
          </a>
        </li>
      `;
    });

    navHtml += `
        </ul>
      </div>
    `;
  });

  navHtml += `
      </nav>
    </div>
  `;

  return navHtml;
}

// Shared CSS styles
const sharedStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: system-ui, sans-serif; 
    line-height: 1.5; 
    display: flex;
    min-height: 100vh;
    color: #333;
  }
  
  .navigation {
    width: 300px;
    background: #f5f5f5;
    border-right: 1px solid #ddd;
    overflow-y: auto;
    height: 100vh;
    position: fixed;
    padding: 1rem 0;
  }
  
  .nav-header {
    padding: 0 1rem 1rem;
    border-bottom: 1px solid #ddd;
    margin-bottom: 1rem;
  }
  
  .nav-section {
    margin-bottom: 1rem;
  }
  
  .nav-section-title {
    font-weight: 600;
    padding: 0.5rem 1rem;
    color: #555;
  }
  
  .nav-subsections {
    list-style: none;
    padding-left: 1.5rem;
  }
  
  .nav-link {
    display: block;
    padding: 0.25rem 0.5rem;
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #0070f3;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .nav-link:hover {
    background: rgba(0, 112, 243, 0.1);
  }
  
  .nav-link.active {
    background: rgba(0, 112, 243, 0.2);
    font-weight: 500;
  }
  
  .content-wrapper {
    margin-left: 300px;
    width: calc(100% - 300px);
    padding: 2rem;
    max-width: 1000px;
  }
  
  h1 { color: #333; margin-bottom: 1rem; }
  h2 { margin-top: 2rem; color: #444; }
  h3 { color: #555; }
  a { color: #0070f3; text-decoration: none; }
  a:hover { text-decoration: underline; }
  p { margin: 1rem 0; }
  
  .section { margin-bottom: 2rem; }
  .subsection { background: #f7f7f7; padding: 1rem; margin: 0.5rem 0; border-radius: 4px; }
  
  .content { margin-top: 2rem; }
  
  .back-link {
    display: inline-block;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 768px) {
    body {
      flex-direction: column;
    }
    .navigation {
      width: 100%;
      height: auto;
      position: relative;
    }
    .content-wrapper {
      margin-left: 0;
      width: 100%;
    }
  }
`;

// API routes
app.get('/api/mcp/sections', (req, res) => {
  try {
    const sections = getMCPContentFromFile();
    res.json(sections);
  } catch (error) {
    console.error('Error in /api/mcp/sections:', error);
    res.status(500).json({ error: 'Failed to fetch MCP sections' });
  }
});

app.get('/api/mcp/subsections', (req, res) => {
  try {
    const subsections = getAllSubsectionsFromFile();
    res.json(subsections);
  } catch (error) {
    console.error('Error in /api/mcp/subsections:', error);
    res.status(500).json({ error: 'Failed to fetch MCP subsections' });
  }
});

app.get('/api/mcp/subsections/:id', (req, res) => {
  try {
    const subsection = getSubsectionByIdFromFile(req.params.id);

    if (!subsection) {
      return res
        .status(404)
        .json({ error: `Subsection with ID ${req.params.id} not found` });
    }

    res.json(subsection);
  } catch (error) {
    console.error(`Error in /api/mcp/subsections/${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch MCP subsection' });
  }
});

// Serve a simple HTML page with the MCP content
app.get('/', (req, res) => {
  const sections = getMCPContentFromFile();
  const navHtml = generateNavigation(sections);

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MCP Learning</title>
      <style>
        ${sharedStyles}
      </style>
    </head>
    <body>
      ${navHtml}
      
      <div class="content-wrapper">
        <h1>Understanding and Implementing the Model Context Protocol (MCP)</h1>
        <p>A comprehensive guide to learning Model Context Protocol (MCP), an open standard for AI applications to access contextual information.</p>
        
        <div class="sections">
  `;

  sections.forEach((section) => {
    html += `
      <div class="section">
        <h2>${section.id}. ${section.title}</h2>
        <div class="subsections">
    `;

    section.subsections.forEach((subsection) => {
      html += `
        <div class="subsection">
          <h3>${subsection.id} ${subsection.title}</h3>
          <a href="/subsection/${subsection.id}">View details</a>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

app.get('/subsection/:id', (req, res) => {
  const subsection = getSubsectionByIdFromFile(req.params.id);

  if (!subsection) {
    return res.status(404).send('Subsection not found');
  }

  // Debug: Log content before parsing
  console.log('Content before parsing - Length:', subsection.content.length);
  console.log('Content preview:', subsection.content.substring(0, 150));

  const sections = getMCPContentFromFile();
  const navHtml = generateNavigation(sections, subsection.id);

  const section = sections.find((s) => s.id === subsection.parentId);

  // Parse content as markdown
  const contentHtml = marked.parse(subsection.content);

  // Debug: Log parsed content
  console.log('Parsed content - Length:', contentHtml.length);
  console.log('Parsed content preview:', contentHtml.substring(0, 150));

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subsection.id} ${subsection.title} | MCP Learning</title>
      <style>
        ${sharedStyles}
        
        /* Additional styles for markdown content */
        .content strong { font-weight: bold; }
        .content em { font-style: italic; }
        .content code { 
          background: rgba(0,0,0,0.05); 
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }
        .content blockquote {
          border-left: 4px solid #ddd;
          padding-left: 1em;
          margin-left: 0;
          color: #666;
        }
        .content ul, .content ol {
          padding-left: 2em;
          margin: 1em 0;
        }
        .content img {
          max-width: 100%;
        }
        
        /* Debug: Add a border to see the content container */
        .content {
          margin-top: 2rem;
          border: 1px dashed #ccc;
          padding: 1rem;
          min-height: 200px;
        }
      </style>
    </head>
    <body>
      ${navHtml}
      
      <div class="content-wrapper">
        <a href="/" class="back-link">← Back to Home</a>
        <div class="breadcrumb">
          Section ${subsection.parentId}: ${section ? section.title : ''}
        </div>
        <h1>${subsection.id} ${subsection.title}</h1>
        <div class="content">
          ${contentHtml}
        </div>
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

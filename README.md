# Model Context Protocol (MCP) Learning Website

A comprehensive website for learning about the Model Context Protocol (MCP), an open standard for AI applications to access contextual information.

## Project Overview

This website serves as a structured tutorial and reference for the Model Context Protocol. It provides:

- Organized learning sections with detailed subsections
- Comprehensive content on MCP concepts and implementation
- User-friendly navigation through the MCP tutorial

## Features

- **Structured Content:** Content organized into sections and subsections for easy navigation
- **Responsive Design:** Built with modern UI/UX principles using Next.js and Tailwind CSS
- **Server-Side Rendering:** Utilizes Next.js App Router for efficient content delivery
- **Content Management:** Pulls MCP content from a structured markdown file
- **Navigation Features:**
  - Interactive section/subsection navigation
  - Previous/Next links for sequential learning
  - Breadcrumb navigation for context awareness

## Technology Stack

- **Frontend Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Language:** JavaScript (JSX)
- **Package Manager:** npm

## Project Structure

- `/app` - Next.js App Router pages and API routes
  - `/app/mcp` - Main MCP tutorial pages and components
  - `/app/api/mcp` - API endpoints to serve MCP content
- `/lib` - MCP content parsing and utility functions
  - `mcp.js` - Client-side API utilities
  - `mcp-server.js` - Server-side content parsing logic
- `/public` - Static assets
- `MCP_Learning_Outline.md` - Source content in markdown format

## Content Organization

The content is parsed from a markdown file where:

- Level 2 headings (`##`) define sections
- Level 3 headings (`###`) define subsections
- Content under subsection headings becomes the subsection content

## Running Locally

1. Install dependencies:

```sh
npm install
```

2. Start the development server:

```sh
node server.js
```

3. Open [http://localhost:3000/mcp](http://localhost:3000/mcp) in your browser

## Building for Production

```sh
npm run build
```

## Running Production Build

```sh
npm start
```

## Future Enhancements

Planned improvements to the learning platform:

- Search functionality for finding specific topics
- Interactive examples of MCP implementation
- User progress tracking
- Dark/light theme toggle

## License

See the [License](./license.md) file for details.

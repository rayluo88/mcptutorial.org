export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Extract the path from the URL
  const path = url.pathname.replace('/api/', '');

  try {
    // For MCP data, we can access directly since we're deploying to Cloudflare
    if (path.startsWith('mcp/')) {
      const sections = await context.env.ASSETS.fetch(
        new Request(`${url.origin}/sections.json`),
      );
      const sectionsData = await sections.json();

      if (path === 'mcp/sections') {
        return new Response(JSON.stringify(sectionsData), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (path === 'mcp/subsections') {
        const subsections = sectionsData.flatMap(
          (section) => section.subsections,
        );
        return new Response(JSON.stringify(subsections), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Handle individual subsection request
      if (path.startsWith('mcp/subsections/')) {
        const id = path.replace('mcp/subsections/', '');
        const allSubsections = sectionsData.flatMap(
          (section) => section.subsections,
        );
        const subsection = allSubsections.find(
          (subsection) =>
            subsection.id === id || subsection.id.trim() === id.trim(),
        );

        if (!subsection) {
          return new Response(
            JSON.stringify({ error: `Subsection with ID ${id} not found` }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            },
          );
        }

        return new Response(JSON.stringify(subsection), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Default 404 response for API routes we don't handle
    return new Response(JSON.stringify({ error: 'API route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

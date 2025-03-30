export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Try to serve as a static asset first
  try {
    // For paths that should render the Next.js app
    return new Response(null, {
      status: 302,
      headers: { Location: '/' },
    });
  } catch (error) {
    return new Response(`Page not found: ${url.pathname}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

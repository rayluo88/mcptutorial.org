import '../styles/globals.css';
import { AddressBar } from '../ui/address-bar';
import { GlobalNav } from '../ui/global-nav';

export const metadata = {
  title: {
    default: 'MCP Learning',
    template: '%s | MCP Learning',
  },
  metadataBase: new URL('https://app-router.vercel.app'),
  description:
    'A comprehensive guide to understanding and implementing the Model Context Protocol (MCP), the standardized method for AI applications to access contextual information.',
  openGraph: {
    title: 'MCP Learning',
    description:
      'A comprehensive guide to understanding and implementing the Model Context Protocol (MCP), the standardized method for AI applications to access contextual information.',
    images: [`/api/og?title=MCP Learning`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className="overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')] pb-36">
        <GlobalNav />

        <div className="lg:pl-72">
          <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black">
                <AddressBar />
              </div>
            </div>

            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

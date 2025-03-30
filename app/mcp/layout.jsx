import { BackToTop } from './components/back-to-top';

export const metadata = {
  title: {
    default: 'MCP Learning - Model Context Protocol',
    template: '%s | MCP Learning',
  },
  description:
    'A comprehensive guide to understanding and implementing the Model Context Protocol (MCP)',
};

export default function MCPLayout({ children }) {
  return (
    <div className="relative">
      <main className="relative">{children}</main>
      <BackToTop />
    </div>
  );
}

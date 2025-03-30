import { NextResponse } from 'next/server';
import { getMCPContentFromFile } from '../../../../lib/mcp-server';

export async function GET() {
  try {
    const sections = getMCPContentFromFile();
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error in /api/mcp/sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MCP sections' },
      { status: 500 },
    );
  }
}

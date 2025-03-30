import { NextResponse } from 'next/server';
import { getAllSubsectionsFromFile } from '../../../../lib/mcp-server';

export async function GET() {
  try {
    const subsections = getAllSubsectionsFromFile();
    return NextResponse.json(subsections);
  } catch (error) {
    console.error('Error in /api/mcp/subsections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MCP subsections' },
      { status: 500 },
    );
  }
}

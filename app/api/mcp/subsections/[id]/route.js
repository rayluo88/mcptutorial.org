import { NextResponse } from 'next/server';
import { getSubsectionByIdFromFile } from '../../../../../lib/mcp-server';

export async function GET(req, { params }) {
  try {
    const subsection = getSubsectionByIdFromFile(params.id);

    if (!subsection) {
      return NextResponse.json(
        { error: `Subsection with ID ${params.id} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(subsection);
  } catch (error) {
    console.error(`Error in /api/mcp/subsections/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch MCP subsection' },
      { status: 500 },
    );
  }
}

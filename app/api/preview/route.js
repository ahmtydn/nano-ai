import { NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    const { file_id, username } = await request.json();

    if (!file_id || !username) {
      return NextResponse.json(
        { success: false, message: 'File ID and username are required' },
        { status: 400 }
      );
    }

    // Use the same Convex download function to get file URL
    const result = await convex.query(api.knowledgeNest.downloadFile, {
      file_id,
      username,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    // Return the file URL with preview flag
    return NextResponse.json({
      success: true,
      previewUrl: result.downloadUrl,
      filename: result.filename,
      file_type: result.file_type,
      file_size: result.file_size,
      message: 'File ready for preview',
    });

  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to prepare preview' },
      { status: 500 }
    );
  }
}

// GET method for direct preview access
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const file_id = searchParams.get('file_id');
    const username = searchParams.get('username');

    if (!file_id || !username) {
      return NextResponse.json(
        { success: false, message: 'File ID and username are required' },
        { status: 400 }
      );
    }

    // Get file info from Convex
    const result = await convex.query(api.knowledgeNest.downloadFile, {
      file_id,
      username,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    // Fetch the actual file from the storage URL
    const fileResponse = await fetch(result.downloadUrl);
    
    if (!fileResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }

    const fileBuffer = await fileResponse.arrayBuffer();

    // Return the file with proper headers for preview
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': result.file_type || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${result.filename}"`, // 'inline' for preview, not 'attachment'
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Frame-Options': 'SAMEORIGIN', // Allow iframe embedding from same origin
      },
    });

  } catch (error) {
    console.error('Preview GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to serve file for preview' },
      { status: 500 }
    );
  }
}

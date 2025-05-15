import { NextRequest, NextResponse } from "next/server";
import zlib from "zlib";
export function createGzipResponse(data: any) {
    const json = JSON.stringify(data);
    const gzipped = zlib.gzipSync(json);
  
    return new NextResponse(gzipped, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
        "Cache-Control": "no-store",
      },
    });
  }
  
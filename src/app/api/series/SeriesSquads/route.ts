import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import redis from "@/config/redis";
import getJsonFromS3 from '@/lib/s3-utils';


export async function POST(req: NextRequest) {
    try {
      // Extract `cid` from request body
      const body = await req.json();
      const { cid } = body;
      
      if (!cid) {
        return NextResponse.json({ error: "cid is required" }, { status: 400 });
      }

            const CACHE_KEY = "series_squads_"+cid;
            const CACHE_TTL = 60;

            const cachedData = await redis.get(CACHE_KEY);
            if (cachedData) {
            // console.log("coming from cache series matches");
            return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
            }
            
            const [rows]: [any[], any] = await db.execute(
                "SELECT fileName FROM competition_squads WHERE cid = ?",[cid]
              );


            let allSquads: any[] = [];

            // Get the file path from the database query

            const { fileName } = rows[0];

            
            if (!fileName) {
            return NextResponse.json({ error: "File not found in database" }, { status: 404 });
            }
            // console.log('Fetching file from S3:', fileName);  // Log fileName to debug
            try {
            const parsedData = await getJsonFromS3( fileName as string);
            allSquads = parsedData;

            } catch (error) {
                console.error(`Error reading/parsing file: ${fileName}`, error);
            }


        
        
        
        if (rows.length > 0) {
            await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(allSquads));
        }
        return NextResponse.json({ success: true, data: allSquads });
}catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);  // Log the error message for more detail
    }

    return NextResponse.json(
      { error: "Internal Server Errors" },
      { status: 500 }
    );
  }
}

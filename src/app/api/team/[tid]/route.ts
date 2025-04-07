import { NextRequest, NextResponse } from "next/server";
import { TeamDetails } from "@/controller/teamController";

type Params = Promise<{
    tid: number;
  }>;
export async function GET(
  req: NextRequest,
  props : { params: Params }
): Promise<NextResponse> {
  
  const params = await props.params;
  const tid = params.tid;
  // Validate tid
  if (!tid || isNaN(Number(tid))) {
    return NextResponse.json(
      { error: "Team ID is required and must be a valid number" },
      { status: 400 }
    );
  }

  try {
    // Call TeamDetails with the tid as a number
    const data = await TeamDetails(Number(tid));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
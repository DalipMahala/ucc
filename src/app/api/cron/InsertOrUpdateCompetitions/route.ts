import { NextResponse } from "next/server";
import { MatchInfo } from "@/controller/dbController"; // Import your function

export async function GET() {
  try {
    const result = await MatchInfo(); // Call your function
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
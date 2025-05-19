import React from "react";
import Link from 'next/link';
import { MatcheStats } from "@/controller/matchInfoController";
import { urlStringEncode } from "@/utils/utility";
import ReadMoreCard from "@/app/components/ReadMoreCard";
import TabMenu from "./menu";

interface Stats {
    urlString: string;
    seriesId: number;
    isPointTable: boolean;
    seriesInfo: any;
    status: boolean;
}
interface PlayerUrlResponse {
    [key: string]: string;
  }

async function fetchHtml(seriesId: number) {
    if (!seriesId || seriesId === 0) return '';

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series/SeriesHtml`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
            },
            body: JSON.stringify({ cid: seriesId }),
            cache: "no-store", // Prevents Next.js from caching the API response
        });

        if (!response.ok) {
            console.error(`Error: API returned ${response.status} for CID ${seriesId}`);
            return '';
        }

        const result = await response.json();
        return result?.data?.[0]?.statsHtml ?? '';
    } catch (error) {
        console.error("Error fetching matches:", error);
        return '';
    }
}

export default async function Stats({ seriesId, urlString, isPointTable, seriesInfo, status }: Stats) {


    return (
        <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
            <TabMenu urlString={urlString} isPointTable={isPointTable} status={status}/>
            <div id="stats">
                                   <div className="md:grid grid-cols-12 gap-4">
           
           
                                       <div className="lg:col-span-8 md:col-span-7 md:grid grid-cols-12 gap-4">
                                           <div className="col-span-6 rounded-lg p-2 mb-4 bg-[#ffffff]">
                                               <div className="py-2 mb-2">
                                                   <h2 className="text-1xl font-semibold pl-[6px] border-l-[3px] border-[#1a80f8]">
                                                       Batting
                                                   </h2>
                                               </div>
                                               <div id="team-buttons" className="">
                                                   <Link href={urlString + "/stats/batting-most-run"}>
                                                       <button
           
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md  hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Most Runs
                                                       </button>
                                                   </Link>
                                                   <Link href={urlString + "/stats/batting-highest-average"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Best Batting Average
                                                       </button>
                                                   </Link>
                                                   <Link href={urlString + "/stats/batting-highest-strike-rate"}>
                                                       <button
           
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
           
                                                       >
                                                           Best Batting Strike Rate
                                                       </button>
                                                   </Link>
           
                                                   <Link href={urlString + "/stats/batting-most-hundreds"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Most Hundreds
                                                       </button>
                                                   </Link>
           
                                                   <Link href={urlString + "/stats/batting-most-fifties"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Most Fifties
                                                       </button>
                                                   </Link>
           
                                                   <Link href={urlString + "/stats/batting-most-fours"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Most Fours
                                                       </button>
                                                   </Link>
           
                                                   <Link href={urlString + "/stats/batting-most-sixes"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Most Sixes
                                                       </button>
                                                   </Link>
           
                                               </div>
                                           </div>
                                           <div className="col-span-6 rounded-lg p-2 mb-4 bg-[#ffffff]">
                                               <div className="py-2 mb-2">
                                                   <h3 className="text-1xl font-semibold pl-[6px] border-l-[3px] border-[#1a80f8]">
                                                       Bowler
                                                   </h3>
                                               </div>
                                               <div id="team-buttons" className="">
                                                   <Link href={urlString + "/stats/bowling-most-wicket"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Most Wickets
                                                       </button>
                                                   </Link>
                                                   <Link href={urlString + "/stats/bowling-best-average"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Best Bowling Average
                                                       </button>
                                                   </Link>
           
                                                   <Link href={urlString + "/stats/bowling-best-figures"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Best Bowling
                                                       </button>
                                                   </Link>
           
                                                   <Link href={urlString + "/stats/bowling-most-five-wicket-hauls"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Most 5 Wickets Haul
                                                       </button>
                                                   </Link>
           
                                                   <Link href={urlString + "/stats/bowling-best-economy-rates"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Best Economy
                                                       </button>
                                                   </Link>
           
                                                   <Link href={urlString + "/stats/bowling-best-strike-rates"}>
                                                       <button
                                                           className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md hover:bg-[#ecf2fd] hover:text-[#1a80f8]} `}
                                                       >
                                                           Best Bowling Strike Rate
                                                       </button>
                                                   </Link>
                                               </div>
                                           </div>
                                       </div>
           
           
           
                                   </div>
                               </div>
        </section>


    )
}
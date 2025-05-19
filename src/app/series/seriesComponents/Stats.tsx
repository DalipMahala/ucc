import React from "react";
import Link from 'next/link';
import { MatcheStats } from "@/controller/matchInfoController";
import { urlStringEncode } from "@/utils/utility";
import ReadMoreCard from "@/app/components/ReadMoreCard";
import TabMenu from "./menu";
import { MdSportsCricket } from "react-icons/md";
import { BiSolidCricketBall } from "react-icons/bi";

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
           
           
                                       
                                           <div className="md:col-span-6 col-span-12 rounded-lg">
                                               <div className="py-3 bg-[#0e2149] text-[#ffffff] rounded-t-lg">
                                                   <h2 className="text-1xl font-semibold pl-[6px] border-l-[3px] border-[#ffffff] mx-2">
                                                       Batting
                                                   </h2>
                                               </div>
                                               <div id="team-buttons" className="px-2 rounded-b-lg mb-4 bg-[#ffffff]">
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/batting-most-run"}>
                                                   <MdSportsCricket />
                                                       <button
           
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md  `}
                                                       >
                                                           Most Runs
                                                       </button>
                                                   </Link>
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/batting-highest-average"}>
                                                    <MdSportsCricket />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Best Batting Average
                                                       </button>
                                                   </Link>
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/batting-highest-strike-rate"}>
                                                    <MdSportsCricket />
                                                       <button
           
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
           
                                                       >
                                                           Best Batting Strike Rate
                                                       </button>
                                                   </Link>
           
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/batting-most-hundreds"}>
                                                    <MdSportsCricket />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Most Hundreds
                                                       </button>
                                                   </Link>
           
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/batting-most-fifties"}>
                                                    <MdSportsCricket />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Most Fifties
                                                       </button>
                                                   </Link>
           
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/batting-most-fours"}>
                                                    <MdSportsCricket />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Most Fours
                                                       </button>
                                                   </Link>
           
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/batting-most-sixes"}>
                                                    <MdSportsCricket />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Most Sixes
                                                       </button>
                                                   </Link>
           
                                               </div>
                                           </div>
                                           <div className="md:col-span-6 col-span-12 rounded-lg">
                                               <div className="py-3 bg-[#0e2149] text-[#ffffff] rounded-t-lg">
                                                   <h2 className="text-1xl font-semibold pl-[6px] border-l-[3px] border-[#ffffff] mx-2">
                                                       Bowler
                                                   </h2>
                                               </div>

                                               <div id="team-buttons" className="px-2 rounded-b-lg mb-4 bg-[#ffffff]">
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/bowling-most-wicket"}>
                                                   <BiSolidCricketBall />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Most Wickets
                                                       </button>
                                                   </Link>
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/bowling-best-average"}>
                                                   <BiSolidCricketBall />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Best Bowling Average
                                                       </button>
                                                   </Link>
           
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/bowling-best-figures"}>
                                                   <BiSolidCricketBall />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Best Bowling
                                                       </button>
                                                   </Link>
           
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/bowling-most-five-wicket-hauls"}>
                                                   <BiSolidCricketBall />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Most 5 Wickets Haul
                                                       </button>
                                                   </Link>
           
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/bowling-best-economy-rates"}>
                                                   <BiSolidCricketBall />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Best Economy
                                                       </button>
                                                   </Link>
           
                                                   <Link className="flex gap-2 items-center border-t px-2 py-3 hover:text-[#1a80f8]" href={urlString + "/stats/bowling-best-strike-rates"}>
                                                   <BiSolidCricketBall />
                                                       <button
                                                           className={`state-btn new-class  w-full font-medium active text-left rounded-md `}
                                                       >
                                                           Best Bowling Strike Rate
                                                       </button>
                                                   </Link>
                                               </div>
                                           </div>
                                     
           
           
           
                                   </div>
                               </div>
        </section>


    )
}
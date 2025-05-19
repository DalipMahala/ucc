

import React from "react";
import Link from 'next/link';
import { MatcheStats } from "@/controller/matchInfoController";
import { urlStringEncode } from "@/utils/utility";
import ReadMoreCard from "@/app/components/ReadMoreCard";
import TabMenu from "./menu";

interface Stats {
    urlString: string;
    statsType: string | null;
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

export default async function StatsList({ seriesId, urlString, statsType, isPointTable, seriesInfo, status }: Stats) {

    const pageHtml = await fetchHtml(seriesId);

    const renderStatus = () => {
        switch (statsType) {
            case "batting-most-run":
                return "batting_most_runs";
            case "batting-highest-average":
                return "batting_highest_average";
            case "batting-highest-strike-rate":
                return "batting_highest_strikerate";
            case "batting-most-hundreds":
                return "batting_most_run100";
            case "batting-most-fifties":
                return "batting_most_run50";
            case "batting-most-fours":
                return "batting_most_run4";
            case "batting-most-sixes":
                return "batting_most_run6";


            case "bowling-most-wicket":
                return "bowling_top_wicket_takers";
            case "bowling-best-average":
                return "bowling_best_averages";
            case "bowling-best-figures":
                return "bowling_best_bowling_figures";
            case "bowling-most-five-wicket-hauls":
                return "bowling_five_wickets";
            case "bowling-best-economy-rates":
                return "bowling_best_economy_rates";
            case "bowling-best-strike-rates":
                return "bowling_best_strike_rates";
            default:
                return "batting_most_runs";
        }
    };
    const statType = renderStatus();

    const renderStatusName = () => {
        switch (statsType) {
            case "batting-most-run":
                return "Most Runs";
            case "batting-highest-average":
                return "Best Batting Average";
            case "batting-highest-strike-rate":
                return "Best Batting Strike Rate";
            case "batting-most-hundreds":
                return "Most Hundreds";
            case "batting-most-fifties":
                return "Most Fifties";
            case "batting-most-fours":
                return "Most Fours";
            case "batting-most-sixes":
                return "Most Sixes";


            case "bowling-most-wicket":
                return "Most Wickets";
            case "bowling-best-average":
                return "Best Bowling Average";
            case "bowling-best-figures":
                return "Best Bowling";
            case "bowling-most-five-wicket-hauls":
                return "Most 5 Wickets Haul";
            case "bowling-best-economy-rates":
                return "Best Economy";
            case "bowling-best-strike-rates":
                return "Best Bowling Strike Rate";
            default:
                return "Most Runs";
        }
    };
    const statsName = renderStatusName();
    const statsMatch = await MatcheStats(seriesId, statType);
    const matchStats = statsMatch?.stats;

    const getAllPlayerIds = () => {
        const allIds = [
          ...matchStats.map((item: {
            player: any; pid: any }) => item?.player?.pid),
        ];
        return [...new Set(allIds)]; // Deduplicate
      };
    
      const ids = getAllPlayerIds();
      let playerUrls: PlayerUrlResponse = {};
    
      if (ids.length > 0) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/player-urls`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
          },
          cache: 'no-store', // Ensure fresh data
          body: JSON.stringify({ ids }),
        });
        playerUrls = await res.json();
      }
    // console.log("renderStatus",playerUrls);


    


    return (
        <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">

            <TabMenu urlString={urlString} isPointTable={isPointTable} status={status}/>
            {matchStats !== undefined && matchStats !== null && matchStats !== '' ? (
                <>
                    <div id="stats">
                        <div className="md:grid grid-cols-12 gap-4">

{/*                             
                            <div className="lg:col-span-3 md:col-span-4">
                                <div className="rounded-lg p-2 mb-4 bg-[#ffffff]">
                                    <div className="py-2 mb-2">
                                        <h2 className="text-1xl font-semibold pl-[6px] border-l-[3px] border-[#1a80f8]">
                                            Batting
                                        </h2>
                                    </div>
                                    <div id="team-buttons" className="">
                                        <Link href={urlString + "/stats/batting-most-run"}>
                                            <button

                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'batting-most-run' || statsType == undefined ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Most Runs
                                            </button>
                                        </Link>
                                        <Link href={urlString + "/stats/batting-highest-average"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'batting-highest-average' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Best Batting Average
                                            </button>
                                        </Link>
                                        <Link href={urlString + "/stats/batting-highest-strike-rate"}>
                                            <button

                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'batting-highest-strike-rate' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}

                                            >
                                                Best Batting Strike Rate
                                            </button>
                                        </Link>

                                        <Link href={urlString + "/stats/batting-most-hundreds"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'batting-most-hundreds' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Most Hundreds
                                            </button>
                                        </Link>

                                        <Link href={urlString + "/stats/batting-most-fifties"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'batting-most-fifties' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Most Fifties
                                            </button>
                                        </Link>

                                        <Link href={urlString + "/stats/batting-most-fours"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'batting-most-fours' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Most Fours
                                            </button>
                                        </Link>

                                        <Link href={urlString + "/stats/batting-most-sixes"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'batting-most-sixes' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Most Sixes
                                            </button>
                                        </Link>

                                    </div>
                                </div>
                                <div className="rounded-lg p-2 mb-4 bg-[#ffffff]">
                                    <div className="py-2 mb-2">
                                        <h3 className="text-1xl font-semibold pl-[6px] border-l-[3px] border-[#1a80f8]">
                                            Bowler
                                        </h3>
                                    </div>
                                    <div id="team-buttons" className="">
                                        <Link href={urlString + "/stats/bowling-most-wicket"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'bowling-most-wicket' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Most Wickets
                                            </button>
                                        </Link>
                                        <Link href={urlString + "/stats/bowling-best-average"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'bowling-best-average' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Best Bowling Average
                                            </button>
                                        </Link>

                                        <Link href={urlString + "/stats/bowling-best-figures"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'bowling-best-figures' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Best Bowling
                                            </button>
                                        </Link>

                                        <Link href={urlString + "/stats/bowling-most-five-wicket-hauls"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'bowling-most-five-wicket-hauls' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Most 5 Wickets Haul
                                            </button>
                                        </Link>

                                        <Link href={urlString + "/stats/bowling-best-economy-rates"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'bowling-best-economy-rates' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Best Economy
                                            </button>
                                        </Link>

                                        <Link href={urlString + "/stats/bowling-best-strike-rates"}>
                                            <button
                                                className={`state-btn new-class border-t px-2 py-3 w-full font-medium active text-left rounded-md ${statsType == 'bowling-best-strike-rates' ? "bg-[#ecf2fd] text-[#1a80f8]" : "hover:bg-[#ecf2fd] hover:text-[#1a80f8]"} `}
                                            >
                                                Best Bowling Strike Rate
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div> */}
                            


                            
                            <div className="col-span-12">
                                <div id="most-runs" className={`state-content most-runs" ? "" : "hidden"}`} >

                                    <div>
                                        <div className={`rounded-lg bg-[#ffffff] mb-4 p-4 ${statsType == "bowling-most-wicket" || statsType == "bowling-best-average" || statsType == "bowling-best-figures" || statsType == "bowling-most-five-wicket-hauls" || statsType == "bowling-best-economy-rates" || statsType == "bowling-best-strike-rates" ? "hidden" : ""}`}>
                                            <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                                Batting
                                            </h3>
                                            <div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                        <thead className="bg-blue-50 text-gray-700 ">
                                                            <tr>
                                                                <th className="px-4 py-3 font-medium w-[10px]" />
                                                                <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50 text-gray-700">Batter</th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Team
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Match
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Inns
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Runs
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Avg
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    4s
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    6s
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    100s
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    50s
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    SR
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200 relative">
                                                            {matchStats?.map((stats: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td className="px-2 pl-[14px] py-3 w-[10px]">{index + 1}</td>
                                                                    <td className="md:px-2 py-3 text-[#217AF7] sticky left-0">
                                                                       <p className="bg-[#ffffff] px-2"> <Link href={"/player/" + playerUrls[stats?.player?.pid]}> {stats?.player?.short_name}</Link>
                                                                       </p>
                                                                    </td>
                                                                    <td className="px-2 pl-[14px] py-3">{stats?.matches}</td>
                                                                    <td className="px-2 pl-[14px] py-3">{stats?.innings}</td>

                                                                    <td className={`px-2 pl-[14px] py-3 ${statsType == 'batting-most-run' ? "font-semibold" : ""}`}>{stats?.runs}</td>

                                                                    <td className={`px-2 pl-[14px] py-3 ${statsType == 'batting-highest-average' ? "font-semibold" : ""}`}>{stats?.average}</td>
                                                                    <td className={`px-2 pl-[14px] py-3 ${statsType == 'batting-most-fours' ? "font-semibold" : ""}`}>{stats?.run4}</td>
                                                                    <td className={`px-2 pl-[14px] py-3 ${statsType == 'batting-most-sixes' ? "font-semibold" : ""}`}>{stats?.run6}</td>
                                                                    <td className={`px-2 pl-[14px] py-3 ${statsType == 'batting-highest-strike-rate' ? "font-semibold" : ""}`}>{stats?.strike}</td>
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`rounded-lg bg-[#ffffff] mb-4 p-4  ${statsType == "bowling-most-wicket" || statsType == "bowling-best-average" || statsType == "bowling-best-figures" || statsType == "bowling-most-five-wicket-hauls" || statsType == "bowling-best-economy-rates" || statsType == "bowling-best-strike-rates" ? "" : "hidden"}`}>
                                            <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                                Bowling
                                            </h3>
                                            <div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                        <thead className="bg-blue-50 text-gray-700 ">
                                                            <tr>
                                                                <th className="px-4 py-3 font-medium w-[10px]" />
                                                                <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50 text-gray-700">Bowler</th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Match
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Inns
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Wickets
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Avg
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    Wicket4i
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    wicket5i
                                                                </th>
                                                                <th className="px-2 pl-[14px] py-3 font-medium">
                                                                    SR
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {matchStats?.map((stats: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td className="px-2 pl-[14px] py-3 w-[10px]">{index + 1}</td>
                                                                    <td className="md:px-2 py-3 text-[#217AF7] sticky left-0">
                                                                        <p className="bg-[#ffffff] px-2">
                                                                        <Link href={"/player/" + playerUrls[stats?.player?.pid]}> {stats?.player?.short_name}</Link>
                                                                        </p>
                                                                    </td>
                                                                    <td className="px-2 pl-[14px] py-3">{stats?.matches}</td>
                                                                    <td className="px-2 pl-[14px] py-3">{stats?.innings}</td>
                                                                    <td className={`px-2 pl-[14px] py-3 ${statsType == 'bowling-most-wicket' ? "font-semibold" : ""}`}>{stats?.wickets}</td>
                                                                    <td className={`px-2 pl-[14px] py-3 ${statsType == 'bowling-best-average' ? "font-semibold" : ""}`}>{stats?.average}</td>
                                                                    <td className="px-2 pl-[14px] py-3">{stats?.wicket4i}</td>
                                                                    <td className="px-2 pl-[14px] py-3">{stats?.wicket5i}</td>
                                                                    <td className={`px-2 pl-[14px] py-3 ${statsType == 'bowling-best-strike-rates' ? "font-semibold" : ""}`}>{stats?.strike}</td>
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg py-4 px-4 bg-[#ffffff] mb-4">
                        <div className="lg:grid grid-cols-12 gap-4">
                            <div className="col-span-12">
                            {statsType == "bowling-most-wicket" || statsType == "bowling-best-average" || statsType == "bowling-best-figures" || statsType == "bowling-most-five-wicket-hauls" || statsType == "bowling-best-economy-rates" || statsType == "bowling-best-strike-rates" ? 
                            <ReadMoreCard
                            title={`${statsName || "Stats"} in ${seriesInfo?.title || ""} ${seriesInfo?.season || ""} – Player Rankings`}
                            content={
                              `Here is the updated list of bowlers with the ${statsName || "stats"} in the ${seriesInfo?.title || ""} ${seriesInfo?.season || ""}. ` +
                              `These players have been in excellent form, helping their teams with consistent performances.` +
                              (matchStats[0]?.player?.first_name ? 
                                ` At the top of the chart is ${matchStats[0].player.first_name} (${matchStats[0]?.team?.abbr || "N/A"}), ` +
                                `who has taken ${matchStats[0]?.wickets || "N/A"} wickets in ${matchStats[0]?.matches || "N/A"} matches ` +
                                `with an economy of ${matchStats[0]?.econ || "N/A"}.` 
                                : ""
                              ) +
                              "<br/><br/>" +
                              (matchStats[1]?.player?.first_name ? 
                                `<span class="text-[#1f2937] font-medium">Top Performers So Far</span><br/>` +
                                `<span class="text-[#1f2937] font-medium">${matchStats[1].player.first_name}</span> – ${matchStats[1]?.matches || "N/A"} matches, ` +
                                `${matchStats[1]?.wickets || "N/A"} wickets, Econ: ${matchStats[1]?.econ || "N/A"}<br/>` 
                                : ""
                              ) +
                              (matchStats[2]?.player?.first_name ? 
                                `<span class="text-[#1f2937] font-medium">${matchStats[2].player.first_name}</span> – ${matchStats[2]?.matches || "N/A"} matches, ` +
                                `${matchStats[2]?.wickets || "N/A"} wickets, Econ: ${matchStats[2]?.econ || "N/A"}<br/>` 
                                : ""
                              ) +
                              (matchStats[3]?.player?.first_name ? 
                                `<span class="text-[#1f2937] font-medium">${matchStats[3].player.first_name}</span> – ${matchStats[3]?.matches || "N/A"} matches, ` +
                                `${matchStats[3]?.wickets || "N/A"} wickets, Econ: ${matchStats[3]?.econ || "N/A"}<br/>` 
                                : ""
                              ) +
                              (matchStats[0]?.player?.first_name ? 
                                `These bowlers are making a strong impact and are in the race for the ${statsName || "stats"} in ` +
                                `${seriesInfo?.title || "the tournament"}.`
                                : ""
                              )
                            }
                            wordLimit={400}
                          />
                          : 
                          <ReadMoreCard
                          title={`${statsName || "Stats"} in ${seriesInfo?.title || ""} ${seriesInfo?.season || ""} – Player Rankings`}
                          content={
                            `Here is the updated list of batters with the ${statsName || "stats"} in the ${seriesInfo?.title || ""} ${seriesInfo?.season || ""}. ` +
                            `These players have been in excellent form, helping their teams with consistent performances.` +
                            (matchStats[0]?.player?.first_name ? 
                              ` At the top of the chart is ${matchStats[0].player.first_name} (${matchStats[0]?.team?.abbr || "N/A"}), ` +
                              `who has scored ${matchStats[0]?.runs || "N/A"} runs in ${matchStats[0]?.matches || "N/A"} matches ` +
                              `with an average of ${matchStats[0]?.average || "N/A"}.` 
                              : ""
                            ) +
                            "<br/><br/>" +
                            (matchStats[1]?.player?.first_name ? 
                              `<span class="text-[#1f2937] font-medium">Top Performers So Far</span><br/>` +
                              `<span class="text-[#1f2937] font-medium">${matchStats[1].player.first_name}</span> – ${matchStats[1]?.matches || "N/A"} matches, ` +
                              `${matchStats[1]?.runs || "N/A"} runs, Avg: ${matchStats[1]?.average || "N/A"}<br/>` 
                              : ""
                            ) +
                            (matchStats[2]?.player?.first_name ? 
                              `<span class="text-[#1f2937] font-medium">${matchStats[2].player.first_name}</span> – ${matchStats[2]?.matches || "N/A"} matches, ` +
                              `${matchStats[2]?.runs || "N/A"} runs, Avg: ${matchStats[2]?.average || "N/A"}<br/>` 
                              : ""
                            ) +
                            (matchStats[3]?.player?.first_name ? 
                              `<span class="text-[#1f2937] font-medium">${matchStats[3].player.first_name}</span> – ${matchStats[3]?.matches || "N/A"} matches, ` +
                              `${matchStats[3]?.runs || "N/A"} runs, Avg: ${matchStats[3]?.average || "N/A"}<br/>` 
                              : ""
                            ) +
                            (matchStats[0]?.player?.first_name ? 
                              `These batters are making a strong impact and are in the race for the ${statsName || "stats"} in ` +
                              `${seriesInfo?.title || "the tournament"}.`
                              : ""
                            )
                          }
                          wordLimit={400}
                        />
                                }
                                        {pageHtml && typeof pageHtml === "string" ? (
                                    <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
                                ) : ("")}
                            </div>
                        </div>


                    </div>
                </>
            ) : (
                <div className='bg-white p-4 rounded-md mb-8'>
                    <div className='text-[18px] text-center text-red-600 font-semibold'>
                        Records unavailable.
                    </div>
                </div>

            )}
        </section>


    )
}
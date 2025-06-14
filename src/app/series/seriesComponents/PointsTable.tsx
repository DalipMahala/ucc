
import React from 'react'
import Image from "next/image";
import Link from 'next/link';
import WeeklySlider from "@/app/components/WeeklySlider";
import { urlStringEncode } from '@/utils/utility';
import PLSeries from "@/app/components/popularSeries";
import ReadMoreCard from "@/app/components/ReadMoreCard";
import { format } from "date-fns";
import FAQ from "./faq";
import TabMenu from "./menu";

interface PointsTable {
    urlString: string;
    seriesInfo: any;
    isPointTable: boolean;
    status: boolean;
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
        return result?.data?.[0] ?? [];
    } catch (error) {
        console.error("Error fetching matches:", error);
        return '';
    }
}
export default async function PointsTable({ urlString, seriesInfo, isPointTable, status }: PointsTable) {

    const standings = seriesInfo?.standing?.standings;
    const total_rounds = seriesInfo?.total_rounds;

    const pageHtml = await fetchHtml(seriesInfo?.cid);
    return (


        <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
            <TabMenu urlString={urlString} isPointTable={isPointTable}  status={status}/>


            <div id="points" className="">
                <div className="md:grid grid-cols-12 gap-4">
                    <div className="lg:col-span-8 md:col-span-7">
                        <div className="rounded-lg bg-[#ffffff] p-4 mb-4">

                            <h2 className='text-[20px] font-semibold mb-2'>{seriesInfo?.title + " " + seriesInfo?.season + " Points Table!"}</h2>
                            {total_rounds == 1 ? (
                                <div>
                            <p className='text-gray-700 font-normal mb-3 text-[14px]'>{"Welcome to the latest " + seriesInfo?.title + " " + seriesInfo?.season + " Points Table! Here's where you’ll find the most accurate and updated information on team standings, wins, losses, and qualification chances."
                                
                            }
                            </p>
                            <p>{"So far, "
                                 + standings[0]?.standings?.[0]?.team?.abbr + ", " + standings[0]?.standings?.[1]?.team?.abbr + ", and " + standings[0]?.standings?.[2]?.team?.abbr + " are leading the race with strong performances, while " + standings[0]?.standings?.[3]?.team?.abbr + " is still in the fight to enter the top 4."+ " " +
                                "The points table is updated in real-time after every match – so you can track your favorite team’s progress all season long!"}</p>
                            </div>
                            ):(
                                standings?.map((rounds:any, index:number)=> (
                                    <React.Fragment key={index}>                                    
                                    <h3 className='text-[16px] font-semibold mb-1'>{rounds?.round?.name}</h3>
                                    <p className='text-gray-700 font-normal mb-3 text-[14px]'>{"In " +rounds?.round?.name+", "+ rounds?.standings?.[0]?.team?.abbr  + " has dominated the group stage with an unbeaten run so far. On the other hand, " 
                                        + rounds?.standings?.[1]?.team?.abbr + ", " + rounds?.standings?.[2]?.team?.abbr + ", and " + rounds?.standings?.[3]?.team?.abbr + " are battling closely, but only one may qualify depending on NRR."
                                    }
                                    </p>
                                    </React.Fragment>

                                ))
                                
                            )
                        }
                            {pageHtml?.pointsTableHtml1 && typeof pageHtml?.pointsTableHtml1 === "string" ? (
                                <div dangerouslySetInnerHTML={{ __html: pageHtml?.pointsTableHtml1 }} />
                            ) : ("")}
                        </div>
                        {standings?.map((rounds: any, index: number) => (
                            <div className="rounded-lg bg-[#ffffff] mb-2 p-4" key={index}>
                                <h2 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                    {rounds?.round?.name}
                                </h2>
                                <div>
                                    <div
                                        className="overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[8px] 
                  [&::-webkit-scrollbar-track]:bg-gray-100 
                  [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                                    >
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-2 py-3 font-medium w-[10px]">
                                                        No
                                                    </th>
                                                    <th className="px-2 py-3 font-medium sticky left-0 bg-blue-50">
                                                        Team
                                                    </th>
                                                    <th className="px-2 py-3 font-medium">M</th>
                                                    <th className="px-2 py-3 font-medium">W</th>
                                                    <th className="px-2 py-3 font-medium">L</th>
                                                    <th className="px-2 py-3 font-medium">T</th>
                                                    <th className="px-2 py-3 font-medium">
                                                        N/R
                                                    </th>
                                                    <th className="px-2 py-3 font-medium">
                                                        PTS
                                                    </th>
                                                    <th className="px-2 py-3 font-medium">
                                                        Net RR
                                                    </th>
                                                    <th className="px-2 py-3 font-medium">
                                                        Form
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {rounds.standings?.map((point: any, index: number) => (
                                                    <tr className="md:hover:bg-[#fffae5]" key={index}>
                                                        <td className="px-2 py-3 w-[10px]">{index + 1}</td>
                                                        <td className=" py-3 sticky left-0 text-[#217AF7]">
                                                            <Link href={"/team/" + urlStringEncode(point?.team.title) + "/" + point?.team.tid}>
                                                                <div className="flex items-center gap-[5px] w-[120px] bg-[#ffffff] px-2">
                                                                    <div>
                                                                        <Image loading="lazy"
                                                                            src={point?.team?.thumb_url}
                                                                            className="h-[20px]"
                                                                            width={20} height={20} alt="1"
                                                                        />
                                                                    </div>
                                                                    <p>
                                                                        {point?.team?.abbr} {point?.quality === "true" ? <span className="text-[#00B564]"> (Q)</span> : ""}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td className="px-2 py-3">{point?.played}</td>
                                                        <td className="px-2 py-3">{point?.win}</td>
                                                        <td className="px-2 py-3">{point?.loss}</td>
                                                        <td className="px-2 py-3">{point?.draw}</td>
                                                        <td className="px-2 py-3">{point?.nr}</td>
                                                        <td className="px-2 py-3 font-semibold ">{point?.points}</td>
                                                        <td className="px-2 py-3">{point?.netrr}</td>
                                                        <td className="px-2 py-3">
                                                            <div className="ml-auto flex gap-1 items-center">
                                                                {point?.lastfivematchresult.split(",")?.map((item: string, index: number) => (
                                                                    <span className={`${item === "W" ? "bg-[#13B76D]" : item === "N" ? "bg-[#928d8d]" : "bg-[#F63636]"} text-white text-[13px] px-[4px] py-[0px] rounded w-[24px] text-center`} key={index}>
                                                                        {item}
                                                                    </span>
                                                                ))}


                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="mb-4 md:px-0 px-4">
                            <p className="font-semibold">
                                {" "}
                                Last Updated On {format(new Date(), "dd MMM yyyy, HH:mm")} IST
                            </p>
                            <p className="text-[14px] text-gray-500">
                                <span className="font-semibold text-[#1F2937]">M:</span>
                                Matches,<span className="font-semibold text-[#1F2937]">
                                    {" "}
                                    W:
                                </span>{" "}
                                Won, <span className="font-semibold text-[#1F2937]">L:</span>{" "}
                                Lost, <span className="font-semibold text-[#1F2937]">T:</span>{" "}
                                Tie, <span className="font-semibold text-[#1F2937]">N/R:</span> No
                                Result, <span className="font-semibold text-[#1F2937]">PTS:</span>{" "}
                                Points,{" "}
                                <span className="font-semibold text-[#1F2937]">Net RR:</span> Net
                                run rate, <span className="font-semibold text-[#1F2937]">Q:</span>{" "}
                                Qualified
                            </p>
                        </div>



                        {pageHtml?.pointsTableHtml2 && typeof pageHtml?.pointsTableHtml2 === "string" ? (
                            <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                                <div dangerouslySetInnerHTML={{ __html: pageHtml?.pointsTableHtml2 }} />
                            </div>
                        ) : ("")}

                        <FAQ seriesInfo={seriesInfo} />


                    </div>

                    <div className="lg:col-span-4 md:col-span-5 md:-mt-4 mt-0">


                        <WeeklySlider />



                        <PLSeries />
                    </div>
                </div>
            </div>


        </section>

    )
}

import React from 'react'
import Image from "next/image";
import Link from 'next/link';
import WeeklySlider from "@/app/components/WeeklySlider";
import { urlStringEncode } from '@/utils/utility';
import PLSeries from "@/app/components/popularSeries";

interface PointsTable {
    urlString: string; 
    seriesInfo: any;
    featuredMatch:any;
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
  export default async function PointsTable({urlString, seriesInfo,featuredMatch} : PointsTable) {

    const standings = seriesInfo?.standing?.standings;

    const pageHtml = await fetchHtml(seriesInfo?.cid);
    return (


        <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
            <div id="tabs" className="my-4">
                <div className="flex text-[13px] space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                    <Link href={urlString}>
                        <button
                            className="font-semibold uppercase py-2 px-3 whitespace-nowrap "
                        >
                            Overview
                        </button>
                    </Link>
                    <Link href={urlString+"/schedule-results"}>
                        <button
                            className="font-semibold uppercase py-2 px-3 whitespace-nowrap "
                        >
                            Schedule & Results

                        </button>
                    </Link>
                    <Link href={urlString+"/squads"}>
                        <button
                            className="font-semibold uppercase py-2 px-3 whitespace-nowrap "
                        >
                            Squads
                        </button>
                    </Link>
                    <Link href={urlString+"/points-table"}>
                        <button
                            className="font-semibold uppercase py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md"
                        >
                            Points Table
                        </button>
                    </Link>
                    <Link href={urlString+"/news"}>
                        <button
                            className="font-semibold uppercase py-2 px-3 whitespace-nowrap"
                        >
                            News
                        </button>
                    </Link>
                    <Link href={urlString+"/stats/most-run"}>
                        <button
                            className="font-semibold uppercase py-2 px-3 whitespace-nowrap" >
                            Stats
                        </button>
                    </Link>

                </div>
            </div>


            <div id="points" className="">
                <div className="md:grid grid-cols-12 gap-4">
                    <div className="lg:col-span-8 md:col-span-7">
                        <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                        {pageHtml?.pointsTableHtml1 && typeof pageHtml?.pointsTableHtml1 === "string" ? (
                                <div dangerouslySetInnerHTML={{ __html: pageHtml?.pointsTableHtml1 }} />
                            ) : (
                              <> 
                            <h3 className="text-1xl font-semibold mb-1">
                                South Africa Women vs New Zealand Women, Final
                            </h3>
                            <p
                                className="text-gray-500 font-normal"
                            >

                                The biggest tournament in the cricketing circuit, the ICC T20
                                WORLD Cup is underway in the USAs and the West Indies. The
                                tournament received excellent response from the fans worldwide...

                            </p>
                            <button
                                className="text-blue-600 font-semibold flex items-center text-[13px] pt-2 underline"
                            >
                                Read More
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-4 h-4 ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                    />
                                </svg>
                            </button>
                            </>
                            )}
                        </div>
                        {standings?.map((rounds : any, index:number) => (
                        <div className="rounded-lg bg-[#ffffff] mb-2 p-4"   key={index}>
                            <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                            {rounds?.round?.name}
                            </h3>
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
                                                <th className="md:px-2 pl-[14px] py-3 font-medium w-[10px]">
                                                    No
                                                </th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">
                                                    Team
                                                </th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">M</th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">W</th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">L</th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">T</th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">
                                                    N/R
                                                </th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">
                                                    PTS
                                                </th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">
                                                    Net RR
                                                </th>
                                                <th className="md:px-2 pl-[14px] py-3 font-medium">
                                                    Form
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {rounds.standings?.map((point : any, index:number) => ( 
                                            <tr className="hover:bg-[#fffae5]" key={index}>
                                                <td className="md:px-2 pl-[14px] py-3 w-[10px]">{index + 1}</td>
                                                <td className="md:px-2 pl-[14px] py-3 text-[#217AF7]">
                                                    <Link href={"/team/"+urlStringEncode(point?.team.title)+"/"+point?.team.tid}>
                                                        <div className="flex items-center gap-[5px] w-[120px]">
                                                            <div>
                                                                <Image  loading="lazy" 
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
                                                <td className="md:px-2 pl-[14px] py-3">{point?.played}</td>
                                                <td className="md:px-2 pl-[14px] py-3">{point?.win}</td>
                                                <td className="md:px-2 pl-[14px] py-3">{point?.loss}</td>
                                                <td className="md:px-2 pl-[14px] py-3">{point?.draw}</td>
                                                <td className="md:px-2 pl-[14px] py-3">{point?.nr}</td>
                                                <td className="md:px-2 pl-[14px] py-3 font-semibold ">{point?.points}</td>
                                                <td className="md:px-2 pl-[14px] py-3">{point?.netrr}</td>
                                                <td className="md:px-2 pl-[14px] py-3">
                                                    <div className="ml-auto flex gap-1 items-center">
                                                    {point?.lastfivematchresult.split(",")?.map((item: string, index:number) => (
                                                <span className={`${item === "W" ? "bg-[#13B76D]" : "bg-[#F63636]" } text-white text-[13px] px-[4px] py-[0px] rounded`} key={index}>
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
                        <div className="mb-4">
                            <p className="font-semibold">
                                {" "}
                                Last Updated On 17 Oct 2024, 22:49 IST
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


                        <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                        {pageHtml?.pointsTableHtml2 && typeof pageHtml?.pointsTableHtml2 === "string" ? (
                                <div dangerouslySetInnerHTML={{ __html: pageHtml?.pointsTableHtml2 }} />
                            ) : (
                              <> 
                            <h3 className="text-1xl font-semibold mb-1">
                                India vs Zimbabwe 2024
                            </h3>
                            <p
                                className="text-gray-500 font-normal "
                            >
                                The biggest tournament in the cricketing circuit, the ICC T20
                                WORLD Cup is underway in the USAs and the West Indies. The
                                tournament received excellent response from the fans worldwide...

                            </p>
                            <button
                                className="text-blue-600 font-semibold flex items-center text-[13px] pt-2 underline"
                            >
                                Read More
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-4 h-4 ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                    />
                                </svg>
                            </button>
                            </>
                            )}
                        </div>

                        <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                            <div className="">
                                <h2 className="text-1xl font-semibold mb-1">FAQs on IPL Points Table</h2>
                                <div className="border-t-[1px] border-[#E7F2F4]" />
                                <div className="space-y-2 my-2">

                                    <div >
                                        <button
                                            className="w-full text-left flex justify-between items-center px-4 py-2 transition"

                                        >
                                            <span className="text-[14px] font-medium">What is NRR?</span>
                                            <span
                                                className="transition-transform transform"

                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                    />
                                                </svg>
                                            </span>
                                        </button>
                                        <p
                                            className="my-2 px-4 text-gray-600 "
                                        >
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde fugiat itaque praesentium dolorum. Fuga ab eveniet minima perferendis beatae autem ducimus error et ex dolores vitae, deserunt mollitia, harum voluptates.
                                        </p>
                                        <div className="border-t-[1px] border-[#E7F2F4]" />
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-4 md:col-span-5 -mt-4">
                      

                        <WeeklySlider featuredMatch={featuredMatch} />



                        <PLSeries/>
                    </div>
                </div>
            </div>


        </section>

    )
}
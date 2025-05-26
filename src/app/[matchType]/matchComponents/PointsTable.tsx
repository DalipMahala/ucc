"use client";
import React, {useState} from 'react';
import Image from "next/image";
import Link from 'next/link';
import WeeklySlider from "@/app/components/WeeklySlider";
import { urlStringEncode } from '@/utils/utility';
import MatchTabs from "./Menu";

interface PointsTable {
    match_id: number;  
    matchData:any | null;
    matchUrl :string | null;
    seriesPointsTable: any | null;
    seriesPointsTableMatches: any | null;
    isPointTable: boolean;
  }
export default function PointsTable({
    match_id,
    matchData,
    matchUrl,
    seriesPointsTable,
    seriesPointsTableMatches,
    isPointTable
  }: PointsTable) {

    // console.log("matchUC",seriesPointsTableMatches);
    const matchDetails = matchData?.match_info;
        const pointTable = seriesPointsTable;
        // const cid = matchData?.match_info?.competition?.cid;
        const standings = pointTable?.standing?.standings;

        const pointTableMatches =   seriesPointsTableMatches;

        const filteredMatches = pointTableMatches.items.filter(
            (            match: { teama: { team_id: number; }; teamb: { team_id: number; }; }) =>
              match.teama.team_id === 128816 || match.teamb.team_id === 128816
          );
       
        // console.log("filteredItems",filteredMatches);
        
        // console.log(pointTableMatches);

        const [expandedRow, setExpandedRow] = useState<number | null>(null);

        const toggleRow = (rowId: number) => {
            console.log("Toggling row:", rowId, "Current expandedRow:", expandedRow);
            setExpandedRow(prev => (prev === rowId ? null : rowId));
        };
        

  return (
    

    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
   <MatchTabs matchUrl={matchUrl} match_id={match_id} matchDetails={matchDetails} isPointTable={isPointTable}/>


    <div id="points" className="">
        <div className="md:grid grid-cols-12 gap-4">
            <div className="lg:col-span-8 md:col-span-7">
                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
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
                </div>
                
                {standings?.map((rounds : any, index:number) => ( 
                <div className="rounded-lg bg-[#ffffff] mb-2 p-4" key={index}>
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
                                    <tr className="" key={index}>
                                        <td className="md:px-2 pl-[14px] py-3 w-[10px]">{index + 1}</td>
                                        <td className="md:px-2 pl-[14px] py-3 text-[#217AF7]">
                                            <Link href={"/team/"+urlStringEncode(point?.team.title)+"/"+point?.team.tid}>
                                                <div className="flex items-center gap-[5px] w-[120px]">
                                                    <div>
                                                        <Image  loading="lazy" 
                                                            src={point?.team?.thumb_url}
                                                            className="h-[20px]"
                                                            width={20} height={20} alt={point?.team?.abbr}
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
                                        <td className="md:px-2 pl-[14px] py-3">{point?.points}</td>
                                        <td className="md:px-2 pl-[14px] py-3">{point?.netrr}</td>
                                        <td className="md:px-2 pl-[14px] py-3">
                                            <div className="ml-auto flex gap-1 items-center">
                                                {point?.lastfivematchresult.split(",")?.map((item: string, index:number) => (
                                                <span className={`${item === "W" ? "bg-[#13b76dbd]" : "bg-[#f63636c2]" } text-white text-[13px] px-[4px] py-[0px] rounded`} key={index}>
                                                    {item}
                                                </span>
                                                ))}
                                                
                                                <span className="flex">
                                                    
                                                    <button className="arro-button" onClick={() => toggleRow(index)}>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className={`size-4 transition-transform ${expandedRow === index ? "rotate-180" : ""}`}
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                            </svg>
                                                        </button>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                ))}

                           {/* {  pointTableMatches.items.filter((match: { teama: { team_id: number; }; teamb: { team_id: number; }; }) =>
                                        match.teama.team_id === 128816 || match.teamb.team_id === 128816)
                            .map((match: any, index: number) => (
                                        <tr  key={index}>
                                        <td colSpan={10} >
                                            <div className='bg-[#ecf2fd] my-2 rounded-md'>
                                                <div className='border-b-[1px] border-[#e4e9f0]'>
                                                    <div className="flex justify-between items-center whitespace-nowrap p-2">
                                                        <div>
                                                            <Link href="/team/india/test">
                                                                <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                                                    <div className="flex items-center space-x-1">
                                                                        <Image  loading="lazy" 
                                                                            src={match?.teama?.logo_url}
                                                                            className="h-[24px] rounded-full"
                                                                            width={25} height={25} alt={match?.teama?.short_name}
                                                                        />
                                                                        <span className="text-[#909090]">{match?.teama?.short_name}</span>
                                                                    </div>
                                                                    <p>{match?.teama?.scores_full}</p>
                                                                </div>

                                                            </Link>
                                                        </div>
                                                        <p>VS</p>
                                                        <div>
                                                            <Link href="/team/india/test">
                                                                <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                                                    <div className="flex items-center space-x-1">
                                                                        <Image  loading="lazy" 
                                                                            src={match?.teamb?.logo_url}
                                                                            className="h-[24px]"
                                                                            width={25} height={25} alt={match?.teamb?.short_name}
                                                                        />
                                                                        <span className="text-[#909090]">{match?.teamb?.short_name}</span>
                                                                    </div>
                                                                    <p>{match?.teamb?.scores_full}</p>
                                                                </div>
                                                            </Link>
                                                        </div>


                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-right leading-6">
                                                                <p className="font-medium">{match?.subtitle}</p>
                                                                <p className="text-[#909090] font-normal">
                                                                {match?.result}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div className="text-center">
                                                                    <span className="bg-[#13b76dbd] text-white text-[13px] px-[6px] py-[3px] rounded">
                                                                    {match?.result}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </td>
                                    </tr>
                                       )) }
                                {expandedRow === index && (
                                        <tr>
                                            <td colSpan={10} >
                                               
                                            </td>
                                        </tr>

                                    )} */}
                                    
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

            <div className="lg:col-span-4 md:col-span-5">
                <div className="bg-white rounded-lg p-4 mb-4">
                    <div className=" gap-1 items-center justify-between hidden">
                        <div className="flex gap-1 items-center">
                            <div className="col-span-4 relative">
                                <Image  loading="lazy"  src="/assets/img/home/trofi.png" className="h-[75px]" width={75} height={75} alt="1" />
                            </div>
                            <div className="col-span-8 relative">
                                <h3 className="font-semibold text-[19px] mb-1">
                                    Weekly challenge
                                </h3>
                                <p className="font-semibold text-[13px] text-[#1a80f8]">
                                    <span className="text-[#586577]">Time Left:</span>2 Days 12h
                                </p>
                            </div>
                        </div>
                        <div className="">
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
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <WeeklySlider />



                <div className=" pb-2 my-4">
                    <div className="py-2">
                        <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
                            POPULAR</h3>

                    </div>
                    <div className="">
                        <Link href="/t20series">
                            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2">
                                <div>
                                    <Image  loading="lazy"  src="/assets/img/1.png" width={20} height={20} alt="1" />
                                </div>
                                <div className="font-medium text-[#394351]">
                                    ICC World cup
                                </div>
                            </div>
                        </Link>
                        <Link href="/t20series">
                            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                <div>
                                    <Image  loading="lazy"  src="/assets/img/2.png" width={20} height={20} alt="1" />
                                </div>
                                <div className="font-medium text-[#394351]">
                                    ICC Champion Trophy
                                </div>
                            </div>
                        </Link>
                        <Link href="/t20series">
                            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                <div>
                                    <Image  loading="lazy"  src="/assets/img/3.png" width={20} height={20} alt="1" />
                                </div>
                                <div className="font-medium text-[#394351]">
                                    T20 World Cup
                                </div>
                            </div>
                        </Link>
                        <Link href="/t20series">
                            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                <div>
                                    <Image  loading="lazy"  src="/assets/img/4.png" width={20} height={20} alt="1" />
                                </div>
                                <div className="font-medium text-[#394351]">
                                    Indian Premium League
                                </div>
                            </div>
                        </Link>
                        <Link href="/t20series">
                            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                <div>
                                    <Image  loading="lazy"  src="/assets/img/5.png" width={20} height={20} alt="1" />
                                </div>
                                <div className="font-medium text-[#394351]">
                                    Pakistan Super League
                                </div>
                            </div>
                        </Link>
                        <Link href="/t20series">
                            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                <div>
                                    <Image  loading="lazy"  src="/assets/img/6.png" width={20} height={20} alt="1" />
                                </div>
                                <div className="font-medium text-[#394351]">
                                    Bangladesh Premium Leaguge
                                </div>
                            </div>
                        </Link>
                        <Link href="/t20series">
                            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                <div>
                                    <Image  loading="lazy"  src="/assets/img/7.png" width={20} height={20} alt="1" />
                                </div>
                                <div className="font-medium text-[#394351]">
                                    Big Bash Leaguge
                                </div>
                            </div>
                        </Link>
                        <Link href="/t20series">
                            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3">
                                <div>
                                    <Image  loading="lazy"  src="/assets/img/8.png" width={20} height={20} alt="1" />
                                </div>
                                <div className="font-medium text-[#394351]">
                                    Super Smash
                                </div>
                            </div>
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    </div>


</section>

  )
}
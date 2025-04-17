"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
// import { getTeamDetailsByTid} from "@/utils/utility";
import { urlStringEncode } from '@/utils/utility';
// import { TeamDetails } from "@/controller/teamController";
interface Stats {
    urlString: string;
    playerAdvanceStats: any | null;
  }
export default function Stats({urlString, playerAdvanceStats}: Stats) {

    const teamStats = playerAdvanceStats?.player_vs_team;
    const tournamentStats = playerAdvanceStats?.tournamentstats;
    const last10Matches = playerAdvanceStats?.last10_matches;

    const [statsTab, setStatsTab] = useState('cust-box-click-t20');

    const t20iTeamIds = teamStats?.batting?.t20i?.map((team: any) => team.teamid) || [];
    const odiTeamIds = teamStats?.batting?.odi?.map((team: any) => team.teamid) || [];
    const testTeamIds = teamStats?.batting?.test?.map((team: any) => team.teamid) || [];

    const allTeamIds = Array.from(new Set([...t20iTeamIds, ...odiTeamIds, ...testTeamIds]));
    const [teamLogos, setTeamLogos] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchAllLogos = async () => {
          for (const teamId of allTeamIds) {
            if (!teamLogos[teamId]) {
                const res = await fetch(`/api/team/${teamId}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
                    }
                  });
                const data = await res.json();
                  
                const logo =     data?.logo_url ? data.logo_url : "/assets/img/flag/2.png";
            //   const logo = await getTeamDetailsByTid(teamId);
              setTeamLogos((prev) => ({ ...prev, [teamId]: logo }));
            }
          }
        };
        fetchAllLogos();
  }, [allTeamIds]);
   
    const handleStatsTabClick = (tab: React.SetStateAction<string>) => {
        setStatsTab(tab);
    };

    return (

        <section className="lg:w-[1000px] md:mx-auto my-5 mx-2">
            <div className="">
                <div id="tabs" className="my-4">
                    <div className="flex text-[13px] space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                        <Link href={"/player/"+urlString}>
                            <button className="font-semibold uppercase py-2 px-3 whitespace-nowrap"
                            >
                                Overview
                            </button>
                        </Link>
                        <Link href={"/player/"+urlString+"/stats"}>
                            <button className="font-semibold uppercase py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md"
                            >
                                Stats
                            </button>
                        </Link>

                        <Link href={"/player/"+urlString+"/news"}>
                            <button
                                className="font-semibold uppercase py-2 px-3 whitespace-nowrap"
                            >
                                News
                            </button>
                        </Link>
                        {/* <Link href={"/player/"+urlString+"/photos"}>
                            <button className="font-semibold uppercase py-2 px-3 whitespace-nowrap"
                            >
                                Photos
                            </button>
                        </Link> */}
                    </div>
                </div>

                <div id="tab-content">
                    <div id="stats">
                        <div className="cust-box-click-container">
                            <h2 className="text-[18px] mb-[1px] font-semibold">{playerAdvanceStats?.player?.title}</h2>
                            <div className="md:flex justify-between items-center mb-3">
                                <h3 className=" font-medium pl-[7px] border-l-[3px] border-[#229ED3]">
                                    Vs Team stats
                                </h3>
                                <div className="flex gap-3 items-center md:justify-center md:mt-0 mt-4">
                                    <button
                                        onClick={() => handleStatsTabClick('cust-box-click-t20')}
                                        className={`cust-box-click-button font-medium px-5 py-1 rounded-full ${statsTab === 'cust-box-click-t20' ? 'bg-[#081736] text-white' : 'bg-[#ffffff] text-[#6A7586]'}`}
                                    >
                                        <span>T20</span>
                                    </button>
                                    <button
                                        onClick={() => handleStatsTabClick('cust-box-click-odi')}
                                        className={`cust-box-click-button font-medium px-5 py-1 rounded-full ${statsTab === 'cust-box-click-odi' ? 'bg-[#081736] text-white' : 'bg-[#ffffff] text-[#6A7586]'}`}
                                    >
                                        <span>ODI Venue</span>
                                    </button>
                                    <button
                                        onClick={() => handleStatsTabClick('cust-box-click-test')}
                                        className={`cust-box-click-button font-medium px-5 py-1 rounded-full ${statsTab === 'cust-box-click-test' ? 'bg-[#081736] text-white' : 'bg-[#ffffff] text-[#6A7586]'}`}
                                    >
                                        <span>TEST</span>
                                    </button>
                                </div>
                            </div>
                            <div className={`cust-box-click-content cust-box-click-t20 ${statsTab === 'cust-box-click-t20' ? "" : "hidden"}`}>
                                <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                            Batting Performance
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium w-[10px]" />
                                                            <th className="px-4 py-3 font-medium">Batter</th>
                                                            <th className="px-3 py-3 font-medium">Inns</th>
                                                            <th className="px-3 py-3 font-medium">No</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">BF</th>
                                                            <th className="px-3 py-3 font-medium">100s</th>
                                                            <th className="px-3 py-3 font-medium">50s</th>
                                                            <th className="px-3 py-3 font-medium">4s</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                            <th className="px-3 py-3 font-medium">H</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {teamStats?.batting?.t20i?.map((teams:any, index:number) =>(
                                                        <tr key={index}>
                                                            <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                            <td className="px-3 py-3">
                                                                <Link href={"/team/"+urlStringEncode(teams.team_name)+"/"+teams.teamid}>
                                                                    <div className="flex space-x-1 w-[114px]">
                                                                        <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image  loading="lazy" 
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                        ):("")}
                                                                        </div>
                                                                        <div className="">
                                                                            <p className="text-[14px] font-medium">
                                                                                {teams?.team_name}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{teams?.innings}</td>
                                                            <td className="px-3 py-3">{teams?.notout}</td>
                                                            <td className="px-3 py-3 font-semibold">{teams?.runs}</td>
                                                            <td className="px-3 py-3">{teams?.balls}</td>
                                                            <td className="px-3 py-3">{teams?.run100}</td>
                                                            <td className="px-3 py-3">{teams?.run50}</td>
                                                            <td className="px-3 py-3">{teams?.run4}</td>
                                                            <td className="px-3 py-3">{teams?.average}</td>
                                                            <td className="px-3 py-3">{teams?.strike}</td>
                                                            <td className="px-3 py-3">{teams?.highest}</td>
                                                        </tr>
                                                        ))}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                            Bowling Performance
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium w-[10px]" />
                                                            <th className="px-4 py-3 font-medium" />
                                                            <th className="px-3 py-3 font-medium">Inns</th>
                                                            <th className="px-3 py-3 font-medium">Wickets</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">Balls</th>
                                                            <th className="px-3 py-3 font-medium">wicket4i</th>
                                                            <th className="px-3 py-3 font-medium">wicket5i</th>
                                                            <th className="px-3 py-3 font-medium">Maidens</th>
                                                            <th className="px-3 py-3 font-medium">Econ</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                    {teamStats?.bowling?.t20i?.map((teams:any, index:number) =>(
                                                        <tr key={index}>
                                                            <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                            <td className="px-3 py-3">
                                                                <Link href={"/team/"+urlStringEncode(teams.team_name)+"/"+teams.teamid}>
                                                                    <div className="flex space-x-1 w-[114px]">
                                                                        <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image  loading="lazy" 
                                                                                src={teamLogos[teams.teamid] }
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                             ):("")}
                                                                        </div>
                                                                        <div className="">
                                                                            <p className="text-[14px] font-medium">
                                                                                {teams.team_name}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{teams.innings}</td>
                                                            <td className="px-3 py-3 font-semibold">{teams.wickets}</td>
                                                            <td className="px-3 py-3">{teams.runs}</td>
                                                            <td className="px-3 py-3">{teams.balls}</td>
                                                            <td className="px-3 py-3">{teams.wicket4i}</td>
                                                            <td className="px-3 py-3">{teams.wicket5i}</td>
                                                            <td className="px-3 py-3">{teams.maidens}</td>
                                                            <td className="px-3 py-3">{teams.econ}</td>
                                                            <td className="px-3 py-3">{teams.average}</td>
                                                            <td className="px-3 py-3">{teams.strike}</td>
                                                        </tr>
                                                    ))}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className={`cust-box-click-content cust-box-click-odi ${statsTab === 'cust-box-click-odi' ? "" : "hidden"}`}>
                            <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                            Batting Performance
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium w-[10px]" />
                                                            <th className="px-4 py-3 font-medium">Batter</th>
                                                            <th className="px-3 py-3 font-medium">Inns</th>
                                                            <th className="px-3 py-3 font-medium">No</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">BF</th>
                                                            <th className="px-3 py-3 font-medium">100s</th>
                                                            <th className="px-3 py-3 font-medium">50s</th>
                                                            <th className="px-3 py-3 font-medium">4s</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                            <th className="px-3 py-3 font-medium">H</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {teamStats?.batting?.odi?.map((teams:any, index:number) =>(
                                                        <tr key={index}>
                                                            <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                            <td className="px-3 py-3">
                                                                <Link href={"/team/"+urlStringEncode(teams.team_name)+"/"+teams.teamid}>
                                                                    <div className="flex space-x-1 w-[114px]">
                                                                        <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image  loading="lazy" 
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                             ):("")}
                                                                        </div>
                                                                        <div className="">
                                                                            <p className="text-[14px] font-medium">
                                                                                {teams?.team_name}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{teams?.innings}</td>
                                                            <td className="px-3 py-3">{teams?.notout}</td>
                                                            <td className="px-3 py-3">{teams?.runs}</td>
                                                            <td className="px-3 py-3">{teams?.balls}</td>
                                                            <td className="px-3 py-3">{teams?.run100}</td>
                                                            <td className="px-3 py-3">{teams?.run50}</td>
                                                            <td className="px-3 py-3">{teams?.run4}</td>
                                                            <td className="px-3 py-3">{teams?.average}</td>
                                                            <td className="px-3 py-3">{teams?.strike}</td>
                                                            <td className="px-3 py-3">{teams?.highest}</td>
                                                        </tr>
                                                        ))}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                            Bowling Performance
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium w-[10px]" />
                                                            <th className="px-4 py-3 font-medium" />
                                                            <th className="px-3 py-3 font-medium">Inns</th>
                                                            <th className="px-3 py-3 font-medium">Wickets</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">Balls</th>
                                                            <th className="px-3 py-3 font-medium">wicket4i</th>
                                                            <th className="px-3 py-3 font-medium">wicket5i</th>
                                                            <th className="px-3 py-3 font-medium">Maidens</th>
                                                            <th className="px-3 py-3 font-medium">Econ</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                    {teamStats?.bowling?.odi?.map((teams:any, index:number) =>(
                                                        <tr key={index}>
                                                            <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                            <td className="px-3 py-3">
                                                                <Link href={"/team/"+urlStringEncode(teams.team_name)+"/"+teams.teamid}>
                                                                    <div className="flex space-x-1 w-[114px]">
                                                                        <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image  loading="lazy" 
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                             ):("")}
                                                                        </div>
                                                                        <div className="">
                                                                            <p className="text-[14px] font-medium">
                                                                                {teams.team_name}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{teams.innings}</td>
                                                            <td className="px-3 py-3">{teams.wickets}</td>
                                                            <td className="px-3 py-3">{teams.runs}</td>
                                                            <td className="px-3 py-3">{teams.balls}</td>
                                                            <td className="px-3 py-3">{teams.wicket4i}</td>
                                                            <td className="px-3 py-3">{teams.wicket5i}</td>
                                                            <td className="px-3 py-3">{teams.maidens}</td>
                                                            <td className="px-3 py-3">{teams.econ}</td>
                                                            <td className="px-3 py-3">{teams.average}</td>
                                                            <td className="px-3 py-3">{teams.strike}</td>
                                                        </tr>
                                                    ))}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`cust-box-click-content cust-box-click-test ${statsTab === 'cust-box-click-test' ? "" : "hidden"}`}>
                            <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                            Batting Performance
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium w-[10px]" />
                                                            <th className="px-4 py-3 font-medium">Batter</th>
                                                            <th className="px-3 py-3 font-medium">Inns</th>
                                                            <th className="px-3 py-3 font-medium">No</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">BF</th>
                                                            <th className="px-3 py-3 font-medium">100s</th>
                                                            <th className="px-3 py-3 font-medium">50s</th>
                                                            <th className="px-3 py-3 font-medium">4s</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                            <th className="px-3 py-3 font-medium">H</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {teamStats?.batting?.test?.map((teams:any, index:number) =>(
                                                        <tr key={index}>
                                                            <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                            <td className="px-3 py-3">
                                                                <Link href={"/team/"+urlStringEncode(teams.team_name)+"/"+teams.teamid}>
                                                                    <div className="flex space-x-1 w-[114px]">
                                                                        <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image  loading="lazy" 
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                             ):("")}
                                                                        </div>
                                                                        <div className="">
                                                                            <p className="text-[14px] font-medium">
                                                                                {teams?.team_name}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{teams?.innings}</td>
                                                            <td className="px-3 py-3">{teams?.notout}</td>
                                                            <td className="px-3 py-3">{teams?.runs}</td>
                                                            <td className="px-3 py-3">{teams?.balls}</td>
                                                            <td className="px-3 py-3">{teams?.run100}</td>
                                                            <td className="px-3 py-3">{teams?.run50}</td>
                                                            <td className="px-3 py-3">{teams?.run4}</td>
                                                            <td className="px-3 py-3">{teams?.average}</td>
                                                            <td className="px-3 py-3">{teams?.strike}</td>
                                                            <td className="px-3 py-3">{teams?.highest}</td>
                                                        </tr>
                                                        ))}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                            Bowling Performance
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium w-[10px]" />
                                                            <th className="px-4 py-3 font-medium" />
                                                            <th className="px-3 py-3 font-medium">Inns</th>
                                                            <th className="px-3 py-3 font-medium">Wickets</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">Balls</th>
                                                            <th className="px-3 py-3 font-medium">wicket4i</th>
                                                            <th className="px-3 py-3 font-medium">wicket5i</th>
                                                            <th className="px-3 py-3 font-medium">Maidens</th>
                                                            <th className="px-3 py-3 font-medium">Econ</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                    {teamStats?.bowling?.test?.map((teams:any, index:number) =>(
                                                        <tr key={index}>
                                                            <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                            <td className="px-3 py-3">
                                                                <Link href={"/team/"+urlStringEncode(teams.team_name)+"/"+teams.teamid}>
                                                                    <div className="flex space-x-1 w-[114px]">
                                                                        <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image  loading="lazy" 
                                                                                src={teamLogos[teams.teamid] }
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                             ):("")}
                                                                        </div>
                                                                        <div className="">
                                                                            <p className="text-[14px] font-medium">
                                                                                {teams.team_name}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{teams.innings}</td>
                                                            <td className="px-3 py-3">{teams.wickets}</td>
                                                            <td className="px-3 py-3">{teams.runs}</td>
                                                            <td className="px-3 py-3">{teams.balls}</td>
                                                            <td className="px-3 py-3">{teams.wicket4i}</td>
                                                            <td className="px-3 py-3">{teams.wicket5i}</td>
                                                            <td className="px-3 py-3">{teams.maidens}</td>
                                                            <td className="px-3 py-3">{teams.econ}</td>
                                                            <td className="px-3 py-3">{teams.average}</td>
                                                            <td className="px-3 py-3">{teams.strike}</td>
                                                        </tr>
                                                    ))}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                            <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                    Tournament Stats
                                </h3>
                                <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                            Batting Statistics
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Tournament</th>
                                                            <th className="px-3 py-3 font-medium">Mat</th>
                                                            <th className="px-3 py-3 font-medium">Inns</th>
                                                            <th className="px-3 py-3 font-medium">No</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">BF</th>
                                                            <th className="px-3 py-3 font-medium">100s</th>
                                                            <th className="px-3 py-3 font-medium">4s</th>
                                                            <th className="px-3 py-3 font-medium">6s</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                            <th className="px-3 py-3 font-medium">H</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {tournamentStats?.map((tournaments:any, index:number) => (
                                                        <tr key={index}>
                                                            <td className="md:px-2 py-3 text-[#217AF7]">
                                                                <Link href="#" style={{ cursor: "pointer" }}>
                                                                    {tournaments.title}
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.matches}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.innings}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.notout}</td>
                                                            <td className="px-3 py-3 font-semibold">{tournaments?.batting?.runs}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.balls}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.run100}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.run4}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.run6}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.average}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.strike}</td>
                                                            <td className="px-3 py-3">{tournaments?.batting?.highest}</td>
                                                        </tr>
                                                        ))}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                            Bowling Statistics
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Tournament</th>
                                                            <th className="px-3 py-3 font-medium">Match</th>
                                                            <th className="px-3 py-3 font-medium">Inns</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">Overs</th>
                                                            <th className="px-3 py-3 font-medium">Wickets</th>
                                                            <th className="px-3 py-3 font-medium">Maidens</th>
                                                            <th className="px-3 py-3 font-medium">Dots</th>
                                                            <th className="px-3 py-3 font-medium">Econ</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">Strike</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                    {tournamentStats?.map((tournaments:any, index:number) => (
                                                        <tr key={index}>
                                                            <td className="md:px-2 py-3 text-[#217AF7]">
                                                                <Link href="#" style={{ cursor: "pointer" }}>
                                                                    {tournaments.title}
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.matches}</td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.innings}</td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.runs}</td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.overs}</td>
                                                            <td className="px-3 py-3 font-semibold">{tournaments?.bowling?.wickets}</td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.maidens}</td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.dot}</td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.econ}</td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.average}</td>
                                                            <td className="px-3 py-3">{tournaments?.bowling?.strike}</td>
                                                        </tr>
                                                    ))}
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                    Last 10 Matches
                                </h3>
                                <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Batting Performance  (Last 10 Matches)
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Match</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">BF</th>
                                                            <th className="px-3 py-3 font-medium">4s</th>
                                                            <th className="px-3 py-3 font-medium">6s</th>
                                                            <th className="px-3 py-3 font-medium">50s</th>
                                                            <th className="px-3 py-3 font-medium">100s</th>
                                                            <th className="px-3 py-3 font-medium">H</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                    {last10Matches?.batting?.map((lmatches:any, index:number) => (
                                                        <tr key={index}>
                                                            <td className="md:px-2 py-3 text-[#217AF7]">
                                                                <Link href="#" style={{ cursor: "pointer" }}>
                                                                    {lmatches.match_title}
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3 font-semibold">{lmatches.runs}</td>
                                                            <td className="px-3 py-3">{lmatches.balls}</td>
                                                            <td className="px-3 py-3">{lmatches.run4}</td>
                                                            <td className="px-3 py-3">{lmatches.run6}</td>
                                                            <td className="px-3 py-3">{lmatches.run50}</td>
                                                            <td className="px-3 py-3">{lmatches.run100}</td>
                                                            <td className="px-3 py-3">{lmatches.highest}</td>
                                                            <td className="px-3 py-3">{lmatches.average}</td>
                                                            <td className="px-3 py-3">{lmatches.strike}</td>
                                                        </tr>
                                                    ))}
                                                       
                                                          
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                        <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Bowling Performance (Last 10 Matches)
                                        </h3>
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                                    <thead className="bg-blue-50 text-gray-700 ">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Match</th>
                                                            <th className="px-3 py-3 font-medium">Runs</th>
                                                            <th className="px-3 py-3 font-medium">Overs</th>
                                                            <th className="px-3 py-3 font-medium">Wickets</th>
                                                            <th className="px-3 py-3 font-medium">Maidens</th>
                                                            <th className="px-3 py-3 font-medium">Dot</th>
                                                            <th className="px-3 py-3 font-medium">Hattrick</th>
                                                            <th className="px-3 py-3 font-medium">Econ</th>
                                                            <th className="px-3 py-3 font-medium">Avg</th>
                                                            <th className="px-3 py-3 font-medium">SR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                    {last10Matches?.bowling?.map((lmatches:any, index:number) => (
                                                        <tr key={index}>
                                                            <td className="md:px-2 py-3 text-[#217AF7]">
                                                                <Link href="#" style={{ cursor: "pointer" }}>
                                                                    {lmatches?.match_title}
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3">{lmatches.runs}</td>
                                                            <td className="px-3 py-3">{lmatches.overs}</td>
                                                            <td className="px-3 py-3 font-semibold">{lmatches.wickets}</td>
                                                            <td className="px-3 py-3">{lmatches.maidens}</td>
                                                            <td className="px-3 py-3">{lmatches.dot}</td>
                                                            <td className="px-3 py-3">{lmatches.hattrick}</td>
                                                            <td className="px-3 py-3">{lmatches.econ}</td>
                                                            <td className="px-3 py-3">{lmatches.average}</td>
                                                            <td className="px-3 py-3">{lmatches.strike}</td>
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
            </div>
        </section>

    )
}
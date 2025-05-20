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
    playerStats: any;
}
export default function Stats({ urlString, playerStats, playerAdvanceStats }: Stats) {

    const teamStats = playerAdvanceStats?.player_vs_team;
    const tournamentStats = playerAdvanceStats?.tournamentstats;
    const last10Matches = playerAdvanceStats?.last10_matches;

    const [statsTab, setStatsTab] = useState('cust-box-click-t20');

    const t20iTeamIds = teamStats?.batting?.t20i?.map((team: any) => team.teamid) || [];
    const odiTeamIds = teamStats?.batting?.odi?.map((team: any) => team.teamid) || [];
    const testTeamIds = teamStats?.batting?.test?.map((team: any) => team.teamid) || [];


    const playerBatting = playerStats?.batting ?? {};
    const playerBowling = playerStats?.bowling ?? {};

    // Convert Batting/Bowling Stats to Array
    const battingArray = Object.keys(playerBatting)?.map((key) => ({
        formatType: key.toUpperCase(),
        ...playerBatting[key],
    }));

    const bowlingArray = Object.keys(playerBowling)?.map((key) => ({
        formatType: key.toUpperCase(),
        ...playerBowling[key],
    }));

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

                    const logo = data?.logo_url ? data.logo_url : "/assets/img/flag/2.png";
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
                    <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                        <Link href={"/player/" + urlString}>
                            <button className="font-medium py-2 px-3 whitespace-nowrap"
                            >
                                Overview
                            </button>
                        </Link>
                        <Link href={"/player/" + urlString + "/stats"}>
                            <button className="font-medium py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md"
                            >
                                Stats
                            </button>
                        </Link>

                        <Link href={"/player/" + urlString + "/news"}>
                            <button
                                className="font-medium py-2 px-3 whitespace-nowrap"
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



                            {/* Career Stats batting start */}

                            <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]"> Batting Performance</h3>
                                <div
                                    className="relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                                  [&::-webkit-scrollbar-track]:bg-gray-100 
                                  [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                                >
                                    <table className="w-full text-[13px] text-left text-gray-500">
                                        <thead className="border-b text-gray-700 bg-[#C3DBFF33]">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3 bg-[#f3f8ff] font-medium sticky left-0"
                                                >
                                                    Format
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Mat
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Inns
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Runs
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Avg
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    4s
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    6s
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    SR
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium whitespace-nowrap">
                                                    Not Out
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Balls
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Highest
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Fifty
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Century
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs">
                                            {battingArray?.map((item, index) => (
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                                    <th
                                                        scope="row"
                                                        className="px-4 py-4 font-medium text-gray-900 bg-[#f3f8ff] whitespace-nowrap dark:text-white sticky left-0"
                                                    >
                                                        {item.formatType}
                                                    </th>
                                                    <td className="px-3 py-3">{item.matches}</td>
                                                    <td className="px-3 py-3">{item.innings}</td>
                                                    <td className="px-3 py-3">{item.runs}</td>
                                                    <td className="px-3 py-3">{item.average}</td>
                                                    <td className="px-3 py-3">{item.run4}</td>
                                                    <td className="px-3 py-3">{item.run6}</td>
                                                    <td className="px-3 py-3">{item.strike}</td>
                                                    <td className="px-3 py-3">{item.notout}</td>
                                                    <td className="px-3 py-3">{item.balls}</td>
                                                    <td className="px-3 py-3">{item.highest}</td>
                                                    <td className="px-3 py-3">{item.run50}</td>
                                                    <td className="px-3 py-3">{item.run100}</td>
                                                </tr>
                                            ))}


                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* Career Stats batting end */}

                            {/* Career Stats bowling start */}

                            <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">Bowling Performance</h3>

                                <div
                                    className="relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                                  [&::-webkit-scrollbar-track]:bg-gray-100 
                                  [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                                >
                                    <table className="w-full text-[13px] text-left text-gray-500">
                                        <thead className="border-b text-gray-700 bg-[#C3DBFF33]">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3 bg-[#f3f8ff] font-medium sticky left-0"
                                                >
                                                    Format
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Mat
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Inns
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Runs
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Avg
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Wicket4i
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Wicket5i
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    SR
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Econ
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Balls
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Wickets
                                                </th>
                                                <th scope="col" className="px-3 py-3 font-medium">
                                                    Overs
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody className="text-xs">
                                            {bowlingArray?.map((item, index) => (
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                                    <th
                                                        scope="row"
                                                        className="px-4 py-4 font-medium text-gray-900 bg-[#f3f8ff] whitespace-nowrap dark:text-white sticky left-0"
                                                    >
                                                        {item.formatType}
                                                    </th>
                                                    <td className="px-3 py-3">{item.matches}</td>
                                                    <td className="px-3 py-3">{item.innings}</td>
                                                    <td className="px-3 py-3">{item.runs}</td>
                                                    <td className="px-3 py-3">{item.average}</td>
                                                    <td className="px-3 py-3">{item.wicket4i}</td>
                                                    <td className="px-3 py-3">{item.wicket5i}</td>
                                                    <td className="px-3 py-3">{item.strike}</td>
                                                    <td className="px-3 py-3">{item.econ}</td>
                                                    <td className="px-3 py-3">{item.balls}</td>
                                                    <td className="px-3 py-3">{item.wickets}</td>
                                                    <td className="px-3 py-3">{item.overs}</td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Career Stats bowling end */}





                          
                            <div className="md:flex justify-between items-center mb-3">
                                <h2 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                                    Vs Team stats
                                </h2>
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
                                        <span>ODI </span>
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

                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Batting Performance
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium w-[10px]" />
                                                    <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50">Team</th>
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
                                                {teamStats?.batting?.t20i?.map((teams: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                        <td className="py-3 sticky left-0">
                                                            <Link href={"/team/" + urlStringEncode(teams.team_name) + "/" + teams.teamid}>
                                                                <div className="flex space-x-1 w-[140px] bg-[#ffffff] px-3">
                                                                    <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image loading="lazy"
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                        ) : ("")}
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


                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Bowling Performance
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium w-[10px]" />
                                                    <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50" />
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
                                                {teamStats?.bowling?.t20i?.map((teams: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                        <td className="py-3 sticky left-0">
                                                            <Link href={"/team/" + urlStringEncode(teams.team_name) + "/" + teams.teamid}>
                                                                <div className="flex space-x-1 w-[140px] bg-[#ffffff] px-3">
                                                                    <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image loading="lazy"
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                        ) : ("")}
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
                            <div className={`cust-box-click-content cust-box-click-odi ${statsTab === 'cust-box-click-odi' ? "" : "hidden"}`}>

                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Batting Performance
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium w-[10px]" />
                                                    <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50">Team</th>
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
                                                {teamStats?.batting?.odi?.map((teams: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                        <td className="py-3 sticky left-0">
                                                            <Link href={"/team/" + urlStringEncode(teams.team_name) + "/" + teams.teamid}>
                                                                <div className="flex space-x-1 w-[140px] bg-[#ffffff] px-3">
                                                                    <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image loading="lazy"
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                        ) : ("")}
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


                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Bowling Performance
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium w-[10px]" />
                                                    <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50" />
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
                                                {teamStats?.bowling?.odi?.map((teams: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                        <td className="py-3 sticky left-0">
                                                            <Link href={"/team/" + urlStringEncode(teams.team_name) + "/" + teams.teamid}>
                                                                <div className="flex space-x-1 w-[140px] bg-[#ffffff] px-3">
                                                                    <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image loading="lazy"
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                        ) : ("")}
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
                            <div className={`cust-box-click-content cust-box-click-test ${statsTab === 'cust-box-click-test' ? "" : "hidden"}`}>

                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Batting Performance
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium w-[10px]" />
                                                    <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50">Team</th>
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
                                                {teamStats?.batting?.test?.map((teams: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                        <td className="py-3 sticky left-0">
                                                            <Link href={"/team/" + urlStringEncode(teams.team_name) + "/" + teams.teamid}>
                                                                <div className="flex space-x-1 w-[140px] bg-[#ffffff] px-3">
                                                                    <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image loading="lazy"
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                        ) : ("")}
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


                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Bowling Performance
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium w-[10px]" />
                                                    <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50" />
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
                                                {teamStats?.bowling?.test?.map((teams: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-3 py-3 w-[10px] font-medium">VS</td>
                                                        <td className="py-3 sticky left-0">
                                                            <Link href={"/team/" + urlStringEncode(teams.team_name) + "/" + teams.teamid}>
                                                                <div className="flex space-x-1 w-[140px] bg-[#ffffff] px-3">
                                                                    <div className="flex items-center space-x-1 flex-col">
                                                                        {teamLogos[teams.teamid] ? (
                                                                            <Image loading="lazy"
                                                                                src={teamLogos[teams.teamid]}
                                                                                className="h-[20px] rounded-full"
                                                                                width={20} height={20} alt="wiw"
                                                                            />
                                                                        ) : ("")}
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
                            <div>
                                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                    Tournament Stats
                                </h3>

                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Batting Statistics
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50">Tournament</th>
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
                                                {tournamentStats?.map((tournaments: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="sticky left-0 py-3 text-[14px] font-medium">

                                                            <div className='bg-white px-3 '> {tournaments.title} </div>

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


                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Bowling Statistics
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                                            <thead className="bg-blue-50 text-gray-700 ">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium sticky left-0 bg-blue-50">Tournament</th>
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
                                                {tournamentStats?.map((tournaments: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="sticky left-0 py-3 text-[14px] font-medium">

                                                            <div className='bg-white px-3'> {tournaments.title} </div>

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

                                <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                    Last 10 Matches
                                </h3>

                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Batting Performance  (Last 10 Matches)
                                    </h3>

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
                                                {last10Matches?.batting?.map((lmatches: any, index: number) => (
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


                                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                                        Bowling Performance (Last 10 Matches)
                                    </h3>

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
                                                {last10Matches?.bowling?.map((lmatches: any, index: number) => (
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
        </section>

    )
}
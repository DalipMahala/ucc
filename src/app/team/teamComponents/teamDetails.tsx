"use client";

import React, { useState } from "react";
import Link from "next/link";
import Banner from "./Banner";
import Image from "next/image";
import { urlStringEncode } from "../../../utils/utility";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "@/app/components/countdownTimer";
import PlayerImage from "@/app/components/PlayerImage";

interface Team {
  teamLast5match: any | null;
  params: any | null;
  teamDetails: any | null;
  teamUpcomingMatch: any | null;
  teamPlayers: any[];
}
// export default function Team({
//   teamLast5match,
//   teamDetails,
//   teamUpcomingMatch,
//   params,
// }: Team) {
//   const teama_id = params.teamId;
//   const matchData = teamLast5match;
//   const upcomingMatch = teamUpcomingMatch;

export default function Team({
  teamLast5match = [],
  teamDetails = null,
  teamUpcomingMatch = [],
  params = null,
  teamPlayers
}: Team) {
  const teama_id = params?.teamId;
  const teamName = params?.teamName;
  // const matchData = teamLast5match || [];
  // const upcomingMatch = teamUpcomingMatch || [];
  const upcomingMatch = Array.isArray(teamUpcomingMatch)
    ? teamUpcomingMatch
    : [];
  const matchData = Array.isArray(teamLast5match) ? teamLast5match : [];
  
  const captains = teamPlayers?.[0]?.captains;
  const teamType = params?.teamType ? params?.teamType : "odi";
  const teamCaptains = captains.filter((captain: { format_str: string; }) => captain.format_str === teamType);
  const squads =  teamPlayers?.[0]?.players?.[teamType];
// console.log("captain", teamPlayers);
  
  let total_match = teamDetails?.total_match_odi;
  let win_match = teamDetails?.win_match_odi;
  let loss_match = teamDetails?.loss_match_odi;
  let tie_match = teamDetails?.tie_match_odi;
  let nr_match = teamDetails?.nr_match_odi;
  let win_per_match = (teamDetails?.win_match_odi/teamDetails?.total_match_odi)*100;
  if(teamType === "test"){
     total_match = teamDetails?.total_match_test;
     win_match = teamDetails?.win_match_test;
     loss_match = teamDetails?.loss_match_test;
     tie_match = teamDetails?.tie_match_test;
     nr_match = teamDetails?.nr_match_test;
     win_per_match = (teamDetails?.win_match_test/teamDetails?.total_match_test)*100;
  }else if(teamType === "t20i"){
    total_match = teamDetails?.total_match_t20;
    win_match = teamDetails?.win_match_t20;
    loss_match = teamDetails?.loss_match_t20;
    tie_match = teamDetails?.tie_match_t20;
    nr_match = teamDetails?.nr_match_t20;
    win_per_match = (teamDetails?.win_match_t20/teamDetails?.total_match_t20)*100;
 }

  
  // console.log();
  const [batterTab, setBatterTab] = useState('cust-box-click-batters');
    const [batter1Tab, setBatter1Tab] = useState('cust-box-click-batters1');
    const [homeRecordTab, setHomeRecordTab] = useState('cust-box-click-homeground');
    const [show, setShow] = useState(false);

    const handleBatterTabClick = (tab: React.SetStateAction<string>) => {
        setBatterTab(tab);
    };

    const handleBatter1TabClick = (tab: React.SetStateAction<string>) => {
        setBatter1Tab(tab);
    };

    const handleHomeRecordTabClick = (tab: React.SetStateAction<string>) => {
        setHomeRecordTab(tab);
    };
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 my-4 px-2 lg:px-0">
      <div className="md:grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 md:col-span-7">
          <Banner teamDetails={teamDetails}></Banner>

          <div id="tabs" className="mb-4">
            <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
              {captains.map((cap: any, index: number) => (
                <Link href={"/team/"+teamName+"/"+teama_id+"/"+cap.format_str} key={index}>
                  <button className={`font-medium py-2 px-3 whitespace-nowrap ${teamType === cap.format_str ? "bg-[#1A80F8]  text-white" :""} rounded-md`}>
                    {cap.format_str.toUpperCase()}
                  </button>
                </Link>
              ))}
            </div>
          </div>
          <div id="tab-content">
            <div id="test" className="">
            {teamCaptains.map((cap: any, index: number) => (
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4" key={index}>
                <div className="bg-white rounded-lg p-4">
                  <Link href={"/player/"+urlStringEncode(cap?.title)+"/"+cap?.pid}>
                    <div className="flex items-center space-x-3">
                      <div>
                        <PlayerImage  key={cap?.pid} player_id={cap?.pid} height={40} width={40} className="rounded-full" />
                        
                      </div>
                      <div className="font-medium">
                        <h2 className="text-[15px]">
                          {" "}
                          {cap?.title}{" "}
                          <span className="text-[#909090] font-normal">
                                                        ({teamName.charAt(0).toUpperCase() + teamName.slice(1)}&nbsp;Captain)
                                                    </span>{" "}
                        </h2>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              ))}
              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                <div className="flex justify-between items-center pb-2">
                  <div>
                    <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                      {teamName.charAt(0).toUpperCase() + teamName.slice(1)}&nbsp;Squad 2024
                    </h3>
                  </div>
                </div>
                <div className="border-t border-[#E4E9F0] mb-3" />
                <div className="cust-tp-pera-card-section">
                  <div className="grid md:grid-cols-12 grid-cols-6 gap-4">
                    {squads.map((squad:any, index:number) => (
                    <div key={index} className="col-span-3 cust-tp-pera-card text-center py-4 px-2 rounded-md border-[1px] border-[##E2E2E2]">
                      <Link href={"/player/"+squad?.title+"/"+squad?.pid}>
                        <div className="relative">
                        <PlayerImage  key={squad?.pid} player_id={squad?.pid} height={65} width={65} className="w-16 h-16 mx-auto rounded-full mb-2" />
                        
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800">
                        {squad?.title}
                        </h3>
                        <p className="text-xs text-gray-600">{squad?.playing_role === 'bowl' ? "Bowler" : squad?.playing_role === 'bat' ? "batsman" :squad?.playing_role === 'wk' ? "Wicket Kiper" :  "All-Rounder"}</p>
                      </Link>
                    </div>
                    ))}
                                       
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                        Overall Team {teamName.charAt(0).toUpperCase() + teamName.slice(1)}
                      </h3>
                    </div>
                    <Link href="#">
                      <div className="md:font-semibold flex items-center justify-center md:text-[13px] text-[12px]">
                      
                        Last updated on&nbsp;{format(new Date(),"dd MMMM yyyy" )}
                      </div>
                    </Link>
                  </div>
                  <div className="border-t border-[#E4E9F0] mb-3" />
                  <div className="grid grid-cols-12 gap-4 justify-between">
                    <div className="w-full md:col-span-3 col-span-6 pr-3 border-r-[1px]">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[#909090]">Match Played</p>
                        <p className="font-semibold text-[black]">{total_match}</p>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[#909090]">Match Won</p>
                        <p className="font-semibold text-[#09BAB5]">{win_match}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[#909090]">Match Lost</p>
                        <p className="font-semibold text-[#FF4442]">{loss_match}</p>
                      </div>
                    </div>
                    <div className="w-full md:col-span-4 col-span-6 pr-3 md:border-r-[1px]">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[#909090]">Match Tied</p>
                        <p className="font-semibold text-[black]">{tie_match}</p>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[#909090]">No Result</p>
                        <p className="font-semibold text-[black]">{nr_match}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[#909090]">Win Percentage</p>
                        <p className="font-semibold text-[#09BAB5]">{win_per_match.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className="w-full flex bg-[#C2D7EF] rounded-lg md:col-span-5 col-span-12">
                      <div className="bg-[#6682A3] flex items-center rounded-l-lg text-white font-semibold p-2">
                        <p>Debut Match</p>
                      </div>
                      <div className="p-2 ">
                        <p className="font-semibold">
                          Vs&nbsp;ENG&nbsp;on&nbsp;Jun 25,
                          1932&nbsp;at&nbsp;Lords..
                        </p>
                        <p className="text-[11px]">
                          England beat India by 158 runs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                        Top performers for Cricket Team India
                      </h3>
                    </div>
                  </div>
                  <div className="border-t border-[#E4E9F0] mb-3" />
                  <div className="cust-box-click-container">
                    <div className="mb-2">
                      <div className="flex gap-[10px] overflow-auto items-center">
                        <button
                          // className="cust-box-click-button font-medium px-5 py-1 rounded-full bg-[#081736] text-white"
                          // onclick="showCustomBox(this, 'cust-box-click-batters')"
                          onClick={() =>
                            handleBatterTabClick("cust-box-click-batters")
                          }
                          className={`cust-box-click-button font-medium px-5 py-1 ${
                            batterTab === "cust-box-click-batters"
                              ? "bg-[#081736] text-white"
                              : "bg-[#ffffff]  text-[#6A7586]"
                          } rounded-full`}
                        >
                          <span>Batters</span>
                        </button>

                        <button
                          // className="cust-box-click-button  font-medium px-5 py-1 bg-[#ffffff]  text-[#6A7586]  rounded-full"
                          // onclick="showCustomBox(this, 'cust-box-click-bowlers')"
                          onClick={() =>
                            handleBatterTabClick("cust-box-click-bowlers")
                          }
                          className={`cust-box-click-button font-medium px-5 py-1 ${
                            batterTab === "cust-box-click-bowlers"
                              ? "bg-[#081736] text-white"
                              : "bg-[#ffffff]  text-[#6A7586]"
                          } rounded-full`}
                        >
                          <span>Bowlers</span>
                        </button>
                      </div>
                    </div>
                    <div
                      className={`cust-box-click-content cust-box-click-batters mt-4 ${
                        batterTab === "cust-box-click-batters" ? "" : "hidden"
                      }`}
                    >
                      <div className="">
                        {/* Player 1 */}
                        <div className="flex items-center justify-between bg-white border-[1px] rounded-lg px-3 py-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-1xl font-bold text-gray-700 ">
                              01
                            </div>

                            <Image
                              src="/assets/img/player/default.png"
                              width={40}
                              height={40}
                              alt="Sachin Tendulkar"
                              className="rounded-full w-10 h-10"
                            />
                            <Link href="/player/playername/overview">
                              <h3 className="text-1xl font-semibold text-gray-800">
                                Sachin Tendulkar
                              </h3>
                            </Link>
                          </div>
                          <div className="">
                            <div className="flex mt-2 text-sm text-gray-500">
                              <div className="md:px-4 px-2 border-r-[1px] border-l-[1px] text-center">
                                <p className="text-[#18A6ED] font-bold">200</p>
                                <p>Matches</p>
                              </div>
                              <div className="md:px-4 px-2 text-center">
                                <p className="text-[#18A6ED] font-bold">
                                  15698
                                </p>
                                <p>Runs</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white border-[1px] rounded-lg px-3 py-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-1xl font-bold text-gray-700 ">
                              02
                            </div>
                            <Image
                              src="/assets/img/player/default.png"
                              width={40}
                              height={40}
                              alt="Sachin Tendulkar"
                              className="rounded-full w-10 h-10"
                            />
                            <Link href="/player/playername/overview">
                              <h3 className="text-1xl font-semibold text-gray-800">
                                Rahul Dravid
                              </h3>
                            </Link>
                          </div>
                          <div className="">
                            <div className="flex mt-2 text-sm text-gray-500">
                              <div className="md:px-4 px-2 border-r-[1px] border-l-[1px] text-center">
                                <p className="text-[#18A6ED] font-bold">200</p>
                                <p>Matches</p>
                              </div>
                              <div className="md:px-4 px-2 text-center">
                                <p className="text-[#18A6ED] font-bold">
                                  15698
                                </p>
                                <p>Runs</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white border-[1px] rounded-lg px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="text-1xl font-bold text-gray-700 ">
                              02
                            </div>
                            <Image
                              src="/assets/img/player/default.png"
                              width={40}
                              height={40}
                              alt="Sachin Tendulkar"
                              className="rounded-full w-10 h-10"
                            />
                            <Link href="/player/playername/overview">
                              <h3 className="text-1xl font-semibold text-gray-800">
                                Sunil Gavaskar
                              </h3>
                            </Link>
                          </div>
                          <div className="">
                            <div className="flex mt-2 text-sm text-gray-500">
                              <div className="md:px-4 px-2 border-r-[1px] border-l-[1px] text-center">
                                <p className="text-[#18A6ED] font-bold">200</p>
                                <p>Matches</p>
                              </div>
                              <div className="md:px-4 px-2 text-center">
                                <p className="text-[#18A6ED] font-bold">
                                  15698
                                </p>
                                <p>Runs</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`cust-box-click-content cust-box-click-batters mt-4 ${
                        batterTab === "cust-box-click-bowlers" ? "" : "hidden"
                      }`}
                    >
                      dfghj
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                        Team India Best Scores/Figures in an Inning
                      </h3>
                    </div>
                  </div>
                  <div className="border-t border-[#E4E9F0] mb-3" />
                  <div className="cust-box-click-container">
                    <div className="mb-2">
                      <div className="flex gap-[10px] overflow-auto items-center">
                        <button
                          // className="cust-box-click-button font-medium px-5 py-1 rounded-full bg-[#081736] text-white"
                          // onclick="showCustomBox(this, 'cust-box-click-bowlers1')"
                          onClick={() =>
                            handleBatter1TabClick("cust-box-click-batters1")
                          }
                          className={`cust-box-click-button font-medium px-5 py-1 ${
                            batter1Tab === "cust-box-click-batters1"
                              ? "bg-[#081736] text-white"
                              : "bg-[#ffffff]  text-[#6A7586]"
                          } rounded-full`}
                        >
                          <span>Bowlers</span>
                        </button>
                        <button
                          onClick={() =>
                            handleBatter1TabClick("cust-box-click-bowlers1")
                          }
                          className={`cust-box-click-button font-medium px-5 py-1 ${
                            batter1Tab === "cust-box-click-bowlers1"
                              ? "bg-[#081736] text-white"
                              : "bg-[#ffffff]  text-[#6A7586]"
                          } rounded-full`}
                          // className="cust-box-click-button bg-[#ffffff] font-medium text-[#6A7586] px-5 py-1 rounded-full"
                          // onclick="showCustomBox(this, 'cust-box-click-batters1')"
                        >
                          <span>Batters</span>
                        </button>
                      </div>
                    </div>
                    <div
                      className={`cust-box-click-content cust-box-click-bowlers1 mt-4 ${
                        batter1Tab === "cust-box-click-batters1" ? "" : "hidden"
                      }`}
                    >
                      <div className="">
                        {/* Player 1 */}
                        <div className="flex items-center justify-between bg-white border-[1px] rounded-lg px-3 py-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-1xl font-bold text-gray-700 ">
                              01
                            </div>
                            <Image
                              src="/assets/img/player/default.png"
                              width={40}
                              height={40}
                              alt="Sachin Tendulkar"
                              className="rounded-full w-10 h-10"
                            />
                            <Link href="/player/playername/overview">
                              <h3 className="text-1xl font-semibold text-gray-800">
                                Anil Kumble
                              </h3>
                            </Link>
                          </div>
                          <div className="">
                            <div className="flex mt-2 text-sm text-gray-500">
                              <div className="md:px-4 px-2 border-r-[1px] border-l-[1px] text-center">
                                <p className="text-[#18A6ED] font-bold">
                                  10/74
                                </p>
                                <p>Wicket</p>
                              </div>

                              <div className="md:px-4 px-2 text-center">
                                <p>Against</p>
                                <Link href="/team/india/test">
                                  <div className="flex items-center space-x-1">
                                    <Image
                                      src="/assets/img/flag/16.png"
                                      className="h-[15px] rounded-full"
                                      width={15}
                                      height={15}
                                      alt="aus"
                                    />
                                    <span className="text-[black] font-medium">
                                      Pak
                                    </span>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white border-[1px] rounded-lg px-3 py-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-1xl font-bold text-gray-700 ">
                              02
                            </div>
                            <Image
                              src="/assets/img/player/default.png"
                              width={40}
                              height={40}
                              alt="Sachin Tendulkar"
                              className="rounded-full w-10 h-10"
                            />
                            <Link href="/player/playername/overview">
                              <h3 className="text-1xl font-semibold text-gray-800">
                                Jasubhai Patel
                              </h3>
                            </Link>
                          </div>
                          <div className="">
                            <div className="flex mt-2 text-sm text-gray-500">
                              <div className="md:px-4 px-2 border-r-[1px] border-l-[1px] text-center">
                                <p className="text-[#18A6ED] font-bold">9/69</p>
                                <p>Wicket</p>
                              </div>
                              <div className="md:px-4 px-2 text-center">
                                <p>Against</p>
                                <Link href="/team/india/test">
                                  <div className="flex items-center space-x-1">
                                    <Image
                                      src="/assets/img/flag/12.png"
                                      className="h-[15px] rounded-full"
                                      width={15}
                                      height={15}
                                      alt="aus"
                                    />
                                    <span className="text-[black] font-medium">
                                      Aus
                                    </span>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white border-[1px] rounded-lg px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="text-1xl font-bold text-gray-700 ">
                              03
                            </div>
                            <Image
                              src="/assets/img/player/default.png"
                              width={40}
                              height={40}
                              alt="Sachin Tendulkar"
                              className="rounded-full w-10 h-10"
                            />
                            <Link href="/player/playername/overview">
                              <h3 className="text-1xl font-semibold text-gray-800">
                                Kapil Dev
                              </h3>
                            </Link>
                          </div>
                          <div className="">
                            <div className="flex mt-2 text-sm text-gray-500">
                              <div className="md:px-4 px-2 border-r-[1px] border-l-[1px] text-center">
                                <p className="text-[#18A6ED] font-bold">9/83</p>
                                <p>Wicket</p>
                              </div>
                              <div className="md:px-4 px-2 text-center">
                                <p>Against</p>
                                <Link href="/team/india/test">
                                  <div className="flex items-center space-x-1">
                                    <Image
                                      src="/assets/img/flag/b-2.png"
                                      className="h-[15px] rounded-full"
                                      width={15}
                                      height={15}
                                      alt="aus"
                                    />
                                    <span className="text-[black] font-medium">
                                      WI
                                    </span>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`cust-box-click-content cust-box-click-bowlers1 mt-4 ${
                        batter1Tab === "cust-box-click-bowlers1" ? "" : "hidden"
                      }`}
                    >
                      dfghj
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg bg-[#ffffff] p-4">
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                        IND&nbsp;win % against Cricket Teams
                      </h3>
                    </div>
                  </div>
                  <div className="border-t border-[#E4E9F0] mb-3" />
                  <div className="grid md:grid-cols-5 grid-cols-2 gap-4 justify-between">
                    {/* Afghanistan */}
                    <div className="flex items-center gap-2 rounded-lg border-[1px] px-3 py-2">
                      <div className="relative w-[50px] h-[50px]">
                        <svg
                          className="absolute top-0 left-0 w-full h-full"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-gray-300"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                          />
                          <path
                            className="text-blue-500"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 1 1 0 31.831
                              a 15.9155 15.9155 0 1 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                            strokeDasharray="100, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold">100%</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#909090]">win%</span>
                        <span className=" font-medium">Afg</span>
                      </div>
                    </div>
                    {/* Australia */}
                    <div className="flex items-center gap-2 rounded-lg border-[1px] px-3 py-2">
                      <div className="relative w-[50px] h-[50px]">
                        <svg
                          className="absolute top-0 left-0 w-full h-full"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-gray-300"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                          />
                          <path
                            className="text-blue-500"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 1 1 0 31.831
                              a 15.9155 15.9155 0 1 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                            strokeDasharray="30, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold">30%</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#909090]">win%</span>
                        <span className=" font-medium">Aus</span>
                      </div>
                    </div>
                    {/* Bangladesh */}
                    <div className="flex items-center gap-2 rounded-lg border-[1px] px-3 py-2">
                      <div className="relative w-[50px] h-[50px]">
                        <svg
                          className="absolute top-0 left-0 w-full h-full"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-gray-300"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                          />
                          <path
                            className="text-blue-500"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 1 1 0 31.831
                              a 15.9155 15.9155 0 1 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                            strokeDasharray="87, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold">87%</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#909090]">win%</span>
                        <span className=" font-medium">Ban</span>
                      </div>
                    </div>
                    {/* England */}
                    <div className="flex items-center gap-2 rounded-lg border-[1px] px-3 py-2">
                      <div className="relative w-[50px] h-[50px]">
                        <svg
                          className="absolute top-0 left-0 w-full h-full"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-gray-300"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                          />
                          <path
                            className="text-blue-500"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 1 1 0 31.831
                              a 15.9155 15.9155 0 1 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                            strokeDasharray="27, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold">27%</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#909090]">win%</span>
                        <span className=" font-medium">Eng</span>
                      </div>
                    </div>
                    {/* Pakistan */}
                    <div className="flex items-center gap-2 rounded-lg border-[1px] px-3 py-2">
                      <div className="relative w-[50px] h-[50px]">
                        <svg
                          className="absolute top-0 left-0 w-full h-full"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-gray-300"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                          />
                          <path
                            className="text-blue-500"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 1 1 0 31.831
                              a 15.9155 15.9155 0 1 1 0 -31.831"
                            fill="none"
                            strokeWidth={2}
                            stroke="currentColor"
                            strokeDasharray="34, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold">34%</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#909090]">win%</span>
                        <span className=" font-medium">Pak</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-4">
                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                        Team India Best Scores/Figures in an Inning
                      </h3>
                    </div>
                    <Link href="#">
                      <div className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] underline">
                        View More{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3 ml-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                  <div className="border-t border-[#E4E9F0] mb-3" />
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                        <thead className="bg-blue-50 text-gray-700 ">
                          <tr>
                            <th className="px-4 py-3 font-medium">Team</th>
                            <th className="px-3 py-3 font-medium">PLD</th>
                            <th className="px-3 py-3 font-medium">W</th>
                            <th className="px-3 py-3 font-medium">L</th>
                            <th className="px-3 py-3 font-medium">T</th>
                            <th className="px-3 py-3 font-medium">W%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="md:px-2 py-3 text-[#217AF7] md:w-[260px]">
                              <Link href="#" style={{ cursor: "pointer" }}>
                                1932
                              </Link>
                            </td>
                            <td className="px-3 py-3">5</td>
                            <td className="px-3 py-3">5</td>
                            <td className="px-3 py-3">123</td>
                            <td className="px-3 py-3">45.50</td>
                            <td className="px-3 py-3">9</td>
                          </tr>
                          <tr>
                            <td className="md:px-2 py-3 text-[#217AF7]">
                              <Link href="#" style={{ cursor: "pointer" }}>
                                1933
                              </Link>
                            </td>
                            <td className="px-3 py-3">5</td>
                            <td className="px-3 py-3">5</td>
                            <td className="px-3 py-3">123</td>
                            <td className="px-3 py-3">45.50</td>
                            <td className="px-3 py-3">9</td>
                          </tr>
                          <tr>
                            <td className="md:px-2 py-3 text-[#217AF7]">
                              <Link href="#" style={{ cursor: "pointer" }}>
                                1934
                              </Link>
                            </td>
                            <td className="px-3 py-3">5</td>
                            <td className="px-3 py-3">5</td>
                            <td className="px-3 py-3">123</td>
                            <td className="px-3 py-3">45.50</td>
                            <td className="px-3 py-3">9</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                        Most viewed Cricket Teams
                      </h3>
                    </div>
                  </div>
                  <div className="border-t border-[#E4E9F0] mb-3" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Card */}
                    <Link href="/team/india/test">
                      <div className="border-[1px] border-[##E2E2E2] rounded-md py-4 px-2 flex flex-col items-center">
                        <Image
                          src="/assets/img/flag/b-1.png"
                          width={40}
                          height={40}
                          alt="Pakistan-W"
                          className="h-[42px] mb-2"
                        />
                        <p className="font-medium">Pakistan-W</p>
                      </div>
                      {/* Card */}
                    </Link>
                    <Link href="/team/india/test">
                      <div className="border-[1px] border-[##E2E2E2] rounded-md py-4 px-2 flex flex-col items-center">
                        <Image
                          src="/assets/img/flag/b-2.png"
                          width={40}
                          height={40}
                          alt="West Indies-W"
                          className="h-[42px] mb-2"
                        />
                        <p className="font-medium">West Indies-W</p>
                      </div>
                    </Link>
                    {/* Card */}
                    <Link href="/team/india/test">
                      <div className="border-[1px] border-[##E2E2E2] rounded-md py-4 px-2 flex flex-col items-center">
                        <Image
                          src="/assets/img/flag/b-3.png"
                          width={40}
                          height={40}
                          alt="Australia-W"
                          className="h-[42px] mb-2"
                        />
                        <p className="font-medium">Australia-W</p>
                      </div>
                    </Link>
                    {/* Card */}
                    <Link href="/team/india/test">
                      <div className="border-[1px] border-[##E2E2E2] rounded-md py-4 px-2 flex flex-col items-center">
                        <Image
                          src="/assets/img/flag/b-4.png"
                          width={40}
                          height={40}
                          alt="Scotland-W"
                          className="h-[42px] mb-2"
                        />
                        <p className="font-medium">Scotland-W</p>
                      </div>
                    </Link>
                    {/* Card */}
                    <Link href="/team/india/test">
                      <div className="border-[1px] border-[##E2E2E2] rounded-md py-4 px-2 flex flex-col items-center">
                        <Image
                          src="/assets/img/flag/b-5.png"
                          width={40}
                          height={40}
                          alt="South Africa-W"
                          className="h-[42px] mb-2"
                        />
                        <p className="font-medium">South Africa-W</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 md:col-span-7">
          {/* <div className="rounded-lg bg-[#ffffff] my-4 p-4"> */}
          <div className="upcomingMatch">
            {upcomingMatch?.map((ucmatch: any) => (
              <div key={ucmatch.match_id}>
                <div className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="flex items-center text-[#A45B09] rounded-full pr-3  font-semibold"
                        style={{ gap: "3px" }}
                      >
                        <span className="rounded-full">●</span>{" "}
                        {ucmatch.status_str}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                          {ucmatch.competition.title} -{" "}
                          {ucmatch.competition.season}
                        </h4>
                      </div>
                    </div>
                    <div className="items-center space-x-2 hidden">
                      <span className="text-[13px] font-medium">AUS</span>
                      <span className="flex items-center bg-[#FAFFFC] border-[1px] border-[#0B773C] rounded-full text-[#0B773C] pr-2">
                        <span className="">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-[14px] w-[17px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                            />
                          </svg>
                        </span>
                        41
                      </span>
                      <span className="flex items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B]  rounded-full text-[#A70B0B] pr-2">
                        <span className="">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-[14px] w-[17px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                            />
                          </svg>
                        </span>
                        45
                      </span>
                    </div>
                  </div>

                  <div className="border-t-[1px] border-[#E7F2F4]"></div>
                  <Link
                    href={
                      "/moreinfo/" +
                      urlStringEncode(
                        ucmatch?.teama?.short_name +
                          "-vs-" +
                          ucmatch?.teamb?.short_name +
                          "-match-" +
                          ucmatch?.match_number +
                          "-" +
                          ucmatch?.competition?.title
                      ) +
                      "/" +
                      ucmatch.match_id
                    }
                  >
                    <div className="py-4 px-3">
                      <div className="flex justify-between items-center text-[14px]">
                        <div className="">
                          <p className="text-[#586577] text-[12px] mb-4 font-medium">
                            {ucmatch.subtitle} ,{ucmatch.format_str} 
                            {ucmatch.venue.name}, {ucmatch.venue.location}
                          </p>
                          <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                            <div className="flex items-center space-x-2">
                              <Image
                                loading="lazy"
                                src={ucmatch.teama.logo_url}
                                className="h-[30px] rounded-full"
                                width={30}
                                height={30}
                                alt={ucmatch.teama.short_name}
                              />
                              <span className="font-semibold">
                                {ucmatch.teama.short_name}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                              <div className="flex items-center space-x-2">
                                <Image
                                  loading="lazy"
                                  src={ucmatch.teamb.logo_url}
                                  className="h-[30px]"
                                  width={30}
                                  height={30}
                                  alt={ucmatch.teamb.short_name}
                                />
                                <span className="font-semibold">
                                  {ucmatch.teamb.short_name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="font-semibold text-center">
                          <div className="text-[#144280]">
                            <div className=" font-medium text-center">
                              {isSameDay(
                                new Date(),
                                new Date(ucmatch.date_start_ist)
                              ) ? (
                                <CountdownTimer
                                  targetTime={ucmatch.date_start_ist}
                                />
                              ) : (
                                <p className="text-[#2F335C] text-[14px]">
                                  {format(
                                    new Date(ucmatch.date_start_ist),
                                    "dd MMMM - EEEE"
                                  )}
                                  , <br />
                                  {format(
                                    new Date(ucmatch.date_start_ist),
                                    "hh:mm:aa"
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="border-t-[1px] border-[#E7F2F4]"></div>

                  <div className="flex items-center justify-between space-x-5 mt-3">
                    <div className="flex items-center">
                      <Link
                        href={
                          "/points-table/" +
                          urlStringEncode(
                            ucmatch?.teama?.short_name +
                              "-vs-" +
                              ucmatch?.teamb?.short_name +
                              "-match-" +
                              ucmatch?.match_number +
                              "-" +
                              ucmatch?.competition?.title
                          ) +
                          "/" +
                          ucmatch.match_id
                        }
                      >
                        <p className=" text-[#909090] font-medium">
                          {" "}
                          Points Table
                        </p>
                      </Link>
                      <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                      <Link href="#">
                        <p className="text-[#909090] font-medium">Schedule</p>
                      </Link>
                    </div>

                    <Link href="#">
                      <div className="flex mt-2 justify-end items-center space-x-2">
                        <Image
                          loading="lazy"
                          src="/assets/img/home/handshake.png"
                          width={30}
                          height={30}
                          alt=""
                        />
                        <span className="text-[#909090] font-medium">H2H</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Mobile */}
                <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="flex items-center text-[#A45B09] rounded-full font-semibold"
                        style={{ gap: "3px" }}
                      >
                        <span className="rounded-full">●</span>{" "}
                        {ucmatch.status_str}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                          {ucmatch.competition.title} -{" "}
                          {ucmatch.competition.season}
                        </h4>
                      </div>
                      <span className="absolute right-[12px] top-[19px]">
                        <button className="arro-button">
                          <Image
                            loading="lazy"
                            src="/assets/img/arrow.png"
                            className=""
                            width={10}
                            height={15}
                            alt=""
                          />
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className="border-t-[1px] border-[#E7F2F4]"></div>
                  <Link
                    href={
                      "/moreinfo/" +
                      urlStringEncode(
                        ucmatch?.teama?.short_name +
                          "-vs-" +
                          ucmatch?.teamb?.short_name +
                          "-match-" +
                          ucmatch?.match_number +
                          "-" +
                          ucmatch?.competition?.title
                      ) +
                      "/" +
                      ucmatch.match_id
                    }
                  >
                    <div className="open-Performance-data">
                      <div className="py-2 pb-3">
                        <p className="text-[#586577] text-[12px] mb-4 font-medium">
                          {ucmatch.subtitle} ,{ucmatch.format_str} 
                          {ucmatch.venue.name}, {ucmatch.venue.location}
                        </p>
                        <div className="flex justify-between items-center text-[14px]">
                          <div>
                            <div className="items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                              <div className="flex items-center space-x-2">
                                <Image
                                  loading="lazy"
                                  src={ucmatch.teama.logo_url}
                                  className="h-[30px] rounded-full"
                                  width={30}
                                  height={30}
                                  alt={ucmatch.teama.short_name}
                                />
                                <div>
                                  <span className="flex items-center gap-1">
                                    <span className="text-[#5e5e5e] font-medium">
                                      {ucmatch.teama.short_name}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                              <div className="flex items-center space-x-2">
                                <Image
                                  loading="lazy"
                                  src={ucmatch.teamb.logo_url}
                                  className="h-[30px] rounded-full"
                                  width={30}
                                  height={30}
                                  alt={ucmatch.teamb.short_name}
                                />
                                <div>
                                  <span className="flex items-center gap-1">
                                    <span className="text-[#5e5e5e] font-medium">
                                      {ucmatch.teamb.short_name}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="font-semibold  text-center">
                            {isSameDay(
                              new Date(),
                              new Date(ucmatch.date_start_ist)
                            ) ? (
                              <CountdownTimer
                                targetTime={ucmatch.date_start_ist}
                              />
                            ) : (
                              <p className="text-[#2F335C] text-[14px]">
                                {format(
                                  new Date(ucmatch.date_start_ist),
                                  "dd MMMM - EEEE"
                                )}
                                , <br />
                                {format(
                                  new Date(ucmatch.date_start_ist),
                                  "hh:mm:aa"
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="border-t-[1px] border-[#E7F2F4]"></div>

                  <div className="flex items-center justify-between space-x-5 mt-2">
                    <div className="flex items-center">
                      <Link
                        href={
                          "/points-table/" +
                          urlStringEncode(
                            ucmatch?.teama?.short_name +
                              "-vs-" +
                              ucmatch?.teamb?.short_name +
                              "-match-" +
                              ucmatch?.match_number +
                              "-" +
                              ucmatch?.competition?.title
                          ) +
                          "/" +
                          ucmatch.match_id
                        }
                      >
                        <p className="text-[#909090] text-[11px] font-medium">
                          Points Table
                        </p>
                      </Link>
                      <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                      <Link href="#">
                        <div className="flex justify-end items-center space-x-2">
                          <Image
                            loading="lazy"
                            src="/assets/img/home/handshake.png"
                            className="h-[15px]"
                            width={30}
                            height={30}
                            alt=""
                          />
                          <span className="text-[#909090] text-[11px] font-medium">
                            H2H
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="hidden items-center space-x-2 text-[11px]">
                      <span className="text-[#909090] font-medium">BAN</span>
                      <span className="flex items-center bg-[#FAFFFC] border-[1px] border-[#0B773C] rounded-md text-[#0B773C] pr-2">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-[14px] w-[17px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                            ></path>
                          </svg>
                        </span>
                        41
                      </span>
                      <span className="flex items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B] rounded-md text-[#A70B0B] pr-2">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-[14px] w-[17px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                            ></path>
                          </svg>
                        </span>
                        45
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* </div> */}
          </div>
        </div>
        <div className="lg:col-span-8 md:col-span-7">
          <div className="rounded-lg bg-[#ffffff] my-4 p-4">
            <div>
              <h3 className="text-[15px] font-semibold  pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                Recent Team Performance{" "}
                <span className="text-[#909090]"> (Last 5 match) </span>
              </h3>
              <div className="border-t-[1px] border-[#E4E9F0]" />
              <div className="md:px-2">
                <div className="performance-section">
                  <div className="flex items-center justify-between my-3">
                    <Link href="">
                      <div className="flex items-center space-x-3">
                        <div>
                          <Image
                            loading="lazy"
                            src={teamDetails?.logo_url}
                            className="h-[25px]"
                            width={25}
                            height={20}
                            alt={teamDetails?.alt_name}
                          />
                        </div>
                        <h3 className="text-1xl font-medium">
                          {teamDetails?.title}
                        </h3>
                      </div>
                    </Link>
                    <div>
                      <div className="ml-auto flex gap-1 items-center">
                        {matchData?.map(
                          (items: {
                            winning_team_id: number;
                            match_id: number;
                          }) =>
                            items.winning_team_id == teama_id ? (
                              <span
                                key={items.match_id}
                                className="bg-[#13b76dbd] text-white text-[13px] px-[6px] py-[3px] rounded"
                              >
                                W
                              </span>
                            ) : (
                              <span
                                key={items.match_id}
                                className="bg-[#f63636c2] text-white text-[13px] px-[7px] py-[3px] rounded"
                              >
                                L
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t-[1px] border-[#E4E9F0]" />

                  <div className="md:px-3 open-Performance-data">
                    {/* full screen teame data */}
                    <div className="overflow-x-auto lg:block hidden">
                      <table className="w-full text-left rtl:text-right">
                        <tbody>
                          {matchData?.map((items: any, index: number) => (
                            <tr
                              className="whitespace-nowrap bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-[13px]"
                              key={index}
                            >
                              <td className="px-4 pl-0 py-1 ">
                                <Link href="#">
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <div className="flex items-center space-x-1">
                                      <Image
                                        loading="lazy"
                                        src={items.teama.logo_url}
                                        className="h-[24px] rounded-full"
                                        width={25}
                                        height={25}
                                        alt={items.teama.short_name}
                                      />
                                      <span className="text-[#909090]">
                                        {items.teama.short_name}
                                      </span>
                                    </div>
                                    <p>{items.teama.scores}</p>
                                  </div>
                                </Link>
                              </td>
                              <td className="md:px-4 py-2 font-medium text-[#6A7586]">
                                VS
                              </td>
                              <td className="md:px-4 py-2">
                                <Link href="#">
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <p>{items.teamb.scores}</p>
                                    <div className="flex items-center space-x-1">
                                      <span className="text-[#909090]">
                                        {items.teamb.short_name}
                                      </span>
                                      <Image
                                        loading="lazy"
                                        src={items.teamb.logo_url}
                                        className="h-[24px]"
                                        width={25}
                                        height={25}
                                        alt={items.teamb.short_name}
                                      />
                                    </div>
                                  </div>
                                </Link>
                              </td>
                              <td className="md:px-4 py-2">
                                <div className="text-right leading-6">
                                  <p className="font-medium">
                                    {items.subtitle}
                                  </p>
                                  <p className="text-[#909090] font-normal">
                                    {items.short_title}
                                  </p>
                                </div>
                              </td>
                              <td className="px-0 pr-0 py-1 text-[#2F335C]">
                                <div className="text-center">
                                  {items.winning_team_id == teama_id ? (
                                    <span className="bg-[#13b76dbd] text-white text-[13px] px-[6px] py-[3px] rounded">
                                      W
                                    </span>
                                  ) : (
                                    <span className="bg-[#f63636c2] text-white text-[13px] px-[7px] py-[3px] rounded">
                                      L
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* responsive teame data  */}
                    <div className="lg:hidden block">
                      {matchData?.map((items: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-4 px-2 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]"
                        >
                          <div className="">
                            <Link href="#">
                              <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-3">
                                <div className="flex items-center space-x-1">
                                  <Image
                                    loading="lazy"
                                    src={items.teama.logo_url}
                                    className="h-[18px] rounded-full"
                                    width={25}
                                    height={25}
                                    alt={items.teama.short_name}
                                  />
                                  <span className="text-[#909090]">
                                    {items.teama.short_name}
                                  </span>
                                </div>
                                <p>{items.teama.scores}</p>
                              </div>
                            </Link>

                            <div>
                              <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                <div className="flex items-center space-x-1">
                                  <Image
                                    loading="lazy"
                                    src={items.teamb.logo_url}
                                    className="h-[18px]"
                                    width={25}
                                    height={25}
                                    alt={items.teamb.short_name}
                                  />
                                  <span className="text-[#909090]">
                                    {items.teamb.short_name}
                                  </span>
                                </div>
                                <p>{items.teamb.scores}</p>
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:block h-[35px] border-l-[1px] border-[#d0d3d7]"></div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right leading-6">
                              <p className="font-medium">{items.subtitle}</p>
                              <p className="text-[#909090] font-normal">
                                {items.short_title}
                              </p>
                            </div>
                            <div>
                              <div className="text-center">
                                {items.winning_team_id == teama_id ? (
                                  <span className="bg-[#13b76dbd] text-white text-[13px] px-[6px] py-[3px] rounded">
                                    W
                                  </span>
                                ) : (
                                  <span className="bg-[#f63636c2] text-white text-[13px] px-[7px] py-[3px] rounded">
                                    L
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

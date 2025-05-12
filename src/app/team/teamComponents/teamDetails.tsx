"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Banner from "./Banner";
import Image from "next/image";
import { urlStringEncode } from "../../../utils/utility";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "@/app/components/countdownTimer";
import PlayerImage from "@/app/components/PlayerImage";
import SeriesListNews from "@/app/series/seriesComponents/SeriesListNews";
import PLSeries from "@/app/components/popularSeries";

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
  const teamData = teamPlayers?.[0]?.team;
  const teamType = params?.teamType ? params?.teamType : captains?.[0]?.format_str ?? 'odi';
  const teamCaptains = captains.filter((captain: { format_str: string; }) => captain.format_str === teamType);
  const squads = teamPlayers?.[0]?.players?.[teamType];
  const coach = teamData?.head_coach;
  // console.log("captain", coach);

  let total_match = teamDetails?.total_match_odi;
  let win_match = teamDetails?.win_match_odi;
  let loss_match = teamDetails?.loss_match_odi;
  let tie_match = teamDetails?.tie_match_odi;
  let nr_match = teamDetails?.nr_match_odi;
  let win_per_match = teamDetails?.total_match_odi ? (teamDetails?.win_match_odi / teamDetails?.total_match_odi) * 100 : 0;
  let debut_match = teamDetails?.debut_match_odi;
  let debut_match_result = teamDetails?.debut_match_result_odi;
  if (teamType === "test") {
    total_match = teamDetails?.total_match_test;
    win_match = teamDetails?.win_match_test;
    loss_match = teamDetails?.loss_match_test;
    tie_match = teamDetails?.tie_match_test;
    nr_match = teamDetails?.nr_match_test;
    win_per_match = teamDetails?.total_match_test ? (teamDetails?.win_match_test / teamDetails?.total_match_test) * 100 : 0;
    debut_match = teamDetails?.debut_match_test;
    debut_match_result = teamDetails?.debut_match_result_test;
  } else if (teamType === "t20i") {
    total_match = teamDetails?.total_match_t20;
    win_match = teamDetails?.win_match_t20;
    loss_match = teamDetails?.loss_match_t20;
    tie_match = teamDetails?.tie_match_t20;
    nr_match = teamDetails?.nr_match_t20;
    win_per_match = teamDetails?.total_match_t20 ? (teamDetails?.win_match_t20 / teamDetails?.total_match_t20) * 100 : 0;
    debut_match = teamDetails?.debut_match_t20;
    debut_match_result = teamDetails?.debut_match_result_t20;
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

  const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});
  
    useEffect(() => {
      const getAllPlayerIds = () => {
        const allIds = [
          ...squads.map((item: { pid: any; }) => item.pid),
          ...teamCaptains.map((item: { pid: any; }) => item.pid),
        ];
        return [...new Set(allIds)]; // Deduplicate
      };
     
      const fetchPlayerUrls = async () => {
        const ids = getAllPlayerIds();
        if (ids.length === 0) return;
        const res = await fetch('/api/player-urls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`, },
          body: JSON.stringify({ ids }),
        });
        const data = await res.json();
        setPlayerUrls(data);
      };
  
      fetchPlayerUrls();
    }, [squads, teamCaptains]);
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 my-4 px-2 lg:px-0">
      <div className="md:grid grid-cols-12 gap-4">
      <div className="lg:col-span-8 md:col-span-7">
        <div className="lg:col-span-8 md:col-span-7">
          <Banner teamDetails={teamDetails} teamType={teamType} coach={coach} teamCaptains={teamCaptains}></Banner>

          {captains.length > 0 &&
            <div id="tabs" className="mb-4">
              <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                {captains.map((cap: any, index: number) => (
                  <Link href={"/team/" + teamName + "/" + teama_id + "/" + cap.format_str} key={index}>
                    <button className={`font-medium py-2 px-3 whitespace-nowrap ${teamType === cap.format_str ? "bg-[#1A80F8]  text-white" : ""} rounded-md`}>
                      {cap.format_str.toUpperCase()}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          }
          <div id="tab-content">
            <div id="test" className="">
              {teamCaptains.map((cap: any, index: number) => (
                <div
                  className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4"
                  key={index}
                >
                  {teamData?.head_coach !== '' &&
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <Image
                            src="/assets/img/player/default.png"
                            className="h-[40] rounded-full"
                            width={40}
                            height={40}
                            alt="R sharma (c)"
                          />
                        </div>
                        <div className="font-medium">
                          <h2 className="text-[15px]">
                            {" "}
                            {teamData?.head_coach.charAt(0).toUpperCase() +
                              teamData?.head_coach.slice(1)}{" "}
                            <span className="text-[#586577] text-[13px] font-medium">
                              (Coach)
                            </span>{" "}
                          </h2>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="bg-white rounded-lg p-4">
                    <Link
                      href={
                        "/player/" +
                        playerUrls[cap?.pid]
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <PlayerImage
                            key={cap?.pid}
                            player_id={cap?.pid}
                            height={40}
                            width={40}
                            className="rounded-full"
                          />
                        </div>
                        <div className="font-medium">
                          <h2 className="text-[15px] hover:text-[#1a80f8]">
                            {" "}
                            {cap?.title}{" "}
                            <span className="text-[#586577] text-[13px] font-medium">
                              (
                              {teamName.charAt(0).toUpperCase() +
                                teamName.slice(1)}
                              &nbsp;Captain)
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
                      {teamName.charAt(0).toUpperCase() + teamName.slice(1)}&nbsp;Squad
                    </h3>
                  </div>
                </div>
                <div className="border-t border-[#E4E9F0] mb-3" />
                <div className="cust-tp-pera-card-section">
                  <div className="grid md:grid-cols-12 grid-cols-6 gap-4">
                    {squads?.map((squad: any, index: number) => (
                      <div key={index} className="col-span-3 cust-tp-pera-card text-center py-4 px-2 rounded-md border-[1px] border-[##E2E2E2]">
                        <Link href={"/player/" + playerUrls[squad?.pid]}>
                          <div className="relative">
                            <PlayerImage key={squad?.pid} player_id={squad?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" />

                          </div>
                          <h3 className="text-sm font-semibold text-gray-800 hover:text-[#1a80f8]">
                            {squad?.title}
                          </h3>
                          <p className="text-xs text-gray-600">{squad?.playing_role === 'bowl' ? "Bowler" : squad?.playing_role === 'bat' ? "batsman" : squad?.playing_role === 'wk' ? "Wicket Kiper" : "All-Rounder"}</p>
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
                      <div className="md:font-medium flex items-center justify-center md:text-[13px] text-[12px]">

                        Last updated on&nbsp;{format(new Date(), "dd MMMM yyyy")}
                      </div>
                    </Link>
                  </div>
                  <div className="border-t border-[#E4E9F0] mb-3" />
                  <div className="grid grid-cols-12 gap-4 justify-between">
                    <div className="w-full md:col-span-3 col-span-6 pr-3 border-r-[1px]">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[#586577]">Match Played</p>
                        <p className="font-semibold text-[black]">{total_match}</p>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[#586577]">Match Won</p>
                        <p className="font-semibold text-[#09BAB5]">{win_match}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[#586577]">Match Lost</p>
                        <p className="font-semibold text-[#FF4442]">{loss_match}</p>
                      </div>
                    </div>
                    <div className="w-full md:col-span-4 col-span-6 pr-3 md:border-r-[1px]">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[#586577]">Match Tied</p>
                        <p className="font-semibold text-[black]">{tie_match}</p>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[#586577]">No Result</p>
                        <p className="font-semibold text-[black]">{nr_match}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[#586577]">Win Percentage</p>
                        <p className="font-semibold text-[#09BAB5]">{win_per_match?.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className="w-full flex bg-[#C2D7EF] rounded-lg md:col-span-5 col-span-12">
                      <div className="bg-[#6682A3] flex items-center rounded-l-lg text-white font-semibold p-2">
                        <p className="text-center">Debut Match</p>
                      </div>
                      <div className="p-2 ">
                        <p className="font-semibold">
                          {debut_match}
                        </p>
                        <p className="text-[11px]">
                          {debut_match_result}
                        </p>
                      </div>
                    </div>
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
                        className="flex items-center text-[13px] text-[#A45B09] rounded-full pr-3 uppercase font-semibold"
                        style={{ gap: "3px" }}
                      >
                        <div className="w-[8px] h-[8px] bg-[#A45B09] rounded-full animate-blink"></div>{" "}
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
                      <span className="text-[13px] font-medium text-[#1F2937]">AUS</span>
                      <span className="flex font-semibold items-center bg-[#FAFFFC] border-[1px] border-[#00a632] rounded-full text-[#00a632] pr-2">
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
                        0
                      </span>
                      <span className="flex font-semibold items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B]  rounded-full text-[#A70B0B] pr-2">
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
                        0
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
                        "-" +
                        ucmatch?.subtitle +
                        "-" +
                        ucmatch?.competition?.title
                      ) +
                      "/" +
                      ucmatch.match_id
                    }
                  >
                    <div className="py-3 px-3">
                      <div className="flex justify-between items-center text-[14px]">
                        <div className="w-[50%]">
                          <p className="text-[#586577] text-[13px] mb-4 font-medium">
                            {ucmatch.subtitle} ,{ucmatch.format_str}
                            {ucmatch.venue.name}, {ucmatch.venue.location}
                          </p>
                          <div className="flex items-center space-x-2 font-medium x md:w-full mb-4">
                            <div className="flex items-center space-x-2">
                              <Image
                                loading="lazy"
                                src={ucmatch.teama.logo_url}
                                className="h-[30px] w-[30px] rounded-full"
                                width={30}
                                height={30}
                                alt={ucmatch.teama.short_name}
                              />
                              <span className="font-semibold text-[14px]">
                                {ucmatch.teama.short_name}
                              </span>
                            </div>
                          </div>



                          <div>
                            <div className="flex items-center space-x-2 font-medium md:w-full">
                              <div className="flex items-center space-x-2">
                                <Image
                                  loading="lazy"
                                  src={ucmatch.teamb.logo_url}
                                  className="h-[30px] w-[30px]"
                                  width={30}
                                  height={30}
                                  alt={ucmatch.teamb.short_name}
                                />
                                <span className="font-semibold text-[14px]">
                                  {ucmatch.teamb.short_name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* <div className="h-[100px] border-l-[1px] border-[#efefef]"></div> */}

                        <div className="w-[50%] font-semibold text-center flex justify-end">
                          <div className="text-[#144280]">
                            <div className=" font-medium text-center">
                              {isSameDay(
                                new Date(),
                                new Date(ucmatch.date_start_ist)
                              ) ? (
                                <>
                                  <span className="text-[13px] font-normal text-[#a45b09]">Start in</span>

                                  <CountdownTimer
                                    targetTime={ucmatch.date_start_ist}
                                  />
                                </>
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
                            "-" +
                            ucmatch?.subtitle +
                            "-" +
                            ucmatch?.competition?.title
                          ) +
                          "/" +
                          ucmatch.match_id
                        }
                      >
                        <p className=" text-[#757A82] font-medium">
                          {" "}
                          Points Table
                        </p>
                      </Link>
                      <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                      <Link href="#">
                        <p className="text-[#757A82] font-medium">Schedule</p>
                      </Link>
                    </div>

                    <Link href={("/h2h/" + urlStringEncode(ucmatch?.teama?.name + "-vs-" + ucmatch?.teamb?.name) + "-head-to-head-in-" + ucmatch?.format_str).toLowerCase()}>
                      <div className="flex mt-2 justify-end items-center space-x-2">
                        <Image
                          loading="lazy"
                          src="/assets/img/home/handshake.png"
                          width={25}
                          height={25}
                          style={{ width: "25px", height: "25px" }}
                          alt=""
                        />
                        <span className="text-[#757A82] font-medium">H2H</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Mobile */}
                <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="flex text-[12px] items-center uppercase text-[#A45B09] rounded-full font-semibold"
                        style={{ gap: "2px" }}
                      >
                        <div className="w-[6px] h-[6px] bg-[#A45B09] rounded-full"></div>{" "}
                        {ucmatch.status_str}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
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
                        "-" +
                        ucmatch?.subtitle +
                        "-" +
                        ucmatch?.competition?.title
                      ) +
                      "/" +
                      ucmatch.match_id
                    }
                  >
                    <div className="open-Performance-data">
                      <div className="py-2 pb-3">
                        <p className="text-[#586577] text-[13px] mb-4 font-medium">
                          {ucmatch.subtitle} ,{ucmatch.format_str}
                          {ucmatch.venue.name}, {ucmatch.venue.location}
                        </p>
                        <div className="flex justify-between items-center text-[14px]">
                          <div className="w-[80%]">
                            <div className="items-center space-x-2 font-medium md:w-full mb-4">
                              <div className="flex items-center space-x-2">
                                <Image
                                  loading="lazy"
                                  src={ucmatch.teama.logo_url}
                                  className="h-[30px] w-[30px] rounded-full"
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
                            <div className="flex items-center space-x-2 font-medium md:w-full">
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

                          <div className="h-[100px] border-l-[1px] border-[#f2fafd]"></div>

                          <div className="w-[80%] font-semibold text-center">
                            {isSameDay(
                              new Date(),
                              new Date(ucmatch.date_start_ist)
                            ) ? (
                              <>
                              <span className="text-[13px] font-normal text-[#a45b09]">Start in</span>
                              <CountdownTimer
                                targetTime={ucmatch.date_start_ist}
                              />
                              </>
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
                            "-" +
                            ucmatch?.subtitle +
                            "-" +
                            ucmatch?.competition?.title
                          ) +
                          "/" +
                          ucmatch.match_id
                        }
                      >
                        <p className="text-[#909090] text-[13px] font-medium">
                          Points Table
                        </p>
                      </Link>
                      <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                      <Link href={("/h2h/" + urlStringEncode(ucmatch?.teama?.name + "-vs-" + ucmatch?.teamb?.name) + "-head-to-head-in-" + ucmatch?.format_str).toLowerCase()}>
                        <div className="flex justify-end items-center space-x-2">
                          <Image
                            loading="lazy"
                            src="/assets/img/home/handshake.png"
                            className="h-[15px]"
                            width={17}
                            height={17}
                            alt=""
                            style={{ width: "17px", height: "17px" }}
                          />
                          <span className="text-[#909090] text-[13px] font-medium">
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
                        0
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
                        0
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
                <span className="text-[#5C6081]"> (Last 5 match) </span>
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
                                className="bg-[#13B76D] text-white text-[13px] px-[6px] py-[3px] rounded w-[24px] text-center"
                              >
                                W
                              </span>
                            ) : (
                              <span
                                key={items.match_id}
                                className="bg-[#F63636] text-white text-[13px] px-[7px] py-[3px] rounded w-[24px] text-center"
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
                                      <span className="text-[#5C6081]">
                                        {items.teama.short_name}
                                      </span>
                                    </div>
                                    <p>{items.teama.scores}</p>
                                  </div>
                                </Link>
                              </td>
                              <td className="md:px-4 py-2 font-medium text-[#5C6081]">
                                VS
                              </td>
                              <td className="md:px-4 py-2">
                                <Link href="#">
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <p>{items.teamb.scores}</p>
                                    <div className="flex items-center space-x-1">
                                      <span className="text-[#5C6081]">
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
                                  <p className="text-[#5C6081] font-normal">
                                    {items.short_title}
                                  </p>
                                </div>
                              </td>
                              <td className="px-0 pr-0 py-1 text-[#2F335C]">
                                <div className="text-center">
                                  {items.winning_team_id == teama_id ? (
                                    <span className="bg-[#13B76D] text-white text-[13px] px-[6px] py-[3px] rounded w-[24px] text-center inline-block">
                                      W
                                    </span>
                                  ) : (
                                    <span className="bg-[#F63636] text-white text-[13px] px-[7px] py-[3px] rounded w-[24px] text-center inline-block">
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
        <div className="lg:col-span-4 md:col-span-5">
          <PLSeries />
          <SeriesListNews></SeriesListNews>
        </div>
      </div>
    </section>
  );
}

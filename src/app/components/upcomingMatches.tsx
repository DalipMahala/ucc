
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";
import {truncateText} from "@/utils/utility";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "./countdownTimer";
import PlayerImage from "./PlayerImage";

interface MatchItem {
    game_state_str: string;
    man_of_the_match: any;
    live_odds: any;
    man_of_the_match_pname: string;
    match_number: string;
    commentary: number;
    live: string;
    match_id: number;
    status_str: string;
    competition: {
      total_teams: number;
      cid: string;
      title: string;
      season: string;
    };
    teama: {
      name: string;
      short_name: string;
      logo_url: string;
      scores?: string;
      overs?: string;
      team_id?: string;
    };
    teamb: {
      name: string;
      short_name: string;
      logo_url: string;
      scores?: string;
      overs?: string;
      team_id?: string;
    };
    subtitle: string;
    format_str: string;
    venue: {
      name: string;
      location: string;
    };
    status_note: string;
    result: string;
    date_start_ist: string;
    match_info: any;
  
}

function updateStatusNoteDirect(matchInfo: any) {
    if (!matchInfo?.status_note) return;
    
    return matchInfo.status_note = matchInfo.status_note
      .replace(/^Stumps : /, '')
      .replace(new RegExp(matchInfo.teama.name, 'gi'), matchInfo.teama.short_name)
      .replace(new RegExp(matchInfo.teamb.name, 'gi'), matchInfo.teamb.short_name);
  }

export default async function UpcomingMatches() {
  let upcomingresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/upcomingMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let upcomingmatchArray = await upcomingresponse.json();

  const upcomingfilteredMatches = upcomingmatchArray?.data?.map(({ match_info, ...rest }: MatchItem) => ({
    ...match_info,
    ...rest
  }));
  let upcomingMatch: MatchItem[] = upcomingfilteredMatches;
  
  upcomingMatch = upcomingMatch?.filter((item: { commentary: number }) => Number(item.commentary) === 1);
  return (
                <React.Fragment>
                  <div>
                  {upcomingMatch?.map((ucmatch) => (
                      <div key={ucmatch.match_id}>
                        <div
                          className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div
                                className="flex items-center text-[12px] text-[#A45B09] rounded-full pr-3 uppercase font-semibold"
                                style={{ gap: "3px" }}
                              >
                                <div className="w-[8px] h-[8px] bg-[#A45B09] rounded-full animate-blink"></div>{" "}
                                {ucmatch.status_str}
                              </div>
                              <div>
                                <h4 className="text-[13px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                                  {ucmatch.competition.title} -{" "}
                                  {ucmatch.competition.season}
                                </h4>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                            <span className={"text-[11px] font-medium oddsTeam" + ucmatch.match_id}>
                                {ucmatch?.[parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back) ? 'teama' : 'teamb'].short_name}
                              </span>
                              
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
                                {
                                    (parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back)
                                      ? ucmatch?.live_odds?.matchodds?.teama?.back
                                      : ucmatch?.live_odds?.matchodds?.teamb?.back) > 0
                                      ? Math.round((parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back)
                                        ? ucmatch?.live_odds?.matchodds?.teama?.back
                                        : ucmatch?.live_odds?.matchodds?.teamb?.back) * 100 - 100)
                                      : 0
                                  }
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
                                {
                                    (parseFloat(ucmatch?.live_odds?.matchodds?.teama?.lay) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.lay)
                                      ? ucmatch?.live_odds?.matchodds?.teama?.lay
                                      : ucmatch?.live_odds?.matchodds?.teamb?.lay) > 0
                                      ? Math.round((parseFloat(ucmatch?.live_odds?.matchodds?.teama?.lay) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.lay)
                                        ? ucmatch?.live_odds?.matchodds?.teama?.lay
                                        : ucmatch?.live_odds?.matchodds?.teamb?.lay) * 100 - 100)
                                      : 0
                                  }
                              </span>
                            </div>
                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>
                          <Link href={"/moreinfo/" + urlStringEncode(ucmatch?.teama?.short_name + "-vs-" + ucmatch?.teamb?.short_name + "-match-" + ucmatch?.match_number + "-" + ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.match_id}>
                            <div className="py-3 px-3">
                              <div className="flex justify-between items-center text-[14px]">
                                <div className="">
                                  <p className="text-[#586577] text-[13px] mb-4 font-medium">
                                    {ucmatch.subtitle}, {ucmatch.format_str}, {ucmatch.venue.location}
                                  </p>
                                  <div className="flex items-center space-x-2 font-medium x md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image
                                        src={`${ucmatch.teama.logo_url}?tr=f-webp`}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={ucmatch.teama.short_name}
                                        loading="lazy"
                                      />
                                      <span className="text-[#586577] font-medium text-[14px]">
                                        {ucmatch.teama.short_name}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex items-center space-x-2 font-medium md:w-full">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${ucmatch.teamb.logo_url}?tr=f-webp`}
                                          className="h-[30px]"
                                          width={30}
                                          height={30}
                                          alt={ucmatch.teamb.short_name}
                                          loading="lazy"
                                        />
                                        <span className="text-[#586577] font-medium text-[14px]">
                                          {ucmatch.teamb.short_name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="font-semibold text-center">
                                  <div className="text-[#144280]">
                                    <div className=" font-medium text-center">
                                      
                                      {isSameDay(new Date(), new Date(ucmatch.date_start_ist)) ? (
                                       <>
                                       <span className="text-[13px] font-normal text-[#a45b09]">Start in</span> 

                                        <CountdownTimer targetTime={ucmatch.date_start_ist} />
                                        </> 

                                      ) : (
                                        <p className="text-[#2F335C] text-[14px]">

                                          {format(new Date(ucmatch.date_start_ist), "dd MMMM - EEEE")}, <br />
                                          {format(new Date(ucmatch.date_start_ist), "hh:mm:aa")}


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
                              {ucmatch?.competition?.total_teams > 2 &&
                                <>
                                  <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.competition?.cid + "/points-table"}>
                                    <p className=" text-[#586577] font-medium">
                                      {" "}
                                      Points Table
                                    </p>
                                  </Link>
                                  <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                </>}
                              <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch?.competition?.cid + "/schedule-results/schedule"}>
                                <p className="text-[#586577] font-medium">
                                  Schedule
                                </p>
                              </Link>
                            </div>
                            {ucmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(ucmatch.format_str) &&
                            <Link href={("/h2h/"+urlStringEncode(ucmatch?.teama?.name+"-vs-"+ucmatch?.teamb?.name)+"-head-to-head-in-"+ucmatch?.format_str).toLowerCase()}>
                              <div className="flex justify-end items-center space-x-2">
                                <Image
                                  src="/assets/img/home/handshake.png"
                                  width={25}
                                  height={25}
                                  style={{ width: "25px", height: "25px" }}
                                  alt=""
                                  loading="lazy"
                                />
                                <span className="text-[#586577] font-medium">
                                  H2H
                                </span>
                              </div>
                            </Link>
                            }
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
                                <div className="w-[6px] h-[6px] bg-[#A45B09] rounded-full"></div> {ucmatch.status_str}
                              </div>
                              <div>
                                <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                  {truncateText(ucmatch.competition.title,3)} -{" "}
                                  {ucmatch.competition.season}
                                </h4>
                              </div>
                              <span className="absolute right-[12px] top-[19px]">
                                <button className="arro-button">
                                  <Image
                                    src="/assets/img/arrow.png"
                                    className=""
                                    width={10}
                                    height={15}
                                    alt=""
                                    loading="lazy"
                                  />
                                </button>
                              </span>
                            </div>
                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>
                          <Link href={"/moreinfo/" + urlStringEncode(ucmatch?.teama?.short_name + "-vs-" + ucmatch?.teamb?.short_name + "-match-" + ucmatch?.match_number + "-" + ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.match_id}>
                            <div className="open-Performance-data">
                              <div className="py-2 pb-3">
                                <p className="text-[#586577] text-[13px] mb-4 font-medium">
                                  {ucmatch.subtitle}, {ucmatch.format_str}, {ucmatch.venue.location}
                                </p>
                                <div className="flex justify-between items-center text-[14px]">
                                  <div className="w-[80%]">
                                    <div className="items-center space-x-2 font-medium md:w-full mb-4">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${ucmatch.teama.logo_url}?tr=f-webp`}
                                          className="h-[30px] rounded-full"
                                          width={30}
                                          height={30}
                                          alt={ucmatch.teama.short_name}
                                          loading="lazy"
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
                                          src={`${ucmatch.teamb.logo_url}?tr=f-webp`}
                                          className="h-[30px] rounded-full"
                                          width={30}
                                          height={30}
                                          alt={ucmatch.teamb.short_name}
                                          loading="lazy"
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
                                    <div className="text-[#144280] mt-1">
                                      <div
                                        className="flex space-x-1 justify-center countdown"
                                        data-time="28800"
                                      >
                                        {/* <!-- 08:00:00 = 8 * 60 * 60 = 28800 seconds --> */}
                                        <div className="flex flex-col items-center">
                                          {isSameDay(new Date(), new Date(ucmatch.date_start_ist)) ? (

                                            <CountdownTimer targetTime={ucmatch.date_start_ist} />

                                          ) : (
                                            <p className="text-[13px] font-medium">
                                              {format(new Date(ucmatch.date_start_ist), "dd MMMM - EEEE")}, <br />
                                              {format(new Date(ucmatch.date_start_ist), "hh:mm:aa")}


                                            </p>
                                          )}

                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>

                          <div className="flex items-center justify-between space-x-5 mt-2">
                            <div className="flex items-center">
                              {ucmatch?.competition?.total_teams > 2 &&
                                <>
                                  <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.competition?.cid + "/points-table"}>
                                    <p className="text-[#586577] text-[13px] font-medium">
                                      Points Table
                                    </p>
                                  </Link>
                                  <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                </>}
                                {ucmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(ucmatch.format_str) &&
                              <Link href={("/h2h/"+urlStringEncode(ucmatch?.teama?.name+"-vs-"+ucmatch?.teamb?.name)+"-head-to-head-in-"+ucmatch?.format_str).toLowerCase()}>
                                <div className="flex justify-end items-center space-x-2">
                                  <Image
                                    src="/assets/img/home/handshake.png"
                                    className="h-[15px]"
                                    width={17}
                                    height={17}
                                    style={{ width: "17px", height: "17px" }}
                                    alt=""
                                    loading="lazy"
                                  />
                                  <span className="text-[#586577] text-[13px] font-medium">
                                    H2H
                                  </span>
                                </div>
                              </Link>
                              }
                            </div>

                            <div className="flex items-center space-x-2 text-[13px]">
                              <span className={"text-[#586577] font-medium oddsTeam" + ucmatch.match_id}>
                                {ucmatch?.[parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back) ? 'teama' : 'teamb'].short_name}
                              </span>
                              <span className="flex font-semibold items-center bg-[#00a632] border-[1px] border-[#00a632] rounded-md text-[#ffffff] pr-2">
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
                                {
                                    (parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back)
                                      ? ucmatch?.live_odds?.matchodds?.teama?.back
                                      : ucmatch?.live_odds?.matchodds?.teamb?.back) > 0
                                      ? Math.round((parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back)
                                        ? ucmatch?.live_odds?.matchodds?.teama?.back
                                        : ucmatch?.live_odds?.matchodds?.teamb?.back) * 100 - 100)
                                      : 0
                                  }
                              </span>
                              <span className="flex font-semibold items-center bg-[#ea2323] border-[1px] border-[#ea2323] rounded-md text-[#ffffff] pr-2">
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
                                {
                                    (parseFloat(ucmatch?.live_odds?.matchodds?.teama?.lay) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.lay)
                                      ? ucmatch?.live_odds?.matchodds?.teama?.lay
                                      : ucmatch?.live_odds?.matchodds?.teamb?.lay) > 0
                                      ? Math.round((parseFloat(ucmatch?.live_odds?.matchodds?.teama?.lay) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.lay)
                                        ? ucmatch?.live_odds?.matchodds?.teama?.lay
                                        : ucmatch?.live_odds?.matchodds?.teamb?.lay) * 100 - 100)
                                      : 0
                                  }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </React.Fragment>
               
  );
}

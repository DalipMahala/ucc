
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";
import { truncateText } from "@/utils/utility";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "./countdownTimer";
import PlayerImage from "./PlayerImage";

interface MatchItem {
  title: string;
  short_title: string;
  game_state_str: string;
  man_of_the_match: any;
  live_odds: any;
  man_of_the_match_pname: string;
  match_number: string;
  commentary: number;
  live: any;
  match_id: number;
  status_str: string;
  competition: {
    abbr: string;
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
function matchOddsCal(data: any) {
  if (!data) return;

  const a = parseFloat(data?.live_odds?.matchodds?.teama?.back || 0);
  const b = parseFloat(data?.live_odds?.matchodds?.teamb?.back || 0);
  const lesserTeam = a < b
    ? { matchId: data?.match_id, team: data?.teama?.short_name, ...data?.live_odds?.matchodds?.teama }
    : { matchId: data?.match_id, team: data?.teamb?.short_name, ...data?.live_odds?.matchodds?.teamb };
  return lesserTeam;
}
export default async function LiveMatches() {
  let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/liveMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let livematchArray = await response.json();

  const filteredMatches = livematchArray?.data?.map(({ match_info, ...rest }: MatchItem) => ({
    ...match_info,
    ...rest
  }));
  let liveMatch: MatchItem[] = filteredMatches;


  liveMatch = liveMatch?.filter((item: { commentary: number }) => Number(item.commentary) === 1);
  liveMatch = liveMatch && liveMatch.sort((a, b) => ({ Toss: 1, 'Play Ongoing': 2 }[a.game_state_str] || 3) - ({ Toss: 1, 'Play Ongoing': 2 }[b.game_state_str] || 3));

  return (
    <React.Fragment>
      <div>
        {liveMatch?.map((items) => (
          <div key={items.match_id}>

            {/* desktop view */}

            <div

              data-key={items.match_id}
              data-id="aaa"
              className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">

                <div className="flex items-center space-x-2 w-[75%]">
                  <div
                    className="flex items-center text-[13px] text-secondary rounded-full pr-3 uppercase font-semibold"
                    style={{ gap: "3px" }}
                  >
                    
                      <svg className="h-[9px] w-[9px] rounded-full">
                        <circle
                          fill="#ea2323"
                          stroke="none"
                          cx="4"
                          cy="4"
                          r="4"
                        >
                          {items.game_state_str === 'Play Ongoing' &&
                            <animate
                              attributeName="opacity"
                              dur="1s"
                              values="0;1;0"
                              repeatCount="indefinite"
                              begin="0.1"
                            />
                          }
                        </circle>
                      </svg>
                    {" "}

                    {items?.game_state_str === 'Play Ongoing' ? items?.status_str : items?.game_state_str}
                  </div>
                  
                    <Link href={"/series/" + urlStringEncode(items.competition.title + "-" + items.competition.season) + "/" + items.competition.cid}  >
                      <h2 className="text-[15px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                        {items.competition.title} - {" "}
                        {items.competition.season}
                      </h2>
                    </Link>
                  
                </div>

                <div className="flex items-center space-x-2">
                  <span className={"text-[13px] font-medium oddsTeam" + items.match_id}>
                    {matchOddsCal(items)?.team}
                  </span>
                  <span className="flex items-center bg-[#FAFFFC] border-[1px] border-[#00a632] rounded-full text-[#00a632] pr-2">
                   
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
                    
                    <span className={"oddback" + items.match_id}>
                      {matchOddsCal(items)?.back > 0 ? Math.round((matchOddsCal(items)?.back) * 100 - 100) : 0}
                      {/* {items?.live_odds?.matchodds?.teama?.back > 0  ? Math.round((items?.live_odds?.matchodds?.teama?.back)*100-100) : 0} */}
                    </span>
                  </span>
                  <span className="flex items-center bg-[#FFF7F7] border-[1px] border-secondary  rounded-full text-secondary pr-2">
                    
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
                   
                    <span className={"oddlay" + items.match_id}>
                      {matchOddsCal(items)?.lay > 0 ? Math.round((matchOddsCal(items)?.lay) * 100 - 100) : 0}
                      {/* {items?.live_odds?.matchodds?.teama?.lay > 0 ? Math.round((items?.live_odds?.matchodds?.teama?.lay)*100-100) : 0} */}
                    </span>
                  </span>
                </div>

              </div>

              <div className="border-t-[1px] border-[#E7F2F4]"></div>

              <div className="py-3 px-3">
                <Link href={"/live-score/" + urlStringEncode(items?.teama?.short_name + "-vs-" + items?.teamb?.short_name + "-" + items?.subtitle + "-" + items?.competition?.title + "-" + items?.competition?.season) + "/" + items.match_id}>
                  <div className="flex justify-between items-center text-[14px]">
                    <div className="w-[55%]">
                      
                      <p className="text-colorSecound text-[12px] mb-4 font-medium">
                        {items.subtitle}, {items.format_str}, {items.venue.location}
                      </p>
                      <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                        <div className="flex items-center space-x-2">
                          <Image
                            // src={items.teama.logo_url}
                            src={items.teama.logo_url || '/assets/img/ring.png'}
                            className="h-[30px] rounded-full"
                            width={30}
                            height={30}
                            alt={items.teama.short_name}
                            loading="lazy"
                          />
                          <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : "text-colorThird font-semibold text-[14px]"}`}>
                            {items.teama.short_name} -{" "}
                          </span>
                        </div>
                        <p
                          className={
                            "flex items-baseline gap-[4px] match" +
                            items.match_id +
                            "-" +
                            items.teama.team_id
                          }
                        >
                          {items.teama.scores === undefined ||
                            items.teama.scores === null ||
                            items.teama.scores === "" ? (
                            <span className="text-[14px] font-semibold">
                              {" "}
                              (Yet to bat){" "}
                            </span>
                          ) : (
                            <>
                              <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : " font-semibold text-[14px]"}`}>
                                {items.teama.scores ?? 0}
                              </span>
                              <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? " text-[13px] text-[black]" : "text-colorThird text-[13px]"}`}>
                                {" "}
                                ({items.teama.overs ?? 0}){" "}
                              </span>
                              {(items.teama.team_id === items?.live?.live_inning?.batting_team_id) &&
                                <Image loading="lazy" src="/assets/img/home/bat.png" width={12} height={12} className="h-[12px] mb-[3px]" alt="bat" />
                              }
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 font-medium md:w-full">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={items.teamb.logo_url || '/assets/img/ring.png'}
                            className="h-[30px]"
                            width={30}
                            height={30}
                            alt={items.teamb.short_name}
                            loading="lazy"
                          />
                          <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : "text-colorThird font-semibold text-[14px]"}`}>
                            {items.teamb.short_name} -
                          </span>
                        </div>
                        <p
                          className={
                            "flex items-baseline gap-[4px] match" +
                            items.match_id +
                            "-" +
                            items.teamb.team_id
                          }
                        >
                          {items.teamb.scores === undefined ||
                            items.teamb.scores === null ||
                            items.teamb.scores === "" ? (
                            <span className="text-[14px] font-semibold">
                              {" "}
                              (Yet to bat){" "}
                            </span>
                          ) : (
                            <>
                              <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : "font-semibold text-[14px]"}`}>
                                {items.teamb.scores ?? 0}
                              </span>
                              <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? " text-[13px] text-[black]" : "text-colorThird text-[13px]"}`}>
                                {" "}
                                ({items.teamb.overs ?? 0}){" "}
                              </span>
                              {(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) &&
                                <Image loading="lazy" src="/assets/img/home/bat.png" width={12} height={12} className="h-[12px] mb-[3px]" alt="bat" />
                              }
                            </>
                          )}
                        </p>
                      </div>

                    </div>

                    {/* <div className="h-[100px] border-l-[1px] border-[#efefef]"></div> */}

                    <div className="w-[38%] font-medium text-center">
                      <p
                        className={
                          "text-[#2F335C] text-[14px] statusNote" +
                          items.match_id
                        }
                        style={{
                          whiteSpace: "break-word",
                          width: "200px",
                        }}
                      >
                        {updateStatusNoteDirect(items)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="border-t-[1px] border-[#E7F2F4]"></div>

              <div className="flex items-center justify-between space-x-5 mt-3">
                <div className="flex items-center">
                  {items?.competition?.total_teams > 2 &&
                    <>
                      <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items.competition?.cid + "/points-table"}>
                        <p className="  text-colorThird font-medium">
                          {" "}
                          Points Table
                        </p>
                      </Link>
                      <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                    </>
                  }
                  <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items?.competition?.cid + "/schedule-results/schedule"}>
                    <p className=" text-colorThird font-medium">
                      Schedule
                    </p>
                  </Link>
                </div>
                {items?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(items.format_str) &&
                  <Link href={("/h2h/" + urlStringEncode(items?.competition?.title === 'Indian Premier League' ? items?.short_title + "-head-to-head-in-ipl" : items?.title + "-head-to-head-in-" + items?.format_str)).toLowerCase()}>
                    <div className="flex justify-end items-center space-x-2">
                      <Image
                        src="/assets/img/home/handshake.png"
                        style={{ width: "25px", height: "25px" }}
                        width={25}
                        height={25}
                        alt=""
                        loading="lazy"
                      />
                      <span className=" text-colorThird font-medium">
                        H2H
                      </span>
                    </div>
                  </Link>
                }
              </div>
            </div>

            {/* mobile */}

            <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
             
                <div className="flex items-center space-x-2 mb-2 w-full">
                  <div
                    className={`flex gap-[2px] items-center text-[#ea2323] rounded-full font-semibold uppercase text-[13px] ${(items.game_state_str === 'Rain Delay' || items.status_str === 'Rain Delay') ? 'w-[23%]' :
                        (items.game_state_str === 'Match Start Delay' || items.status_str === 'Match Start Delay') ? 'w-[36%]' :
                          ''
                      }`}
                  >
                    
                      <svg className="h-[7px] w-[7px] rounded-full">
                        <circle
                          fill="#ea2323"
                          stroke="none"
                          cx="3"
                          cy="3"
                          r="3"
                        >
                          {items.game_state_str === 'Play Ongoing' &&
                            <animate
                              attributeName="opacity"
                              dur="1s"
                              values="0;1;0"
                              repeatCount="indefinite"
                              begin="0.1"
                            />
                          }
                        </circle>
                      </svg>
                    
                    {items.game_state_str === 'Play Ongoing' ? items.status_str : items.game_state_str}
                  </div>

                  <Link href={"/series/" + urlStringEncode(items.competition.title + "-" + items.competition.season) + "/" + items.competition.cid}  >
                    <h2 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                      <span> {items.competition.abbr} </span> -
                      <span> {items.competition.season} </span>
                    </h2>
                  </Link>


                </div>
           

              <div className="border-t-[1px] border-[#E7F2F4]"></div>

              <div className="open-Performance-data">
                <Link href={"/live-score/" + urlStringEncode(items?.teama?.short_name + "-vs-" + items?.teamb?.short_name + "-" + items?.subtitle + "-" + items?.competition?.title + "-" + items?.competition?.season) + "/" + items.match_id}>
                  <div className="py-2 pb-3">
                    <p className="text-colorSecound text-[11px] mb-4 font-normal">
                      {items.subtitle}, {items.format_str}, {items.venue.location}
                    </p>
                    <div className="flex justify-between items-center text-[14px]">

                      <div className="w-[82%]">
                        
                          <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                            <Image
                              src={items.teama.logo_url || '/assets/img/ring.png'}
                              className="h-[30px] rounded-full"
                              width={30}
                              height={30}
                              alt={items.teama.short_name}
                              loading="lazy"
                            />
                            <div>
                              <span className="flex items-center gap-1">
                                <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? "font-medium text-[14px] text-[black]" : "text-[#5e5e5e] font-medium text-[14px]"}`}>

                                  {items.teama.short_name}
                                </span>

                              </span>

                              <p className={
                                "flex items-baseline gap-2 match" +
                                items.match_id +
                                "-" +
                                items.teama.team_id
                              }>
                                {items.teama.scores === undefined ||
                                  items.teama.scores === null ||
                                  items.teama.scores === "" ? (
                                  <span className="font-normal text-[11px]">
                                    {" "}
                                    (Yet to bat){" "}
                                  </span>
                                ) : (
                                  <>
                                    <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : " font-semibold text-[#1F2937] text-[14px]"}`}>
                                      {items.teama.scores ?? 0}
                                    </span>
                                    <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? "text-[12px] text-[black] font-normal" : "text-colorThird text-[12px] font-normal"}`}>
                                      {" "}
                                      ({items.teama.overs ?? 0}){" "}
                                    </span>
                                    {(items.teama.team_id === items?.live?.live_inning?.batting_team_id) &&
                                      <Image loading="lazy" src="/assets/img/home/bat.png" width={14} height={14} className="h-[14px] mb-[3px]" alt="bat" />
                                    }
                                  </>
                                )}

                              </p>
                            </div>
                          </div>
                       
                            <div className="flex items-center space-x-2 font-medium md:w-full">
                              <Image
                                src={items.teamb.logo_url || '/assets/img/ring.png'}
                                className="h-[30px]"
                                width={30}
                                height={30}
                                alt={items.teamb.short_name}
                                loading="lazy"
                              />
                              <div>
                                <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? "font-medium text-[14px] text-[black]" : "text-[#5e5e5e] font-medium text-[14px]"}`}>
                                  {items.teamb.short_name}
                                </span>
                                <p
                                  className={
                                    "flex items-baseline gap-2 font-normal text-[14px] match" +
                                    items.match_id +
                                    "-" +
                                    items.teamb.team_id
                                  }
                                >
                                  {items.teamb.scores === undefined ||
                                    items.teamb.scores === null ||
                                    items.teamb.scores === "" ? (
                                    <span className="font-normal text-[11px]">
                                      {" "}
                                      (Yet to bat){" "}
                                    </span>
                                  ) : (
                                    <>
                                      <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : " font-semibold text-[#1F2937] text-[14px]"}`}>
                                        {items.teamb.scores ?? 0}
                                      </span>
                                      <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? "text-[12px] text-[black] font-normal" : "text-colorThird text-[12px] font-normal"}`}>
                                        {" "}
                                        ({items.teamb.overs ?? 0}){" "}
                                      </span>
                                      {(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) &&
                                        <Image loading="lazy" src="/assets/img/home/bat.png" width={14} height={14} className="h-[14px] mb-[3px]" alt="bat" />
                                      }
                                    </>
                                  )}
                                </p>

                              </div>
                            </div>
                          
                      </div>

                      {/* <div className="h-[100px] border-l-[1px] border-[#f2fafd]"></div> */}

                      <div className="w-[44%] font-semibold text-center">
                        <p className={"mt-1 mx-2 text-[#2F335C] text-[12px]  statusNote" +
                          items.match_id
                        }>
                          {/* {items.status_note} */}
                          {updateStatusNoteDirect(items)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="border-t-[1px] border-[#E7F2F4]"></div>

                <div className="flex items-center justify-between space-x-5 mt-2">
                  <div className="flex items-center">
                    {items?.competition?.total_teams > 2 &&
                      <>
                        <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items.competition?.cid + "/points-table"}>
                          <p className=" pr-[10px] text-colorThird text-[11px] font-medium">
                            {" "}
                            Points Table
                          </p>
                        </Link>

                        <div className="hidden md:block h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                      </>
                    }
                    {items?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(items.format_str) &&
                      <Link href={("/h2h/" + urlStringEncode(items?.competition?.title === 'Indian Premier League' ? items?.short_title + "-head-to-head-in-ipl" : items?.title + "-head-to-head-in-" + items?.format_str)).toLowerCase()}>

                        <div className="pl-[10px] border-l-[1px] border-[#d0d3d7] flex justify-end items-center space-x-2">
                          <Image
                            src="/assets/img/home/handshake.png"
                            className="h-[15px]"
                            width={17}
                            height={17}
                            style={{ width: "17px", height: "17px" }}
                            alt=""
                            loading="lazy"
                          />
                          <span className=" text-colorThird text-[11px] font-medium">
                            H2H
                          </span>
                        </div>
                      </Link>
                    }
                  </div>

                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className={"text-colorThird font-medium oddsTeam" + items.match_id}>
                      {matchOddsCal(items)?.team}
                    </span>
                    <span className="flex items-center bg-[#FAFFFC] border-[1px] border-accent rounded-md text-accent pr-2">
                     
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
                     
                      <span className={"oddback" + items.match_id}>
                        {matchOddsCal(items)?.back > 0 ? Math.round((matchOddsCal(items)?.back) * 100 - 100) : 0}
                        {/* {items?.live_odds?.matchodds?.teama?.back > 0  ? Math.round((items?.live_odds?.matchodds?.teama?.back)*100-100) : 0} */}
                      </span>
                    </span>
                    <span className="flex items-center bg-[#FFF7F7] border-[1px] border-secondary  rounded-md text-secondary pr-2">
                      
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
                      
                      <span className={"oddlay" + items.match_id}>
                        {matchOddsCal(items)?.lay > 0 ? Math.round((matchOddsCal(items)?.lay) * 100 - 100) : 0}
                        {/* {items?.live_odds?.matchodds?.teama?.lay > 0  ? Math.round((items?.live_odds?.matchodds?.teama?.lay)*100-100) : 0} */}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>




        ))}


      </div>
    </React.Fragment>

  );
}

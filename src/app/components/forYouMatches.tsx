
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";
import { truncateText } from "@/utils/utility";
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
interface PlayerUrlResponse {
  [key: string]: string;
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

export default async function ForYouMatches() {
  let forYouresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/forYouMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let forYoumatchArray = await forYouresponse.json();

  const forYoufilteredMatches = forYoumatchArray?.data?.map(({ match_info, ...rest }: MatchItem) => ({
    ...match_info,
    ...rest
  }));
  let forYouMatch = forYoufilteredMatches;

  const completedMatch1 = forYouMatch?.filter((item: { commentary: number, status: number }) => Number(item.commentary) === 1 && item.status === 2).reverse();
  const upcomingMatch1 = forYouMatch?.filter((item: { commentary: number, status: number }) => Number(item.commentary) === 1 && item.status === 1);
  const liveMatch1 = forYouMatch?.filter((item: { commentary: number, status: number }) => Number(item.commentary) === 1 && item.status === 3);

  const getAllPlayerIds = () => {
    const allIds = [
      ...completedMatch1.map((item: {
        man_of_the_match: any; pid: any }) => item?.man_of_the_match?.pid),
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
  return (
    <React.Fragment>
      <div className="liveMatch1">
        {liveMatch1?.map((items: any, index: number) => (
          <div key={index}>
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
                        {items.competition.title} -{" "}
                        {items.competition.season}
                      </h2>
                    </Link>
                 
                </div>
                <div className="flex items-center space-x-2">
                  <span className={"text-[13px] font-medium oddsTeam" + items.match_id}>
                    {matchOddsCal(items)?.team}
                  </span>
                  <span className="flex items-center bg-[#FAFFFC] border-[1px] border-accent rounded-full text-accent pr-2">
                   
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

              <div className="border-t-[1px] border-colorFourth"></div>

              <div className="py-3 px-3">
                <Link href={"/live-score/" + urlStringEncode(items?.teama?.short_name + "-vs-" + items?.teamb?.short_name + "-" + items?.subtitle + "-" + items?.competition?.title + "-" + items?.competition?.season) + "/" + items?.match_id}>
                  <div className="flex justify-between items-center text-[14px]">
                    <div className="w-[55%]">
                      <p className="text-colorSecound text-[12px] mb-4 font-medium">
                        {items?.subtitle}, {items?.format_str}, {items?.venue?.location}
                      </p>
                      <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                        <div className="flex items-center space-x-2">
                          <Image
                            // src={items.teama.logo_url}
                            src={items?.teama?.logo_url || '/assets/img/ring.png'}
                            className="h-[30px] rounded-full"
                            width={30}
                            height={30}
                            alt={items?.teama?.short_name}
                            loading="lazy"
                          />
                          <span className={`${(items?.teama?.team_id === items?.live?.live_inning?.batting_team_id) ? "ont-semibold text-[14px] text-[black]" : "text-colorThird font-semibold text-[14px]"}`}>
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
                                {items.teama.scores}
                              </span>
                              <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? " text-[13px] text-[black]" : "text-colorThird text-[13px]"}`}>
                                {" "}
                                ({items.teama.overs}){" "}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      
                        <div className="flex items-center space-x-2 font-medium md:w-full">
                          <div className="flex items-center space-x-2">
                            <Image
                              src={items?.teamb?.logo_url || '/assets/img/ring.png'}
                              className="h-[30px]"
                              width={30}
                              height={30}
                              alt={items?.teamb?.short_name ?? "team"}
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
                                  {items.teamb.scores}
                                </span>
                                <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? "text-[13px] text-[black]" : "text-colorThird text-[13px]"}`}>
                                  {" "}
                                  ({items.teamb.overs}){" "}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                     
                    </div>

                    {/* <div className="h-[100px] border-l-[1px] border-[#efefef]"></div> */}

                    <div className="w-[38%] font-semibold text-center">
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

              <div className="border-t-[1px] border-colorFourth"></div>

              <div className="flex items-center justify-between space-x-5 mt-3">
                <div className="flex items-center">
                  {items?.competition?.total_teams > 2 &&
                    <>
                      <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items.competition?.cid + "/points-table"}>
                        <p className=" text-colorThird font-medium">
                          {" "}
                          Points Table
                        </p>
                      </Link>
                      <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                    </>
                  }
                  <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items?.competition?.cid + "/schedule-results/schedule"}>
                    <p className="text-colorThird font-medium">
                      Schedule
                    </p>
                  </Link>
                </div>
                {items?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(items.format_str) &&
                  <Link href={("/h2h/" + urlStringEncode(items?.competition?.title === 'Indian Premier League' ? items?.short_title+ "-head-to-head-in-ipl" : items?.title + "-head-to-head-in-" + items?.format_str)).toLowerCase()}>
                    <div className="flex justify-end items-center space-x-2">
                      <Image
                        src="/assets/img/home/handshake.png"
                        style={{ width: "25px", height: "25px" }}
                        width={25}
                        height={25}
                        alt=""
                        loading="lazy"
                      />
                      <span className="text-colorThird font-medium">
                        H2H
                      </span>
                    </div>
                  </Link>
                }
              </div>
            </div>

            {/* mobile */}

            <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
             
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex gap-[2px] items-center text-[#ea2323] rounded-full font-semibold uppercase text-[13px]">
                    <span className="rounded-full">
                      <svg className="h-[7px] w-[7px]">
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
                    </span>
                    {items.game_state_str === 'Play Ongoing' ? items.status_str : items.game_state_str}
                  </div>
                 
                    <Link href={"/series/" + urlStringEncode(items.competition.title + "-" + items.competition.season) + "/" + items.competition.cid}  >
                      <h2 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                        {items.competition.abbr} -{" "}
                        {items.competition.season}
                      </h2>
                    </Link>
                  

                </div>
             

              <div className="border-t-[1px] border-colorFourth"></div>

              <div className="open-Performance-data">
                <Link href={"/live-score/" + urlStringEncode(items?.teama?.short_name + "-vs-" + items?.teamb?.short_name + "-" + items?.subtitle + "-" + items?.competition?.title + "-" + items?.competition?.season) + "/" + items.match_id}>
                  <div className="py-2 pb-3">
                    <p className="text-colorSecound text-[13px] mb-4 font-normal">
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
                              
                                <span className="text-[#5e5e5e] font-medium text-[14px]">
                                  {items.teama.short_name}
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
                                    <span className="font-semibold text-[#1F2937] text-[14px]">
                                      {items.teama.scores}
                                    </span>
                                    <span className="text-colorThird text-[12px] font-normal">
                                      {" "}
                                      ({items.teama.overs}){" "}
                                    </span>
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
                                <span className="text-[#5e5e5e] font-medium text-[14px]">
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
                                      <span className="font-semibold text-[#1F2937] text-[14px]">
                                        {items.teamb.scores}
                                      </span>
                                      <span className="text-colorThird text-[12px] font-normal">
                                        {" "}
                                        ({items.teamb.overs}){" "}
                                      </span>
                                    </>
                                  )}
                                </p>

                              </div>
                            </div>
                          
                       
                      </div>

                      <div className="h-[100px] border-l-[1px] border-[#f2fafd]"></div>

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

                <div className="border-t-[1px] border-colorFourth"></div>

                <div className="flex items-center justify-between space-x-5 mt-2">
                  <div className="flex items-center">
                    {items?.competition?.total_teams > 2 &&
                      <>
                        <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items.competition?.cid + "/points-table"}>
                          <p className="pr-[10px] text-colorThird text-[11px] font-medium">
                            {" "}
                            Points Table
                          </p>
                        </Link>

                      </>
                    }
                    {items?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(items.format_str) &&
                      <Link href={("/h2h/" + urlStringEncode(items?.competition?.title === 'Indian Premier League' ? items?.short_title+ "-head-to-head-in-ipl" : items?.title + "-head-to-head-in-" + items?.format_str)).toLowerCase()}>
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
                          <span className="text-colorThird text-[11px] font-medium">
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





        {upcomingMatch1?.map((ucmatch: any, index: number) => (
          <div key={index}>
            <div
              className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="flex items-center text-[13px] text-colorFirst rounded-full pr-3 uppercase font-semibold"
                    style={{ gap: "3px" }}
                  >
                    <div className="w-[8px] h-[8px] bg-colorFirst rounded-full animate-blink"></div>{" "}
                    {ucmatch.status_str}
                  </div>
                 
                    <Link href={"/series/" + urlStringEncode(ucmatch.competition.title + "-" + ucmatch.competition.season) + "/" + ucmatch.competition.cid}  >
                      <h2 className="text-[15px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                        {ucmatch.competition.title} -{" "}
                        {ucmatch.competition.season}
                      </h2>
                    </Link>
                 
                </div>
                <div className="flex items-center space-x-2">
                  <span className={"text-[13px] font-medium text-[#1F2937] oddsTeam" + ucmatch.match_id}>
                    {matchOddsCal(ucmatch)?.team}
                  </span>

                  <span className="flex items-center bg-[#FAFFFC] border-[1px] border-accent rounded-full text-accent pr-2">
                   
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
                    
                    {matchOddsCal(ucmatch)?.back > 0 ? Math.round((matchOddsCal(ucmatch)?.back) * 100 - 100) : 0}
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
                   
                    {matchOddsCal(ucmatch)?.lay > 0 ? Math.round((matchOddsCal(ucmatch)?.lay) * 100 - 100) : 0}
                  </span>
                </div>
              </div>

              <div className="border-t-[1px] border-colorFourth"></div>
              <Link href={"/moreinfo/" + urlStringEncode(ucmatch?.teama?.short_name + "-vs-" + ucmatch?.teamb?.short_name + "-" + ucmatch?.subtitle + "-" + ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.match_id}>
                
                  <div className="flex justify-between items-center text-[14px] py-3 px-3">
                    <div className="w-[50%]">
                      <p className="text-colorSecound text-[12px] mb-4 font-medium">
                        {ucmatch.subtitle}, {ucmatch.format_str}, {ucmatch.venue.location}
                      </p>
                      <div className="flex items-center space-x-2 font-medium x md:w-full mb-4">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={ucmatch.teama.logo_url || '/assets/img/ring.png'}
                            className="h-[30px] rounded-full"
                            width={30}
                            height={30}
                            alt={ucmatch?.teama?.name}
                            loading="lazy"
                          />
                          <span className="font-semibold text-[14px]">
                            {ucmatch?.teama?.name}
                          </span>
                        </div>
                      </div>

                    
                        <div className="flex items-center space-x-2 font-medium md:w-full">
                          <div className="flex items-center space-x-2">
                            <Image
                              src={ucmatch.teamb.logo_url || '/assets/img/ring.png'}
                              className="h-[30px]"
                              width={30}
                              height={30}
                              alt={ucmatch.teamb.short_name}
                              loading="lazy"
                            />
                            <span className="font-semibold text-[14px]">
                              {ucmatch?.teamb?.name}
                            </span>
                          </div>
                        </div>
                     
                    </div>

                    {/* <div className="h-[100px] border-l-[1px] border-[#efefef]"></div> */}

                    <div className="w-[50%] font-semibold text-center flex justify-end">
                     
                        <div className=" font-medium text-center text-[#144280]">

                          {isSameDay(new Date(), new Date(ucmatch.date_start_ist)) ? (
                            <>
                              <span className="text-[13px] font-normal text-colorFirst">Start in</span>

                              <CountdownTimer targetTime={ucmatch.date_start_ist} />
                            </>

                          ) : (
                            <p className="text-[#2F335C] text-[14px]">

                              {format(new Date(ucmatch.date_start_ist), "dd MMMM - EEEE")} <br />
                              {format(new Date(ucmatch.date_start_ist), "hh:mm:aa")}


                            </p>
                          )}
                        </div>
                     
                    </div>
                  </div>
               
              </Link>
              <div className="border-t-[1px] border-colorFourth"></div>

              <div className="flex items-center justify-between space-x-5 mt-3">
                <div className="flex items-center">
                  {ucmatch?.competition?.total_teams > 2 &&
                    <>
                      <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.competition?.cid + "/points-table"}>
                        <p className="  text-colorThird font-medium">
                          {" "}
                          Points Table
                        </p>
                      </Link>
                      <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                    </>}
                  <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch?.competition?.cid + "/schedule-results/schedule"}>
                    <p className=" text-colorThird font-medium">
                      Schedule
                    </p>
                  </Link>
                </div>
                {ucmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(ucmatch.format_str) &&
                  <Link href={("/h2h/" + urlStringEncode(ucmatch?.competition?.title === 'Indian Premier League' ? ucmatch?.short_title+ "-head-to-head-in-ipl" : ucmatch?.title + "-head-to-head-in-" + ucmatch?.format_str)).toLowerCase()}>
                    <div className="flex justify-end items-center space-x-2">
                      <Image
                        src="/assets/img/home/handshake.png"
                        width={25}
                        height={25}
                        style={{ width: "25px", height: "25px" }}
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

            {/* Mobile */}
            <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
              
                <div className="flex items-center space-x-2  mb-2">
                  <div
                    className="flex text-[13px] items-center uppercase text-colorFirst rounded-full font-semibold"
                    style={{ gap: "2px" }}
                  >
                    <div className="w-[6px] h-[6px] bg-colorFirst rounded-full"></div> {ucmatch.status_str}
                  </div>
                  
                    <Link href={"/series/" + urlStringEncode(ucmatch.competition.title + "-" + ucmatch.competition.season) + "/" + ucmatch.competition.cid}  >
                      <h2 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                        {ucmatch.competition.abbr} -{" "}
                        {ucmatch.competition.season}
                      </h2>
                    </Link>
                  

                </div>
             

              <div className="border-t-[1px] border-colorFourth"></div>

              <Link href={"/moreinfo/" + urlStringEncode(ucmatch?.teama?.short_name + "-vs-" + ucmatch?.teamb?.short_name + "-" + ucmatch?.subtitle + "-" + ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.match_id}>
                
                  <div className="open-Performance-data py-2 pb-3">
                    <p className="text-colorSecound text-[12px] mb-4 font-medium">
                      {ucmatch.subtitle}, {ucmatch.format_str}, {ucmatch.venue.location}
                    </p>

                    <div className="flex justify-between items-center text-[14px]">
                      <div className="w-[80%]">
                        
                          <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                            <Image
                              src={ucmatch.teama.logo_url || '/assets/img/ring.png'}
                              className="h-[30px] rounded-full"
                              width={30}
                              height={30}
                              alt={ucmatch.teama.short_name}
                              loading="lazy"
                            />
                           
                                <span className=" font-medium">
                                  {ucmatch?.teama?.name}
                                </span>
                             
                          </div>
                       
                        <div className="flex items-center space-x-2 font-medium md:w-full">
                          <div className="flex items-center space-x-2">
                            <Image
                              src={ucmatch.teamb.logo_url || '/assets/img/ring.png'}
                              className="h-[30px] rounded-full"
                              width={30}
                              height={30}
                              alt={ucmatch?.teamb?.short_name}
                              loading="lazy"
                            />
                           
                                <span className=" font-medium">
                                  {ucmatch?.teamb?.name}
                                </span>
                             
                          </div>
                        </div>
                      </div>

                     

                     
                     
                          <div
                            className="flex space-x-1 justify-center text-[#144280] mt-1 w-[80%] font-semibold text-center countdown"
                            data-time="28800"
                          >
                            {/* <!-- 08:00:00 = 8 * 60 * 60 = 28800 seconds --> */}
                            <div className="flex flex-col items-center">
                              {isSameDay(new Date(), new Date(ucmatch.date_start_ist)) ? (
                                <>

                                  <span className="text-[13px] font-normal text-colorFirst">Start in</span>

                                  <CountdownTimer targetTime={ucmatch.date_start_ist} />
                                </>

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
                
              </Link>

              <div className="border-t-[1px] border-colorFourth"></div>

              <div className="flex items-center justify-between space-x-5 mt-2">
                <div className="flex items-center">
                  {ucmatch?.competition?.total_teams > 2 &&
                    <>
                      <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.competition?.cid + "/points-table"}>
                        <p className="pr-[10px] text-colorThird text-[11px] font-medium">
                          Points Table
                        </p>
                      </Link>
                     
                    </>}
                  {ucmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(ucmatch.format_str) &&
                    <Link href={("/h2h/" + urlStringEncode(ucmatch?.competition?.title === 'Indian Premier League' ? ucmatch?.short_title+ "-head-to-head-in-ipl" : ucmatch?.title + "-head-to-head-in-" + ucmatch?.format_str)).toLowerCase()}>
                      <div className="pl-[10px] border-l-[1px] flex justify-end items-center space-x-2">
                        <Image
                          src="/assets/img/home/handshake.png"
                          className="h-[15px]"
                          width={17}
                          height={17}
                          style={{ width: "17px", height: "17px" }}
                          alt=""
                          loading="lazy"
                        />
                        <span className="text-colorThird text-[11px] font-medium">
                          H2H
                        </span>
                      </div>
                    </Link>
                  }
                </div>

                <div className="flex items-center space-x-2 text-[11px]">
                  <span className={"text-colorThird font-medium oddsTeam" + ucmatch.match_id}>
                    {matchOddsCal(ucmatch)?.team}
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
                        ></path>
                      </svg>
                    
                    {matchOddsCal(ucmatch)?.back > 0 ? Math.round((matchOddsCal(ucmatch)?.back) * 100 - 100) : 0}
                  </span>
                  <span className="flex items-center bg-[#FFF7F7] border-[1px] border-secondary rounded-md text-secondary pr-2">
                   
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
                   
                    {matchOddsCal(ucmatch)?.lay > 0 ? Math.round((matchOddsCal(ucmatch)?.lay) * 100 - 100) : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {completedMatch1?.map((cmatch: any, index: number) => (
          <div key={index}>
            <div
              className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
            >
              
                <div className="flex items-center space-x-2 mb-4">
                  <div
                    className="flex items-center text-[13px] text-accent rounded-full pr-3 uppercase  font-semibold"
                    style={{ gap: "3px" }}
                  >
                    <div className="w-[8px] h-[8px] bg-accent rounded-full"></div>{" "}
                    {cmatch.status_str}
                  </div>
                  
                    <Link href={"/series/" + urlStringEncode(cmatch.competition.title + "-" + cmatch.competition.season) + "/" + cmatch.competition.cid}  >
                      <h2 className="text-[15px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                        {cmatch.competition.title} -{" "}
                        {cmatch.competition.season}
                      </h2>
                    </Link>
                  
                </div>


              <div className="border-t-[1px] border-colorFourth"></div>

             
                <div className="flex justify-between items-center text-[14px] py-3 px-3">
                  <Link className="w-[61%]" href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-" + cmatch?.subtitle + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
                  
                      <p className="text-colorSecound text-[12px] mb-4 font-medium">
                        {cmatch.subtitle}, {cmatch.format_str}, {cmatch.venue.location}
                      </p>
                      <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={cmatch.teama.logo_url || '/assets/img/ring.png'}
                            className="h-[30px] rounded-full"
                            width={30}
                            height={30}
                            alt={cmatch.teama.short_name}
                            loading="lazy"
                          />
                          <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "text-colorThird font-semibold text-[14px]"}`}>
                            {cmatch.teama.short_name} -{" "}
                          </span>
                        </div>
                        <p className="text-[14px] flex gap-[4px] items-baseline">
                          <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "font-semibold text-[14px]"}`}>
                            {cmatch.teama.scores}
                          </span>
                          <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "text-[13px] text-[black]" : "text-colorThird text-[13px]"}`}>
                            {" "}
                            ({cmatch.teama.overs})
                          </span>
                        </p>
                      </div>

                    
                        <div className="flex items-center space-x-2 font-medium md:w-full">
                          <div className="flex items-center space-x-2">
                            <Image
                              src={cmatch.teamb.logo_url || '/assets/img/ring.png'}
                              className="h-[30px]"
                              width={30}
                              height={30}
                              alt={cmatch.teamb.short_name}
                              loading="lazy"
                            />
                            <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "text-colorThird font-semibold text-[14px]"}`}>
                              {cmatch.teamb.short_name} -{" "}
                            </span>
                          </div>
                          <p className="text-[14px] flex gap-[4px] items-baseline">
                            <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "text-[14px] font-semibold "}`}>
                              {cmatch.teamb.scores}
                            </span>
                            <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "text-[13px] text-[black]" : "text-colorThird text-[13px]"}`}>
                              ({cmatch.teamb.overs})
                            </span>
                          </p>
                        </div>
                     
                    
                  </Link>
                  <div className="h-[100px] border-l-[1px] border-colorFourth"></div>

                  <Link className="w-[38%]" href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-" + cmatch?.subtitle + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
                    <div className=" font-semibold flex flex-col items-center">
                    {(cmatch?.result_type === 1 || cmatch?.result_type === 2) &&
                      <Image
                        src="/assets/img/home/win.png"
                        width={30}
                        height={30}
                        style={{ width: "30px", height: "30px" }}
                        alt=""
                        loading="lazy"
                      />
                    }
                      <p className="text-accent text-[15px] w-[75%] text-center">
                        {cmatch.result}
                      </p>
                    </div>
                  </Link>
                  {(cmatch.man_of_the_match && !Array.isArray(cmatch.man_of_the_match)) &&
                    <>
                      <div className="h-[100px] border-l-[1px] border-colorFourth"></div>
                      <Link className="w-[45%]"
                        href={
                          "/player/" +
                          playerUrls[cmatch?.man_of_the_match?.pid]
                        }>
                        <div className="flex flex-col items-center">

                          <PlayerImage key={cmatch?.man_of_the_match?.pid} player_id={cmatch?.man_of_the_match?.pid} height={45} width={45} className="rounded-full" />
                          <p className="text-[14px] font-semibold">{cmatch?.man_of_the_match?.name}</p>
                          <p className="text-[14px]">Man of the match</p>
                        </div>
                      </Link>
                    </>
                  }
                </div>

            

              <div className="border-t-[1px] border-colorFourth"></div>

              <div className="flex items-center justify-between space-x-5 mt-3">
                <div className="flex items-center">
                  {cmatch?.competition?.total_teams > 2 &&
                    <>
                      <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.competition?.cid + "/points-table"}>
                        <p className="  text-colorThird font-medium">
                          {" "}
                          Points Table
                        </p>
                      </Link>
                      <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                    </>}
                  <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch?.competition?.cid + "/schedule-results/schedule"}>
                    <p className=" text-colorThird font-medium">
                      Schedule
                    </p>
                  </Link>
                </div>
                {cmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(cmatch.format_str) &&
                  <Link href={("/h2h/" + urlStringEncode(cmatch?.competition?.title === 'Indian Premier League' ? cmatch?.short_title+ "-head-to-head-in-ipl" : cmatch?.title + "-head-to-head-in-" + cmatch?.format_str)).toLowerCase()}>
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
            {/* Mobile */}

            <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative">
              
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className="flex text-[13px] items-center text-accent rounded-full uppercase font-semibold"
                    style={{ gap: "2px" }}
                  >
                    <div className="w-[6px] h-[6px] bg-accent rounded-full"></div> {cmatch.status_str}
                  </div>
                 
                    <Link href={"/series/" + urlStringEncode(cmatch.competition.title + "-" + cmatch.competition.season) + "/" + cmatch.competition.cid}  >
                      <h2 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                        {cmatch.competition.abbr} -{" "}
                        {cmatch.competition.season}
                      </h2>
                    </Link>
                  
                  
                </div>
             

              <div className="border-t-[1px] border-colorFourth"></div>

              <div className="open-Performance-data">
                <Link href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-" + cmatch?.subtitle + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
                  <div className="py-2 pb-3">
                    <p className="text-colorSecound text-[11px] mb-4 font-normal">
                      {cmatch.subtitle}, {cmatch.format_str}, {cmatch.venue.location}
                    </p>

                    <div className="flex justify-between items-center text-[14px]">

                      <div className="">
                       
                          <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                            <Image
                              src={cmatch.teama.logo_url || '/assets/img/ring.png'}
                              className="h-[30px] rounded-full"
                              width={30}
                              height={30}
                              alt={cmatch.teama.short_name}
                              loading="lazy"
                            />
                            <div>
                              <span className={`flex items-center gap-1 ${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-medium text-[14px] text-[black]" : "text-[#5e5e5e] font-medium"}`}>
                                {cmatch.teama.short_name}
                              </span>
                              <p className="flex items-end gap-2">
                                <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "font-semibold text-[#434c59]"}`}>
                                  {cmatch.teama.scores}
                                </span>

                                <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "text-[black] text-[12px] font-normal" : "text-colorThird text-[12px] font-normal"}`}>
                                  ({cmatch.teama.overs})
                                </span>
                              </p>
                            </div>
                          </div>
                      
                       
                         
                            <div className="flex items-center space-x-2 font-medium md:w-full">
                              <Image
                                src={cmatch.teamb.logo_url || '/assets/img/ring.png'}
                                className="h-[30px] rounded-full"
                                width={30}
                                height={30}
                                alt={cmatch.teamb.short_name}
                                loading="lazy"
                              />
                              <div>
                                <span className={`flex items-center gap-1 ${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-medium text-[14px] text-[black]" : "text-[#5e5e5e] font-medium"}`}>
                                  {cmatch.teamb.short_name}
                                </span>

                                <p className="flex items-end gap-2">
                                  <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "font-semibold text-[#434c59]"}`}>
                                    {cmatch.teamb.scores}
                                  </span>

                                  <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "text-[black] text-[12px] font-normal" : "text-colorThird text-[12px] font-normal"}`}>
                                    ({cmatch.teamb.overs})
                                  </span>
                                </p>
                              </div>
                            </div>
                         
                       
                      </div>

                     

                      <div className=" w-[50%] font-semibold flex flex-col items-center">
                      {(cmatch?.result_type === 1 || cmatch?.result_type === 2) &&
                        <Image
                          src="/assets/img/home/win.png"
                          width={26}
                          height={30}
                          style={{ width: "26px", height: "30px" }}
                          alt=""
                          loading="lazy"
                        />
                      }
                        <p className="text-accent font-semibold mt-1 text-[13px] w-[60%] text-center">
                          {cmatch.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="border-t-[1px] border-colorFourth"></div>

                <div className="flex items-center justify-between space-x-5 mt-2">
                  <div className="flex items-center">
                    {cmatch?.competition?.total_teams > 2 &&
                      <>
                        <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.competition?.cid + "/points-table"}>
                          <p className=" pr-[10px]  text-colorThird text-[11px] font-medium">
                            {" "}
                            Points Table
                          </p>
                        </Link>


                      </>}
                    {cmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(cmatch.format_str) &&
                      <Link href={("/h2h/" + urlStringEncode(cmatch?.competition?.title === 'Indian Premier League' ? cmatch?.short_title+ "-head-to-head-in-ipl" : cmatch?.title + "-head-to-head-in-" + cmatch?.format_str)).toLowerCase()}>
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
                          <span className="text-colorThird text-[11px] font-medium">
                            H2H
                          </span>
                        </div>
                      </Link>
                    }
                  </div>
                  {(cmatch.man_of_the_match && !Array.isArray(cmatch.man_of_the_match)) &&
                    <>
                      <Link
                        href={
                          "/player/" +
                          playerUrls[cmatch?.man_of_the_match?.pid]
                        }>
                        
                          <div className="flex items-center gap-2" >
                            <PlayerImage key={cmatch?.man_of_the_match?.pid} player_id={cmatch?.man_of_the_match?.pid}
                              height={32}
                              width={32}

                              className="rounded-full" />
                            <div className="text-center">
                              <p className=" font-semibold">{cmatch?.man_of_the_match?.name}</p>
                              <p className="text-[11px]">Man of the match </p>
                            </div>
                          </div>
                       
                      </Link>
                    </>}
                </div>
              </div>
            </div>

          </div>
        ))}

      </div>
    </React.Fragment>

  );
}

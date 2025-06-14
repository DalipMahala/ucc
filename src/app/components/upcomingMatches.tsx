
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
  live: string;
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
  // console.log("upcomingMatch",upcomingMatch[0].teama.logo_url);
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
                      <Image
                        src={ucmatch.teama.logo_url || '/assets/img/ring.png'}
                        className="h-[30px] rounded-full"
                        width={30}
                        height={30}
                        alt={ucmatch.teama.short_name ?? 'team'}
                        loading="lazy"
                      />
                      <span className="font-semibold text-[14px]">
                        {ucmatch.teama.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 font-medium md:w-full">
                      <Image
                        src={ucmatch.teamb.logo_url || '/assets/img/ring.png'}
                        className="h-[30px]"
                        width={30}
                        height={30}
                        alt={ucmatch.teamb.short_name || 'team'}
                        loading="lazy"
                      />
                      <span className="font-semibold text-[14px]">
                        {ucmatch.teamb.name}
                      </span>
                    </div>


                  </div>

                  {/* <div className="h-[100px] border-l-[1px] border-[#efefef]"></div> */}



                  <div className="w-[50%] text-[#144280] flex flex-col items-end">
                    <div className=" font-medium text-center min-h-[60px] min-w-[30%]">

                    {isSameDay(new Date(), new Date(ucmatch.date_start_ist)) ? (
                      <>
                        <span className="text-[13px] font-normal text-colorFirst">Start in</span>

                        <CountdownTimer targetTime={ucmatch.date_start_ist} />
                      </>

                    ) : (
                      <p className="text-[#2F335C] text-[16px]">

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
                  <Link href={("/h2h/" + urlStringEncode(ucmatch?.competition?.title === 'Indian Premier League' ? ucmatch?.short_title + "-head-to-head-in-ipl" : ucmatch?.title + "-head-to-head-in-" + ucmatch?.format_str)).toLowerCase()}>
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

              <div className="flex items-center space-x-2 mb-2">
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

                        <span className="font-semibold text-[14px]">
                          {ucmatch?.teama?.name}
                        </span>

                      </div>
                      <div className="flex items-center space-x-2 font-medium md:w-full">
                        <Image
                          src={ucmatch.teamb.logo_url || '/assets/img/ring.png'}
                          className="h-[30px] rounded-full"
                          width={30}
                          height={30}
                          alt={ucmatch.teamb.short_name}
                          loading="lazy"
                        />
                        <div>
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-[14px]">
                              {ucmatch?.teamb?.name}
                            </span>
                          </span>
                        </div>
                      </div>

                    </div>


                    <div
                      className="w-[80%] flex space-x-1 justify-end text-[#144280] font-semibold text-center countdown min-h-[60px]"
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
                      <div className="hidden md:block h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                    </>}
                  {ucmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(ucmatch.format_str) &&
                    <Link href={("/h2h/" + urlStringEncode(ucmatch?.competition?.title === 'Indian Premier League' ? ucmatch?.short_title + "-head-to-head-in-ipl" : ucmatch?.title + "-head-to-head-in-" + ucmatch?.format_str)).toLowerCase()}>
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

      </div>
    </React.Fragment>

  );
}

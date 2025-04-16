
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
  winning_team_id: string;
  result_type: number;

}

function updateStatusNoteDirect(matchInfo: any) {
  if (!matchInfo?.status_note) return;

  return matchInfo.status_note = matchInfo.status_note
    .replace(/^Stumps : /, '')
    .replace(new RegExp(matchInfo.teama.name, 'gi'), matchInfo.teama.short_name)
    .replace(new RegExp(matchInfo.teamb.name, 'gi'), matchInfo.teamb.short_name);
}

export default async function CompletedMatches() {
  let completedresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/completedMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let completedmatchArray = await completedresponse.json();

  const completedfilteredMatches = completedmatchArray?.data?.map(({ match_info, ...rest }: MatchItem) => ({
    ...match_info,
    ...rest
  }));
  let completedMatch: MatchItem[] = completedfilteredMatches;

  completedMatch = completedMatch?.filter((item: { commentary: number }) => Number(item.commentary) === 1);
  return (
    <React.Fragment>
      <div>
        {completedMatch?.map((cmatch) => (
          <div key={cmatch.match_id}>
            <div
              className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="flex items-center text-[12px] text-[#00a632] rounded-full pr-3 uppercase  font-semibold"
                    style={{ gap: "3px" }}
                  >
                    <div className="w-[8px] h-[8px] bg-[#00a632] rounded-full"></div>{" "}
                    {cmatch.status_str}
                  </div>
                  <div>
                    <Link href={"/series/" + urlStringEncode(cmatch.competition.title + "-" + cmatch.competition.season) + "/" + cmatch.competition.cid}  >
                      <h4 className="text-[13px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                        {cmatch.competition.title} -{" "}
                        {cmatch.competition.season}
                      </h4>
                    </Link>
                  </div>
                </div>

              </div>

              <div className="border-t-[1px] border-[#E7F2F4]"></div>

              <div className="py-3 px-3">
                <div className="flex justify-between items-center text-[14px]">
                  <Link className="w-[61%]" href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-match-" + cmatch?.match_number + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
                    <div className="">
                      <p className="text-[#586577] text-[13px] mb-4 font-medium">
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
                          <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[15px] text-[black]" : "text-[#586577] font-medium text-[14px]"}`}>
                            {cmatch.teama.short_name} -{" "}
                          </span>
                        </div>
                        <p className="text-[14px] flex gap-[4px] items-end">
                          <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[15px] text-[black]" : "font-medium text-[#586577]"}`}>
                            {cmatch.teama.scores}
                          </span>
                          <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "text-[12px] text-[black]" : "font-medium text-[#586577]"}`}>
                            {" "}
                            ({cmatch.teama.overs})
                          </span>
                        </p>
                      </div>

                      <div>
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
                            <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[15px] text-[black]" : "text-[#586577] font-medium text-[14px]"}`}>
                              {cmatch.teamb.short_name} -{" "}
                            </span>
                          </div>
                          <p className="text-[14px] flex gap-[4px] items-end">
                            <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[15px] text-[black]" : "font-medium text-[#586577]"}`}>
                              {cmatch.teamb.scores}
                            </span>
                            <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "text-[12px] text-[black]" : "font-medium text-[#586577]"}`}>
                              ({cmatch.teamb.overs})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="h-[100px] border-l-[1px] border-[#efefef]"></div>

                  <Link className="w-[38%]" href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-match-" + cmatch?.match_number + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
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
                      <p className="text-[#00a632] text-[14px] w-[75%] text-center">
                        {cmatch.result}
                      </p>
                    </div>
                  </Link>

                  {(cmatch.man_of_the_match && !Array.isArray(cmatch.man_of_the_match)) &&
                    <>
                      <div className="h-[100px] border-l-[1px] border-[#e7f2f4]"></div>
                      <Link className="w-[45%]"
                        href={
                          "/player/" +
                          urlStringEncode(cmatch?.man_of_the_match?.name) +
                          "/" +
                          cmatch?.man_of_the_match?.pid
                        }>
                        <div className="flex flex-col items-center">

                          <PlayerImage key={cmatch?.man_of_the_match?.pid} player_id={cmatch?.man_of_the_match?.pid} height={38} width={30} className="rounded-full" />
                          <p className="text-[13px] font-semibold">{cmatch?.man_of_the_match?.name}</p>
                          <p className="text-[11px]">Man of the match</p>
                        </div>
                      </Link>
                    </>
                  }
                </div>

              </div>
              <div className="border-t-[1px] border-[#E7F2F4]"></div>

              <div className="flex items-center justify-between space-x-5 mt-3">
                <div className="flex items-center">
                  {cmatch?.competition?.total_teams > 2 &&
                    <>
                      <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.competition?.cid + "/points-table"}>
                        <p className=" text-[#909090] font-semibold">
                          {" "}
                          Points Table
                        </p>
                      </Link>
                      <div className=" h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                    </>}
                  <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch?.competition?.cid + "/schedule-results/schedule"}>
                    <p className="text-[#909090] font-semibold">
                      Schedule
                    </p>
                  </Link>
                </div>
                {cmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(cmatch.format_str) &&
                  <Link href={("/h2h/" + urlStringEncode(cmatch?.teama?.name + "-vs-" + cmatch?.teamb?.name) + "-head-to-head-in-" + cmatch?.format_str).toLowerCase()}>
                    <div className="flex justify-end items-center space-x-2">
                      <Image
                        src="/assets/img/home/handshake.png"
                        style={{ width: "25px", height: "25px" }}
                        width={25}
                        height={25}
                        alt=""
                        loading="lazy"
                      />
                      <span className="text-[#586577] font-semibold">
                        H2H
                      </span>
                    </div>
                  </Link>
                }
              </div>
            </div>

            
            {/* Mobile */}

            <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="flex text-[12px] items-center text-[#00a632] rounded-full uppercase font-semibold"
                    style={{ gap: "2px" }}
                  >
                    <div className="w-[6px] h-[6px] bg-[#00a632] rounded-full"></div> {cmatch.status_str}
                  </div>
                  <div>
                    <Link href={"/series/" + urlStringEncode(cmatch.competition.title + "-" + cmatch.competition.season) + "/" + cmatch.competition.cid}  >
                      <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                        {truncateText(cmatch.competition.title, 2)} -{" "}
                        {cmatch.competition.season}
                      </h4>
                    </Link>
                  </div>
                  <span className="absolute right-4 top-[19px]">
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

              <div className="open-Performance-data">
                <Link href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-match-" + cmatch?.match_number + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
                  <div className="py-2 pb-3">
                    <p className="text-[#586577] text-[13px] mb-4 font-normal">
                      {cmatch.subtitle}, {cmatch.format_str}, {cmatch.venue.location}
                    </p>
                    <div className="flex justify-between items-center text-[14px]">
                      <div className="w-[100%]">
                        <div className="items-center space-x-2 font-medium md:w-full mb-4">
                          <div className="flex items-center space-x-2">
                            <Image
                              src={cmatch.teama.logo_url || '/assets/img/ring.png'}
                              className="h-[30px] rounded-full"
                              width={30}
                              height={30}
                              alt={cmatch.teama.short_name}
                              loading="lazy"
                            />
                            <div>
                              <span className="flex items-center gap-1">
                                <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[15px] text-[black]" : "text-[#5e5e5e] font-medium"}`}>
                                  {cmatch.teama.short_name}
                                </span>
                              </span>
                              <p className="flex items-end gap-2">
                                <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[15px] text-[black]" : "font-medium text-[#434c59]"}`}>
                                  {cmatch.teama.scores}
                                </span>

                                <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "text-[12px] text-[black]" : "text-[#586577] text-[12px] font-normal"}`}>
                                  ({cmatch.teama.overs})
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <div className="flex items-center space-x-2 font-medium md:w-full">
                            <div className="flex items-center space-x-2">
                              <Image
                                src={cmatch.teamb.logo_url || '/assets/img/ring.png'}
                                className="h-[30px] rounded-full"
                                width={30}
                                height={30}
                                alt={cmatch.teamb.short_name}
                                loading="lazy"
                              />
                              <div>
                                <span className="flex items-center gap-1">
                                  <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[15px] text-[black]" : "text-[#5e5e5e] font-medium"}`}>
                                    {cmatch.teamb.short_name}
                                  </span>
                                </span>
                                <p className="flex items-end gap-2">
                                  <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[15px] text-[black]" : "font-medium text-[#434c59]"}`}>
                                    {cmatch.teamb.scores}
                                  </span>

                                  <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "text-[12px] text-[black]" : "font-medium text-[#434c59]"}`}>
                                    ({cmatch.teama.overs})
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-[100px] border-l-[1px] border-[#f2fafd]"></div>

                      <div className=" w-[50%] font-semibold flex flex-col items-center">
                        <Image
                          src="/assets/img/home/win.png"
                          width={30}
                          height={30}
                          style={{ width: "30px", height: "30px" }}
                          alt=""
                          loading="lazy"
                        />
                        <p className="text-[#00a632] font-semibold mt-1 text-[13px] w-[75%] text-center">
                          {cmatch.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="border-t-[1px] border-[#E7F2F4]"></div>

                <div className="flex items-center justify-between space-x-5 mt-2">
                  <div className="flex items-center">
                    {cmatch?.competition?.total_teams > 2 &&
                      <>
                        <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.competition?.cid + "/points-table"}>
                          <p className=" text-[#909090] text-[13px] font-medium">
                            {" "}
                            Points Table
                          </p>
                        </Link>

                        <div className="hidden md:block h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                      </>}
                    {cmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(cmatch.format_str) &&
                      <Link href={("/h2h/" + urlStringEncode(cmatch?.teama?.name + "-vs-" + cmatch?.teamb?.name) + "-head-to-head-in-" + cmatch?.format_str).toLowerCase()}>
                        <div className="pl-5 border-l-[1px] flex justify-end items-center space-x-2">
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
                  {(cmatch.man_of_the_match && !Array.isArray(cmatch.man_of_the_match)) &&
                    <>
                      <Link
                        href={
                          "/player/" +
                          urlStringEncode(cmatch?.man_of_the_match?.name) +
                          "/" +
                          cmatch?.man_of_the_match?.pid
                        }>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2" >
                            <PlayerImage key={cmatch?.man_of_the_match?.pid} player_id={cmatch?.man_of_the_match?.pid}
                              height={22}
                              width={22}

                              className="rounded-full" />
                            <div className="text-center">
                              <p className=" font-semibold">{truncateText(cmatch?.man_of_the_match?.name, 1)}</p>
                              <p className="text-[11px]">Man of the match </p>
                            </div>
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

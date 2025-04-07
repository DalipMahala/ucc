"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import eventEmitter from "@/utils/eventEmitter";
import { calculateRemainingOvers, getPlayerNameByPid } from "@/utils/utility";
import { PlayerStats } from "@/controller/playerController";
import { urlStringEncode} from "@/utils/utility";

interface Live {
  match_id: number;

  matchData: any | null;

  matchUrl: string | null;

  matchCommentary: any | null;
  isPointTable: boolean;

  // matchLast:any | null;
}

export default function Live({
  match_id,
  matchData,
  matchUrl,
  matchCommentary,
  isPointTable
}: // matchLast,
Live) {
  const [activeTab, setActiveTab] = useState("tab1");

  let commentaries = [...matchCommentary?.commentaries]?.reverse();

  const matchLiveData = matchData;

  
  let teamwinpercentage = matchLiveData?.teamwinpercentage;
  let matchDetails = matchLiveData?.match_info;
  let players = matchLiveData?.players;
  let matchinfo = matchLiveData?.live;
  let matchinning = matchLiveData?.live?.live_inning;
  let batsman = matchinfo?.batsmen;
  let bowlers = matchinning?.bowlers;
  let fows = matchinning?.fows;
  let yetTobat = matchinning?.did_not_bat;
  let currPartnership = matchLiveData?.live?.live_inning?.current_partnership;
  let currentOver = Math.floor(matchinning?.equations.overs);
  let lastOver = currentOver - 1;
  let thisOverRun = commentaries?.filter(
    (events: { event: string; over: any }) =>
      Number(events.over) === currentOver && events.event !== "overend"
  );
  let lastOverRun = commentaries?.filter(
    (events: { event: string; over: any }) =>
      Number(events.over) === lastOver && events.event !== "overend"
  );
  let thisOvertotalRuns = thisOverRun?.reduce(
    (accumulator: number, currentEvent: { run: number }) => {
      return accumulator + currentEvent.run;
    },
    0
  );
  let lastOvertotalRuns = lastOverRun?.reduce(
    (accumulator: number, currentEvent: { run: number }) => {
      return accumulator + currentEvent.run;
    },
    0
  );
 
  if (commentaries) {
    commentaries = [...commentaries]?.reverse();
  }
 


  // Merge new unique data into firstArray
  let updatedCommentaries =commentaries;



  const [filter, setFilter] = useState("All");
  // console.log("filter", filter);
  if (filter === "all") {
    updatedCommentaries;
  } else if (filter === "6s") {
    updatedCommentaries = updatedCommentaries.filter(
      (item: { score: number; event: string }) => Number(item.score) === 6
    );
  } else if (filter === "4s") {
    updatedCommentaries = updatedCommentaries.filter(
      (item: { score: number; event: string }) => Number(item.score) === 4
    );
  } else if (filter === "Wicket") {
    updatedCommentaries = updatedCommentaries.filter(
      (item: { score: string; event: string }) => item.score === "w"
    );
  } else if (filter === "Overs") {
    updatedCommentaries = updatedCommentaries.filter(
      (item: { score: string; event: string }) => item.event === "overend"
    );
  } else {
    updatedCommentaries;
  }

  // console.log("allComm1", newCommentary);

  // const playerName = getPlayerNameByPid(players, 117226);

  const numberOfSpans = 6 - thisOverRun?.length;
  const emptySpans = [];
  for (let i = 0; i < numberOfSpans; i++) {
    emptySpans.push(
      <span
        className="px-2 py-1 border rounded text-gray-700"
        key={`empty-${i}`}
      >
        {/* Empty span */}&nbsp;&nbsp;&nbsp;
      </span>
    );
  }

  const maxOver = matchinning?.max_over;
  const finishOver = matchinfo?.live_score?.overs;
  const remainingOvers = calculateRemainingOvers(maxOver, finishOver);

  const matchFormat = matchDetails?.competition?.match_format;
  if(matchinfo?.bowlers?.[0]?.overs != 0){
    // const bowlerPlayerStats =  PlayerStats(matchinfo?.bowlers?.[0]?.bowler_id,matchFormat,"bowling");
    // console.log("bowlerPlayerStats",bowlerPlayerStats);
  }
  if(matchinfo?.batsmen?.[0]?.balls_faced == 0 || matchinfo?.batsmen?.[1]?.balls_faced == 0){
    // const batsmaPplayerStats =  PlayerStats(matchinfo?.bowlers?.[0]?.bowler_id,matchFormat,"batting");
    // console.log("batsmaPplayerStats",batsmaPplayerStats);
  }
 

  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <div id="tabs" className="my-4">
        <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
          <Link href={"/moreinfo/" + matchUrl + "/" + match_id}>
            <button className="font-medium py-2 px-3 whitespace-nowrap ">
              More Info
            </button>
          </Link>
          <Link href={"/live-score/" + matchUrl + "/" + match_id}>
            <button className="font-medium py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md">
              Live
            </button>
          </Link>
          <Link href={"/scorecard/" + matchUrl + "/" + match_id}>
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Scorecard
            </button>
          </Link>
          <Link href={"/squad/" + matchUrl + "/" + match_id}>
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Squad
            </button>
          </Link>
          {isPointTable && (
          <Link href={"/series/"+urlStringEncode(matchDetails?.competition?.title+"-"+matchDetails?.competition?.season)+"/"+matchDetails?.competition?.cid+"/points-table"}>
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Points Table
            </button>
          </Link>
          )}
          <Link href={"/series/"+urlStringEncode(matchDetails?.competition?.title+"-"+matchDetails?.competition?.season)+"/"+matchDetails?.competition?.cid+"/stats/most-run"}>
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Stats
            </button>
          </Link>
        </div>
      </div>

      <div id="tab-content">
        <div id="live" className="tab-content ">
          <div className="md:grid grid-cols-12 gap-4">
            <div className="lg:col-span-8 md:col-span-7 lg:grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <div className="rounded-lg bg-white">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <Link href={"/player/"+urlStringEncode(getPlayerNameByPid(
                                                      players,
                                                      batsman?.[0]?.batsman_id
                                                    ))+"/"+batsman?.[0]?.batsman_id}>
                        <div className="flex items-center gap-3">
                          <div>
                            <Image  loading="lazy" 
                              src="/assets/img/player/1.png"
                              width={40}
                              height={40}
                              alt="R sharma (c)"
                              className="rounded-lg"
                            />
                          </div>
                          <div className="font-medium">
                            <h2 className="md:text-[15px] text-[14px] text-[#909090]">
                              {getPlayerNameByPid(
                                players,
                                batsman?.[0]?.batsman_id
                              )}{" "}
                            </h2>
                            <p className="md:text-[15px] text-[14px] flex items-center">
                              {batsman?.[0].runs}{" "}
                              <span className="md:text-[13px] text-[12px] text-[#909090] px-1">
                                ({batsman?.[0]?.balls_faced})
                              </span>
                              {batsman?.[0]?.batsman_id ==
                              currPartnership?.batsmen?.[0]?.batsman_id ? (
                                <Image  loading="lazy" 
                                  src="/assets/img/home/bat.png"
                                  className="h-[14px]"
                                  width={14}
                                  height={14}
                                  alt=""
                                />
                              ) : (
                                ""
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="font-medium text-center">
                        <p className="md:text-[18px] text-[15px] text-[#13b76dbd]">
                          {currPartnership?.runs}{" "}
                          <span className="md:text-[15px] text-[13px] text-black">
                            ({currPartnership?.balls})
                          </span>
                        </p>
                        <p>Partnership</p>
                      </div>
                      <Link href={"/player/"+urlStringEncode(getPlayerNameByPid(
                                                      players,
                                                      batsman?.[1]?.batsman_id
                                                    ))+"/"+batsman?.[1]?.batsman_id}>
                        <div className="flex items-center justify-end flex-row-reverse gap-3">
                          <div>
                            <Image  loading="lazy" 
                              src="/assets/img/player/2.png"
                              width={40}
                              height={40}
                              alt="R sharma (c)"
                              className="rounded-lg"
                            />
                          </div>
                          <div className="font-medium text-end">
                            <h2 className="md:text-[15px] text-[14px] text-[#909090]">
                              {getPlayerNameByPid(
                                players,
                                batsman?.[1]?.batsman_id
                              )}
                            </h2>
                            <p className="md:text-[15px] text-[14px] flex items-center">
                              {batsman?.[1]?.runs}{" "}
                              <span className="md:text-[13px] text-[12px] text-[#909090] pl-1">
                                ({batsman?.[1]?.balls_faced})
                              </span>
                              {batsman?.[0]?.batsman_id ==
                              currPartnership?.batsman?.[1]?.batsman_id ? (
                                <Image  loading="lazy" 
                                  src="/assets/img/home/bat.png"
                                  className="h-[14px]"
                                  width={14}
                                  height={14}
                                  alt=""
                                />
                              ) : (
                                ""
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 my-4 lg:my-0">
                <div className="rounded-lg bg-white p-4">
                  <Link href={"/player/"+urlStringEncode(getPlayerNameByPid(
                                                  players,
                                                  matchinfo?.bowlers?.[0]?.bowler_id
                                                ))+"/"+matchinfo?.bowlers?.[0]?.bowler_id}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image  loading="lazy" 
                          src="/assets/img/player/13.png"
                          className="h-[40px]"
                          width={40}
                          height={40}
                          alt="T Ahmed"
                        />
                        <Image  loading="lazy" 
                          src="/assets/img/player/ball.png"
                          className="absolute -bottom-1.5 -right-0.5 h-[13px] bg-white rounded-full p-[2px]"
                          width={13}
                          height={13}
                          alt=""
                        />
                        <p />
                      </div>
                      <div className="font-medium">
                        <h2 className="md:text-[15px] text-[14px] text-[#909090]">
                          {getPlayerNameByPid(
                            players,
                            matchinfo?.bowlers?.[0]?.bowler_id
                          )}
                        </h2>
                        <p className="md:text-[15px] text-[14px] flex items-center">
                          {matchinfo?.bowlers?.[0]?.wickets}-
                          {matchinfo?.bowlers?.[0]?.runs_conceded}{" "}
                          <span className="md:text-[13px] text-[12px] text-[#909090] pt-[4px] px-1">
                            ({matchinfo?.bowlers?.[0]?.overs})
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-span-12 mb-4 md:mb-0">
                <div className="rounded-lg bg-white p-4 flex lg:flex-row flex-col items-center md:gap-8 gap-4">
                  {/* Last Over Section */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#909090]">
                      Last Over:
                    </span>
                    <div className="flex gap-1">
                      {lastOverRun?.map((lastOver: any, index: number) => (
                        <span
                          className={`px-2 py-1 border rounded ${
                            lastOver.score == 6
                              ? "bg-[#13b76dbd] text-white"
                              : lastOver.score == 4
                              ? "bg-orange-500 text-white"
                              : lastOver.score == "w"
                              ? "bg-red-500 text-white"
                              : "text-gray-700"
                          }`}
                          key={index}
                        >
                          {lastOver.score}
                        </span>
                      ))}
                    </div>
                    <span className="font-medium text-1xl text-[#6A7586]">
                      = {lastOvertotalRuns}
                    </span>
                  </div>
                  {/* This Over Section */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#909090]">
                      This Over:
                    </span>
                    <div className="flex gap-1">
                      {thisOverRun?.map((thisOver: any, index: number) => (
                        <span
                          className={`px-2 py-1 border rounded ${
                            thisOver.score == 6
                              ? "bg-[#13b76dbd] text-white"
                              : thisOver.score == 4
                              ? "bg-orange-500 text-white"
                              : thisOver.score == "w"
                              ? "bg-red-500 text-white"
                              : "text-gray-700"
                          }`}
                          key={index}
                        >
                          {thisOver.score}
                        </span>
                      ))}

                      {emptySpans}
                    </div>
                    <span className="font-medium text-1xl text-[#6A7586]">
                      = {thisOvertotalRuns}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 md:col-span-5">
              <div className="rounded-lg bg-[#ffffff]">
                <div className="p-4 cust-box-click-container">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="border-l-[3px] border-[#229ED3] h-[19px]" />
                      <h3 className="text-1xl font-semibold">Probability</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={`cust-box-click-button  font-medium ${
                          activeTab === "tab1"
                            ? "bg-[#081736] text-[#ffffff] "
                            : "bg-[#ffffff] text-[#6A7586]"
                        } px-5 py-1 rounded-full`}
                        onClick={() => setActiveTab("tab1")}
                      >
                        <span>% View</span>
                      </button>
                      <button
                        className={`cust-box-click-button font-medium ${
                          activeTab === "tab2"
                            ? "bg-[#081736] text-[#ffffff] "
                            : "bg-[#ffffff] text-[#6A7586]"
                        }  px-5 py-1 rounded-full`}
                        onClick={() => setActiveTab("tab2")}
                      >
                        <span>Odds View</span>
                      </button>
                    </div>
                  </div>
                  {activeTab === "tab1" && (
                    <div className="cust-box-click-content">
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="font-semibol"></p>
                          { remainingOvers < "0" ? (""):(
                          <p className="text-[#909090]">
                            Overs left today:{" "}
                            <span className="font-semibol text-black">
                              {remainingOvers}
                            </span>
                          </p>
                        )}
                        </div>
                        <div className="relative mt-4 h-[4px] bg-gray-200 overflow-hidden">
                          <div
                            className="absolute h-full bg-[#13b76dbd]"
                            style={{
                              width: `${teamwinpercentage?.team_a_win}%`,
                            }}
                          />
                          <div
                            className="absolute h-full bg-[#EB9D29]"
                            style={{
                              width: `${teamwinpercentage?.draw}%`,
                              left: `${teamwinpercentage?.team_a_win}%`,
                            }}
                          ></div>
                          <div
                            className="absolute h-full bg-[#B7132B]"
                            style={{
                              width: `${teamwinpercentage?.team_b_win}%`,
                              left: `${
                                teamwinpercentage?.draw +
                                teamwinpercentage?.team_a_win
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <p className="text-green-600 font-medium">
                            {matchDetails?.teama?.short_name}:{" "}
                            {teamwinpercentage?.team_a_win}%
                          </p>
                          {teamwinpercentage?.draw > 0 ? (
                            <p className="text-yellow-600 font-medium">
                              Drew: {teamwinpercentage?.draw}%
                            </p>
                          ) : (
                            ""
                          )}
                          <p className="text-red-600 font-medium">
                            {matchDetails?.teamb?.short_name}:{" "}
                            {teamwinpercentage?.team_b_win}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "tab2" && (
                    <div className="cust-box-click-content">
                      <div className="flex justify-between items-center border-t-[1px] pt-2">
                        <div className="text-1xl font-medium">
                          {matchLiveData?.match_info?.teama?.short_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="py-1 px-4 bg-orange-500 rounded-md text-white">
                            { (matchLiveData?.live_odds?.matchodds?.teama?.back !== null && matchLiveData?.live_odds?.matchodds?.teama?.back !== undefined && matchLiveData?.live_odds?.matchodds?.teama?.back !== "") ? Math.round((matchLiveData?.live_odds?.matchodds?.teama?.back)*100-100) :
                              0}
                          </p>
                          <p className="py-1 px-4 bg-orange-500 rounded-md text-white">
                            {(matchLiveData?.live_odds?.matchodds?.teama?.lay !== null && matchLiveData?.live_odds?.matchodds?.teama?.lay !== undefined && matchLiveData?.live_odds?.matchodds?.teama?.lay !== "") ? Math.round((matchLiveData?.live_odds?.matchodds?.teama?.lay)*100-100) :
                              0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="cust-box-click-container">
            <div className="my-2">
              <div className="flex gap-[10px] justify-between overflow-auto items-center py-2">
                <p className="font-medium text-[14px]">Commentary</p>
                {[
                  "All",
                  "View",
                  "Overs",
                  "Wicket",
                  "6s",
                  "4s",
                  "Inn1",
                  "Inn2",
                  "Inn3",
                  "Inn4",
                  "Milestone",
                ].map((item) => (
                  <button
                    key={item}
                    className={`cust-box-click-button px-5 py-1 rounded-full font-medium ${
                      filter === item
                        ? "bg-[#081736] text-[#ffffff]"
                        : "bg-[#ffffff] text-[#6A7586]"
                    }`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="cust-box-click-content">
              {updatedCommentaries?.map((comment: any, index: number) =>
                comment?.event === "overend" ? (
                  <div className="rounded-t-lg bg-white p-4 mt-4" key={index}>
                    <div className="flex md:flex-row flex-col justify-between md:items-center gap-2">
                      <div className="text-[14px] font-normal">
                        {matchinning.short_name} : {comment.score}
                      </div>
                      <div className="text-[14px] font-normal">
                        {comment?.over}{" "}
                        <span className="text-[#909090] font-medium text-[13px]">
                          End Of Over
                        </span>
                      </div>
                      <div className="text-[14px] font-normal text-black">
                        {lastOverRun &&
                          lastOverRun.map((lastOver: any, idx: number) => (
                            <span key={idx}>{lastOver.score} </span>
                          ))}
                      </div>
                      <div className="text-[14px] font-normal">
                        {getPlayerNameByPid(
                          players,
                          comment?.bats?.[0]?.batsman_id
                        )}
                        : {comment?.bats?.[0]?.runs}{" "}
                        <span className="text-[#909090]">
                          ({comment?.bats?.[0]?.balls_faced})
                        </span>{" "}
                        |{" "}
                        {getPlayerNameByPid(
                          players,
                          comment?.bats?.[1]?.batsman_id
                        )}
                        : {comment?.bats?.[1]?.runs}{" "}
                        <span className="text-[#909090]">
                          ({comment?.bats?.[1]?.balls_faced})
                        </span>
                      </div>
                      <div className="text-[14px] font-normal">
                        {getPlayerNameByPid(
                          players,
                          comment?.bowls?.[0]?.bowler_id
                        )}{" "}
                        <span className="text-[#909090]">
                          {comment?.bowls?.[0]?.overs}-
                          {comment?.bowls?.[0]?.runs_conceded}-
                          {comment?.bowls?.[0]?.wickets}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                  <div className="rounded-t-lg bg-white" key={index}>
                    <div className="border-t-[1px] border-[#E7F2F4]" />
                    <div
                      className="md:flex items-start py-3 md:px-3 gap-[21px] bg-white p-4"
                      key={comment.event_id}
                    >
                      <div className="flex items-center gap-[10px] md:py-4 pb-4">
                        <p className="text-[16px] font-semibold">
                          {comment?.over}.{comment?.ball}
                        </p>
                        <p
                          className={`text-[16px] font-semibold px-[11px] py-[2px] rounded-lg ${
                            comment?.run == 6
                              ? "bg-[#13b76dbd] text-white"
                              : comment?.run == 4
                              ? "bg-orange-500 text-white"
                              : comment?.score == "w"
                              ? "bg-red-500 text-white"
                              : " text-white bg-[#bec2d3]"
                          }`}
                        >
                          {comment?.score}
                        </p>
                      </div>
                      <div>
                        <div className="text-gray-500 font-normal text-[14px] mb-2">
                          {
                            comment?.commentary
                              .split(",")
                              .map((item: string) => item.trim())[0]
                          }
                          {", "}
                          <span className="text-[14px] font-normal text-black">
                            {
                              comment?.commentary
                                .split(",")
                                .map((item: string) => item.trim())[1]
                            }
                          </span>
                        </div>
                        <p className="text-[14px] font-normal">
                          {comment?.text}
                        </p>
                      </div>
                    </div>
                    {comment?.wicket_batsman_id !== undefined ? (
                      <div className="">
                        <div
                          className="text-white p-4 rounded-lg"
                          style={{
                            background:
                              "linear-gradient(90deg, #D20A5E 0%, #9C0C0C 100%)",
                          }}
                        >
                          
                          <div className="md:flex items-center justify-between">
                            <div className="flex items-center">
                              <Image  loading="lazy" 
                                src="/assets/img/player/15.png"
                                width={65}
                                height={65}
                                alt="Player"
                                className="md:mr-4 mr-2 h-[40px] md:h-[auto]"
                              />
                              <div>
                                <h2 className="md:text-xl text-[16px] font-semibold flex gap-3">
                                  <span>{getPlayerNameByPid(players, comment?.wicket_batsman_id !== undefined ? JSON.parse(comment?.wicket_batsman_id) : {})}</span>{" "}
                                  <span className="text-[#BFEF50] text-[14px]">
                                    {comment?.batsman_runs}({comment?.batsman_balls})
                                  </span>
                                </h2>
                                <p className="text-[14px] font-normal">
                                  {comment?.how_out}{" "}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-4 justify-end">
                              <div>
                                <p className="md:text-1xl text-[14px] font-normal">
                                  {/* 4s/6s */}
                                </p>
                                <p className="md:text-2xl text-[16px] font-semibold">
                                  {/* 6/0 */}
                                </p>
                              </div>
                              <div className="text-end">
                                <p className="md:text-1xl text-[14px] font-normal">
                                  {/* SR */}
                                </p>
                                <p className="md:text-2xl text-[16px] font-semibold">
                                  {/* 153.63 */}
                                </p>
                              </div>
                            </div>
                          </div>
                         
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    </div>
                  </>
                )
              )}
              {matchinfo?.bowlers?.[0]?.overs == 3000 ? 
              <div className="my-4">
                  <div
                    className="text-white p-4 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(90deg, #2D71D6 0%, #114DA6 100%)",
                    }}
                  >
                    <h2 className="text-[14px] font-normal mb-4">
                      New bowler spell
                    </h2>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                         
                            
                        
                        <Image  loading="lazy" 
                          src="/assets/img/player/14.png"
                          width={65}
                          height={65}
                          alt="Player"
                          className="md:mr-4 mr-2 h-[40px] md:h-[auto]"
                        />
                        {/* Player Info */}
                        <div>
                          <h2 className="md:text-xl text-[16px] font-semibold">
                            {getPlayerNameByPid(
                            players,
                            matchinfo?.bowlers?.[0]?.name
                          )}
                          </h2>
                          <p className="text-[14px] font-normal">
                            35 year (bowler)
                          </p>
                        </div>
                      </div>
                      {/* Best Score */}
                      <div className="flex gap-3 items-center">
                        <p className="text-1xl font-normal">Best</p>
                        <h1 className="md:text-2xl text-[16px] font-semibold">
                          4/12
                        </h1>
                      </div>
                    </div>
                    {/* Player Stats */}
                    <div className="mt-4 md:flex grid grid-cols-12 justify-between md:gap-4 text-center border-t border-[#9d9d9d] pt-3">
                      <div className="col-span-6 flex gap-2 items-center">
                        <p className="md:text-[14px] text-[13px] font-normal">
                          MATCHES
                        </p>
                        <h2 className="md:text-xl text-[14px] md:font-bold font-semibold">
                          79
                        </h2>
                      </div>
                      <div className="col-span-6 flex gap-2 items-center justify-end">
                        <p className="md:text-[14px] text-[13px] font-normal">
                          Wickets
                        </p>
                        <h2 className="md:text-xl text-[14px] md:font-bold font-semibold">
                          123
                        </h2>
                      </div>
                      <div className="col-span-6 flex gap-2 items-center">
                        <p className="md:text-[14px] text-[13px] font-normal">
                          Econ
                        </p>
                        <h2 className="md:text-xl text-[14px] md:font-bold font-semibold">
                          5.00
                        </h2>
                      </div>
                      <div className="col-span-6 flex gap-2 items-center justify-end">
                        <p className="md:text-[14px] text-[13px] font-normal">
                          AVG
                        </p>
                        <h2 className="md:text-xl text-[14px] md:font-bold font-semibold">
                          26.00
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              :("")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

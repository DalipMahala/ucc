"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import eventEmitter from "@/utils/eventEmitter";
import { calculateRemainingOvers, getPlayerNameByPid } from "@/utils/utility";
import { PlayerStats } from "@/controller/playerController";
import { urlStringEncode } from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";
import { useWakeLock } from '@/utils/useWakeLock';
import MatchTabs from "./../matchComponents/Menu";

interface Live {
  match_id: number;

  matchData: any | null;

  matchUrl: string | null;

  matchCommentary: any | null;
  isPointTable: boolean;
  // matchLast:any | null;
}

function getPlayerRecord(scoreCard: any, pid: number) {
  return scoreCard?.batsmen.find((batsman: { batsman_id: any; }) => Number(batsman.batsman_id) === pid);
}
export default function LiveResult({
  match_id,
  matchData,
  matchUrl,
  matchCommentary,
  isPointTable
}: // matchLast,
  Live) {
  useWakeLock();
  const [activeTab, setActiveTab] = useState("tab2");

  // const [allCommentries, setAllCommentries] = useState(
  //   [...matchCommentary?.commentaries]?.reverse()
  // );

  const [allCommentries, setAllCommentries] = useState(
    Array.isArray(matchCommentary?.commentaries)
      ? [...matchCommentary.commentaries].reverse()
      : []
  );
  const [matchLiveData, setmatchLiveData] = useState(matchData);
  // let matchInningbatsmen = matchCommentary?.commentaries[6]?.bowlers?.bowls?.overs;

  // let commentaries = matchInningCommentaries;


  // console.log("LiveOdds", matchOdds?.oddsEvent);
  let teamwinpercentage = matchLiveData?.teamwinpercentage;
  let matchDetails = matchLiveData?.match_info;
  let players = matchLiveData?.players;
  let matchinfo = matchLiveData?.live;
  let matchinning = matchLiveData?.live?.live_inning;
  let commentaries = matchLiveData?.live?.commentaries;
  let scorecard = matchLiveData?.scorecard?.innings.find((inning: { number: number; }) => inning.number === 2);
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
  // const players = matchStates?.players;
  const [latestInning, setLatestInning] = useState(matchLiveData?.live?.live_inning_number);
  if (
    matchLiveData !== undefined &&
    matchLiveData?.match_id == match_id &&
    matchLiveData?.live?.live_inning !== undefined &&
    matchLiveData?.live?.live_inning !== ""
  ) {
    matchData = matchLiveData;
    teamwinpercentage = matchLiveData?.teamwinpercentage;
    matchDetails = matchLiveData?.match_info;
    matchinfo = matchLiveData?.live;
    players = matchLiveData?.players;
    matchinning = matchLiveData?.live?.live_inning;
    commentaries = matchLiveData?.live?.commentaries;
    scorecard = matchLiveData?.scorecard?.innings.find((inning: { number: number; }) => inning.number === latestInning);
    batsman = matchinfo.batsmen;
    bowlers = matchinning.bowlers;
    fows = matchinning.fows;
    yetTobat = matchinning.did_not_bat;
    currPartnership = matchinning.current_partnership;
    currentOver = Math.floor(matchinning.equations.overs);
    lastOver = currentOver - 1;
    thisOverRun = commentaries.filter(
      (events: { event: string; over: any }) =>
        Number(events.over) === currentOver && events.event !== "overend"
    );
    lastOverRun = commentaries.filter(
      (events: { event: string; over: any }) =>
        Number(events.over) === lastOver && events.event !== "overend"
    );
    thisOvertotalRuns = thisOverRun?.reduce(
      (accumulator: number, currentEvent: { run: number }) => {
        return accumulator + currentEvent.run;
      },
      0
    );
    lastOvertotalRuns = lastOverRun?.reduce(
      (accumulator: number, currentEvent: { run: number }) => {
        return accumulator + currentEvent.run;
      },
      0
    );
  }

  if (commentaries) {
    commentaries = [...commentaries]?.reverse();
  }

  const newCommentary = commentaries?.filter(
    (item: {
      event_id: any;
      event: string;
      over: number;
      wicket_batsman_id: string;
    }) =>
      !allCommentries.some(
        (existingItem: {
          event_id: any;
          event: string;
          over: number;
          wicket_batsman_id: string;
        }) =>
          item?.event_id
            ? existingItem?.event_id === item?.event_id &&
            existingItem?.event === item?.event // Compare event_id for regular events
            : existingItem?.event === "overend" &&
            existingItem?.over === item?.over // Compare "overend" events by over number
      )
  );
  // Merge new unique data into firstArray
  let updatedCommentaries = [...allCommentries];
  // console.log("comment", newCommentary);
  if (newCommentary && Array.isArray(newCommentary)) {
    newCommentary.forEach(
      (newItem: { event_id: number; event: string; commentary: string }) => {
        const index = updatedCommentaries.findIndex(
          (existingItem) => existingItem?.event_id === newItem?.event_id
        );

        if (index !== -1) {
          //  Update existing item
          allCommentries[index] = { ...updatedCommentaries[index], ...newItem };
        } else {
          //  Add new item if not found
          // updatedCommentaries.unshift(newItem);
          updatedCommentaries = [...newCommentary, ...updatedCommentaries];
        }
      }
    );
  }
  let filteredCommentaries = [];
  // let updatedCommentaries = [...newCommentary, ...allCommentries];
  if (allCommentries.length !== updatedCommentaries.length) {
    setAllCommentries(updatedCommentaries);
  }
  const [innCommentary, setInnCommentary] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  // console.log("filter", filter);
  if (filter === "all") {
    updatedCommentaries;
  } else if (filter === "6s") {
    filteredCommentaries = updatedCommentaries.filter(
      (item: { score: number; event: string }) => Number(item?.score) === 6
    );
    updatedCommentaries =
      filteredCommentaries.length > 0
        ? filteredCommentaries
        : [{ errorMessage: "Record not found" }];
  } else if (filter === "4s") {
    filteredCommentaries = updatedCommentaries.filter(
      (item: { score: number; event: string }) => Number(item?.score) === 4
    );
    updatedCommentaries =
      filteredCommentaries.length > 0
        ? filteredCommentaries
        : [{ errorMessage: "Record not found" }];
  } else if (filter === "Wicket") {
    filteredCommentaries = updatedCommentaries.filter(
      (item: { score: string; event: string }) => item?.score === "w"
    );
    updatedCommentaries =
      filteredCommentaries.length > 0
        ? filteredCommentaries
        : [{ errorMessage: "Record not found" }];
  } else if (filter === "Overs") {
    filteredCommentaries = updatedCommentaries.filter(
      (item: { score: string; event: string }) => item?.event === "overend"
    );
    updatedCommentaries =
      filteredCommentaries.length > 0
        ? filteredCommentaries
        : [{ errorMessage: "Record not found" }];
  } else if (
    filter === "Inn1" ||
    filter === "Inn2" ||
    filter === "Inn3" ||
    filter === "Inn4" ||
    filter === "Inn5" ||
    filter === "Inn6"
  ) {
    updatedCommentaries = innCommentary;
  } else {
    updatedCommentaries;
  }

  const errorMessage = updatedCommentaries[0]?.errorMessage;

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
  if (matchinfo?.bowlers?.[0]?.overs != 0) {
    // const bowlerPlayerStats =  PlayerStats(matchinfo?.bowlers?.[0]?.bowler_id,matchFormat,"bowling");
    // console.log("bowlerPlayerStats",bowlerPlayerStats);
  }
  if (
    matchinfo?.batsmen?.[0]?.balls_faced == 0 ||
    matchinfo?.batsmen?.[1]?.balls_faced == 0
  ) {
    // const batsmanPlayerStats =  PlayerStats(matchinfo?.bowlers?.[0]?.bowler_id,matchFormat,"batting");
    // console.log("batsmanPlayerStats",batsmanPlayerStats);
  }

  let baseFilterArray = ["All", "Overs", "Wicket", "6s", "4s"];
  let inningsArray = [
    "Inn1",
    "Inn2",
    "Inn3",
    "Inn4",
    "Inn5",
    "Inn6",
    "Inn7",
    "Inn8",
  ];

  // Select the first 'count' elements from inningsArray
  let updatedFilterarray = inningsArray.slice(
    0,
    matchDetails?.latest_inning_number
  );

  // Merge the arrays
  updatedFilterarray = [...baseFilterArray, ...updatedFilterarray];
  const [visibleCount, setVisibleCount] = useState(20);
  const loaderRef = useRef(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    async function fetchCommentary(inn: number) {
      const response: any = await fetch(`/api/match/MatchCommentary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
        },
        body: JSON.stringify({ matchid: match_id, inningNumer: inn }),
      });
      const result = await response.json();
      let commentariesInn = result?.data?.commentaries;
      commentariesInn = [...commentariesInn]?.reverse();
      setInnCommentary(commentariesInn);
    }
    if (/^Inn\d+$/.test(filter)) {
      // ✅ More dynamic filter check
      const numberPart = parseInt(filter.replace(/\D/g, ""), 10);
      fetchCommentary(numberPart);
      setVisibleCount(20);
      setLatestInning(numberPart);
    }
  }, [filter]);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect(); // ✅ Disconnect previous observer
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filter, loaderRef.current]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loaderRef.current) {
        // console.log("Loader Ref Found:", loaderRef.current);
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadMore();
            }
          },
          { threshold: 1.0 }
        );

        observerRef.current.observe(loaderRef.current);
        clearInterval(interval);
      } else {
        // console.log("Waiting for loaderRef...");
      }
    }, 100); // Check every 100ms
    return () => {
      clearInterval(interval);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [filter]);

  const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getAllPlayerIds = () => {
      const allIds = [
        matchinfo?.bowlers?.[0]?.bowler_id,
        batsman?.[0]?.batsman_id,
        batsman?.[1]?.batsman_id,
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
  }, []);


  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <MatchTabs matchUrl={matchUrl} match_id={match_id} matchDetails={matchDetails} isPointTable={isPointTable} />
      {updatedCommentaries && updatedCommentaries.length > 0 ? (
        <div id="tab-content">
          <div id="live" className="tab-content ">
            <div className="md:grid grid-cols-12 gap-4">

              <div className="lg:col-span-12 md:col-span-7 lg:grid grid-cols-12 gap-4">
                <div className="col-span-8">
                  <div className="rounded-lg bg-white">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <Link className="w-[43%]"
                          href={
                            "/player/" + playerUrls[batsman?.[0]?.batsman_id]
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <PlayerImage
                                key={batsman?.[0]?.batsman_id}
                                player_id={batsman?.[0]?.batsman_id}
                                height={40}
                                width={40}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="font-medium">
                              <h2 className="md:text-[15px] text-[14px] text-[#757A82]">
                                {getPlayerNameByPid(
                                  players,
                                  batsman?.[0]?.batsman_id
                                )}{" "}
                              </h2>
                              <p className="md:text-[15px] text-[14px] flex items-center">
                                {batsman?.[0].runs}{" "}
                                <span className="md:text-[13px] text-[12px] text-[#757A82] px-1">
                                  ({batsman?.[0]?.balls_faced})
                                </span>
                                {batsman?.[0]?.batsman_id ==
                                  currPartnership?.batsmen?.[0]?.batsman_id ? (
                                  <Image
                                    src="/assets/img/home/bat.png"
                                    className="h-[13px]"
                                    width={12}
                                    height={13}
                                    alt=""
                                    loading="lazy"
                                  />
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div className="font-medium text-center w-[14%] ">
                          <p className="md:text-[18px] text-[15px] text-[#13b76dbd]">
                            {currPartnership?.runs}{" "}
                            <span className="md:text-[15px] text-[13px] text-black">
                              ({currPartnership?.balls})
                            </span>
                          </p>
                          <p>P-ship</p>
                        </div>


                        <Link className="w-[43%] flex justify-end"
                          href={
                            "/player/" +
                            playerUrls[batsman?.[1]?.batsman_id]
                          }
                        >
                          <div className="flex items-center justify-end flex-row-reverse gap-3">
                            <div>
                              <PlayerImage
                                key={batsman?.[1]?.batsman_id}
                                player_id={batsman?.[1]?.batsman_id}
                                height={40}
                                width={40}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="font-medium text-end">
                              <h2 className="md:text-[15px] text-[14px] text-[#757A82]">
                                {getPlayerNameByPid(
                                  players,
                                  batsman?.[1]?.batsman_id
                                )}
                              </h2>
                              <p className="md:text-[15px] text-[14px] flex items-center justify-end">
                                {batsman?.[1]?.runs}{" "}
                                <span className="md:text-[13px] text-[12px] text-[#757A82] pl-1">
                                  ({batsman?.[1]?.balls_faced})
                                </span>
                                {batsman?.[0]?.batsman_id ==
                                  currPartnership?.batsman?.[1]?.batsman_id ? (
                                  <Image
                                    src="/assets/img/home/bat.png"
                                    className="h-[14px]"
                                    width={14}
                                    height={14}
                                    alt=""
                                    loading="lazy"
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
                  <div className="hidden md:block  rounded-lg bg-white p-4">
                    <Link
                      href={
                        "/player/" +
                        playerUrls[matchinfo?.bowlers?.[0]?.bowler_id]
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <PlayerImage
                            key={matchinfo?.bowlers?.[0]?.bowler_id}
                            player_id={matchinfo?.bowlers?.[0]?.bowler_id}
                            height={40}
                            width={40}
                            className="rounded-lg"
                          />
                          <Image
                            src="/assets/img/player/ball.png"
                            className="absolute -bottom-1.5 -right-0.5 h-[13px] bg-white rounded-full p-[2px]"
                            width={13}
                            height={13}
                            alt=""
                            loading="lazy"
                          />
                          <p />
                        </div>
                        <div className="font-medium">
                          <h2 className="md:text-[15px] text-[14px] text-[#757A82]">
                            {getPlayerNameByPid(
                              players,
                              matchinfo?.bowlers?.[0]?.bowler_id
                            )}
                          </h2>
                          <p className="md:text-[15px] text-[14px] flex items-center">
                            {matchinfo?.bowlers?.[0]?.wickets}-
                            {matchinfo?.bowlers?.[0]?.runs_conceded}{" "}
                            <span className="md:text-[13px] text-[12px] text-[#757A82] pt-[4px] px-1">
                              ({matchinfo?.bowlers?.[0]?.overs})
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>


                  <div className="md:hidden rounded-lg bg-white py-2 px-4">
                    <Link
                      href={
                        "/player/" +
                        playerUrls[matchinfo?.bowlers?.[0]?.bowler_id]
                      }
                    >
                      <div className="flex items-center justify-between gap-3 font-medium mx-auto w-[100%]">


                        <div className="flex ga-1 items-center  w-[50%]">
                          <div className="relative">
                            <PlayerImage
                              key={matchinfo?.bowlers?.[0]?.bowler_id}
                              player_id={matchinfo?.bowlers?.[0]?.bowler_id}
                              height={40}
                              width={40}
                              className="rounded-lg"
                            />
                            <Image
                              src="/assets/img/player/ball.png"
                              className="absolute -bottom-1.5 -right-0.5 h-[13px] bg-white rounded-full p-[2px]"
                              width={13}
                              height={13}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <h2 className="md:text-[15px] text-[14px] text-[#586577] pl-[10px]">
                            {getPlayerNameByPid(
                              players,
                              matchinfo?.bowlers?.[0]?.bowler_id
                            )}
                          </h2>


                        </div>
                        <p className="md:text-[15px] text-[14px] flex items-center justify-end w-[50%]">
                          {matchinfo?.bowlers?.[0]?.wickets}-
                          {matchinfo?.bowlers?.[0]?.runs_conceded}{" "}
                          <span className="md:text-[13px] text-[12px] text-[#586577] pt-[4px] px-1">
                            ({matchinfo?.bowlers?.[0]?.overs})
                          </span>
                        </p>

                      </div>
                    </Link>
                  </div>


                </div>


              </div>

            </div>
            <div className="cust-box-click-container">
              <div className="my-2">
                <div className="flex gap-[10px] overflow-auto items-center py-2">
                  <p className="font-medium text-[14px]">Commentary</p>
                  {updatedFilterarray.map((item) => (
                    <button
                      key={item}
                      className={`cust-box-click-button px-5 py-1 rounded-full font-medium ${filter === item
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

              {errorMessage && errorMessage === "Record not found" ? (
                <div className="bg-white p-4 rounded-md mb-8">
                  <div className="text-[18px] text-center text-red-600 font-semibold">
                    {updatedCommentaries[0]?.errorMessage}
                  </div>
                </div>
              ) : (
                <div className="cust-box-click-content" key="testMatch">
                  {updatedCommentaries
                    ?.slice(0, visibleCount)
                    ?.map((comment: any, index: number) =>
                      comment?.event === "overend" ? (
                        <div
                          className="rounded-t-lg bg-[#f8f8f8] mt-6"  style={{ boxShadow: '0px -1px 3px 0px #dfdfdf' }}
                          key={`over-${index}`}
                        >
                          {/* <div className="flex md:flex-row flex-col justify-between md:items-center gap-2"> */}

                          <div className="flex justify-between p-4">

                            <div className="text-[14px] font-normal  ">
                              {matchinning.short_name} : {comment.score}
                            </div>


                            <div className="text-[14px] font-normal ">
                            {updatedCommentaries?.map((cruns:any, index:number) => (cruns?.event !== "overend" && Number(cruns?.over)+1 == Number(comment?.over)) ? (
                                            <span key={index}>{cruns?.score} </span>
                                  ):(""))}
                            </div>

                            <div className="text-[16px] font-semibold text-[#3992f4]">
                              {comment?.over}{" "}
                              <span className=" font-medium text-[13px]  ">
                                End Of Over
                              </span>
                            </div>

                          </div>

                          <div className="border-b-[1px] border-[#e7e7e7]"></div>

                          <div className="flex justify-between p-4">
                            <div className="text-[14px] font-normal  ">
                              {getPlayerNameByPid(
                                players,
                                comment?.bats?.[0]?.batsman_id
                              )}
                              : {comment?.bats?.[0]?.runs}{" "}
                              <span className="text-[#3992f4]">
                                ({comment?.bats?.[0]?.balls_faced})
                              </span>{" "}
                              |{" "}
                              {getPlayerNameByPid(
                                players,
                                comment?.bats?.[1]?.batsman_id
                              )}
                              : {comment?.bats?.[1]?.runs}{" "}
                              <span className="text-[#3992f4]">
                                ({comment?.bats?.[1]?.balls_faced})
                              </span>
                            </div>


                            <div className="text-[14px] font-normal  ">
                              {getPlayerNameByPid(
                                players,
                                comment?.bowls?.[0]?.bowler_id
                              )}{" "}
                              <span className="text-[#3992f4]">
                                {comment?.bowls?.[0]?.overs}-
                                {comment?.bowls?.[0]?.runs_conceded}-
                                {comment?.bowls?.[0]?.wickets}
                              </span>
                            </div>

                          </div>

                        </div>
                      ) : (
                        <div
                          className="rounded-t-lg bg-white"
                          key={`other-${comment?.event_id || index}`}
                        >
                          <div className="border-t-[1px] border-[#E7F2F4]" />
                          <div
                            className="md:flex items-center py-3 md:px-3 gap-[21px] bg-white p-4"
                            key={comment?.event_id}
                          >
                            <div className="flex items-center gap-[10px] md:py-4 pb-4">
                              <p className="text-[16px] font-semibold">
                                {comment?.over}.{comment?.ball}
                              </p>
                              <p
                                className={`text-[16px] font-semibold px-[11px] py-[2px] rounded-lg ${comment?.run == 6
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
                                    <PlayerImage
                                      key={comment?.wicket_batsman_id}
                                      player_id={comment?.wicket_batsman_id}
                                      height={65}
                                      width={65}
                                      className="rounded-lg md:mr-4 mr-2 h-[65px] w-[65px]"
                                    />

                                    <div>
                                      <h2 className="md:text-xl text-[16px] font-semibold flex gap-3">
                                        <span>
                                          {getPlayerNameByPid(
                                            players,
                                            comment?.wicket_batsman_id !==
                                              undefined
                                              ? JSON.parse(
                                                comment?.wicket_batsman_id
                                              )
                                              : {}
                                          )}
                                        </span>{" "}
                                        <span className="text-[#BFEF50] text-[18px] font-medium">
                                          {comment?.batsman_runs} (
                                          <span className="text-[#BFEF50] text-[15px]">{comment?.batsman_balls}) </span>
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
                                        4s/6s
                                      </p>
                                      <p className="md:text-2xl text-[16px] font-semibold">
                                        {getPlayerRecord(scorecard, Number(comment?.wicket_batsman_id))?.fours}/{getPlayerRecord(scorecard, Number(comment?.wicket_batsman_id))?.sixes}
                                      </p>
                                    </div>
                                    <div className="text-end">
                                      <p className="md:text-1xl text-[14px] font-normal">
                                        SR
                                      </p>
                                      <p className="md:text-2xl text-[16px] font-semibold">
                                        {getPlayerRecord(scorecard, Number(comment?.wicket_batsman_id))?.strike_rate}
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
                      )
                    )}
                  {matchinfo?.bowlers?.[0]?.overs == 3000 ? (
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
                            <Image
                              src="/assets/img/player/default.webp"
                              width={65}
                              height={65}
                              alt="Player"
                              className="md:mr-4 mr-2 h-[65px] w-[65px] md:w-[auto] md:h-[auto]"
                              loading="lazy"
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
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="px-4 text-center">
            {visibleCount < updatedCommentaries.length && (
              <div ref={loaderRef} className="h-10 w-full"></div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-md mb-8">
          <div className="text-[18px] text-center text-red-600 font-semibold">
            Match not started, stay tuned.
          </div>
        </div>
      )}
    </section>
  );
}

"use client"


import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import eventEmitter from "@/utils/eventEmitter";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "../../components/countdownTimer";
import { motion } from 'framer-motion';
import Link from "next/link";

interface Banner {
  matchData: any | null;
  match_id: number;
}

interface BallEventData {
  matchId: number;
  ballEvent: string;
}

const TeamShortName = ({ teamData, teamId }: { teamData: any, teamId: number }) => {
  // Find the team with matching ID
  const team = teamData.teama.team_id === teamId
    ? teamData.teama
    : teamData.teamb.team_id === teamId
      ? teamData.teamb
      : null;

  if (!team) {
    return <span>Team not found</span>;
  } else {
    return team.short_name;
  }
}
function updateStatusNoteDirect(matchInfo: any) {
  if (!matchInfo?.status_note) return;

  return matchInfo.status_note = matchInfo.status_note
    .replace(/^Stumps : /, '')
    .replace(new RegExp(matchInfo.teama.name, 'gi'), matchInfo.teama.short_name)
    .replace(new RegExp(matchInfo.teamb.name, 'gi'), matchInfo.teamb.short_name);
}
export default function Banner({ matchData, match_id }: Banner) {


  const [matchLiveData, setmatchLiveData] = useState(matchData);

  const handleMatchData = (data: any) => {
    // console.log("handledata", data?.match_id , "matchId", match_id);
    if (data?.match_id == match_id) {
      setmatchLiveData(data); // ✅ Update only when new data is received
    }
  };
  eventEmitter.off("matchLiveData", handleMatchData);
  eventEmitter.on("matchLiveData", handleMatchData);

  const liveMatch = matchLiveData;
  const teamascores = liveMatch?.match_info?.teama?.scores ?? "";
  const teambscores = liveMatch?.match_info?.teamb?.scores ?? "";
  const teamaovers = liveMatch?.match_info?.teama?.overs ?? "";
  const teambovers = liveMatch?.match_info?.teamb?.overs ?? "";
  const seriesName = liveMatch?.match_info?.competition?.title ?? "";

  // Split by " & " to separate both innings
  const [inning1teamarun, inning2teamarun] = teamascores.includes(" & ")
    ? teamascores.split(" & ")
    : [teamascores, ""];
  const [inning1teambrun, inning2teambrun] = teambscores.includes(" & ")
    ? teambscores.split(" & ")
    : [teambscores, ""];
  const [inning1teamaOver, inning2teamaOver] = teamaovers.includes(" & ")
    ? teamaovers.split(" & ")
    : [teamaovers, ""];
  const [inning1teambOver, inning2teambOver] = teambovers.includes(" & ")
    ? teambovers.split(" & ")
    : [teambovers, ""];

  // console.log("banner",liveMatch?.match_info?.teama);
  const lastevent = liveMatch?.ballEvent ? liveMatch?.ballEvent : '';
  const [ballEvent, setBallEvent] = useState(lastevent);

  useEffect(() => {
    const handler = (data: BallEventData) => {
      if (data.matchId === match_id) {
        setBallEvent(data.ballEvent);
      }
    };
    eventEmitter.off("ballEvent", handler);
    eventEmitter.on("ballEvent", handler);


    // Proper cleanup function that returns void
    return () => {
      if (typeof eventEmitter.off === 'function') {
        eventEmitter.off("ballEvent", handler);
      } else if (typeof eventEmitter.off === 'function') {
        eventEmitter.off("ballEvent", handler);
      }
    };
  }, [match_id]);

  return (
    <>
      {liveMatch?.match_info?.status_str == "Completed" ? (

        // Completed Banner

        <section className="bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3">
          <div className="lg:w-[1000px] mx-auto">

            {/* desktop */}

            <div className=" hidden md:flex justify-between items-center md:py-0 py-4">
              <div className=" text-1xl text-[#00a632] font-bold uppercase ">
                <span className="h-[10px] w-[10px] inline-block	bg-[#00a632] rounded-full" />{" "}
                {liveMatch?.match_info?.status_str}
              </div>
              <div className="text-[#8192B4] font-medium  text-1xl md:text-center md:mx-0 my-3">
                {seriesName}

              </div>
              <div className="flex gap-[3px] items-center text-[#8192B4] text-1xl font-medium md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>

                {liveMatch?.match_info?.date_start_ist ? format(new Date(liveMatch?.match_info?.date_start_ist), "dd MMM yyyy") : ""}
              </div>
            </div>

            {/* mbobile */}

            <div className="md:hidden">
              <div className="items-center flex font-semibold text-[#b9b9b9] py-4">
                <Link href="/">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400 group-hover:text-gray-600 transition-colors" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
                </Link>

                {seriesName}, {liveMatch?.match_info?.date_start_ist ? format(new Date(liveMatch?.match_info?.date_start_ist), "dd MMM yyyy") : ""}

              </div>
            </div>
          </div>


          <div className="border-t-[1px] border-[#E4E9F01A]">
            <div className="lg:w-[1000px] mx-auto md:py-8 tracking-[1px]">

              {/* Desktop */}

              <div className="hidden md:flex py-8 justify-between items-end">


                <div className="flex gap-3 flex-row text-[#BDCCECA8] uppercase items-center w-[35%]">
                  {liveMatch?.match_info?.teama?.logo_url ? (
                    <Image
                      className="lg:h-[42px] lg:w-[42px] h-[30px] w-[30px] rounded-full"
                      style={{ boxShadow: '0px 0px 3px 0px white' }}
                      src={liveMatch?.match_info?.teama?.logo_url}
                      width={30}
                      height={30}
                      alt="ind"
                      loading="lazy"
                    />
                  ) : ("")}
                  <div className="flex md:flex-col md:items-start items-center md:gap-0 gap-2">
                    <p
                      className={`${(liveMatch?.match_info?.teama?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] md:text-[17px] lg:text-[19px] text-[14px] font-semibold uppercase" : "text-[#BDCCECA8] md:text-[17px] lg:text-[19px] text-[14px] font-semibold uppercase"}`}>
                      {liveMatch?.match_info?.teama?.short_name}
                    </p>
                    <p
                      className={`${(liveMatch?.match_info?.teama?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] md:text-[17px]  capitalize lg:text-[18px] text-[16px] font-semibold" : "text-[#BDCCECA8] md:text-[17px]  capitalize lg:text-[18px] text-[16px] font-semibold"}
                      "matchinfo"${match_id}"-"${liveMatch?.match_info?.teama?.team_id}
                      `}
                    >
                      {inning1teamarun ? (
                        <>
                          {inning1teamarun}{" "}
                          <span className={`${(liveMatch?.match_info?.teama?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff]  text-[13px] font-medium" : "text-[#BDCCECA8]  text-[13px] font-medium"}`}>
                            ({inning1teamaOver})
                          </span>
                        </>
                      ) : (
                        "Yet To Bat"
                      )}

                      {inning2teamarun ? (
                        <>
                          {" "}
                          &amp; {inning2teamarun}{" "}
                          {inning2teamaOver !== "" && (
                            <span className={`${(liveMatch?.match_info?.teama?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  text-[16px] font-medium uppercase"}`}>
                              ({inning2teamaOver})
                            </span>
                          )}
                        </>
                      ) : (
                        " "
                      )}
                    </p>
                  </div>
                </div>


                <div className="text-[#8192B4] font-normal w-[30%] text-center md:my-0 my-4 flex gap-2 items-center justify-center">
                  <p className="text-[#00a632] lg:text-[22px] text-[16px] font-semibold uppercase">
                    {updateStatusNoteDirect(liveMatch?.match_info)}
                    <Image
                      src="/assets/img/home/win.png"
                      width={28}
                      height={28}
                      style={{ width: "28px", height: "28px" }}
                      className="inline-block ml-2"
                      alt=""
                      loading="lazy"
                    />
                  </p>
                </div>


                <div className="flex gap-3 flex-row-reverse md:flex-row  items-center text-[#8192B4] font-normal w-[35%] justify-end">
                  <div className="flex md:flex-col md:items-end items-center md:gap-0 gap-2">
                    <p className={`${(liveMatch?.match_info?.teamb?.team_id === liveMatch?.match_info?.winning_team_id) ?  " text-[#ffffff] md:text-[17px] lg:text-[19px] text-[14px] font-semibold uppercase" : "text-[#BDCCECA8] md:text-[17px] lg:text-[19px] text-[14px] font-semibold uppercase"}`}>
                      {liveMatch?.match_info?.teamb?.short_name}
                    </p>
                    <p
                      className={`${(liveMatch?.match_info?.teamb?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] md:text-[17px]  capitalize lg:text-[18px] text-[16px] font-semibold" : "text-[#BDCCECA8] md:text-[17px]  capitalize lg:text-[18px] text-[16px] font-semibold"}
                      "matchinfo"${match_id}"-"${liveMatch?.match_info?.teamb?.team_id}
                      `}
                    >
                      {inning1teambrun ? (
                        <>
                          {inning1teambrun}{" "}
                          <span className={`${(liveMatch?.match_info?.teamb?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff]  text-[13px] font-medium" : "text-[#BDCCECA8]  text-[13px] font-medium"}`}>
                            ({inning1teambOver})
                          </span>
                        </>
                      ) : (
                        "Yet To Bat"
                      )}

                      {inning2teambrun ? (
                        <>
                          {" "}
                          &amp;  {inning2teambrun}{" "}
                          {inning2teambOver !== "" && (
                            <span className={`${(liveMatch?.match_info?.teamb?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  text-[16px] font-medium uppercase"}`}>
                              ({inning2teambOver})
                            </span>
                          )}
                        </>
                      ) : (
                        " "
                      )}
                    </p>
                  </div>
                  {liveMatch?.match_info?.teamb?.logo_url ? (
                    <Image
                      src={liveMatch?.match_info?.teamb?.logo_url}
                      className="lg:h-[42px] lg:w-[42px] h-[30px] w-[30px] rounded-full"
                      style={{ boxShadow: '0px 0px 3px 0px white' }}
                      width={30}
                      height={30}
                      alt="ban"
                      loading="lazy"
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>


              {/* mobile */}

              <div className="md:hidden py-3">


                <div className="flex justify-between items-end">


                  <div className="flex gap-3 flex-row text-[#BDCCECA8] uppercase items-center w-[47%]">
                    {liveMatch?.match_info?.teama?.logo_url ? (
                      <Image
                        className="lg:h-[42px] lg:w-[42px] h-[30px] w-[30px] rounded-full"
                        style={{ boxShadow: '0px 0px 3px 0px white' }}
                        src={liveMatch?.match_info?.teama?.logo_url}
                        width={30}
                        height={30}
                        alt="ind"
                        loading="lazy"
                      />
                    ) : ("")}
                    <div className="flex flex-col items-start">
                      <p className={`${(liveMatch?.match_info?.teama?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[17px]" : "text-[#BDCCECA8] text-[14px] font-medium uppercase"}`}>
                        {liveMatch?.match_info?.teama?.short_name}
                      </p>
                      <p
                        className={`${(liveMatch?.match_info?.teama?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[20px]" : "text-[#BDCCECA8] md:text-[20px] text-[16px] font-semibold uppercase"}
                      "matchinfo"${match_id}"-"${liveMatch?.match_info?.teama?.team_id}
                      `}
                      >
                        {inning1teamarun ? (
                          <>
                            {inning1teamarun}{" "}
                            <span className={`${(liveMatch?.match_info?.teama?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  text-[11px] font-medium uppercase"}`}>
                              ({inning1teamaOver})
                            </span>
                          </>
                        ) : (
                          "Yet To Bat"
                        )}

                        {inning2teamarun ? (
                          <>
                            {" "}
                            &amp; {inning2teamarun}{" "}
                            {inning2teamaOver !== "" && (
                              <span className={`${(liveMatch?.match_info?.teama?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  md-text-[11px] font-medium uppercase"}`}>
                                ({inning2teamaOver})
                              </span>
                            )}
                          </>
                        ) : (
                          " "
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>

                  </div>


                  <div className="flex gap-3 items-center text-[#8192B4] font-normal w-[47%] justify-end">
                    <div className="flex flex-col items-end md:gap-0">
                      <p className={`${(liveMatch?.match_info?.teamb?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[17px]" : "text-[#BDCCECA8] text-[11px] font-medium"}`}>
                        {liveMatch?.match_info?.teamb?.short_name}
                      </p>
                      <p
                        className={`${(liveMatch?.match_info?.teamb?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[20px]" : "text-[#BDCCECA8] md:text-[20px] text-[16px] font-semibold uppercase"}
                        "matchinfo"${match_id}"-"${liveMatch?.match_info?.teamb?.team_id}
                        `}
                      >
                        {inning1teambrun ? (
                          <>
                            {inning1teambrun}{" "}
                            <span className={`${(liveMatch?.match_info?.teamb?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  md-text-[11px] font-medium"}`}>
                              ({inning1teambOver})
                            </span>
                          </>
                        ) : (
                          "Yet To Bat"
                        )}

                        {inning2teambrun ? (
                          <>
                            {" "}
                            &amp;  {inning2teambrun}{" "}
                            {inning2teambOver !== "" && (
                              <span className={`${(liveMatch?.match_info?.teamb?.team_id === liveMatch?.match_info?.winning_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  md-text-[11px] font-medium"}`}>
                                ({inning2teambOver})
                              </span>
                            )}
                          </>
                        ) : (
                          " "
                        )}
                      </p>
                    </div>
                    {liveMatch?.match_info?.teamb?.logo_url ? (
                      <Image
                        src={liveMatch?.match_info?.teamb?.logo_url}
                        className="lg:h-[42px] lg:w-[42px] h-[30px] w-[30px] rounded-full"
                        style={{ boxShadow: '0px 0px 3px 0px white' }}
                        width={30}
                        height={30}
                        alt="ban"
                        loading="lazy"
                      />
                    ) : (
                      ""
                    )}
                  </div>



                </div>


                <div className="text-[#8192B4] font-normal text-center mt-9 mb-2 flex gap-2 items-center justify-center">
                  <p className="text-[#00a632] text-[14px] font-semibold uppercase">
                    {updateStatusNoteDirect(liveMatch?.match_info)} 🏆
                  </p>
                </div>


              </div>
            </div>
          </div>
        </section>

      ) : liveMatch?.match_info?.status_str == "Live" ? (

        // live Banner

        <section className="bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3">
          <div className="lg:w-[1000px] mx-auto lg:block hidden hover:shadow-lg">
            <div className="md:flex justify-between items-center md:py-0 py-4">

              <div className="text-[#8192B4] font-medium  text-1xl md:text-center md:mx-0 my-3">
                {liveMatch?.match_info?.short_title},&nbsp;

                {liveMatch?.match_info?.subtitle}

              </div>

            </div>
          </div>

          <div className="lg:hidden rounded-lg md:p-4 px-0 py-4 performance-section relative hover:shadow-lg">

            <span className="flex items-center font-semibold text-[#b9b9b9] ">
              <Link href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-400 group-hover:text-gray-600 transition-colors"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              {liveMatch?.match_info?.short_title},&nbsp; {" "}
              {liveMatch?.match_info?.subtitle}
            </span>
          </div>


          <div className="border-t-[1px] border-[#E4E9F01A]">
            <div className="lg:w-[1000px] mx-auto tracking-[1px]">

              {/* desktop */}

              <div className="hidden md:block">
                <div className="flex h-[168px] justify-between items-center">
                  <div className="flex gap-2 text-[#BDCCECA8] uppercase flex-row items-center w-full">
                    {liveMatch?.match_info?.teama?.logo_url ? (
                      <Image
                        className="lg:h-[42px] lg:w-[42px] h-[30px] w-[30px] rounded-full"
                        style={{ boxShadow: '0px 0px 3px 0px white' }}
                        src={liveMatch?.match_info?.teama?.logo_url}
                        width={30}
                        height={30}
                        alt="ind"
                        loading="lazy"
                      />
                    ) : (
                      ""
                    )}
                    <div className="flex md:flex-col md:items-start items-center md:gap-0 gap-2">
                      <p
                        className={`${(liveMatch?.match_info.teama.team_id === liveMatch?.live?.live_inning?.batting_team_id) ? "text-[#ffffff] md:text-[17px] lg:text-[19px] text-[14px] font-semibold uppercase" : "text-[#BDCCECA8] md:text-[17px] lg:text-[19px] text-[14px] font-semibold uppercase"}`}>
                        {liveMatch?.match_info?.teama?.short_name}
                      </p>

                      <p
                        className={`${(liveMatch?.match_info.teama.team_id === liveMatch?.live?.live_inning?.batting_team_id) ? "text-[#ffffff] md:text-[17px]  capitalize lg:text-[18px] text-[16px] font-semibold" : "text-[#BDCCECA8] md:text-[17px]  capitalize lg:text-[18px] text-[16px] font-semibold"}
                     "matchinfo"${match_id}"-"${liveMatch?.match_info?.teama?.team_id}
                     `}

                      // className={
                      //   "md:text-[20px] text-[16px] font-semibold " +
                      //   match_id +
                      //   "-" +
                      //   liveMatch?.match_info?.teama?.team_id
                      // }
                      >
                        {inning1teamarun ? (
                          <>
                            {inning1teamarun}{" "}
                            {/* <span className="text-[16px] font-medium"> */}
                            <span className={`${(liveMatch?.match_info.teama.team_id === liveMatch?.live?.live_inning?.batting_team_id) ? " text-[#ffffff]  text-[13px] font-medium " : "text-[#BDCCECA8]  text-[13px] font-medium "}`}>
                              ({inning1teamaOver})
                            </span>
                          </>
                        ) : (
                          "Yet To Bat"
                        )}

                        {inning2teamarun ? (
                          <>
                            {" "}
                            &nbsp; &amp; &nbsp; {inning2teamarun}{" "}
                            {inning2teamaOver !== "" && (
                              // <span className="text-[16px] font-medium">
                              <span className={`${(liveMatch?.match_info.teama.team_id === liveMatch?.live?.live_inning?.batting_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  text-[16px] font-medium uppercase"}`}>
                                ({inning2teamaOver})
                              </span>
                            )}
                          </>
                        ) : (
                          " "
                        )}
                      </p>
                    </div>
                  </div>


                  <div className="text-[#8192B4] font-normal w-full text-center md:my-0 my-4">


                    <motion.div
                      key={ballEvent}
                      initial={{ scale: 0, opacity: 0, rotate: -15 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                        color: { duration: 1.5, repeat: Infinity }
                      }}
                      className={`text-[#459af4] lg:text-[40px] text-[16px] font-bold
                     ${ballEvent.toUpperCase() === 'FOUR' ? "animate-blinkFour" : ""}
                     ${ballEvent.toUpperCase() === 'SIX' ? "animate-blinkSix" : ""}
                     ${ballEvent.toUpperCase() === 'WICKET' ? "animate-Out" : ""} `}
                    >
                      {ballEvent.toUpperCase() === 'FOUR' ? 4 : ballEvent.toUpperCase() === 'SIX' ? 6 : ballEvent.toUpperCase() === 'DOT' ? 0 : ballEvent}
                    </motion.div>

                  </div>


                  <div className="flex gap-2 flex-row-reverse md:flex-row  items-center text-[#8192B4] font-normal w-full justify-end">
                    <div className="flex md:flex-col md:items-end items-center md:gap-0 gap-2">
                      <p className={`${(liveMatch?.match_info.teamb.team_id === liveMatch?.live?.live_inning?.batting_team_id) ? "text-[#ffffff] md:text-[17px]  uppercase lg:text-[19px] text-[16px] font-semibold" : "text-[#BDCCECA8] md:text-[17px]  uppercase lg:text-[19px] text-[16px] font-semibold"}`}>
                        {liveMatch?.match_info?.teamb?.short_name}
                      </p>
                      <p
                        // className={
                        //   "lg:text-[20px] text-[16px] font-semibold matchinfo" +
                        //   match_id +
                        //   "-" +
                        //   liveMatch?.match_info?.teamb?.team_id
                        // }

                        className={`${(liveMatch?.match_info.teamb.team_id === liveMatch?.live?.live_inning?.batting_team_id) ? "text-[#ffffff] md:text-[17px]  uppercase lg:text-[18px] text-[16px] font-semibold" : "text-[#BDCCECA8] md:text-[17px]  uppercase lg:text-[18px] text-[16px] font-semibold"}
                      "matchinfo"${match_id}"-"${liveMatch?.match_info?.teamb?.team_id}
                      `}
                      >
                        {inning1teambrun ? (
                          <>
                            {inning1teambrun}{" "}
                            {/* <span className="text-[16px] font-medium"> */}
                            <span className={`${(liveMatch?.match_info.teamb.team_id === liveMatch?.live?.live_inning?.batting_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  text-[16px] font-medium uppercase"}`}>
                              ({inning1teambOver})
                            </span>
                          </>
                        ) : (
                          "Yet To Bat"
                        )}

                        {inning2teambrun ? (
                          <>
                            {" "}
                            &nbsp; &amp; &nbsp; {inning2teambrun}{" "}
                            {inning2teambOver !== "" && (
                              // <span className="text-[16px] font-medium">
                              <span className={`${(liveMatch?.match_info.teamb.team_id === liveMatch?.live?.live_inning?.batting_team_id) ? " text-[#ffffff] font-semibold md:text-[16px]" : "text-[#BDCCECA8]  text-[16px] font-medium uppercase"}`}>
                                ({inning2teambOver})
                              </span>
                            )}
                          </>
                        ) : (
                          " "
                        )}
                      </p>
                    </div>
                    {liveMatch?.match_info?.teamb?.logo_url ? (
                      <Image
                        src={liveMatch?.match_info?.teamb?.logo_url}
                        className="lg:h-[42px] lg:w-[42px] h-[30px] w-[30px] rounded-full"
                        style={{ boxShadow: '0px 0px 3px 0px white' }}
                        width={30}
                        height={30}
                        alt="ban"
                        loading="lazy"
                      />
                    ) : (
                      ""
                    )}
                  </div>

                </div>
                <div className="flex items-center justify-between py-1  text-[12px] relative top-[-12px] text-[#c1ceea]">
                  <div className="flex gap-3 items-center">
                    <p className="flex gap-1 items-center">
                      <span> CRR :{" "} </span> <span>{liveMatch?.live?.live_score?.runrate}</span>
                    </p>
                    {!!liveMatch?.live?.live_score?.required_runrate &&
                      <p className="flex gap-1 items-center">
                        <span>RRR : </span><span>{liveMatch?.live?.live_score?.required_runrate}</span>
                      </p>
                    }
                  </div>

                </div>
              </div>

              {/* mobile */}

              <div className="md:hidden block bg-[white] p-4 rounded-md mb-4">
                <div>
                  <div>

                    <div className="flex items-center justify-between">
                      <div className="w-full">
                        <div className="flex gap-2 flex-row  uppercase items-center w-full">
                          <Image
                            className="lg:h-[42px] lg:w-[42px] h-[40px] w-[40px]"
                            src={[liveMatch?.match_info?.teama, liveMatch?.match_info?.teamb].find(team => team?.team_id === liveMatch?.live?.live_inning?.batting_team_id)?.logo_url || null}
                            width={30}
                            height={30}
                            alt="teams"
                            loading="lazy"
                          />

                          <div className="flex flex-col items-start gap-0">
                            <p className="text-[14px] font-semibold uppercase">
                              {[liveMatch?.match_info?.teama, liveMatch?.match_info?.teamb].find(team => team?.team_id === liveMatch?.live?.live_inning?.batting_team_id)?.short_name || null}
                            </p>
                            <p className="lg:text-[18px] text-[18px] font-semibold">
                              {liveMatch?.live?.live_score?.runs}/
                              {liveMatch?.live?.live_score?.wickets}{" "}
                              <span className="text-[13px] font-medium">
                                ({liveMatch?.live?.live_score?.overs})
                              </span>
                            </p>
                          </div>

                        </div>

                      </div>

                      <div className="border-r-[1px] border-[#e5e5e5] h-[60px]"></div>

                      <div className="w-full h-[60px] mx-2 text-center flex items-center justify-center">
                        <motion.div
                          key={ballEvent}
                          initial={{ scale: 0, opacity: 0, rotate: -15 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            rotate: 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                            color: { duration: 1.5, repeat: Infinity }
                          }}

                          className={`text-[#459af4]  text-[21px] font-bold
                          ${ballEvent.toUpperCase() === 'FOUR' ? "phone-animate-blinkFour" : ""}
                          ${ballEvent.toUpperCase() === 'SIX' ? "phone-animate-blinkSix" : ""}
                          ${ballEvent.toUpperCase() === 'WICKET' ? "phone-animate-Out" : ""}
                           ${ballEvent === '1' ? "text-[35px]" : ""} 
                           ${ballEvent === '2' ? "text-[35px]" : ""}
                           ${ballEvent === '3' ? "text-[35px]" : ""}
                           ${ballEvent.toUpperCase() === 'DOT' ? "text-[35px]" : ""}
                           ${ballEvent === '5' ? "text-[35px]" : ""}  `}
                        >

                          {ballEvent.toUpperCase() === 'FOUR' ? 4 : ballEvent.toUpperCase() === 'SIX' ? 6 : ballEvent.toUpperCase() === 'DOT' ? 0 : ballEvent}
                        </motion.div>
                      </div>

                    </div>



                    <div className="flex items-center justify-between py-1 border-t-[1px] bottom-[#e5e5e5] text-[12px] relative top-[12px]">
                      <div className="flex gap-3 items-center">
                        <p className="flex gap-1 items-center">
                          <span> CRR :{" "} </span> <span>{liveMatch?.live?.live_score?.runrate}</span>
                        </p>



                        {!!liveMatch?.live?.live_score?.required_runrate &&
                          <p className="flex gap-1 items-center">
                            <span>RRR : </span><span>{liveMatch?.live?.live_score?.required_runrate}</span>
                          </p>
                        }
                      </div>
                      <p>
                        Toss: <span><TeamShortName teamData={liveMatch?.match_info} teamId={liveMatch?.match_info?.toss?.winner} /></span>
                      </p>

                      {!!liveMatch?.live?.live_score?.target &&
                        <p>
                          Target: <span>{liveMatch?.live?.live_score?.target}</span>
                        </p>
                      }
                    </div>


                  </div>

                  <div></div>
                </div>
              </div>
            </div>
          </div>
          {!!liveMatch?.live?.live_score?.required_runrate &&
            <div className="lg:hidden rounded-lg md:p-2 px-0 performance-section relative hover:shadow-lg">
              <span className="flex items-center font-semibold text-[#b9b9b9] ">
                {updateStatusNoteDirect(liveMatch?.match_info)}
              </span>
            </div>
          }

        </section>
      ) : (

        // Sheduled Banner

        <section className="bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3">
          <div className="lg:w-[1000px] mx-auto">

            {/* desktop */}

            <div className="hidden md:flex justify-between items-center md:py-0 py-4">
              <div className=" text-1xl text-[#FF912C] font-bold uppercase w-full">
                <span className="h-[10px] w-[10px] inline-block	bg-[#FF912C] rounded-full" />{" "}
                {liveMatch?.match_info?.status_str}
              </div>
              <div className="text-[#8192B4] font-medium w-full text-1xl md:text-center md:mx-0 my-3">
                {liveMatch?.match_info?.short_title},&nbsp; {liveMatch?.match_info?.subtitle}
              </div>

              <div className="flex gap-[3px] text-[#8192B4] text-1xl font-medium w-full md:justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>

                {liveMatch?.match_info?.date_start_ist ? format(new Date(liveMatch?.match_info?.date_start_ist), "dd MMM yyyy") : ""}
              </div>
            </div>



            {/* mobile */}

            <div className="md:hidden flex items-center">


              <Link href="/">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400 group-hover:text-gray-600 transition-colors" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg></Link>

              <div className="items-center flex font-semibold text-[#b9b9b9] py-4">
                {liveMatch?.match_info?.short_title},&nbsp; {liveMatch?.match_info?.subtitle}
              </div>

            </div>
          </div>


          <div className="border-t-[1px] border-[#E4E9F01A] md:h-48">
            <div className="lg:w-[1000px] mx-auto md:py-8 tracking-[1px]">


              {/* desktop */}

              <div className="hidden md:flex py-8 justify-between items-center">
                <div className="flex flex-col md:flex-row text-[#FF912C] font-bold uppercase  md:items-center items-start w-[35%]">
                  {liveMatch?.match_info?.teama?.logo_url ? (
                    <Image
                      className="md:h-[42px] md:w-[42px] h-[30px] w-[30px] rounded-full"
                      style={{ boxShadow: '0px 0px 3px 0px white' }}
                      src={liveMatch?.match_info?.teama?.logo_url}
                      width={30}
                      height={30}
                      alt={liveMatch?.match_info?.teama?.short_name}
                      loading="lazy"
                    />
                  ) : (
                    "")}
                  <p className=" md:mx-3 mx-0  text-[#BDCCECA8] md:text-[17px] lg:text-[19px] text-[14px] font-semibold uppercase">
                    {liveMatch?.match_info?.teama?.short_name}
                  </p>
                </div>


                <div className="text-[#8192B4] font-normal w-[30%] text-center h-[37px]">
                  <p className="text-[#C1CEEA] text-1xl">
                    {liveMatch?.match_info?.date_start_ist ? format(new Date(liveMatch?.match_info?.date_start_ist), "hh:mm:aa") : ""}  </p>

                  {liveMatch?.match_info?.date_start_ist ? isSameDay(new Date(), new Date(liveMatch?.match_info?.date_start_ist)) ? (

                    <div className="scheduled-timer">
                      <CountdownTimer targetTime={liveMatch?.match_info?.date_start_ist} />
                    </div>

                  ) : (

                    <p className="text-[#FFBD71] md:text-[24px] text-[16px] font-semibold">
                      {liveMatch?.match_info?.date_start_ist ? format(new Date(liveMatch?.match_info?.date_start_ist), "dd MMM yyyy") : ""}
                    </p>
                  ) : ""}


                </div>


                <div className="flex flex-col md:flex-row md:items-center items-end text-[#8192B4] font-normal w-[35%] justify-end">
                  <p className="md:block hidden md:mx-3 mx-0 uppercase  text-[#BDCCECA8] md:text-[17px] lg:text-[19px] text-[14px] font-semibold">
                    {liveMatch?.match_info?.teamb?.short_name}
                  </p>
                  {liveMatch?.match_info?.teamb?.logo_url ? (
                    <Image
                      src={liveMatch?.match_info?.teamb?.logo_url}

                      className="md:h-[42px] md:w-[42px] h-[30px] w-[30px] rounded-full"
                      style={{ boxShadow: '0px 0px 3px 0px white' }}
                      width={30}
                      height={30}
                      alt={liveMatch?.match_info?.teamb?.short_name}
                      loading="lazy"
                    />
                  ) : (
                    ""
                  )}
                  <p className="text-[#BDCCECA8] md:hidden md:text-[18px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                    {liveMatch?.match_info?.teamb?.short_name}
                  </p>
                </div>
              </div>

              {/* // mobile */}

              <div className="flex md:hidden py-3 justify-between items-center h-[120px]">
                <div className="flex gap-3 text-[#FF912C] font-bold uppercase items-center w-[35%]">
                  {liveMatch?.match_info?.teama?.logo_url ? (
                    <Image
                      className="md:h-[42px] md:w-[42px] h-[30px] w-[30px] rounded-full"
                      style={{ boxShadow: '0px 0px 3px 0px white' }}
                      src={liveMatch?.match_info?.teama?.logo_url}
                      width={30}
                      height={30}
                      alt={liveMatch?.match_info?.teama?.short_name}
                      loading="lazy"
                    />
                  ) : (
                    "")}
                  <p className="text-[#BDCCECA8] md:mx-3 mx-0 md:text-[22px] text-[14px] font-medium uppercase">
                    {liveMatch?.match_info?.teama?.short_name}
                  </p>
                </div>


                <div className="text-[#8192B4] font-normal w-[50%] text-center">
                  <p className="text-[#C1CEEA] text-[13px]"> {liveMatch?.match_info?.date_start_ist ? format(new Date(liveMatch?.match_info?.date_start_ist), "hh:mm:aa") : ""}  </p>

                  {liveMatch?.match_info?.date_start_ist ? isSameDay(new Date(), new Date(liveMatch?.match_info?.date_start_ist)) ? (

                    <div className="scheduled-timer">
                      <div className="banner-timer">
                        <CountdownTimer targetTime={liveMatch?.match_info?.date_start_ist} />
                      </div>
                    </div>

                  ) : (

                    <p className="text-[#FFBD71] md:text-[24px] text-[16px] font-semibold">
                      {liveMatch?.match_info?.date_start_ist ? format(new Date(liveMatch?.match_info?.date_start_ist), "dd MMM yyyy") : ""}
                    </p>
                  ) : ""}


                </div>


                <div className="flex flex-row-reverse gap-3 items-center text-[#8192B4] font-normal w-[35%]">
                  <p className="text-[#BDCCECA8] md:block hidden md:text-[22px] text-[14px] md:mx-3 mx-0 font-medium uppercase">
                    {liveMatch?.match_info?.teamb?.short_name}
                  </p>
                  {liveMatch?.match_info?.teamb?.logo_url ? (
                    <Image
                      src={liveMatch?.match_info?.teamb?.logo_url}

                      className="md:h-[42px] md:w-[42px] h-[30px] w-[30px] rounded-full"
                      style={{ boxShadow: '0px 0px 3px 0px white' }}
                      width={30}
                      height={30}
                      alt={liveMatch?.match_info?.teamb?.short_name}
                      loading="lazy"
                    />
                  ) : (
                    ""
                  )}
                  <p className="text-[#BDCCECA8] md:hidden md:text-[18px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                    {liveMatch?.match_info?.teamb?.short_name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
      }
    </>
  );
}

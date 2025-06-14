"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { urlStringEncode } from "@/utils/utility";
import MatchCard from "./matchCard";
import PlayerImage from "@/app/components/PlayerImage";
import MatchTabs from "./Menu";
import { format, isSameDay } from "date-fns";

interface MatchInfo {
  match_id: number;

  matchData: any | null;

  matchLast: any | null;
  matchUrl: string | null;
  isPointTable: boolean
}

export default function MoreInfo({
  match_id,
  matchData,
  matchLast,
  matchUrl,
  isPointTable
}: MatchInfo) {
  const teama_id = matchData?.match_info?.teama?.team_id;
  const teamb_id = matchData?.match_info?.teamb?.team_id;
  const matchDetails = matchData?.match_info;
  const manOfTheMatch = matchData?.man_of_the_match;
  const playing11 = matchData?.["match-playing11"];
  const teama11Players = [
    ...(playing11?.teama?.squads.filter(
      (player: { playing11: string }) => player.playing11 === "true"
    ) || []),
  ];
  const teamb11Players = [
    ...(playing11?.teamb?.squads.filter(
      (player: { playing11: string }) => player.playing11 === "true"
    ) || []),
  ];
  // console.log("test1",matchLast.items.teama_vs_teamb_last10_match_same_venue);
  const matchlistA = matchLast?.items?.teama_last10_match;
  const matchlistB = matchLast?.items?.teamb_last10_match;
  const matchlistASameVenue = matchLast?.items?.teama_last10_match_same_venue;
  const matchlistBSameVenue = matchLast?.items?.teamb_last10_match_same_venue;
  const matchlistAB = matchLast?.items?.teama_vs_teamb_last10_match ?? "";
  const matchlistSameVenue =
    matchLast?.items?.teama_vs_teamb_last10_match_same_venue ?? "";
  const matchVenueStats = matchLast?.items?.venue_stats ?? "";

  let teamaWinMatch = 0;
  let teambWinMatch = 0;
  let teamaWinMatchP = 0;
  let teambWinMatchP = 0;
  const matchPlayed = matchlistAB.length;
  const matchPlayedA = matchlistA.length;
  const matchPlayedB = matchlistB.length;

  if (Array.isArray(matchlistAB) && matchlistAB.length > 0) {
    matchlistAB?.slice(0, 5).map((items: { winning_team_id: any }) =>
      items.winning_team_id === teama_id
        ? teamaWinMatch++
        : items.winning_team_id === teamb_id
          ? teambWinMatch++
          : ""
    );
  }

  if (Array.isArray(matchlistA) && matchlistA.length > 0) {
    matchlistA?.map((items: { winning_team_id: any }) =>
      items.winning_team_id === teama_id
        ? teamaWinMatchP++
        : ""
    );
  }

  if (Array.isArray(matchlistB) && matchlistB.length > 0) {
    matchlistB?.map((items: { winning_team_id: any }) =>
      items.winning_team_id === teamb_id
        ? teambWinMatchP++
        : ""
    );
  }

  const teamaWinper =
    teamaWinMatchP > 0 ? (teamaWinMatchP / matchPlayedA) * 100 : 0;
  const teambWinper =
    teambWinMatchP > 0 ? (teambWinMatchP / matchPlayedB) * 100 : 0;

  let teamAScores: any = [];


  if (Array.isArray(matchlistA) && matchlistA.length > 0) {
    teamAScores = matchlistA?.map((match: any) => {
      const team = match?.teama?.team_id === teama_id ? match?.teama :
        match?.teamb?.team_id === teama_id ? match?.teamb :
          null;
      const score = team?.scores?.split('/')[0];
      return parseInt(score, 10) || 0;
    });
  }

  const highestScoreTeamA = (teamAScores?.length ?? 0) > 0 ? Math.max(...teamAScores) : 0;
  const lowestScoreTeamA = (teamAScores?.length ?? 0) > 0 ? Math.min(...teamAScores) : 0;
  const averageScoreTeamA =
    teamAScores?.length > 0
      ? teamAScores.reduce((sum: any, score: any) => sum + score, 0) /
      teamAScores.length
      : 0;

  let teamBScores: any = [];

  if (Array.isArray(matchlistB) && matchlistB.length > 0) {
    teamBScores = matchlistB?.map((match: any) => {
      const team = match?.teama?.team_id === teamb_id ? match?.teama :
        match?.teamb?.team_id === teamb_id ? match?.teamb :
          null;
      const score = team?.scores?.split('/')[0];
      return parseInt(score, 10) || 0;
    });
  }
  const highestScoreTeamB = (teamBScores?.length ?? 0) > 0 ? Math.max(...teamBScores) : 0;
  const lowestScoreTeamB = (teamBScores?.length ?? 0) > 0 ? Math.min(...teamBScores) : 0;
  const averageScoreTeamB =
    teamBScores?.length > 0
      ? teamBScores.reduce((sum: any, score: any) => sum + score, 0) /
      teamBScores.length
      : 0;

  let sameVenueteamaWinMatch = 0;
  let sameVenueteambWinMatch = 0;
  const sameVenuematchPlayed = matchlistSameVenue.length;
  const sameVenuematchPlayedA = matchlistASameVenue.length;
  const sameVenuematchPlayedB = matchlistBSameVenue.length;
  if (Array.isArray(matchlistASameVenue) && matchlistASameVenue.length > 0) {
    matchlistASameVenue?.map((items: { winning_team_id: any }) =>
      items.winning_team_id === teama_id
        ? sameVenueteamaWinMatch++
        : ""
    );
  }
  if (Array.isArray(matchlistBSameVenue) && matchlistBSameVenue.length > 0) {
    matchlistBSameVenue?.map((items: { winning_team_id: any }) =>
      items.winning_team_id === teamb_id
        ? sameVenueteambWinMatch++
        : ""
    );
  }

  const sameVenueteamaWinper =
    sameVenuematchPlayedA > 0
      ? (sameVenueteamaWinMatch / sameVenuematchPlayedA) * 100
      : 0;
  const sameVenueteambWinper =
    sameVenuematchPlayedB > 0
      ? (sameVenueteambWinMatch / sameVenuematchPlayedB) * 100
      : 0;

  let sameVenueteamAScores: any = '';

  if (Array.isArray(matchlistASameVenue) && matchlistASameVenue.length > 0) {
    sameVenueteamAScores = matchlistASameVenue?.map((match: any) => {
      const team = match?.teama?.team_id === teama_id ? match?.teama :
        match?.teamb?.team_id === teama_id ? match?.teamb :
          null;
      const score = team?.scores?.split('/')[0];
      return parseInt(score, 10) || 0;
    });
  }

  const sameVenuehighestScoreTeamA =
    (sameVenueteamAScores?.length ?? 0) > 0 ? Math.max(...sameVenueteamAScores) : 0;
  const sameVenuelowestScoreTeamA =
    (sameVenueteamAScores?.length ?? 0) > 0 ? Math.min(...sameVenueteamAScores) : 0;

  const sameVenueaverageScoreTeamA =
    sameVenueteamAScores?.length > 0
      ? sameVenueteamAScores.reduce((sum: any, score: any) => sum + score, 0) /
      sameVenueteamAScores.length
      : 0;


  let sameVenueteamBScores: any = '';

  if (Array.isArray(matchlistBSameVenue) && matchlistBSameVenue.length > 0) {
    sameVenueteamBScores = matchlistBSameVenue?.map((match: any) => {
      const team = match?.teama?.team_id === teamb_id ? match?.teama :
        match?.teamb?.team_id === teamb_id ? match?.teamb :
          null;
      const score = team?.scores?.split('/')[0];
      return parseInt(score, 10) || 0;
    });
  }
  const sameVenuehighestScoreTeamB =
    (sameVenueteamBScores?.length ?? 0) > 0 ? Math.max(...sameVenueteamBScores) : 0;
  const sameVenuelowestScoreTeamB =
    (sameVenueteamBScores?.length ?? 0) > 0 ? Math.min(...sameVenueteamBScores) : 0;
  const sameVenueaverageScoreTeamB =
    sameVenueteamBScores?.length > 0
      ? sameVenueteamBScores.reduce((sum: any, score: any) => sum + score, 0) /
      sameVenueteamBScores.length
      : 0;

  // console.log("playing11", teama11Players);

  const [openHeading, setOpenHeading] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenHeading(openHeading === index ? null : index);
  };

  const [activeTab, setActiveTab] = useState("cust-box-click-firview");

  const handleProbabilityTab = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tabName: React.SetStateAction<string>
  ) => {
    setActiveTab(tabName);
  };

  const [playing11Tab, setPlaying11Tab] = useState("cust-box-click-playing11");

  const handlePlaying11Tab = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tabName: React.SetStateAction<string>
  ) => {
    setPlaying11Tab(tabName);
  };

  const [activeOddTab, setActiveOddTab] = useState("tab2");
  let teamwinpercentage = matchData?.teamwinpercentage;

  const [matchUrls, setMatchUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getAllMatchIds = () => {
      const allIds = [
        ...matchlistA.map((item: { match_id: any; }) => item.match_id),
        ...matchlistB.map((item: { match_id: any; }) => item.match_id),
        ...matchlistAB.map((item: { match_id: any; }) => item.match_id),
      ];
      return [...new Set(allIds)]; // Deduplicate
    };

    const fetchMatchUrls = async () => {
      const ids = getAllMatchIds();
      if (ids.length === 0) return;
      const res = await fetch('/api/match-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`, },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      setMatchUrls(data);
    };

    fetchMatchUrls();
  }, [matchlistA, matchlistB, matchlistAB]);

  const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getAllPlayerIds = () => {
      const allIds = [
        ...teama11Players.map((item: { player_id: any; }) => item.player_id),
        ...teamb11Players.map((item: { player_id: any; }) => item.player_id),
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
  }, [teama11Players, teamb11Players]);

  const a = parseFloat(matchData?.live_odds?.matchodds?.teama?.back || 0);
  const b = parseFloat(matchData?.live_odds?.matchodds?.teamb?.back || 0);
  const lesserTeam = a < b
    ? { team: matchData?.match_info?.teama?.short_name, ...matchData?.live_odds?.matchodds?.teama }
    : { team: matchData?.match_info?.teamb?.short_name, ...matchData?.live_odds?.matchodds?.teamb };
  return (
    <>
      <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
        <MatchTabs matchUrl={matchUrl} match_id={match_id} matchDetails={matchDetails} isPointTable={isPointTable} />


        {/*------------------------  More Info Seaction Start ---------------------------*/}
        <div id="info" className="tab-content">
          <div className="md:grid grid-cols-12 gap-4">
            {/* Match Detail */}
            <div className="lg:col-span-8 md:col-span-7">


              <div className="md:flex items-center justify-between p-4 rounded-lg bg-white">
                <div className="flex gap-4 items-center md:mb-0 mb-[15px]">
                  <div>
                    <MatchCard teamA={matchData?.match_info?.teama?.logo_url} teamB={matchData?.match_info?.teamb?.logo_url} />
                  </div>
                  <div>
                    <p className="text-[16px] text-[#757A82] font-medium md:mb-4">
                      {matchData?.match_info?.subtitle}
                    </p>
                    <p className="text-[16px] text-[#272B47] font-medium mb-2">
                      {matchData?.match_info?.competition?.title}
                    </p>
                  </div>
                </div>
                <div className="text-start">
                  <p className="text-[14px] md:mb-4 mb-1 text-[#272B47] font-medium">
                    <span className="text-[14px] text-[#757A82]">
                      Date : </span>
                    {format(new Date(matchData?.match_info?.date_start_ist), "dd MMM, yyyy hh:mm a")}
                  </p>
                  <p className="text-[14px] text-[#272B47] font-medium">
                    <span className="text-[14px] text-[#757A82]">
                      Toss :  </span>{" "}
                    {matchData?.match_info?.toss?.text}
                  </p>
                </div>
              </div>







              {matchData?.match_info?.status_str !== 'Completed' ? (


                ""

              ) : (
                manOfTheMatch?.pid !== undefined &&
                <div className="rounded-lg bg-[#ffffff] my-4 p-4 md:hidden">

                  <Link href={"/player/" + playerUrls[manOfTheMatch?.pid]}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 md:py-3">


                        <PlayerImage key={manOfTheMatch?.pid} player_id={manOfTheMatch?.pid} height={50} width={50} className="rounded-lg" />

                        <div className="font-medium">
                          <h2 className="text-1xl font-semibold hover:text-[#1a80f8]">{manOfTheMatch?.name}</h2>
                          <p className="text-[#6A7586] font-normal"> Man of the match </p>
                        </div>
                      </div>
                      <Image
                        src="/assets/img/home/win.png"
                        width={26}
                        height={30}
                        style={{ width: "26px", height: "30px" }}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  </Link>

                </div>

              )}












              <div className="rounded-lg bg-[#ffffff] my-4 p-4">

                <h2 className="text-[15px] font-semibold pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                  Recent Performance{" "}
                  <span className="text-[#757A82]"> (Last 5 match) </span>
                </h2>

                <div className="border-t-[1px] border-[#E4E9F0]" />

                <div className="md:px-2">
                  <div className="performance-section">
                    <div
                      className="flex items-center justify-between my-3"
                      onClick={() => handleToggle(1)}
                    >

                      <div className="flex items-center space-x-3">

                        <Image
                          loading="lazy"
                          src={matchData?.match_info?.teama?.logo_url}
                          className="h-[25px]"
                          width={25}
                          height={20}
                          alt={matchData?.match_info?.teama?.name}
                        />

                        <h3 className="md:block hidden text-1xl font-medium">
                          {matchData?.match_info?.teama?.name}
                        </h3>

                        <h3 className="md:hidden text-1xl font-medium">
                          {matchData?.match_info?.teama?.short_name}
                        </h3>

                      </div>


                      <div className="ml-auto flex gap-1 items-center">
                        {matchlistA && matchlistA
                          .slice(0, 5)
                          .map(
                            (items: {
                              match_id: number | undefined;
                              winning_team_id: number;
                            }) =>
                              items.winning_team_id === teama_id ? (
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


                        <button
                          className={`transform transition-transform ${openHeading === 1
                            ? "rotate-180"
                            : "rotate-0"
                            }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 12l-7.5 7.5L4.5 12"
                            />
                          </svg>
                        </button>

                      </div>

                    </div>

                    <div className="border-t-[1px] border-[#E4E9F0]" />
                    {openHeading === 1 && (
                      <div className="md:px-3 open-Performance-data">
                        {/* full screen teame data */}

                        <div className="overflow-x-auto lg:block hidden">
                          <table className="w-full text-left rtl:text-right">
                            <tbody>
                              {matchlistA
                                .slice(0, 5)
                                .map((items: any, index: number) => (
                                  <tr
                                    className="whitespace-nowrap bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-[13px]"
                                    key={index}
                                  >

                                    <td className="px-8 pl-0 py-1 ">
                                      <Link className="w-full flex" href={"/scorecard/" + matchUrls[items.match_id]}>
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
                                            <span className="text-[#757A82]">
                                              {items.teama.short_name}
                                            </span>
                                          </div>
                                          <p>{items.teama.scores}</p>
                                        </div>
                                      </Link>
                                    </td>

                                    <td className="md:px-8 py-2 font-medium text-[#6A7586]">
                                      VS
                                    </td>
                                    <td className="md:px-8 py-2">
                                      <Link className="w-full flex" href={"/scorecard/" + matchUrls[items.match_id]}>
                                        <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                          <p>{items.teamb.scores}</p>
                                          <div className="flex items-center space-x-1">
                                            <span className="text-[#757A82]">
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
                                        <p className="text-[#757A82] font-normal">
                                          {items.short_title}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="px-0 pr-0 py-1 text-[#2F335C]">
                                      <div className="text-center">
                                        {items.winning_team_id ===
                                          teama_id ? (
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
                          {matchlistA
                            .slice(0, 5)
                            .map((items: any, index: number) => (
                              <Link className="flex justify-between items-center py-4 px-2 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]" key={index} href={"/scorecard/" + matchUrls[items.match_id]}>
                                <div className="">
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-3">
                                    <div className="flex items-center space-x-1">
                                      <Image loading="lazy"
                                        src={items.teama.logo_url}
                                        className=" rounded-full"
                                        width={25}
                                        height={25}
                                        alt={items.teama.short_name}
                                      />
                                      <span className="text-[#757A82]">
                                        {items.teama.short_name}
                                      </span>
                                    </div>
                                    <p>{items.teama.scores}</p>
                                  </div>


                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <div className="flex items-center space-x-1">
                                      <Image loading="lazy"
                                        src={items.teamb.logo_url}
                                        className=""
                                        width={25}
                                        height={25}
                                        alt={items.teamb.short_name}
                                      />
                                      <span className="text-[#757A82]">
                                        {items.teamb.short_name}
                                      </span>
                                    </div>
                                    <p>{items.teamb.scores}</p>
                                  </div>

                                </div>


                                <div className="hidden md:block h-[35px] border-l-[1px] border-[#d0d3d7]"></div>

                                <div className="flex items-center space-x-4">
                                  <div className="text-right leading-6">
                                    <p className="font-medium"> {items.subtitle}</p>
                                    <p className="text-[#757A82] font-normal">
                                      {items.short_title}
                                    </p>
                                  </div>

                                  <div className="text-center">
                                    {items.winning_team_id ===
                                      teama_id ? (
                                      <span className="bg-[#13B76D] text-white text-[13px] px-[6px] py-[3px] rounded w-[24px] text-center inline-block">
                                        W
                                      </span>
                                    ) : (
                                      <span className="bg-[#F63636] text-white text-[13px] px-[7px] py-[3px] rounded w-[24px] text-center inline-block">
                                        L
                                      </span>
                                    )}

                                  </div>

                                </div>
                              </Link>
                            ))}

                        </div>
                      </div>
                    )}
                  </div>

                  <div className="performance-section mt-4">

                    <div
                      className="flex items-center justify-between my-3"
                      onClick={() => handleToggle(2)}
                    >
                      <div className="flex items-center space-x-3">

                        <Image
                          loading="lazy"
                          src={matchData?.match_info?.teamb?.logo_url}
                          width={25}
                          height={25}
                          alt={matchData?.match_info?.teamb?.name}
                          className="h-[25px]"
                        />


                        <h3 className="md:block hidden text-1xl font-medium">
                          {matchData?.match_info?.teamb?.name}
                        </h3>

                        <h3 className="md:hidden text-1xl font-medium">
                          {matchData?.match_info?.teamb?.short_name}
                        </h3>

                      </div>

                      <div className="ml-auto flex gap-1 items-center">
                        {matchlistB && matchlistB
                          .slice(0, 5)
                          .map(
                            (items: {
                              match_id: number;
                              winning_team_id: any;
                            }) =>
                              items.winning_team_id === teamb_id ? (
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

                        <button
                          className={`transform transition-transform ${openHeading === 2
                            ? "rotate-180"
                            : "rotate-0"
                            }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 12l-7.5 7.5L4.5 12"
                            />
                          </svg>
                        </button>

                      </div>

                    </div>

                    <div className="border-t-[1px] border-[#E4E9F0]" />

                    {openHeading === 2 && (
                      <div className="md:px-3 open-Performance-data">
                        {/* full screen teame data */}
                        <div className="overflow-x-auto lg:block hidden">
                          <table className="w-full text-left rtl:text-right">
                            <tbody>
                              {matchlistB && matchlistB
                                .slice(0, 5)
                                .map((items: any, index: number) => (
                                  <tr
                                    className="whitespace-nowrap bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-[13px]"
                                    key={index}
                                  >

                                    <td className="px-8 pl-0 py-1 ">
                                      <Link className="w-full flex" href={"/scorecard/" + matchUrls[items.match_id]}>
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
                                    <td className="md:px-8 py-2 font-medium text-[#6A7586]">
                                      VS
                                    </td>
                                    <td className="md:px-8 py-2">
                                      <Link className="w-full flex" href={"/scorecard/" + matchUrls[items.match_id]}>
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
                                        {items.winning_team_id ===
                                          teamb_id ? (
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
                          {matchlistB
                            .slice(0, 5)
                            .map((items: any, index: number) => (
                              <Link className="flex justify-between items-center py-4 px-2 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]" key={index} href={"/scorecard/" + matchUrls[items.match_id]}>
                                <div className="">

                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-3">
                                    <div className="flex items-center space-x-1">
                                      <Image loading="lazy"
                                        src={items.teama.logo_url}
                                        className=" rounded-full"
                                        width={25}
                                        height={25}
                                        alt={items.teama.short_name}
                                      />
                                      <span className="text-[#757A82]">
                                        {items.teama.short_name}
                                      </span>
                                    </div>
                                    <p>{items.teama.scores}</p>
                                  </div>



                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <div className="flex items-center space-x-1">
                                      <Image loading="lazy"
                                        src={items.teamb.logo_url}
                                        className=""
                                        width={25}
                                        height={25}
                                        alt={items.teamb.short_name}
                                      />
                                      <span className="text-[#757A82]">
                                        {items.teamb.short_name}
                                      </span>
                                    </div>
                                    <p>{items.teamb.scores}</p>
                                  </div>

                                </div>
                                <div className="hidden md:block h-[35px] border-l-[1px] border-[#d0d3d7]"></div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right leading-6">
                                    <p className="font-medium"> {items.subtitle}</p>
                                    <p className="text-[#757A82] font-normal">
                                      {items.short_title}
                                    </p>
                                  </div>

                                  <div className="text-center">
                                    {items.winning_team_id ===
                                      teamb_id ? (
                                      <span className="bg-[#13B76D] text-white text-[13px] px-[6px] py-[3px] rounded w-[24px] text-center">
                                        W
                                      </span>
                                    ) : (
                                      <span className="bg-[#F63636] text-white text-[13px] px-[7px] py-[3px] rounded w-[24px] text-center">
                                        L
                                      </span>
                                    )}

                                  </div>
                                </div>

                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>


              <div className="rounded-lg bg-[#ffffff] my-4 p-4" key="mypage">
                <h2 className="text-1xl font-semibold pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                  Head To Head (Last 5 matches)
                </h2>
                <div className="border-t-[1px] border-[#E4E9F0]" />

                <div className="py-4 text-1xl flex justify-between items-center">

                  <div className="font-bold uppercase flex items-center">
                    <Image
                      loading="lazy"
                      className="h-[30px]"
                      src={matchData?.match_info?.teama?.logo_url}
                      width={30}
                      height={30}
                      alt={matchData?.match_info?.teama?.short_name}
                    />
                    <p className="mx-2 font-semibold uppercase">
                      {matchData?.match_info?.teama?.short_name}
                    </p>
                  </div>

                  <div className="text-[#D28505] text-[17px] font-semibold text-center">
                    {teamaWinMatch}{" "}
                    <span className="text-[#009900]">
                      - {teambWinMatch}
                    </span>
                  </div>


                  <div className="font-bold uppercase flex items-center">
                    <p className="mx-2 font-semibold uppercase">
                      {matchData?.match_info?.teamb?.short_name}
                    </p>
                    <Image
                      loading="lazy"
                      className="h-[30px]"
                      src={matchData?.match_info?.teamb?.logo_url}
                      width={30}
                      height={30}
                      alt={matchData?.match_info?.teamb?.short_name}
                    />
                  </div>

                </div>

                <div className="border-t-[1px] border-[#E4E9F0]" />
                {matchlistAB && matchlistAB
                  .slice(0, 5)
                  .map((items: any, index: number) => (
                    <div
                      className="py-4 flex justify-between items-center"
                      key={index}
                    >
                      <Link className="w-full flex" href={"/scorecard/" + matchUrls[items.match_id]}>
                        <div className="font-medium w-[20%] ">
                          <p className="mx-2 font-semibold uppercase">
                            {items.teama.short_name}
                          </p>
                          <p className="mx-2 font-medium uppercase text-[#586577]">
                            {items.teama.scores}
                          </p>
                        </div>
                        <div className=" font-semibold text-center w-[60%]">
                          <p className="text-[#3D4DCF]">
                            {items.status_note}
                          </p>
                          <p className="text-[#586577] font-medium">
                            {items.subtitle} {items.short_title}
                          </p>
                        </div>
                        <div className="font-medium text-right w-[20%]">
                          <p className="mx-2 font-semibold uppercase">
                            {items.teamb.short_name}
                          </p>
                          <p className="mx-2 font-medium uppercase text-[#586577]">
                            {items.teamb.scores}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>



              <div className="rounded-lg bg-[#ffffff] my-4 p-4 cust-box-click-container">
                <div className="md:flex justify-between items-center  mb-3">
                  <h2 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                    Team Comparison (Last 10 matches)
                  </h2>
                  <div className="flex items-center md:justify-center justify-end md:mt-0 mt-4">
                    <button
                      onClick={(e) =>
                        handleProbabilityTab(e, "cust-box-click-firview")
                      }
                      className={` cust-box-click-button font-medium px-5 py-1 rounded-full ${activeTab === "cust-box-click-firview"
                        ? "bg-[#081736] text-white"
                        : "bg-[#ffffff] text-[#6A7586]"
                        }`}
                    >
                      <span>Overall</span>
                    </button>

                    <button
                      onClick={(e) =>
                        handleProbabilityTab(e, "cust-box-click-oddsview")
                      }
                      className={` cust-box-click-button font-medium px-5 py-1 rounded-full ${activeTab === "cust-box-click-oddsview"
                        ? "bg-[#081736] text-white"
                        : "bg-[#ffffff] text-[#6A7586]"
                        }`}
                    >
                      <span>On Venue</span>
                    </button>
                  </div>
                </div>

                <div className="border-t-[1px] border-[#E4E9F0]" />

                <div>
                  <div
                    className={`cust-box-click-content cust-box-click-firview mt-4 ${activeTab === "cust-box-click-firview" ? "" : "hidden"
                      }`}
                  >
                    <div className="cust-box-click-content cust-box-click-overall1 mt-4">
                      <div>
                        <div className="py-4 flex justify-between items-center">

                          <div className="font-bold flex items-center">
                            <Image
                              loading="lazy"
                              className="h-[30px]"
                              src={matchData?.match_info?.teama?.logo_url}
                              width={30}
                              height={30}
                              alt={
                                matchData?.match_info?.teama?.short_name
                              }
                            />
                            <p className="mx-2 text-1xl font-semibold">
                              {matchData?.match_info?.teama?.short_name}
                              <span className="text-[13px] text-[#9094b6] font-medium block">
                                vs all teams
                              </span>
                            </p>
                          </div>

                          <div className="font-bold flex items-center">
                            <p className="mx-2 text-1xl font-semibold text-right">
                              {matchData?.match_info?.teamb?.short_name}
                              <span className="text-[13px] text-[#9094b6] font-medium block">
                                vs all teams
                              </span>
                            </p>
                            <Image
                              loading="lazy"
                              className="h-[30px]"
                              src={matchData?.match_info?.teamb?.logo_url}
                              width={30}
                              height={30}
                              alt={
                                matchData?.match_info?.teamb?.short_name
                              }
                            />
                          </div>

                        </div>
                        <div className="border-t-[1px] border-[#E4E9F0]" />
                        <div className="py-2 flex justify-between items-center">
                          <div className="font-medium text-[#586577] w-full">
                            <p className="mx-2 font-semibold uppercase">
                              {matchPlayedA}
                            </p>
                          </div>
                          <div className=" font-semibold text-center w-full">
                            <p className="text-[#73758B] font-normal">
                              Matches Played
                            </p>
                          </div>
                          <div className="font-medium text-right w-full">
                            <p className="text-[#586577] font-medium">
                              {matchPlayedB}
                            </p>
                          </div>
                        </div>
                        <div className="border-t-[1px] border-[#E4E9F0]" />
                        <div className="py-2 flex justify-between items-center">
                          <div className="font-medium text-[#586577] w-full">
                            <p className="mx-2 font-semibold text-[#439F76] uppercase">
                              {teamaWinper.toFixed(2)}%
                            </p>
                          </div>
                          <div className=" font-semibold text-center w-full">
                            <p className="text-[#73758B] font-normal">
                              Win
                            </p>
                          </div>
                          <div className="font-medium text-right w-full">
                            <p className="text-[#586577] font-medium">
                              {teambWinper.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <div className="border-t-[1px] border-[#E4E9F0]" />
                        <div className="py-2 flex justify-between items-center">
                          <div className="font-medium text-[#586577] w-full">
                            <p className="mx-2 font-semibold uppercase text-[#439F76]">
                              {averageScoreTeamA.toFixed(2)}
                            </p>
                          </div>
                          <div className=" font-semibold text-center w-full">
                            <p className="text-[#73758B] font-normal">
                              Avg Score
                            </p>
                          </div>
                          <div className="font-medium text-right w-full">
                            <p className="text-[#586577] font-medium">
                              {averageScoreTeamB.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="border-t-[1px] border-[#E4E9F0]" />
                        <div className="py-2 flex justify-between items-center">
                          <div className="font-medium text-[#586577] w-full">
                            <p className="mx-2 font-semibold uppercase text-[#439F76]">
                              {highestScoreTeamA}
                            </p>
                          </div>
                          <div className=" font-semibold text-center w-full">
                            <p className="text-[#73758B] font-normal">
                              Highest Score
                            </p>
                          </div>
                          <div className="font-medium text-right w-full">
                            <p className="text-[#586577] font-medium">
                              {highestScoreTeamB}
                            </p>
                          </div>
                        </div>
                        <div className="border-t-[1px] border-[#E4E9F0]" />
                        <div className="py-2 flex justify-between items-center">
                          <div className="font-medium text-[#586577] w-full">
                            <p className="mx-2 font-semibold uppercase text-[#E14848]">
                              {lowestScoreTeamA}
                            </p>
                          </div>
                          <div className=" font-semibold text-center w-full">
                            <p className="text-[#73758B] font-normal">
                              Lowest Score
                            </p>
                          </div>
                          <div className="font-medium text-right w-full">
                            <p className="text-[#586577] font-medium">
                              {lowestScoreTeamB}
                            </p>
                          </div>
                        </div>
                        <div className="border-t-[1px] border-[#E4E9F0]" />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`cust-box-click-content cust-box-click-oddsview mt-4 ${activeTab === "cust-box-click-oddsview"
                      ? ""
                      : "hidden"
                      }`}
                  >

                    <div className="cust-box-click-content cust-box-click-overall1 mt-4">

                      <div className="py-4 flex justify-between items-center">

                        <div className="font-bold flex items-center">
                          <Image
                            loading="lazy"
                            className="h-[30px]"
                            src={
                              matchData?.match_info?.teama?.logo_url
                            }
                            width={30}
                            height={30}
                            alt={
                              matchData?.match_info?.teama?.short_name
                            }
                          />
                          <p className="mx-2 text-1xl font-semibold">
                            {matchData?.match_info?.teama?.short_name}
                            <span className="text-[13px] text-[#9094b6] font-medium block">
                              vs all teams
                            </span>
                          </p>
                        </div>

                        <div className="font-bold flex items-center">
                          <p className="mx-2 text-1xl font-semibold text-right">
                            {matchData?.match_info?.teamb?.short_name}
                            <span className="text-[13px] text-[#9094b6] font-medium block">
                              vs all teams
                            </span>
                          </p>
                          <Image
                            loading="lazy"
                            className="h-[30px]"
                            src={
                              matchData?.match_info?.teamb?.logo_url
                            }
                            width={30}
                            height={30}
                            alt={
                              matchData?.match_info?.teamb?.short_name
                            }
                          />
                        </div>

                      </div>
                      <div className="border-t-[1px] border-[#E4E9F0]" />
                      <div className="py-2 flex justify-between items-center">
                        <div className="font-medium text-[#586577] w-full">
                          <p className="mx-2 font-semibold uppercase">
                            {sameVenuematchPlayedA}
                          </p>
                        </div>
                        <div className=" font-semibold text-center w-full">
                          <p className="text-[#73758B] font-normal">
                            Matches Played
                          </p>
                        </div>
                        <div className="font-medium text-right w-full">
                          <p className="text-[#586577] font-medium">
                            {sameVenuematchPlayedB}
                          </p>
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[#E4E9F0]" />
                      <div className="py-2 flex justify-between items-center">
                        <div className="font-medium text-[#586577] w-full">
                          <p className="mx-2 font-semibold text-[#439F76] uppercase">
                            {sameVenueteamaWinper.toFixed(2)}%
                          </p>
                        </div>
                        <div className=" font-semibold text-center w-full">
                          <p className="text-[#73758B] font-normal">
                            Win
                          </p>
                        </div>
                        <div className="font-medium text-right w-full">
                          <p className="text-[#586577] font-medium">
                            {sameVenueteambWinper.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[#E4E9F0]" />
                      <div className="py-2 flex justify-between items-center">
                        <div className="font-medium text-[#586577] w-full">
                          <p className="mx-2 font-semibold uppercase text-[#439F76]">
                            {sameVenueaverageScoreTeamA.toFixed(2)}
                          </p>
                        </div>
                        <div className=" font-semibold text-center w-full">
                          <p className="text-[#73758B] font-normal">
                            Avg Score
                          </p>
                        </div>
                        <div className="font-medium text-right w-full">
                          <p className="text-[#586577] font-medium">
                            {sameVenueaverageScoreTeamB.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[#E4E9F0]" />
                      <div className="py-2 flex justify-between items-center">
                        <div className="font-medium text-[#586577] w-full">
                          <p className="mx-2 font-semibold uppercase text-[#439F76]">
                            {sameVenuehighestScoreTeamA}
                          </p>
                        </div>
                        <div className=" font-semibold text-center w-full">
                          <p className="text-[#73758B] font-normal">
                            Highest Score
                          </p>
                        </div>
                        <div className="font-medium text-right w-full">
                          <p className="text-[#586577] font-medium">
                            {sameVenuehighestScoreTeamB}
                          </p>
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[#E4E9F0]" />
                      <div className="py-2 flex justify-between items-center">
                        <div className="font-medium text-[#586577] w-full">
                          <p className="mx-2 font-semibold uppercase text-[#E14848]">
                            {sameVenuelowestScoreTeamA}
                          </p>
                        </div>
                        <div className=" font-semibold text-center w-full">
                          <p className="text-[#73758B] font-normal">
                            Lowest Score
                          </p>
                        </div>
                        <div className="font-medium text-right w-full">
                          <p className="text-[#586577] font-medium">
                            {sameVenuelowestScoreTeamB}
                          </p>
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[#E4E9F0]" />

                    </div>

                  </div>
                </div>
              </div>



              <div className="rounded-lg bg-[#ffffff] my-4 p-4 relative">

                <div className="flex justify-between items-center">
                  <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Weather Condition
                  </h2>
                  <p className="text-[12px]"><span> Last Updated : </span> <span>{format(new Date(), "dd MMM, yyyy hh:ii a")}</span></p>
                </div>
                <div className="border-t-[1px] border-[#E4E9F0]" />
                <div className="flex lg:grid md:grid-cols-12 justify-between md:gap-4 items-center py-3">
                  <div className="col-span-3">

                    <Image
                      loading="lazy"
                      src={matchData?.match_info?.weather?.weather ? "/assets/img/weather/" + matchData?.match_info?.weather?.weather + ".svg" : "/assets/img/weather/weather.png"}
                      className="md:h-[75px] h-[60px]"
                      width={75}
                      height={75}
                      alt=""
                    />
                    {/* <p className="text-1xl ml-2 font-semibold">{matchData?.match_info?.weather?.weather}</p> */}
                    <p className="text-1xl ml-2 font-semibold capitalize">{matchData?.match_info?.weather?.weather_desc}</p>

                  </div>
                  {/* <div className="col-span-3 font-normal text-[#616161] mb-2">

                        <p className="">
                          {matchData?.match_info?.weather?.weather_desc}
                        </p>

                      </div> */}
                  <div className="col-span-6 flex items-center justify-center">
                    <p className="font-bold	md:text-[28px] text-[24px]">
                      {matchData?.match_info?.weather?.temp}°C
                    </p>
                  </div>
                  <div className="col-span-3 text-[#616161] md:text-[13px] text-[11px]">
                    <div className="flex justify-between pb-[6px] items-center">
                      <div className="flex space-x-2 items-center">
                        <Image
                          loading="lazy"
                          src="/assets/img/w-1.png"
                          className="h-[16px]"
                          width={15}
                          height={15}
                          alt=""
                        />
                        <p className="">Humidity:</p>
                      </div>

                      <div className="text-[#FEA126]">
                        {matchData?.match_info?.weather?.humidity}%
                      </div>

                    </div>
                    <div className="flex justify-between pb-[6px] space-x-2 items-center">
                      <div className="flex space-x-2 items-center">
                        <Image
                          loading="lazy"
                          src="/assets/img/w-2.png"
                          className="h-[16px]"
                          width={15}
                          height={15}
                          alt=""
                        />
                        <p className="">Clouds: </p>
                      </div>

                      <span className="text-[#16A1EF]">
                        {matchData?.match_info?.weather?.clouds}
                      </span>

                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2 items-center">
                        <Image
                          loading="lazy"
                          src="/assets/img/wind.png"
                          className="h-[16px]"
                          width={15}
                          height={15}
                          alt=""
                        />
                        <p className="">Wind:</p>
                      </div>

                      <span className="text-[#1565c0]">
                        {matchData?.match_info?.weather?.wind_speed}km/h
                      </span>

                    </div>
                  </div>
                </div>
                <div className="border-t-[1px] border-[#E4E9F0]" />
                <div className="flex space-x-2 pt-3 items-center">
                  <Image
                    loading="lazy"
                    src="/assets/img/map.png"
                    width={15}
                    height={15}
                    alt="location"
                  />
                  <p className="text-[#586577]">
                    {matchData?.match_info?.venue?.name},{" "}
                    {matchData?.match_info?.venue?.location},{" "}
                    {matchData?.match_info?.venue?.country}.
                  </p>
                </div>

              </div>



              <div className="rounded-lg bg-[#ffffff] my-4 p-4">
                <h2
                  className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Venue Stats
                </h2>
                <div className="border-t-[1px] border-[#E4E9F0]" />
                {/* full screen view */}
                <div className="lg:flex hidden justify-between items-center py-4">

                  <div
                    className="col-span-1 relative flex justify-center items-center w-[81px] h-[81px] rounded-full"
                    style={{
                      background:
                        "conic-gradient(#586577 0 0%, #b7132b 0 " +
                        matchVenueStats?.first_batting_match_won +
                        "%, #00a632 0 " +
                        matchVenueStats?.first_bowling_match_won +
                        "%)",
                    }}
                  >
                    <div className="flex flex-col items-center w-[65px] h-[64px] p-4 justify-center rounded-full bg-white">
                      {/* <p className="font-bold leading-[21px] text-[18px]">8</p> */}
                      <p className="text-[10px]"></p>
                    </div>
                  </div>

                  <div className="col-span-1 relative">
                    <div className="pb-5">
                      <p className="text-[#00a632] font-semibold">
                        {!isNaN(matchVenueStats?.first_batting_match_won) ? matchVenueStats?.first_batting_match_won : 0}%
                      </p>
                      <p className="text-[13px] text-[#586577]">
                        Win Bat first{" "}
                      </p>
                    </div>

                    <p className="text-[#B7132B] font-semibold">
                      {!isNaN(matchVenueStats?.first_bowling_match_won) ? matchVenueStats?.first_bowling_match_won : 0}%
                    </p>
                    <p className="text-[13px] text-[#586577]">
                      Win Bowl first{" "}
                    </p>

                  </div>
                  <div className="col-span-1 relative">
                    <div className="pb-5">
                      <p className="font-semibold">
                        {
                          !isNaN(matchVenueStats?.average_score_for_venue?.[0]?.avgruns) ? matchVenueStats?.average_score_for_venue?.[0]
                            ?.avgruns : 0
                        }
                      </p>
                      <p className="text-[13px] text-[#586577]">
                        Avg 1st Innings
                      </p>
                    </div>

                    <p className="font-semibold">
                      {
                        !isNaN(matchVenueStats?.average_score_for_venue?.[1]
                          ?.avgruns) ? matchVenueStats?.average_score_for_venue?.[1]
                          ?.avgruns : 0
                      }
                    </p>
                    <p className="text-[13px] text-[#586577]">
                      Avg 2st Innings
                    </p>

                  </div>
                  <div className="col-span-1 relative">
                    <div className="pb-5">
                      <p className="font-semibold">
                        {!isNaN(matchVenueStats?.team_toss_win_choose_batting) ? matchVenueStats?.team_toss_win_choose_batting : 0}%
                      </p>
                      <p className="text-[13px] text-[#586577]">
                        Toss Win First Bat
                      </p>
                    </div>

                    <p className="font-semibold">
                      {!isNaN(matchVenueStats?.team_toss_win_choose_fieldeding) ? matchVenueStats?.team_toss_win_choose_fieldeding : 0}%
                    </p>
                    <p className="text-[13px] text-[#586577]">
                      Toss Win FIrst Bowl
                    </p>

                  </div>
                  <div className="col-span-1 relative">
                    <div className="pb-5">
                      <p className="font-semibold">
                        {
                          !isNaN(matchVenueStats?.team_toss_win_choose_batting_match_won) ? matchVenueStats?.team_toss_win_choose_batting_match_won : 0
                        }
                        %
                      </p>
                      <p className="text-[13px] text-[#586577]">
                        Toss Win First Bat Won
                      </p>
                    </div>

                    <p className="font-semibold">
                      {
                        !isNaN(matchVenueStats?.team_toss_win_choose_fielding_match_won) ? matchVenueStats?.team_toss_win_choose_fielding_match_won : 0
                      }
                      %
                    </p>
                    <p className="text-[13px] text-[#586577]">
                      Toss Win First Bowl Won
                    </p>
                  </div>

                </div>
                {/* responsive screen view */}
                <div className="lg:hidden">
                  <div className="flex items-center justify-around my-2 py-3 rounded-lg bg-[#f7faff]">
                    <div className="col-span-1 relative">
                      <div
                        className="flex justify-center items-center w-[81px] h-[81px] rounded-full"
                        style={{
                          background:
                            "conic-gradient(#586577 0 0%, #b7132b 0 " +
                            matchVenueStats?.first_batting_match_won +
                            "%, #00a632 0 " +
                            matchVenueStats?.first_bowling_match_won +
                            "%)",
                        }}
                      >
                        <div className="flex flex-col justify-center items-center w-[65px] h-[64px] p-4 rounded-full bg-white">
                          {/* <p className="font-bold text-[18px]">7</p> */}
                          {/* <p className="text-[10px]">Matches</p> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 relative">
                      <div className="flex items-center space-x-8 mb-4 justify-between">
                        <p className="text-[13px] text-[#586577]">
                          Win Bat first{" "}
                        </p>
                        <p className="text-[#00a632] font-semibold text-1xl">
                          {!isNaN(matchVenueStats?.first_batting_match_won) ? matchVenueStats?.first_batting_match_won : 0}%
                        </p>
                      </div>
                      <div className="flex items-center space-x-8">
                        <p className="text-[13px] text-[#586577]">
                          Win Bowl first{" "}
                        </p>
                        <p className="text-[#B7132B] font-semibold text-1xl">
                          {!isNaN(matchVenueStats?.first_bowling_match_won) ? matchVenueStats?.first_bowling_match_won : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 mb-3 pb-3 border-b border-[#e4e9f0]">
                    <div className="flex flex-col items-start space-y-1">
                      <p className="text-[13px] text-[#586577]">
                        Avg 1st Innings
                      </p>
                      <p className="font-medium text-1xl">
                        {
                          !isNaN(matchVenueStats?.average_score_for_venue?.[0]?.avgruns) ? matchVenueStats?.average_score_for_venue?.[0]
                            ?.avgruns : 0
                        }%
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <p className="text-[13px] text-[#586577]">
                        Avg 2st Innings
                      </p>
                      <p className="font-medium text-1xl">
                        {
                          !isNaN(matchVenueStats?.average_score_for_venue?.[1]?.avgruns) ? matchVenueStats?.average_score_for_venue?.[1]
                            ?.avgruns : 0
                        }%
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 mb-3 pb-3 border-b border-[#e4e9f0]">
                    <div className="flex flex-col items-start space-y-1">
                      <p className="text-[13px] text-[#586577]">
                        Toss Win First Bat
                      </p>
                      <p className="font-medium text-1xl">
                        {!isNaN(matchVenueStats?.team_toss_win_choose_batting) ? matchVenueStats?.team_toss_win_choose_batting : 0}%
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <p className="text-[13px] text-[#586577]">
                        Toss Win First Bowl
                      </p>
                      <p className="font-medium text-1xl">
                        {!isNaN(matchVenueStats?.team_toss_win_choose_fieldeding) ? matchVenueStats?.team_toss_win_choose_fieldeding : 0}%
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 mb-3 pb-3 border-b border-[#e4e9f0]">
                    <div className="flex flex-col items-start space-y-1">
                      <p className="text-[13px] text-[#586577]">
                        Toss Win First Bat Won
                      </p>
                      <p className="font-medium text-1xl">
                        {
                          !isNaN(matchVenueStats?.team_toss_win_choose_batting_match_won) ? matchVenueStats?.team_toss_win_choose_batting_match_won : 0
                        }%
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <p className="text-[13px] text-[#586577]">
                        Toss Win First Bowl Won
                      </p>
                      <p className="font-medium text-1xl">
                        {
                          !isNaN(matchVenueStats?.team_toss_win_choose_fielding_match_won) ? matchVenueStats?.team_toss_win_choose_fielding_match_won : 0
                        }%
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="rounded-lg bg-[#ffffff] my-4 md:hidden p-4">
                <div className="flex space-x-2">
                  <div className="border-l-[3px] border-[#229ED3] h-[19px]" />
                  <h3 className="text-1xl font-semibold mb-3">
                    Pace vs Spin on Venue{" "}
                    <span className="text-[#5C6081]">
                      {" "}
                      &nbsp;(Last 10 matches){" "}
                    </span>
                  </h3>
                </div>
                <div className="w-full">
                  <div className="bg-[#B7132B] h-[4px] mr-2 mb-2">
                    <div
                      className="bg-[#13B76D] h-[4px]"
                      style={{ width: "40%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className=" text-gray-500">
                      {" "}
                      Pace:{" "}
                      <span className="text-[#00a632] text-[15px] font-semibold">
                        40%{" "}
                      </span>
                    </p>
                    <p className="text-gray-500 ">
                      {" "}
                      Spin:{" "}
                      <span className="text-[#B7132B] text-[15px] font-semibold">
                        60%{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </div>



              <div className="rounded-lg bg-[#ffffff] my-4 p-4">
                <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Umpires
                </h2>
                <div className="border-t-[1px] border-[#E4E9F0]" />

                <div className="py-2 flex justify-between items-center">
                  <div className="md:w-[20%] w-[40%]">
                    <p className="mx-2 font-medium">On-field Umpire :</p>
                  </div>
                  <div className="md:w-[80%] w-[60%]">
                    <p className="mx-2 text-[#586577] font-medium text-end">
                      {matchData?.match_info?.umpires}
                    </p>
                  </div>
                </div>
                {/* <div className="border-t-[1px] border-[#E4E9F0]" />
                  <div className="py-2 flex justify-between items-center">
                    <div className="">
                      <p className="mx-2 font-medium">Third Umpire :</p>
                    </div>
                    <div className="">
                      <p className="mx-2 text-[#586577] font-medium ">
                        Sue Redfern
                      </p>
                    </div>
                  </div> */}
                <div className="border-t-[1px] border-[#E4E9F0]" />

                <div className="py-2 pb-0 flex justify-between items-center">

                  <p className="mx-2 font-medium">Referee :</p>


                  <p className="mx-2 text-[#586577] font-medium ">
                    {matchData?.match_info?.referee}
                  </p>

                </div>
              </div>
            </div>

            <div className="lg:col-span-4 md:col-span-5">


              {matchData?.match_info?.status_str !== 'Completed' ? (


                <div className="rounded-lg bg-[#ffffff]  mb-4 hidden md:block p-4 cust-box-click-container">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="border-l-[3px] border-[#229ED3] h-[19px]" />
                      <h2 className="text-1xl font-semibold">Probability</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={`cust-box-click-button  font-medium ${activeOddTab === "tab1"
                          ? "bg-[#081736] text-[#ffffff] "
                          : "bg-[#ffffff] text-[#6A7586]"
                          } px-5 py-1 rounded-full`}
                        onClick={() => setActiveOddTab("tab1")}
                      >
                        <span>% View</span>
                      </button>
                      <button
                        className={`cust-box-click-button font-medium ${activeOddTab === "tab2"
                          ? "bg-[#081736] text-[#ffffff] "
                          : "bg-[#ffffff] text-[#6A7586]"
                          }  px-5 py-1 rounded-full`}
                        onClick={() => setActiveOddTab("tab2")}
                      >
                        <span>Odds View</span>
                      </button>
                    </div>
                  </div>
                  {activeOddTab === "tab1" && (
                  
                      <div className="cust-box-click-content">

                        <div className="relative mt-4 h-[4px] bg-gray-200 overflow-hidden">
                          <div
                            className="absolute h-full bg-[#13B76D]"
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
                              left: `${teamwinpercentage?.draw +
                                teamwinpercentage?.team_a_win
                                }%`,
                            }}
                          >

                          </div>
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
                   
                  )}
                  {activeOddTab === "tab2" && (
                    <div className="cust-box-click-content">
                      <div className="flex justify-between items-center border-t-[1px] pt-2">
                        <div className="text-1xl font-medium">
                          {lesserTeam?.team}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="py-1 px-4 bg-orange-500 rounded-md text-white">
                            {lesserTeam
                              ?.back !== null &&
                              lesserTeam
                                ?.back !== undefined &&
                              lesserTeam
                                ?.back !== ""
                              ? Math.round(
                                lesserTeam
                                  ?.back *
                                100 -
                                100
                              )
                              : 0}
                          </p>
                          <p className="py-1 px-4 bg-[#00a632] rounded-md text-white">
                            {lesserTeam
                              ?.lay !== null &&
                              lesserTeam
                                ?.lay !== undefined &&
                              lesserTeam
                                ?.lay !== ""
                              ? Math.round(
                                lesserTeam
                                  ?.lay *
                                100 -
                                100
                              )
                              : 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>



              ) : (
                manOfTheMatch?.pid !== undefined &&
                <div className="rounded-lg bg-[#ffffff] mb-4 md:block hidden p-4">
                 
                    <Link href={"/player/" + playerUrls[manOfTheMatch?.pid]}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 ">


                          <PlayerImage key={manOfTheMatch?.pid} player_id={manOfTheMatch?.pid} height={50} width={50} className="rounded-lg" />

                          <div className="font-medium">
                            <h2 className="text-1xl font-semibold hover:text-[#1a80f8]">{manOfTheMatch?.name}</h2>
                            <p className="text-[#6A7586] font-normal"> Man of the match </p>
                          </div>
                        </div>
                        <Image
                          src="/assets/img/home/win.png"
                          width={26}
                          height={30}
                          style={{ width: "26px", height: "30px" }}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    </Link>
                    </div>
              

              )}


              
                <div className="rounded-lg bg-[#ffffff] p-4 cust-box-click-container">
                  <h2 className="text-1xl font-semibold pl-[7px] mb-3 border-l-[3px] border-[#229ED3]">
                    Playing XI
                  </h2>
                  <div className="border-t-[1px] border-[#E4E9F0]" />
                  <div className="flex items-center justify-around py-4">
                    <button
                      onClick={(e) =>
                        handlePlaying11Tab(e, "cust-box-click-playing11")
                      }
                      className={` cust-box-click-button font-medium px-12 py-1 rounded-full ${playing11Tab === "cust-box-click-playing11"
                        ? "bg-[#081736] text-white"
                        : "bg-[#ffffff] text-[#6A7586]"
                        }`}
                    >
                      <span>{matchData?.match_info?.teama.short_name}</span>
                    </button>

                    <button
                      onClick={(e) =>
                        handlePlaying11Tab(e, "cust-box-click-playing12")
                      }
                      className={` cust-box-click-button font-medium px-12 py-1 rounded-full ${playing11Tab === "cust-box-click-playing12"
                        ? "bg-[#081736] text-white"
                        : "bg-[#ffffff] text-[#6A7586]"
                        }`}
                    >
                      <span>{matchData?.match_info?.teamb.short_name}</span>
                    </button>
                  </div>
                  <div className="border-t-[1px] border-[#E4E9F0]" />

                  <div
                    className={`cust-box-click-content cust-box-click-playing11 ${playing11Tab === "cust-box-click-playing11"
                      ? ""
                      : "hidden"
                      }`}
                  >
                    
                      {teama11Players?.map((player) => (
                        <Link
                          href={
                            "/player/" +
                            playerUrls[player?.player_id]
                          }
                          key={player.player_id}
                        >
                          <div className="flex items-center space-x-3 py-3 border-b-[1px] border-border-gray-700">
                            <div>
                              <PlayerImage key={player?.player_id} player_id={player?.player_id} height={35} width={35} className="rounded-lg" />

                            </div>
                            <div className="font-medium">
                              <h3 className="text-[15px] hover:text-[#1a80f8]">
                                {" "}
                                {player.name}{" "}
                                {player.role_str !== ""
                                  ? player.role_str
                                  : ""}{" "}
                              </h3>
                              <p className="text-[#757A82] font-normal">
                                {
                                  player.role !== ""
                                    ? player.role === 'wk'
                                      ? 'Wicket Keeper'
                                      : player.role === 'bat'
                                        ? 'Batsman'
                                        : player.role === 'bowl'
                                          ? 'Bowler'
                                          : 'All Rounder'
                                    : ""
                                }
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    
                  </div>

                  <div
                    className={`cust-box-click-content cust-box-click-playing12 ${playing11Tab === "cust-box-click-playing12"
                      ? ""
                      : "hidden"
                      }`}
                  >
                    
                      {teamb11Players?.map((player) => (
                        <Link
                          href={
                            "/player/" +
                            playerUrls[player?.player_id]
                          }
                          key={player.player_id}
                        >
                          <div className="flex items-center space-x-3 py-3 border-b-[1px] border-border-gray-700">
                            <div>
                              <PlayerImage key={player?.player_id} player_id={player?.player_id} height={35} width={35} className="rounded-lg" />

                            </div>
                            <div className="font-medium">
                              <h3 className="text-[15px] hover:text-[#1a80f8]">
                                {" "}
                                {player.name}{" "}
                                {player.role_str !== ""
                                  ? player.role_str
                                  : ""}{" "}
                              </h3>
                              <p className="text-[#757A82] font-normal">
                                {
                                  player.role !== ""
                                    ? player.role === 'wk'
                                      ? 'Wicket Keeper'
                                      : player.role === 'bat'
                                        ? 'Batsman'
                                        : player.role === 'bowl'
                                          ? 'Bowler'
                                          : 'All Rounder'
                                    : ""
                                }
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  
                </div>
              
        
                <div className="rounded-lg bg-[#ffffff] my-4 hidden md:block p-4">
                  <div className="flex space-x-2">
                    <div className="border-l-[3px] border-[#229ED3] h-[19px]" />
                    <h2 className="text-1xl font-semibold mb-3">
                      Pace vs Spin on Venue{" "}
                      <span className="text-[#757A82]">
                        {" "}
                        &nbsp;(Last 10 matches){" "}
                      </span>
                    </h2>
                  </div>
                  <div className="w-full">
                    <div className="bg-[#B7132B] h-[4px] mr-2 mb-2">
                      <div
                        className="bg-[#13B76D] h-[4px]"
                        style={{ width: "40%" }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className=" text-gray-500">
                        {" "}
                        Pace:{" "}
                        <span className="text-[#00a632] text-[15px] font-semibold">
                          40%{" "}
                        </span>
                      </p>
                      <p className="text-gray-500 ">
                        {" "}
                        Spin:{" "}
                        <span className="text-[#B7132B] text-[15px] font-semibold">
                          60%{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
             



            </div>
          </div>
        </div>

      </section>
    </>
  );
}

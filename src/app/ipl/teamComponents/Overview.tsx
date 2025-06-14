"use client";

import React, { useState, useEffect, Suspense, lazy, useMemo } from "react";
import Link from "next/link";
// import WeeklySlider from "@/app/components/WeeklySlider";
import Image from "next/image";
import { urlStringEncode } from "@/utils/utility";
import PlayerImage from "@/app/components/PlayerImage";
// import FantasyTips from "@/app/components/FantasyTips";
// import PLSeries from "@/app/components/popularSeries";
import NewsSection from "../../series/seriesComponents/NewsSection";

const WeeklySlider = lazy(() => 
  import('@/app/components/WeeklySlider.tsx')
    .then(module => ({ 
      default: module.default as unknown as React.ComponentType<any> 
    }))
);
const FantasyTips = lazy(() => 
  import('@/app/components/FantasyTips.tsx')
    .then(module => ({ 
      default: module.default as unknown as React.ComponentType<any> 
    }))
);
const PLSeries = lazy(() => 
  import('@/app/components/popularSeries.tsx')
    .then(module => ({ 
      default: module.default as unknown as React.ComponentType<any> 
    }))
);
interface teamview {
  cid: number;
  params: any;
  teamPlayers: any;
  teamLast5match: any;
  pointTables: any;
  seriesMatches: any;
  venueDetails: any;
}





export default function Overview({
  cid,
  params,
  teamPlayers,
  teamLast5match,
  pointTables,
  seriesMatches,
  venueDetails
}: teamview) {


  const [activeSquad, setActiveSquad] = useState("Batter");
  const [pageHtml, setPageHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = (tab: React.SetStateAction<string>) => {
    setActiveSquad(tab);
  };

  const teams = teamPlayers[0]?.team || {};
  const captain = teamPlayers[0]?.captains?.[0] || null;
  const players = teamPlayers[0]?.players?.["t20"] || [];
  const standings = pointTables?.standing?.standings || [];

  const [squads, setSquads] = useState([]);
      useEffect(() => {
        async function fetchSquads() {
          try {
            const response = await fetch("/api/series/SeriesSquads", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
              },
              body: JSON.stringify({ cid: cid }),
            });
            if (!response.ok) {
              console.error(
                `Error: API returned ${response.status} for CID ${cid}`
              );
              return null; // Skip failed requests
            }
    
            const result = await response.json();
            let items = result?.data?.squads || [];
            const teamSquad = items.find((sd: any) => [sd?.team_id,].includes(Number(teams?.tid )) );
            setSquads(teamSquad?.players);
          } catch (error) {
            console.error("Error fetching matches:", error);
          }
        }
        fetchSquads()
      }, [cid]);
  
   
   
  
    const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});
    
      useEffect(() => {
        const getAllPlayerIds = (squads: any[]) => {
          const allIds = [
            ...squads.flatMap((team: {  pid: any }) => team.pid)
            ];
          return [...new Set(allIds)]; // Deduplicate
        };
        
        const fetchPlayerUrls = async () => {
          const ids = getAllPlayerIds(squads);
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
      }, [squads]);

    const { batsmen, bowlers, allRounders } = React.useMemo(() => {
        
      return {
        batsmen: squads?.filter((sd: any) => ['bat', 'wk'].includes(sd?.playing_role)) || null,
        bowlers: squads?.filter((sd: any) => ['bowl'].includes(sd?.playing_role)) || null,
        allRounders: squads?.filter((sd: any) => ['all'].includes(sd?.playing_role)) || null
      };
    }, [squads, teams?.tid]);

  const completedMatch = useMemo(() => {
    return seriesMatches?.resultMatch
      ?.filter((m: any) => m?.date_start && [m?.teama?.team_id, m?.teamb?.team_id].includes(Number(teams?.tid)))
      ?.sort((a: any, b: any) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())?.[0] || null;
  }, [seriesMatches, teams?.tid]);

  const upcomingMatch = useMemo(() => {
    return seriesMatches?.scheduledMatch
      ?.filter((m: any) => m?.date_start && [m?.teama?.team_id, m?.teamb?.team_id].includes(Number(teams?.tid)))
      ?.sort((a: any, b: any) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())?.[0] || null;
  }, [seriesMatches, teams?.tid]);
 
  const [seriesStats, setSeriesStats] = useState<any[]>([]);
  const [statsType, setStatsType] = useState("most-run"); // user-facing type
  const [statType, setStatType] = useState("batting_most_runs"); // API type

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setStatsType(selectedType);

    const renderStatus = () => {
      switch (selectedType) {
        case "most-run":
          return "batting_most_runs";
        case "highest-average":
          return "batting_highest_average";
        case "highest-strikerate":
          return "batting_highest_strikerate";
        case "most-hundreds":
          return "batting_most_run100";
        case "most-fifties":
          return "batting_most_run50";
        case "most-fours":
          return "batting_most_run4";
        case "most-sixes":
          return "batting_most_run6";
        case "most-wicket":
          return "bowling_top_wicket_takers";
        case "best-average":
          return "bowling_best_averages";
        case "best-bowling":
          return "bowling_best_bowling_figures";
        case "most-five_wickets":
          return "bowling_five_wickets";
        case "best-economy":
          return "bowling_best_economy_rates";
        case "best-strike":
          return "bowling_best_strike_rates";
        default:
          return "batting_most_runs";
      }
    };

    const apiStatType = renderStatus();
    setStatType(apiStatType); // update the API-compatible stat type
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, htmlRes] = await Promise.all([
          fetch(`/api/match/MatchStats`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
            },
            body: JSON.stringify({ cid, statType }),
          }),
          fetch(`/api/series/SeriesHtml`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
            },
            body: JSON.stringify({ cid }),
          })
        ]);

        const [statsData, htmlData] = await Promise.all([
          statsRes.ok ? statsRes.json() : { data: { stats: [] } },
          htmlRes.ok ? htmlRes.json() : { data: [{ overViewHtml: "" }] }
        ]);

        setSeriesStats(statsData?.data?.stats || []);
        setPageHtml(htmlData?.data?.[0]?.overViewHtml || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cid) fetchData();
  }, [cid, statType]);

  const [open, setOpen] = useState({
    mostRuns: false,
    mostHundreds: false,
    mostFifties: false,
    mostDucks: false,
    highestBattingAverage: false,
    highestScore: false,
    mostMatchesAsCaptain: false,
  });

  const toggleOpen = (key: keyof typeof open) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key], // Now TypeScript knows 'key' is a valid key
    }));
  };
  if (isLoading) {
    return (
      <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <div id="tabs" className="mt-4">
        <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
          <Link
            href={
              "/ipl/" + pointTables?.season + "/" + urlStringEncode(teams?.title) + "/" + teams?.tid
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md">
              Overview
            </button>
          </Link>
          <Link
            href={
              "/ipl/" + pointTables?.season + "/" +
              urlStringEncode(teams?.title) +
              "/" +
              teams?.tid +
              "/schedule-results"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap ">
              Schedule & Results
            </button>
          </Link>
          <Link
            href={
              "/ipl/" + pointTables?.season + "/" +
              urlStringEncode(teams?.title) +
              "/" +
              teams?.tid +
              "/squads"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Squads
            </button>
          </Link>
          <Link
            href={
              "/series/" +
              urlStringEncode(pointTables?.title + "-" + pointTables?.season) +
              "/" +
              pointTables?.cid +
              "/points-table"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Points Table
            </button>
          </Link>
          <Link
            href={
              "/series/" +
              urlStringEncode(pointTables?.title + "-" + pointTables?.season) +
              "/" +
              pointTables?.cid +
              "/news"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              News
            </button>
          </Link>
          <Link
            href={
              "/series/" +
              urlStringEncode(pointTables?.title + "-" + pointTables?.season) +
              "/" +
              pointTables?.cid +
              "/stats"
            }
          >
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Stats
            </button>
          </Link>
        </div>
      </div>

      <div id="tab-content">
        <div id="info" className="">
          <div className="md:grid grid-cols-12 gap-4">
            <div className="lg:col-span-8 md:col-span-7 mt-4">
              <div className="rounded-lg bg-white mb-4">
                <div className="p-4">
                  <h2 className="text-[15px] font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Info
                  </h2>
                  <div className="border-t border-[#E4E9F0]"></div>

                  {/* <!-- Responsive Grid Section --> */}
                  <div className="grid gap-2 grid-cols-1 py-3 px-2">
                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">Coach :</h3>
                      <p className="text-[14px] font-medium">
                        {teams?.head_coach}{" "}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">Country :</h3>
                      <p className="text-[14px] font-medium flex gap-[3px]">
                        <Image
                          src="/assets/img/flag/17.png"
                          className="h-[20px]"
                          width={20}
                          height={20}
                          alt=""
                        />{" "}
                        <span> India </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white">
                <div className="p-4">
                  <h2 className="text-[15px] font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Venue
                  </h2>
                  <div className="border-t border-[#E4E9F0]"></div>

                  {/* <!-- Responsive Grid Section --> */}
                  <div className="grid gap-2 grid-cols-1 py-3 px-2">
                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">Name :</h3>
                      <p className="text-[14px] font-medium"> {venueDetails?.venue_name} </p>
                    </div>
                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">Capacity :</h3>
                      <p className="text-[14px] font-medium"> {venueDetails?.venue_capacity}</p>
                    </div>

                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">City :</h3>
                      <p className="text-[14px] font-medium"> {venueDetails?.venue_city}, {venueDetails?.venue_country}</p>
                    </div>
                  </div>
                </div>
              </div>
              {completedMatch &&
                <div className="rounded-lg bg-[#ffffff] my-4 p-4">
                  <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Last Match Result
                  </h2>

                  {/* <!-- Featured Matches desktop view  --> */}
                  <div className="border-t-[1px] border-[#E4E9F0]"></div>
                  <div className="hidden lg:block cursor-pointer">
                  <Link href={"/scorecard/" + urlStringEncode(completedMatch?.short_title + "-" + completedMatch?.subtitle + "-" + completedMatch?.competition?.title + "-" + completedMatch?.competition?.season) + "/" + completedMatch.match_id} passHref
                      legacyBehavior>
                      <div className="py-3 flex justify-between items-center">
                      
                        <div className="flex space-x-2 font-medium	w-full">
                          <div className="flex items-center space-x-1 flex-col">
                            <Image
                              src={completedMatch?.teama?.logo_url}
                              className="h-[35px] rounded-full"
                              width={35}
                              height={35}
                              alt={completedMatch?.teama?.short_name}
                              priority={false}
                            />
                            <span className="text-[#757A82]">{completedMatch?.teama?.short_name}</span>
                          </div>
                          <div className="mt-1">
                            <p className="text-1xl font-semibold">{completedMatch?.teama?.scores}</p>
                            <p className="text-[#757A82]">({completedMatch?.teama?.overs} overs)</p>
                          </div>
                        </div>

                        <div className=" font-semibold text-center w-full">
                          <p className="text-[#3D4DCF] text-[14px]">{completedMatch?.result}</p>
                          <p className="text-[#757A82] text-[12px] font-normal">
                            {completedMatch?.subtitle} {completedMatch?.competition?.abbr}
                          </p>
                        </div>

                        <div className="flex space-x-2 font-medium justify-end w-full">
                          <div className="mt-1 text-end">
                            <p className="text-1xl font-semibold">{completedMatch?.teamb?.scores}</p>
                            <p className="text-[#757A82]">({completedMatch?.teamb?.overs} overs)</p>
                          </div>

                          <div className="flex items-center space-x-1 flex-col font-medium">
                            <Image
                              src={completedMatch?.teamb?.logo_url}
                              className="h-[35px] rounded-full"
                              width={35}
                              height={35}
                              alt={completedMatch?.teamb?.short_name}
                              priority={false}
                            />
                            <span className="text-[#757A82]">{completedMatch?.teamb?.short_name}</span>
                          </div>
                        </div>
                        
                      </div>
                      </Link>

                  </div>

                  {/* <!-- Featured Matches responsive view view  --> */}
                  
                    <div className="lg:hidden">
                    <Link href={"/scorecard/" + urlStringEncode(completedMatch?.teama?.short_name + "-vs-" + completedMatch?.teamb?.short_name + "-" + completedMatch?.subtitle + "-" + completedMatch?.competition?.title + "-" + completedMatch?.competition?.season) + "/" + completedMatch.match_id}>
                      <div className="py-4 px-3 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]">
                        <p className="text-[#757A82] text-[12px] mb-4 font-normal">
                          {completedMatch?.subtitle} {completedMatch?.competition?.abbr}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="">
                            <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full mb-3">
                              <div className="flex items-center space-x-1 flex-col">
                                <Image
                                  src={completedMatch?.teama?.logo_url}
                                  className="h-[25px] rounded-full"
                                  width={25}
                                  height={25}
                                  alt={completedMatch?.teama?.short_name}
                                />
                                <span className="text-[#757A82]">{completedMatch?.teama?.short_name}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-1xl font-semibold">{completedMatch?.teama?.scores}</p>
                                <p className="text-[#757A82]">({completedMatch?.teama?.overs} overs)</p>
                              </div>
                            </div>

                            <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full">
                              <div className="flex items-center space-x-1 flex-col">
                                <Image
                                  src={completedMatch?.teamb?.logo_url}
                                  className="h-[25px] rounded-full"
                                  width={25}
                                  height={25}
                                  alt={completedMatch?.teamb?.short_name}
                                />
                                <span className="text-[#757A82]">{completedMatch?.teamb?.short_name}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-1xl font-semibold">{completedMatch?.teamb?.scores}</p>
                                <p className="text-[#757A82]">({completedMatch?.teamb?.overs} overs)</p>
                              </div>
                            </div>
                          </div>

                          <div className="h-[60px] border-l-[1px] border-[#d0d3d7]"></div>

                          <div className=" font-semibold text-right">
                            <p className="text-[#3D4DCF]">{completedMatch?.result}</p>
                          </div>
                        </div>
                      </div>
                      </Link>
                    </div>
                  
                </div>
              }
              {upcomingMatch &&
                <div className="rounded-lg bg-[#ffffff] my-4 p-4">
                  <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Upcoming Match
                  </h2>

                  {/* <!-- Featured Matches desktop view  --> */}
                  <div className="border-t-[1px] border-[#E4E9F0]"></div>
                  <Link href={"/moreinfo/" + urlStringEncode(upcomingMatch?.teama?.short_name + "-vs-" + upcomingMatch?.teamb?.short_name + "-" + upcomingMatch?.subtitle + "-" + upcomingMatch?.competition?.title + "-" + upcomingMatch?.competition?.season) + "/" + upcomingMatch.match_id}>
                    <div className="hidden lg:block">

                      <div className="py-3 pb-0 flex justify-between items-center">
                        <div className="flex space-x-2 font-medium	w-full">
                          <div className="flex items-center space-x-1 flex-row">
                            <Image
                              src={upcomingMatch?.teama?.logo_url}
                              className="h-[35px] rounded-full"
                              width={35}
                              height={35}
                              alt={upcomingMatch?.teama?.short_name}
                            />
                            <span className="text-[#757A82]">{upcomingMatch?.teama?.short_name}</span>
                          </div>
                        </div>

                        <div className=" font-semibold text-center w-full">
                          <p className="text-[#414143] text-[14px]">{upcomingMatch?.subtitle} {upcomingMatch?.competition?.abbr} on</p>
                          <p className="text-[#757A82] text-[12px] font-normal">
                            {upcomingMatch?.date_start_ist}
                          </p>
                        </div>

                        <div className="flex space-x-2 font-medium justify-end w-full">
                          <div className="flex items-center gap-1 flex-row-reverse font-medium">
                            <Image
                              src={upcomingMatch?.teamb?.logo_url}
                              className="h-[35px] rounded-full"
                              width={35}
                              height={35}
                              alt={upcomingMatch?.teamb?.short_name}
                            />
                            <span className="text-[#757A82]">{upcomingMatch?.teamb?.short_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* <!-- Featured Matches responsive view view  --> */}

                  <div className="lg:hidden">
                    <Link href={"/moreinfo/" + urlStringEncode(upcomingMatch?.teama?.short_name + "-vs-" + upcomingMatch?.teamb?.short_name + "-" + upcomingMatch?.subtitle + "-" + upcomingMatch?.competition?.title + "-" + upcomingMatch?.competition?.season) + "/" + upcomingMatch.match_id}>
                      <div className="py-4 px-3 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]">
                        <p className="text-[#757A82] text-[12px] mb-4 font-normal">
                          {upcomingMatch?.subtitle} {upcomingMatch?.competition?.abbr}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="">
                            <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full mb-3">
                              <div className="flex items-center space-x-1 ">
                                <Image
                                  src={upcomingMatch?.teama?.logo_url}
                                  className="h-[25px] rounded-full"
                                  width={25}
                                  height={25}
                                  alt={upcomingMatch?.teama?.short_name}
                                />
                                <span className="text-[#757A82]">{upcomingMatch?.teama?.short_name}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full">
                              <div className="flex items-center space-x-1 ">
                                <Image
                                  src={upcomingMatch?.teamb?.logo_url}
                                  className="h-[25px] rounded-full"
                                  width={25}
                                  height={25}
                                  alt={upcomingMatch?.teamb?.short_name}
                                />
                                <span className="text-[#757A82]">{upcomingMatch?.teamb?.short_name}</span>
                              </div>
                            </div>
                          </div>

                          <div className="h-[60px] border-l-[1px] border-[#d0d3d7]"></div>

                          <div className=" font-semibold text-right">
                            <p className="text-[#414143]"> {upcomingMatch?.date_start_ist}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              }

              {standings?.map((rounds: any, index: number) => (
                <div className="rounded-lg bg-[#ffffff] mb-2 p-4" key={index}>
                  <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                    {rounds?.round?.name} {pointTables?.season}
                  </h3>

                  <div className="relative">
                    <div
                      className="overflow-x-auto  [&amp;::-webkit-scrollbar] [&amp;::-webkit-scrollbar]:h-[5px] 
                [&amp;::-webkit-scrollbar-track]:bg-gray-100 
                [&amp;::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                dark:[&amp;::-webkit-scrollbar-track]:bg-neutral-700 
                dark:[&amp;::-webkit-scrollbar-thumb]:bg-neutral-500"
                    >
                      <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                        <thead className="bg-blue-50 text-gray-700 ">
                          <tr>
                            <th className="md:px-2 pl-[14px] py-3 font-medium w-[10px]">
                              No
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              Team
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              M
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              W
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              L
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              T
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              N/R
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              PTS
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              Net RR
                            </th>
                            <th className="md:px-2 pl-[14px] py-3 font-medium">
                              Form
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {rounds.standings?.slice(0, 4)?.map(
                            (point: any, index: number) => (
                              <tr key={index}>
                                <td className="md:px-2 pl-[14px] py-3 w-[10px]">
                                  {index + 1}
                                </td>
                                <td className="md:px-2 pl-[14px] py-3 text-[#217AF7]">
                                  <Link
                                    href={
                                      "/ipl/" + pointTables?.season + "/" +
                                      urlStringEncode(point?.team.title) +
                                      "/" +
                                      point?.team.tid
                                    }
                                  >
                                    <div className="flex items-center gap-[5px] w-[120px]">
                                      <div>
                                        <Image
                                          src={point?.team?.thumb_url}
                                          className="h-[20px]"
                                          width={20}
                                          height={20}
                                          alt="1"
                                        />
                                      </div>
                                      <p>
                                        {point?.team?.abbr}{" "}
                                        {point?.quality === "true" ? (
                                          <span className="text-[#00B564]">
                                            {" "}
                                            (Q)
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </p>
                                    </div>
                                  </Link>
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">
                                  {point?.played}
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">
                                  {point?.win}
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">
                                  {point?.loss}
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">
                                  {point?.draw}
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">
                                  {point?.nr}
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">
                                  {point?.points}
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">
                                  {point?.netrr}
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">
                                  <div className="ml-auto flex gap-2 items-center">
                                    {point?.lastfivematchresult
                                      .split(",")
                                      ?.map((item: string, index: number) => (
                                        <span
                                          className={`${item === "W"
                                            ? "bg-[#13B76D]"
                                            : item === "N" ? "bg-[#928d8d]"
                                              : "bg-[#F63636]"
                                            } text-white text-[13px] px-[4px] py-[0px] rounded w-[24px] text-center`}
                                          key={index}
                                        >
                                          {" "}
                                          {item}
                                        </span>
                                      ))}


                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {rounds?.standings?.length > 4 && (
                      <div className="absolute bottom-[33px] left-0 w-full h-10 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none z-10"></div>
                    )}

                    {rounds?.standings?.length > 4 &&
                      <div className="text-center">
                        <Link href={
                          "/series/" +
                          urlStringEncode(pointTables?.title + "-" + pointTables?.season) +
                          "/" +
                          pointTables?.cid +
                          "/points-table"
                        } >
                          <div className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-2 underline">
                            View More{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-3 ml-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </div>
                        </Link>
                      </div>
                    }
                  </div>
                </div>
              ))}

              <div className="rounded-lg bg-[#ffffff] mb-2 p-4">
                <div className="mb-3 flex justify-between items-center">
                  <h2 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                    Top Player {pointTables?.season}
                  </h2>
                  <div>
                    <select
                      className="border-[1px] rounded-md p-2 bg-[#ffffff]"
                      onChange={handleSelectChange}
                      defaultValue="most-run"
                    >
                      <option value="most-run">Most Runs</option>
                      <option value="highest-average">
                        Best Batting Average
                      </option>
                      <option value="highest-strikerate">
                        Best Batting Strike Rate
                      </option>
                      <option value="most-hundreds">Most Hundreds</option>
                      <option value="most-fifties">Most Fifties</option>
                      <option value="most-fours">Most Fours</option>
                      <option value="most-sixes">Most Sixes</option>
                      <option value="most-wicket">Most Wickets</option>
                      <option value="best-average">Best Bowling Average</option>
                      <option value="best-bowling">Best Bowling</option>
                      <option value="best-economy">Best Economy</option>
                      <option value="best-strike">
                        Best Bowling Strike Rate
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <div
                    className="overflow-x-auto  [&amp;::-webkit-scrollbar] [&amp;::-webkit-scrollbar]:h-[5px] 
                [&amp;::-webkit-scrollbar-track]:bg-gray-100 
                [&amp;::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                dark:[&amp;::-webkit-scrollbar-track]:bg-neutral-700 
                dark:[&amp;::-webkit-scrollbar-thumb]:bg-neutral-500"
                  >
                    <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                      <thead className="bg-blue-50 text-gray-700 ">
                        <tr>
                          <th className="md:px-2 pl-[14px] py-3 font-medium w-[10px]">
                            Player
                          </th>
                          <th className="md:px-2 pl-[14px] py-3 font-medium">
                            Mat
                          </th>
                          <th className="md:px-2 pl-[14px] py-3 font-medium">
                            Inns
                          </th>
                          <th className="md:px-2 pl-[14px] py-3 font-medium">
                            HS
                          </th>
                          <th className="md:px-2 pl-[14px] py-3 font-medium">
                            Avg
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {seriesStats?.map((stats: any, index: number) => (
                          <tr className="" key={index}>
                            <td className="md:px-3 pl-[14px] py-3">
                              <div className="flex items-center gap-[5px] md:w-[240px] w-[185px]">
                                <div>
                                  <PlayerImage
                                    key={stats?.player?.pid}
                                    player_id={stats?.player?.pid}
                                    height={33}
                                    width={33}
                                    className="h-[33px] rounded-lg"
                                  />
                                </div>
                                <div>
                                  <p className="text-[#3e3e3e] font-medium hover:text-[#1a80f8]">
                                    <Link
                                      href={
                                        "/player/" +
                                        urlStringEncode(
                                          stats?.player?.first_name
                                        ) +
                                        "/" +
                                        stats?.player?.pid
                                      }
                                    >
                                      {" "}
                                      {stats?.player?.short_name}
                                    </Link>
                                  </p>
                                  <p className="text-[12px]">
                                    {stats?.player?.playing_role === "all"
                                      ? "All-Rounder"
                                      : stats?.player?.playing_role === "wk"
                                        ? "Wiket-Keeper"
                                        : stats?.player?.playing_role === "bat"
                                          ? "Batsman"
                                          : "Bowler"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="md:px-2 pl-[14px] py-3">
                              {stats?.matches}
                            </td>
                            <td className="md:px-2 pl-[14px] py-3">
                              {stats?.innings}
                            </td>
                            <td className="md:px-2 pl-[14px] py-3">
                              {stats?.runs}
                            </td>
                            <td className="md:px-2 pl-[14px] py-3">
                              {stats?.average}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  {teams?.title} (Last 5 Matches)
                </h2>

                {/* <!-- Featured Matches desktop view  --> */}
                <div className="border-t-[1px] border-[#E4E9F0]"></div>
                <div className="hidden lg:block">
                  {teamLast5match?.map((match: any, index: number) => (
                    <Link key={index} href={"/scorecard/" + urlStringEncode(match?.teama?.short_name + "-vs-" + match?.teamb?.short_name + "-" + match?.subtitle + "-" + match?.competition?.title + "-" + match?.competition?.season) + "/" + match.match_id}>
                      <div className="py-3 flex justify-between items-center">

                        <div className="flex space-x-2 font-medium	w-full">
                          <div className="flex items-center space-x-1 flex-col">
                            <Image
                              src={match?.teama?.logo_url}
                              className="h-[35px] rounded-full"
                              width={33}
                              height={33}
                              alt="csk"
                            />
                            <span className="text-[#757A82]">
                              {match?.teama?.short_name}
                            </span>
                          </div>
                          <div className="mt-1">
                            <p className="text-1xl font-semibold">
                              {match?.teama?.scores}
                            </p>
                            <p className="text-[#757A82]">
                              ({match?.teama?.overs} overs)
                            </p>
                          </div>
                        </div>

                        <div className=" font-semibold text-center w-full">
                          <p className="text-[#3D4DCF] text-[14px]">
                            {match?.result}
                          </p>
                          <p className="text-[#757A82] text-[12px] font-normal">
                            {match?.subtitle}, {match?.competition?.abbr}
                          </p>
                        </div>

                        <div className="flex space-x-2 font-medium justify-end w-full">
                          <div className="mt-1 text-end">
                            <p className="text-1xl font-semibold">
                              {match?.teamb?.scores}
                            </p>
                            <p className="text-[#757A82]">
                              ({match?.teamb?.overs} overs)
                            </p>
                          </div>

                          <div className="flex items-center space-x-1 flex-col font-medium">
                            <Image
                              src={match?.teamb?.logo_url}
                              className="h-[35px] rounded-full"
                              width={33}
                              height={33}
                              alt="nz"
                            />
                            <span className="text-[#757A82]">
                              {match?.teamb?.short_name}
                            </span>
                          </div>
                        </div>

                      </div>
                      {index < teamLast5match?.length - 1 && (
                        <div className="border-t-[1px] border-[#E4E9F0]"></div>
                      )}
                    </Link>
                  ))}
                </div>

                {/* <!-- Featured Matches responsive view view  --> */}

                <div className="lg:hidden">
                  {teamLast5match?.map((match: any, index: number) => (
                    <div className="py-4 px-3 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]" key={index}>
                      <p className="text-[#757A82] text-[12px] mb-4 font-normal">
                        {match?.subtitle}, {match?.competition?.abbr}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="">
                          <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full mb-3">
                            <div className="flex items-center space-x-1 flex-col">
                              <Image
                                src={match?.teama?.logo_url}
                                className="h-[25px] rounded-full"
                                width={25}
                                height={25}
                                alt={match?.teama?.short_name}
                              />
                              <span className="text-[#757A82]">{match?.teama?.short_name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-1xl font-semibold">{match?.teama?.scores}</p>
                              <p className="text-[#757A82]">({match?.teama?.overs} overs)</p>
                            </div>
                          </div>

                          <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full">
                            <div className="flex items-center space-x-1 flex-col">
                              <Image
                                src={match?.teamb?.logo_url}
                                className="h-[25px] rounded-full"
                                width={25}
                                height={25}
                                alt={match?.teamb?.short_name}
                              />
                              <span className="text-[#757A82]">{match?.teamb?.short_name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-1xl font-semibold">{match?.teamb?.scores}</p>
                              <p className="text-[#757A82]">({match?.teamb?.overs} overs)</p>
                            </div>
                          </div>
                        </div>

                        <div className="h-[60px] border-l-[1px] border-[#d0d3d7]"></div>

                        <div className=" font-semibold text-right">
                          <p className="text-[#3D4DCF]">{match?.result}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                <div>
                  <div className="mb-3 md:flex justify-between items-center">
                    <h3 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                      Players
                    </h3>


                    <div className="flex space-x-4 md:mt-0 mt-3">
                      {["Batter", "Bowler", "All-Rounder"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleClick(tab)}
                          className={`font-medium py-1 md:px-7 px-6 whitespace-nowrap border-[1px] border-[#E5E8EA] rounded-full ${activeSquad === tab ? 'bg-[#081736] text-white' : 'bg-white text-black'
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>





                  </div>

                  <div className="border-t-[1px] border-[#E4E9F0]"></div>

                  <div className="">
                    {activeSquad === "Batter" && <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                      {batsmen?.map((player: any, index: number) => (
                        <div
                          className="text-center p-4 rounded-md border-[1px] border-[##E2E2E2]"
                          key={index}
                        >
                          <Link href={"/player/" + playerUrls[player?.pid]}>
                            <div className="relative">
                              <PlayerImage
                                key={player?.pid}
                                player_id={player?.pid}
                                height={55}
                                width={55}
                                className="h-[55px] mx-auto rounded-full mb-2"
                              />
                              <Image
                                loading="lazy"
                                src={player?.playing_role === "all"
                                  ? "/assets/img/player/bat-ball.png"
                                  : player?.playing_role === "wk"
                                    ? "/assets/img/player/bat.png"
                                    : player?.playing_role === "bat"
                                      ? "/assets/img/player/bat.png"
                                      : "/assets/img/player/ball.png"}
                                className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                width={23}
                                height={23}
                                alt="1"
                              />
                            </div>
                            <h3 className="text-[14px] font-medium text-gray-800 hover:text-[#1a80f8]">
                              {player?.title}
                            </h3>
                            <div className="flex gap-1 items-center justify-center">
                              {/* <Image src="/assets/img/flag/b-2.png" className="h-[15px] rounded-full" width={15} height={15} alt="" /> */}
                              <p className="text-xs text-gray-600">
                                {player?.playing_role === "all"
                                  ? "All-Rounder"
                                  : player?.playing_role === "wk"
                                    ? "Wiket-Keeper"
                                    : player?.playing_role === "bat"
                                      ? "Batsman"
                                      : "Bowler"}
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                    }
                    {activeSquad === "Bowler" && <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                      {bowlers?.map((player: any, index: number) => (
                        <div
                          className="text-center p-4 rounded-md border-[1px] border-[##E2E2E2]"
                          key={index}
                        >
                          <Link href={"/player/" + playerUrls[player?.pid]}>
                            <div className="relative">
                              <PlayerImage
                                key={player?.pid}
                                player_id={player?.pid}
                                height={55}
                                width={55}
                                className="h-[55px] mx-auto rounded-full mb-2"
                              />
                              <Image
                                loading="lazy"
                                src={"/assets/img/player/ball.png"}
                                className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                width={23}
                                height={23}
                                alt="1"
                              />
                            </div>
                            <h3 className="text-[14px] font-medium text-gray-800 hover:text-[#1a80f8]">
                              {player?.title}
                            </h3>
                            <div className="flex gap-1 items-center justify-center">
                              {/* <Image src="/assets/img/flag/b-2.png" className="h-[15px] rounded-full" width={15} height={15} alt="" /> */}
                              <p className="text-xs text-gray-600">
                                Bowler
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>}
                    {activeSquad === "All-Rounder" && <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                      {allRounders?.map((player: any, index: number) => (
                        <div
                          className="text-center p-4 rounded-md border-[1px] border-[##E2E2E2]"
                          key={index}
                        >
                          <Link href={"/player/" + playerUrls[player?.pid]}>
                            <div className="relative">
                              <PlayerImage
                                key={player?.pid}
                                player_id={player?.pid}
                                height={55}
                                width={55}
                                className="h-[55px] mx-auto rounded-full mb-2"
                              />
                              <Image
                                loading="lazy"
                                src={"/assets/img/player/bat-ball.png"}
                                className="h-[23px] absolute md:right-[17px] right-[35px] bottom-0 bg-white rounded-full p-[4px]"
                                width={23}
                                height={23}
                                alt="1"
                              />
                            </div>
                            <h3 className="text-[14px] font-medium text-gray-800 hover:text-[#1a80f8]">
                              {player?.title}
                            </h3>
                            <div className="flex gap-1 items-center justify-center">
                              {/* <Image src="/assets/img/flag/b-2.png" className="h-[15px] rounded-full" width={15} height={15} alt="" /> */}
                              <p className="text-xs text-gray-600">
                                All-Rounder
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>}
                  </div>




                </div>
              </div>

              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                {pageHtml && typeof pageHtml === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
                ) : (
                  <>
                    <h3 className="text-1xl font-semibold mb-1">
                      India vs Zimbabwe 2024
                    </h3>
                    <p className="text-gray-500 font-normal">
                      The biggest tournament in the cricketing circuit, the ICC
                      T20 WORLD Cup is underway in the USAs and the West Indies.
                      The tournament received excellent response from the fans
                      worldwide and the finals of the gran
                    </p>

                  </>
                )}
              </div>
              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  News
                </h2>
                <div className="border-t-[1px] border-[#E4E9F0]" />
                <Suspense fallback={<div>Loading news...</div>}>
                <NewsSection urlString={""} />
              </Suspense>
              </div>
            </div>

            <div className="lg:col-span-4 md:col-span-5">
              <div className="bg-white rounded-lg p-4 mb-4 hidden">
                <div className="flex gap-1 items-center justify-between">
                  <div className="flex gap-1 items-center">
                    <div className="col-span-4 relative">
                      <Image
                        src="/assets/img/home/trofi.png"
                        className="h-[75px]"
                        width={75}
                        height={75}
                        alt=""
                      />
                    </div>
                    <div className="col-span-8 relative">
                      <h3 className="font-semibold text-[19px] mb-1">
                        Weekly challenge
                      </h3>
                      <p className="font-semibold text-[13px] text-[#1a80f8]">
                        <span className="text-[#586577]">Time Left:</span> 2
                        Days 12h
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* <!-- Slider 1 --> */}
              <Suspense fallback={<div>Loading...</div>}>
              <WeeklySlider />

              <div className="my-4">
                <div className="mb-2">
                  <h3 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8]">
                    IPL Records
                  </h3>
                </div>
                <div className="bg-white rounded-lg px-4">
                  <div className="border-b mb-4 ">
                    <Link href={"/series/" + urlStringEncode(pointTables?.title + "-" + pointTables?.season) + "/" + pointTables?.cid + "/stats/batting-most-run"}
                      className="w-full flex text-[14px] justify-between items-center pb-3 pt-4" >
                      <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                        Most Runs in IPL
                      </span>

                    </Link>

                  </div>

                  <div className="border-b mb-4">
                    <Link href={"/series/" + urlStringEncode(pointTables?.title + "-" + pointTables?.season) + "/" + pointTables?.cid + "/stats/batting-most-hundreds"}
                      className="w-full flex text-[14px] justify-between items-center pb-3" >
                      <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                        Most Hundreds in IPL
                      </span>

                    </Link>

                  </div>

                  <div className="border-b mb-4">
                    <Link href={"/series/" + urlStringEncode(pointTables?.title + "-" + pointTables?.season) + "/" + pointTables?.cid + "/stats/batting-most-fifties"}
                      className="w-full flex text-[14px] justify-between items-center pb-3" >
                      <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                        Most Fifties in IPL
                      </span>

                    </Link>

                  </div>


                  <div className="border-b mb-4">
                    <Link href={"/series/" + urlStringEncode(pointTables?.title + "-" + pointTables?.season) + "/" + pointTables?.cid + "/stats/batting-highest-average"}
                      className="w-full flex text-[14px] justify-between items-center pb-3" >
                      <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                        Highest Batting Average in IPL
                      </span>

                    </Link>

                  </div>

                  <div className="border-b mb-4">
                    <Link href={"/series/" + urlStringEncode(pointTables?.title + "-" + pointTables?.season) + "/" + pointTables?.cid + "/stats/bowling-most-wicket"}
                      className="w-full flex text-[14px] justify-between items-center pb-3" >
                      <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                        Most Wickets in IPL
                      </span>

                    </Link>

                  </div>

                  <div className="border-b mb-4">
                    <Link href={"/series/" + urlStringEncode(pointTables?.title + "-" + pointTables?.season) + "/" + pointTables?.cid + "/stats/bowling-best-average"}
                      className="w-full flex text-[14px] justify-between items-center pb-3">
                      <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                        Highest Bowling Average in IPL
                      </span>

                    </Link>

                  </div>


                </div>
              </div>

              <PLSeries />

              <FantasyTips />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

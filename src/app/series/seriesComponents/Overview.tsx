"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import WeeklySlider from "@/app/components/WeeklySlider";
import Image from "next/image";
import { format } from "date-fns";
import { urlStringEncode } from "@/utils/utility";
import NewsSection from "./NewsSection";
import PlayerImage from "@/app/components/PlayerImage";
import PLSeries from "@/app/components/popularSeries";
import FantasyTips from "@/app/components/FantasyTips";
import ReadMoreCard from "@/app/components/ReadMoreCard";
import TabMenu from "./menu";

interface Overview {
  //seriesData: any[]; // Adjust type based on your data
  seriesInfo: any;
  seriesKeystats: any;
  urlString: string;
  isPointTable: boolean;
}
export default function Overview({
  seriesInfo,
  seriesKeystats,
  urlString,
  isPointTable,
}: Overview) {
  const standings = seriesInfo?.standing?.standings;
  // console.log("seriesKeystats",seriesKeystats);

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

  const [pageHtml, setPageHtml] = useState<string>("");
  useEffect(() => {
    async function fetchMatches() {
      if (!seriesInfo || seriesInfo.length === 0) return;

      try {
        const response = await fetch(`/api/series/SeriesHtml`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
          },
          body: JSON.stringify({ cid: seriesInfo.cid }),
        });

        if (!response.ok) {
          console.error(
            `Error: API returned ${response.status} for CID ${seriesInfo.cid}`
          );
          return null; // Skip failed requests
        }

        const result = await response.json();
        //   console.log('Response for CID',result?.data?.[0]?.overViewHtml);
        let items = result?.data?.[0]?.overViewHtml || "";
        setPageHtml(items);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    }

    fetchMatches();
  }, [seriesInfo]);

  const [featureSeries, setFeatureSeries] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMatch() {
      const response: any = await fetch(
        `/api/series/SeriesPointsTableMatches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
          },
          body: JSON.stringify({ cid: seriesInfo.cid }),
        }
      );
      const result = await response.json();
      let matches = result?.data?.items;
      setFeatureSeries(matches);
    }
    fetchMatch();
  }, []);

  let completedMatch = featureSeries?.filter(
    (item: { status: number }) => Number(item.status) === 2
  );
  completedMatch = completedMatch ? [...completedMatch]?.reverse() : [];
  let upcomingMatch = featureSeries?.filter(
    (item: { status: number }) => Number(item.status) === 1
  );
  let liveMatch = featureSeries?.filter(
    (item: { status: number }) => Number(item.status) === 3
  );

  let selectedMatches = [];

  if (
    liveMatch?.length > 0 &&
    completedMatch?.length > 0 &&
    upcomingMatch?.length > 0
  ) {
    selectedMatches = [
      ...liveMatch?.slice(0, 1),
      ...completedMatch?.slice(0, 1),
      ...upcomingMatch?.slice(0, 1),
    ];
  }
  else if (
    liveMatch?.length === 0 &&
    completedMatch?.length > 0 &&
    upcomingMatch?.length > 0
  ) {
    selectedMatches = [
      ...completedMatch?.slice(0, 1),
      ...upcomingMatch?.slice(0, 2),
    ];
  }
  else if (
    liveMatch?.length === 0 &&
    completedMatch?.length === 0 &&
    upcomingMatch?.length > 0
  ) {
    selectedMatches = upcomingMatch?.slice(0, 3);
  }
  else {
    if (liveMatch?.length > 0) {
      selectedMatches = liveMatch?.slice(0, 3);
    } else if (completedMatch?.length > 0) {
      selectedMatches = completedMatch?.slice(0, 3);
    } else if (upcomingMatch?.length > 0) {
      selectedMatches = upcomingMatch?.slice(0, 3);
    }
  }

  const [playerUrls, setPlayerUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getAllPlayerIds = () => {
      const allIds = [
        ...seriesKeystats?.mostRuns?.stats?.slice(0, 3).map((item: { player: any; player_id: any; }) => item?.player?.pid),
        ...seriesKeystats?.topWickets?.stats?.slice(0, 3).map((item: { player: any; player_id: any; }) => item?.player?.pid),
        seriesKeystats?.mostRuns?.stats?.[0]?.player?.pid,
        seriesKeystats?.highStrike?.stats?.[0]?.player?.pid,
        seriesKeystats?.topWickets?.stats?.[0]?.player?.pid,
        seriesKeystats?.bestBowling?.stats?.[0]?.player?.pid
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
  }, [seriesKeystats?.mostRuns?.stats?.slice(0, 3), seriesKeystats?.topWickets?.stats?.slice(0, 3)]);

  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <TabMenu urlString={urlString} isPointTable={isPointTable} />

      <div id="tab-content">
        <div id="info" className="tab-content ">
          <div className="md:grid grid-cols-12 gap-4 mb-4">
            <div className="lg:col-span-8 md:col-span-7">
              <div className="rounded-lg bg-white">
                <div className="p-4">
                  <h2 className="text-[15px] font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Series Info
                  </h2>
                  <div className="border-t border-[#E4E9F0]" />
                  {/* Responsive Grid Section */}
                  <div className="grid gap-2 grid-cols-1 pt-3 px-2">
                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">Series :</h3>
                      <p className="text-[14px] font-medium">
                        {seriesInfo?.title} {seriesInfo?.season}{" "}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">Duration :</h3>
                      <p className="text-[14px] font-medium">
                        {seriesInfo?.datestart
                          ? format(new Date(seriesInfo?.datestart), "dd MMM")
                          : ""}{" "}
                        -{" "}
                        {seriesInfo?.datestart
                          ? format(new Date(seriesInfo.dateend), "dd MMM, yyyy")
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">Format :</h3>
                      <p className="text-[14px] font-medium">
                        {" "}
                        {seriesInfo?.game_format?.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <h3 className="text-[13px] font-normal text-[#586577] md:w-[15%] w-[25%]">Teams :</h3>
                      <p className="text-[14px] font-medium">
                        {seriesInfo?.total_teams} (Teams)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[#ffffff] my-4 p-4">
                <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Featured Matches
                </h2>
                {/* Featured Matches desktop view  */}
                <div className="hidden lg:block">
                  {selectedMatches?.map((matches: any, index: number) => (
                    <React.Fragment key={index}>
                      <div className="border-t-[1px] border-[#E4E9F0]" />
                      {(matches?.status === 2 || matches?.status === 3) &&
                        <Link href={"/scorecard/" + urlStringEncode(matches?.teama?.short_name + "-vs-" + matches?.teamb?.short_name + "-" + matches?.subtitle + "-" + matches?.competition?.title + "-" + matches?.competition?.season) + "/" + matches.match_id} className="py-3 flex justify-between items-center">

                          <div className="flex space-x-2 font-medium	w-full">
                            <div className="flex items-center space-x-1 flex-col" >

                              <Image
                                loading="lazy"
                                src={matches?.teama?.logo_url}
                                className="h-[30px] rounded-full"
                                width={30}
                                height={30}
                                alt={matches?.teama?.short_name}
                              />
                              <span className="text-[#757A82]">{matches?.teama?.short_name}</span>

                            </div>
                            <div className="mt-1">
                              <p className="text-1xl font-semibold">{matches?.teama?.scores}</p>
                              <p className="text-[#757A82]">({matches?.teama?.overs})</p>
                            </div>
                          </div>


                          <div className=" font-semibold text-center w-full">
                            <h3 className="text-[#3D4DCF] text-[14px]">{matches?.result}</h3>
                            <p className="text-[#757A82] text-[12px] font-normal">
                              {matches?.subtitle}
                            </p>
                          </div>


                          <div className="flex space-x-2 font-medium justify-end w-full">
                            <div className="mt-1 text-end">
                              <p className="text-1xl font-semibold">{matches?.teamb?.scores}</p>
                              <p className="text-[#586577]">({matches?.teamb?.overs})</p>
                            </div>
                            <div className="flex items-center space-x-1 flex-col font-medium">
                              <Image
                                loading="lazy"
                                src={matches?.teamb?.logo_url}
                                className="h-[30px] rounded-full"
                                width={30}
                                height={30}
                                alt={matches?.teamb?.short_name}
                              />
                              <span className="text-[#757A82]">{matches?.teamb?.short_name}</span>
                            </div>
                          </div>
                        </Link>
                      }{matches?.status === 1 &&
                        <Link href={"/moreinfo/" + urlStringEncode(matches?.teama?.short_name + "-vs-" + matches?.teamb?.short_name + "-" + matches?.subtitle + "-" + matches?.competition?.title + "-" + matches?.competition?.season) + "/" + matches.match_id}>
                          <div className="py-3 flex justify-between items-center">
                            <div className="flex space-x-2 font-medium	w-full">
                              <div className="flex items-center space-x-1 flex-row">
                                <Image
                                  loading="lazy"
                                  src={matches?.teama?.logo_url}
                                  className="h-[30px] rounded-full"
                                  width={30}
                                  height={30}
                                  alt={matches?.teama?.short_name}
                                />
                                <span className="text-[#757A82]">{matches?.teama?.short_name}</span>
                              </div>
                            </div>
                            <div className=" font-semibold text-center w-full">
                              <h3 className="text-[#414143] text-[14px]">{matches?.subtitle} on</h3>
                              <p className="text-[#757A82] text-[12px] font-normal">
                                {matches?.date_start_ist}
                              </p>
                            </div>
                            <div className="flex space-x-2 font-medium justify-end w-full">
                              <div className="flex items-center gap-1 flex-row-reverse font-medium">
                                <Image
                                  loading="lazy"
                                  src={matches?.teamb?.logo_url}
                                  className="h-[30px] rounded-full"
                                  width={30}
                                  height={30}
                                  alt={matches?.teamb?.short_name}
                                />
                                <span className="text-[#757A82]">{matches?.teamb?.short_name}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      }
                    </React.Fragment>
                  ))}

                </div>

                {/* Featured Matches responsive view view  */}
                <div className="lg:hidden">
                  {selectedMatches?.map((matches: any, index: number) => (
                    <React.Fragment key={index}>
                      {(matches?.status === 2 || matches?.status === 3) &&
                        <Link href={"/scorecard/" + urlStringEncode(matches?.teama?.short_name + "-vs-" + matches?.teamb?.short_name + "-" + matches?.subtitle + "-" + matches?.competition?.title + "-" + matches?.competition?.season) + "/" + matches.match_id}>
                          <div className="py-4 px-3 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]">
                            <p className="text-[#586577] text-[12px] mb-4 font-normal">
                              {matches?.subtitle}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="w-[50%]">
                                <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full mb-3">
                                  <div className="flex items-center space-x-1 flex-col">
                                    <Image
                                      loading="lazy"
                                      src={matches?.teama?.logo_url}
                                      className="h-[25px] w-[25px] rounded-full"
                                      width={25}
                                      height={25}
                                      alt={matches?.teama?.short_name}
                                    />
                                    <span className="text-[#586577] font-medium">{matches?.teama?.short_name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-1xl font-semibold">{matches?.teama?.scores}</p>
                                    <p className="text-[#586577] font-medium text-[13px]">({matches?.teama?.overs})</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full">
                                  <div className="flex items-center space-x-1 flex-col">
                                    <Image
                                      loading="lazy"
                                      src={matches?.teamb?.logo_url}
                                      className="h-[25px] w-[25px] rounded-full"
                                      width={25}
                                      height={25}
                                      alt={matches?.teamb?.short_name}
                                    />
                                    <span className="text-[#586577] font-medium">{matches?.teamb?.short_name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-1xl font-semibold">{matches?.teamb?.scores}</p>
                                    <p className="text-[#586577] font-medium">({matches?.teamb?.overs})</p>
                                  </div>
                                </div>
                              </div>
                              <div className="h-[60px] border-l-[1px] border-[#d0d3d7]" />
                              <div className="w-[50%] font-semibold text-right">
                                <p className="text-[#3D4DCF]">{matches?.result}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      }{matches?.status === 1 &&
                        <Link href={"/moreinfo/" + urlStringEncode(matches?.teama?.short_name + "-vs-" + matches?.teamb?.short_name + "-" + matches?.subtitle + "-" + matches?.competition?.title + "-" + matches?.competition?.season) + "/" + matches.match_id}>
                          <div className="py-4 px-3 bg-[#f7faff] rounded-lg my-3 border-b-[1px] border-[#E4E9F0]">
                            <p className="text-[#586577] text-[12px] mb-4 font-normal">
                              {matches?.subtitle}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="w-[50%]">
                                <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full mb-3">
                                  <div className="flex items-center space-x-1 ">
                                    <Image
                                      loading="lazy"
                                      src={matches?.teama?.logo_url}
                                      className="h-[25px] w-[25px] rounded-full"
                                      width={25}
                                      height={25}
                                      alt={matches?.teama?.short_name}
                                    />
                                    <span className="text-[#586577] font-medium text-[14px]">{matches?.teama?.short_name}</span>
                                  </div>
                                </div>
                                <div className="flex space-x-2 items-start font-medium w-[162px] md:w-full">
                                  <div className="flex items-center space-x-1 ">
                                    <Image
                                      loading="lazy"
                                      src={matches?.teamb?.logo_url}
                                      className="h-[25px] w-[25px] rounded-full"
                                      width={25}
                                      height={25}
                                      alt={matches?.teamb?.short_name}
                                    />
                                    <span className="text-[#586577] font-medium text-[14px]">{matches?.teamb?.short_name}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="h-[60px] border-l-[1px] border-[#d0d3d7]" />
                              <div className="w-[50%] font-semibold text-right">
                                <p className="text-[#2F335C]">{matches?.subtitle} on </p>
                                <p className="text-[#586577] text-[12px] font-normal">
                                  {matches?.date_start_ist}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      }
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {seriesInfo?.title === "Indian Premier League" &&
                standings?.map((rounds: any, index: number) => (
                  <div className="rounded-lg bg-[#ffffff] mb-2 p-4" key={index}>
                    <h2 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                      {rounds?.round?.name}
                    </h2>
                    <div className="relative">
                      <div
                        className="overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[8px] 
                  [&::-webkit-scrollbar-track]:bg-gray-100 
                  [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
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
                            {rounds.standings?.slice(0, 4).map(
                              (point: any, index: number) => (
                                <tr className="hover:bg-[#fffae5]" key={index}>
                                  <td className="md:px-2 pl-[14px] py-3 w-[10px]">
                                    {index + 1}
                                  </td>
                                  <td className="md:px-2 pl-[14px] py-3 text-[#217AF7]">
                                    <Link
                                      href={
                                        "/ipl/" + seriesInfo?.season + "/" +
                                        urlStringEncode(point?.team.title) +
                                        "/" +
                                        point?.team.tid
                                      } >
                                      <div className="flex items-center gap-[5px] w-[120px]">
                                        <div>
                                          <Image
                                            loading="lazy"
                                            src={point?.team?.thumb_url}
                                            className="h-[20px]"
                                            width={20}
                                            height={20}
                                            alt={point?.team?.abbr}
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
                                    <div className="ml-auto flex gap-1 items-center">
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


                        <Link href={urlString + "/points-table"}>
                          <div className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-2 underline ">
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
                      }
                    </div>
                  </div>
                ))}
              {seriesInfo?.title === "Indian Premier League" && (
                <>
                  <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                    <h2 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                      Orange Cap-Most Runs
                    </h2>
                    <div>
                      <div
                        className="overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
      [&::-webkit-scrollbar-track]:bg-gray-100 
      [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
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
                                Runs
                              </th>
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                HS
                              </th>
                              {/* <th className="md:px-2 pl-[14px] py-3 font-medium">
                                Avg
                              </th> */}
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                SR
                              </th>
                              <th className="md:px-2 px-3 py-3 font-medium">
                                6S
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {seriesKeystats?.mostRuns?.stats?.slice(0, 3)?.map((player: any, index: number) => (

                              <tr className={index === 0 ? "bg-[#FB7E02] text-white" : ""} key={index}>
                                <td className="md:px-3 pl-[14px] py-3">
                                  <div className="flex items-center gap-[5px] md:w-[240px] w-[185px]">
                                    <div>
                                      <PlayerImage
                                        key={player?.player?.pid}
                                        player_id={player?.player?.pid}
                                        height={33}
                                        width={33}
                                        className="h-[33px] w-[33px] rounded-lg"
                                      />

                                    </div>
                                    <Link href={"/player/" + playerUrls[player?.player?.pid]}>
                                      <div className="">
                                        <p className="font-medium hover:text-[#1a80f8]">{player?.player?.short_name}</p>
                                        <p className="text-[12px]">{player?.team?.abbr}</p>
                                      </div>
                                    </Link>
                                  </div>
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">{player?.matches}</td>
                                <td className="md:px-2 pl-[14px] py-3 font-semibold">{player?.runs}</td>
                                <td className="md:px-2 pl-[14px] py-3">{player?.highest}</td>
                                {/* <td className="md:px-2 pl-[14px] py-3">{player?.average}</td> */}
                                <td className="md:px-2 pl-[14px] py-3">{player?.strike}</td>
                                <td className="md:px-2 pl-[14px] py-3">{player?.run6}</td>
                              </tr>
                            ))}

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                    <h2 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                      Purple Cap-Most Wickets
                    </h2>
                    <div>
                      <div
                        className="overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
      [&::-webkit-scrollbar-track]:bg-gray-100 
      [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                      >
                        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                          <thead className="bg-blue-50 text-gray-700 ">
                            <tr>
                              <th className="px-3 py-3 font-medium w-[10px]">
                                Player
                              </th>
                              <th className="px-1 py-3 font-medium">Mat</th>
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                Overs
                              </th>
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                W
                              </th>
                              {/* <th className="md:px-2 pl-[14px] py-3 font-medium">
                                Avg
                              </th> */}
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                Eco
                              </th>
                              <th className="px-3 pl-[14px] py-3 font-medium">
                                5W
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {seriesKeystats?.topWickets?.stats?.slice(0, 3)?.map((player: any, index: number) => (
                              <tr className={index === 0 ? "bg-[#9E26BC] text-white" : ""} key={index}>
                                <td className="px-3 py-3">
                                  <div className="flex items-center gap-[5px] md:w-[240px] w-[185px]">
                                    <div>
                                      <PlayerImage
                                        key={player?.player?.pid}
                                        player_id={player?.player?.pid}
                                        height={33}
                                        width={33}
                                        className="h-[33px] w-[33px] rounded-lg"
                                      />

                                    </div>
                                    <Link href={"/player/" + playerUrls[player?.player?.pid]}>
                                      <div>
                                        <p className="font-medium hover:text-[#1a80f8]">{player?.player?.short_name}</p>
                                        <p className="text-[12px]">{player?.team?.abbr}</p>
                                      </div>
                                    </Link>
                                  </div>
                                </td>
                                <td className="md:px-2 pl-[14px] py-3">{player?.matches}</td>
                                <td className="md:px-2 pl-[14px] py-3">{player?.overs}</td>
                                <td className="md:px-2 pl-[14px] py-3 font-semibold">{player?.wickets}</td>
                                {/* <td className="md:px-2 pl-[14px] py-3">{player?.average}</td> */}
                                <td className="md:px-2 pl-[14px] py-3">{player?.econ}</td>
                                <td className="md:px-2 pl-[14px] py-3">{player?.wicket5i}</td>
                              </tr>
                            ))}

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center pb-4">
                <div>
                  <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                    Key Stats
                  </h3>
                </div>
                <Link href={urlString + "/stats/batting-most-run"}>
                  <div className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px]  underline">
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
              <div className="mb-4">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 items-center gap-2">
                  {seriesKeystats?.mostRuns?.stats?.[0]?.player?.short_name && (
                    <div className="col-span-1">
                      <Link
                        href={
                          "/player/" +
                          playerUrls[seriesKeystats?.mostRuns?.stats?.[0]?.player?.pid]
                        }
                      >
                        <div className="rounded-lg bg-[#ffffff] p-4 flex flex-col items-center">
                          <p className="mb-2 font-medium">Most Runs</p>

                          <PlayerImage
                            key={seriesKeystats?.mostRuns?.stats?.[0]?.player?.pid}
                            player_id={seriesKeystats?.mostRuns?.stats?.[0]?.player?.pid}
                            height={45}
                            width={45}
                            className="rounded-full h-[45px]"
                          />

                          <h3 className="mt-2 text-[14px] font-semibold">
                            {seriesKeystats?.mostRuns?.stats?.[0]?.player?.short_name}
                          </h3>
                          <p className="text-[#757A82]">
                            {seriesKeystats?.mostRuns?.stats?.[0]?.team?.abbr}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-[18px] font-semibold">
                              {seriesKeystats?.mostRuns?.stats?.[0]?.runs}
                            </p>
                            <p className="text-gray-600 text-sm">Runs</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  {seriesKeystats?.highStrike?.stats?.[0]?.player?.short_name && (
                    <div className="col-span-1">
                      <Link
                        href={
                          "/player/" +
                          playerUrls[seriesKeystats?.highStrike?.stats?.[0]?.player?.pid]
                        }
                      >
                        <div className="rounded-lg bg-[#ffffff] p-4 flex flex-col items-center">
                          <p className="mb-2 font-medium">Highest Strike</p>
                          <PlayerImage
                            key={seriesKeystats?.highStrike?.stats?.[0]?.player?.pid}
                            player_id={seriesKeystats?.highStrike?.stats?.[0]?.player?.pid}
                            height={45}
                            width={45}
                            className="rounded-full h-[45px]"
                          />
                          <h3 className="mt-2 text-[14px] font-semibold">
                            {seriesKeystats?.highStrike?.stats?.[0]?.player?.short_name}
                          </h3>
                          <p className="text-[#757A82]">
                            {seriesKeystats?.highStrike?.stats?.[0]?.team?.abbr}
                          </p>
                          <div className="flex items-center mt-2">
                            <p className="text-[18px] font-semibold">
                              {seriesKeystats?.highStrike?.stats?.[0]?.strike}
                            </p>
                            <p className="text-gray-600 text-sm"></p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  {seriesKeystats?.topWickets?.stats?.[0]?.player?.short_name && (
                    <div className="col-span-1">
                      <Link
                        href={
                          "/player/" +
                          playerUrls[seriesKeystats?.topWickets?.stats?.[0]?.player?.pid]
                        }
                      >
                        <div className="rounded-lg bg-[#ffffff] p-4 flex flex-col items-center">
                          <p className="mb-2 font-medium">Most Wickets</p>
                          <PlayerImage
                            key={seriesKeystats?.topWickets?.stats?.[0]?.player?.pid}
                            player_id={seriesKeystats?.topWickets?.stats?.[0]?.player?.pid}
                            height={45}
                            width={45}
                            className="rounded-full h-[45px]"
                          />
                          <h3 className="mt-2 text-[14px] font-semibold">
                            {seriesKeystats?.topWickets?.stats?.[0]?.player?.short_name}
                          </h3>
                          <p className="text-[#757A82]">
                            {seriesKeystats?.topWickets?.stats?.[0]?.team?.abbr}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-[18px] font-semibold">
                              {seriesKeystats?.topWickets?.stats?.[0]?.wickets}
                            </p>
                            <p className="text-gray-600 text-sm">Wickets</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  {seriesKeystats?.bestBowling?.stats?.[0]?.player?.short_name && (
                    <div className="col-span-1">
                      <Link
                        href={
                          "/player/" +
                          playerUrls[seriesKeystats?.bestBowling?.stats?.[0]?.player?.pid]
                        }
                      >
                        <div className="rounded-lg bg-[#ffffff] p-4 flex flex-col items-center">
                          <p className="mb-2 font-medium">Best Figures</p>
                          <PlayerImage
                            key={seriesKeystats?.bestBowling?.stats?.[0]?.player?.pid}
                            player_id={seriesKeystats?.bestBowling?.stats?.[0]?.player?.pid}
                            height={45}
                            width={45}
                            className="rounded-full h-[45px]"
                          />
                          <h3 className="mt-2 text-[14px] font-semibold">
                            {seriesKeystats?.bestBowling?.stats?.[0]?.player?.short_name}
                          </h3>
                          <p className="text-[#757A82]">
                            {seriesKeystats?.bestBowling?.stats?.[0]?.team?.abbr}
                          </p>
                          <div className="flex items-center mt-2">
                            <p className="text-[18px] font-semibold">
                              {seriesKeystats?.bestBowling?.stats?.[0]?.bestmatch}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Team Name
                </h2>
                <div className="border-t-[1px] border-[#E4E9F0]" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
                  {seriesInfo?.teams?.map((teams: any, index: number) => (
                    <Link
                      href={
                        "/team/" +
                        urlStringEncode(teams.title) +
                        "/" +
                        teams.tid
                      }
                      key={index}
                    >
                      <div className="border-[1px] border-[##E2E2E2] rounded-md py-4 px-2 flex flex-col items-center">
                        {teams?.thumb_url ? (
                          <Image
                            loading="lazy"
                            src={teams?.thumb_url}
                            width={42}
                            height={42}
                            alt={teams?.alt_name ? teams?.alt_name : "1"}
                            className="h-[42px] mb-2"
                          />
                        ) : (
                          ""
                        )}
                        <h3 className="font-medium text-[13px]">{teams?.abbr}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                <ReadMoreCard
                  title={seriesInfo?.title + " " + seriesInfo?.season + " – Overview"}
                  content={
                    "The " + (seriesInfo?.title ? seriesInfo.title : "") + " " +
                    (seriesInfo?.season ? seriesInfo.season : "") +
                    " is one of the biggest cricket events of the year. It started on " +
                    (seriesInfo?.datestart ? format(new Date(seriesInfo.datestart), 'dd MMM yyyy') : "[start date not available]") +
                    " and will end on " +
                    (seriesInfo?.dateend ? format(new Date(seriesInfo.dateend), 'dd MMM yyyy') : "[end date not available]") +
                    ". The matches are being played in the " + [...new Set(seriesInfo?.venue_list.map((venue: { country: any; }) => venue.country))] + ".<br/>This tournament has " + seriesInfo?.total_teams + " teams playing " + seriesInfo?.total_matches + " exciting " + seriesInfo?.game_format.toUpperCase() + " matches. Fans all over the world are enjoying the close matches, amazing sixes, and great bowling spells.\n\n"
                    + "<br/><strong>Featured Teams</strong><br/>" +
                    " Top cricketing " + (["ODI", "TEST", "T20I"].includes(seriesInfo?.game_format?.toUpperCase()) ? 'nations' : 'domestic') + " like " + [...new Set(seriesInfo?.teams.map((teams: { abbr: any; }) => teams.abbr))] + " and more are part of this global contest." +
                    "<br/><strong>Host Nations/City</strong><br/>" +
                    seriesInfo?.title + " is being played in: " +
                    [...new Set(seriesInfo?.venue_list.map((venue: { country: any; }) => venue.country))]
                  }
                  wordLimit={35}
                />
                {pageHtml && typeof pageHtml === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
                ) : ("")}
              </div>
              <div className="rounded-lg bg-[#ffffff] p-4">
                <h2 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  News
                </h2>
                <div className="border-t-[1px] border-[#E4E9F0]" />
                <NewsSection urlString={""}></NewsSection>
              </div>
            </div>



            <div className="lg:col-span-4 md:col-span-5">

              <div className="-mt-4">

                <WeeklySlider />

              </div>

              {seriesInfo?.title === "Indian Premier League" && (
                <>
                  <div className="my-4">
                    <div className="mb-2">
                      <h3 className="text-1xl font-semibold pl-[5px] border-l-[3px] border-[#1a80f8]">
                        IPL Records
                      </h3>
                    </div>
                    <div className="bg-white rounded-lg px-4">
                      <div className="border-b mb-4">
                        <Link href={urlString + "/stats/batting-most-run"}
                          className="w-full flex text-[14px] justify-between items-center pb-3 pt-4" >
                          <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                            Most Runs in IPL
                          </span>

                        </Link>

                      </div>

                      <div className="border-b mb-4">
                        <Link href={urlString + "/stats/batting-most-hundreds"}
                          className="w-full flex text-[14px] justify-between items-center pb-3" >
                          <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                            Most Hundreds in IPL
                          </span>

                        </Link>

                      </div>

                      <div className="border-b mb-4">
                        <Link href={urlString + "/stats/batting-most-fifties"}
                          className="w-full flex text-[14px] justify-between items-center pb-3" >
                          <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                            Most Fifties in IPL
                          </span>

                        </Link>

                      </div>


                      <div className="border-b mb-4">
                        <Link href={urlString + "/stats/batting-highest-average"}
                          className="w-full flex text-[14px] justify-between items-center pb-3" >
                          <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                            Highest Batting Average in IPL
                          </span>

                        </Link>

                      </div>

                      <div className="border-b mb-4">
                        <Link href={urlString + "/stats/bowling-most-wicket"}
                          className="w-full flex text-[14px] justify-between items-center pb-3" >
                          <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                            Most Wickets in IPL
                          </span>

                        </Link>

                      </div>

                      <div className="border-b mb-4">
                        <Link href={urlString + "/stats/bowling-best-average"}
                          className="w-full flex text-[14px] justify-between items-center pb-3">
                          <span className="flex items-center font-medium text-[#394351] hover:text-[#1a80f8]">
                            Highest Bowling Average in IPL
                          </span>

                        </Link>

                      </div>

                    </div>
                  </div>
                  <PLSeries />
                </>
              )}


              <div className="sticky top-[82px]">
                <FantasyTips />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
  console.log("seriesKeystats",seriesKeystats);

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
  completedMatch = [...completedMatch]?.reverse();
  let upcomingMatch = featureSeries.filter(
    (item: { status: number }) => Number(item.status) === 1
  );
  let liveMatch = featureSeries.filter(
    (item: { status: number }) => Number(item.status) === 3
  );

  let selectedMatches = [];

  if (
    liveMatch.length > 0 &&
    completedMatch.length > 0 &&
    upcomingMatch.length > 0
  ) {
    selectedMatches = [
      ...liveMatch.slice(0, 1),
      ...completedMatch.slice(0, 1),
      ...upcomingMatch.slice(0, 1),
    ];
  }
  else if (
    liveMatch.length === 0 &&
    completedMatch.length > 0 &&
    upcomingMatch.length > 0
  ) {
    selectedMatches = [
      ...completedMatch.slice(0, 1),
      ...upcomingMatch.slice(0, 2),
    ];
  }
  else if (
    liveMatch.length === 0 &&
    completedMatch.length === 0 &&
    upcomingMatch.length > 0
  ) {
    selectedMatches = upcomingMatch.slice(0, 3);
  }
  else {
    if (liveMatch.length > 0) {
      selectedMatches = liveMatch.slice(0, 3);
    } else if (completedMatch.length > 0) {
      selectedMatches = completedMatch.slice(0, 3);
    } else if (upcomingMatch.length > 0) {
      selectedMatches = upcomingMatch.slice(0, 3);
    }
  }
  console.log("completedMatch", selectedMatches);
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <div id="tabs" className="mt-4">
        <div className="flex text-[13px] space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
          <Link href={urlString}>
            <button className="font-semibold py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md uppercase">
              Overview
            </button>
          </Link>
          <Link href={urlString + "/schedule-results"}>
            <button className="font-semibold py-2 px-3 whitespace-nowrap  uppercase ">
              Schedule & Results
            </button>
          </Link>
          <Link href={urlString + "/squads"}>
            <button className="font-semibold py-2 px-3 whitespace-nowrap  uppercase ">
              Squads
            </button>
          </Link>
          {isPointTable && (
            <Link href={urlString + "/points-table"}>
              <button className="font-semibold py-2 px-3 whitespace-nowrap uppercase ">
                Points Table
              </button>
            </Link>
          )}
          <Link href={urlString + "/news"}>
            <button className="font-semibold py-2 px-3 whitespace-nowrap uppercase ">
              News
            </button>
          </Link>
          <Link href={urlString + "/stats/most-run"}>
            <button className="font-semibold py-2 px-3 whitespace-nowrap uppercase ">
              Stats
            </button>
          </Link>
        </div>
      </div>

      <div id="tab-content">
        <div id="info" className="tab-content ">
          <div className="md:grid grid-cols-12 gap-4">
            <div className="lg:col-span-8 md:col-span-7 mt-4">
              <div className="rounded-lg bg-white">
                <div className="p-4">
                  <h3 className="text-[15px] font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    Series Info
                  </h3>
                  <div className="border-t border-[#E4E9F0]" />
                  {/* Responsive Grid Section */}
                  <div className="grid gap-2 grid-cols-1 pt-3 px-2">
                    <div className="flex items-center">
                      <h2 className="font-text-[13px] font-medium text-[#586577] md:w-[15%] w-[25%]">Series :</h2>
                      <p className="text-[13px] font-medium">
                        {seriesInfo?.title} {seriesInfo?.season}{" "}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <h2 className="text-[13px] font-medium text-[#586577] md:w-[15%] w-[25%]">Duration :</h2>
                      <p className="text-[13px] font-medium">
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
                      <h2 className="text-[13px] font-medium text-[#586577] md:w-[15%] w-[25%]">Format :</h2>
                      <p className="text-[13px] font-medium">
                        {" "}
                        {seriesInfo?.game_format?.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <h2 className="text-[13px] font-medium text-[#586577] md:w-[15%] w-[25%]">Teams :</h2>
                      <p className="text-[13px] font-medium">
                        {seriesInfo?.total_teams} (Teams)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[#ffffff] my-4 p-4">
                <h3 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Featured Matches
                </h3>
                {/* Featured Matches desktop view  */}
                <div className="hidden lg:block">
                  {selectedMatches?.map((matches: any, index: number) => (
                    <React.Fragment key={index}>
                      <div className="border-t-[1px] border-[#E4E9F0]" />
                      {(matches?.status === 2 || matches?.status === 3) &&
                        <Link href={"/scorecard/" + urlStringEncode(matches?.teama?.short_name + "-vs-" + matches?.teamb?.short_name + "-match-" + matches?.match_number + "-" + matches?.competition?.title + "-" + matches?.competition?.season) + "/" + matches.match_id} className="py-3 flex justify-between items-center">

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
                              <span className="text-[#586577] font-medium text-[14px]">{matches?.teama?.short_name}</span>

                            </div>
                            <div className="mt-1">
                              <p className="text-1xl font-semibold">{matches?.teama?.scores}</p>
                              <p className="text-[#586577]">({matches?.teama?.overs})</p>
                            </div>
                          </div>
                          <div className=" font-semibold text-center w-full">
                            <p className="text-[#3D4DCF] text-[14px]">{matches?.result}</p>
                            <p className="text-[#909090] text-[12px] font-normal">
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
                                <span className="text-[#586577] font-medium text-[14px]">{matches?.teamb?.short_name}</span>
                              </div>
                          </div>
                        </Link>
                      }{matches?.status === 1 &&
                        <Link href={"/moreinfo/" + urlStringEncode(matches?.teama?.short_name + "-vs-" + matches?.teamb?.short_name + "-match-" + matches?.match_number + "-" + matches?.competition?.title + "-" + matches?.competition?.season) + "/" + matches.match_id}>
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
                                  <span className="text-[#586577] font-medium text-[14px]">{matches?.teama?.short_name}</span>
                                </div>
                            </div>
                            <div className=" font-semibold text-center w-full">
                              <p className="text-[#414143] text-[14px]">{matches?.subtitle} on</p>
                              <p className="text-[#909090] text-[12px] font-normal">
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
                                  <span className="text-[#586577] font-medium text-[14px]">{matches?.teamb?.short_name}</span>
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
                        <Link href={"/scorecard/" + urlStringEncode(matches?.teama?.short_name + "-vs-" + matches?.teamb?.short_name + "-match-" + matches?.match_number + "-" + matches?.competition?.title + "-" + matches?.competition?.season) + "/" + matches.match_id}>
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
                        <Link href={"/moreinfo/" + urlStringEncode(matches?.teama?.short_name + "-vs-" + matches?.teamb?.short_name + "-match-" + matches?.match_number + "-" + matches?.competition?.title + "-" + matches?.competition?.season) + "/" + matches.match_id}>
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
                                      <span className="text-[#586577] font-medium">{matches?.teama?.short_name}</span>
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
                                      <span className="text-[#586577] font-medium">{matches?.teamb?.short_name}</span>
                                    </div>
                                </div>
                              </div>
                              <div className="h-[60px] border-l-[1px] border-[#d0d3d7]" />
                              <div className="w-[50%] font-semibold text-right">
                                <p className="text-[#414143]">{matches?.subtitle} on </p>
                                <p className="text-[#909090] text-[12px] font-normal">
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
                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                      {rounds?.round?.name}
                    </h3>
                    <div>
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
                            {rounds.standings?.map(
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
                                                : "bg-[#F63636]"
                                              } text-white text-[13px] px-[4px] py-[0px] rounded`}
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
                    </div>
                  </div>
                ))}
              {seriesInfo?.title === "Indian Premier League" && (
                <>
                  <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                      Orange Cap-Most Runs
                    </h3>
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
                                Inns
                              </th>
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                HS
                              </th>
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                Avg
                              </th>
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                SR
                              </th>
                              <th className="md:px-2 px-3 py-3 font-medium">
                                6S
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr className="bg-[#FB7E02] text-white">
                              <td className="md:px-3 pl-[14px] py-3">
                                <div className="flex items-center gap-[5px] md:w-[240px] w-[185px]">
                                  <div>
                                    <Image
                                      loading="lazy"
                                      src="/assets/img/player/default.png"
                                      className="h-[33px] w-[33px] rounded-lg"
                                      width={33}
                                      height={33}
                                      alt="1"
                                    />
                                  </div>
                                  <Link href="/player/playername/overview">
                                    <div>
                                      <p className="font-medium">Virat Kohli</p>
                                      <p className="text-[12px]">RCB</p>
                                    </div>
                                  </Link>
                                </div>
                              </td>
                              <td className="md:px-2 pl-[14px] py-3">15</td>
                              <td className="md:px-2 pl-[14px] py-3">741</td>
                              <td className="md:px-2 pl-[14px] py-3">113</td>
                              <td className="md:px-2 pl-[14px] py-3">45.50</td>
                              <td className="md:px-2 pl-[14px] py-3">145.70</td>
                              <td className="md:px-2 pl-[14px] py-3">38</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-[5px] md:w-[240px] w-[185px]">
                                  <div>
                                    <Image
                                      loading="lazy"
                                      src="/assets/img/player/default.png"
                                      className="h-[33px] w-[33px] rounded-lg"
                                      width={33}
                                      height={33}
                                      alt="1"
                                    />
                                  </div>
                                  <Link href="/player/playername/overview">
                                    <div>
                                      <p className="text-[#3e3e3e] font-medium">
                                        Virat Kohli
                                      </p>
                                      <p className="text-[12px]">RCB</p>
                                    </div>
                                  </Link>
                                </div>
                              </td>
                              <td className="md:px-2 pl-[14px] py-3">15</td>
                              <td className="md:px-2 pl-[14px] py-3">741</td>
                              <td className="md:px-2 pl-[14px] py-3">113</td>
                              <td className="md:px-2 pl-[14px] py-3">45.50</td>
                              <td className="md:px-2 pl-[14px] py-3">145.70</td>
                              <td className="md:px-2 pl-[14px] py-3">38</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-3 md:w-[240px] w-[185px]">
                                <div className="flex items-center gap-[5px]">
                                  <div>
                                    <Image
                                      loading="lazy"
                                      src="/assets/img/player/default.png"
                                      className="h-[33px] w-[33px] rounded-lg"
                                      width={33}
                                      height={33}
                                      alt="1"
                                    />
                                  </div>
                                  <Link href="/player/playername/overview">
                                    <div>
                                      <p className="text-[#3e3e3e] font-medium">
                                        Virat Kohli
                                      </p>
                                      <p className="text-[12px]">RCB</p>
                                    </div>
                                  </Link>
                                </div>
                              </td>
                              <td className="md:px-2 pl-[14px] py-3">15</td>
                              <td className="md:px-2 pl-[14px] py-3">741</td>
                              <td className="md:px-2 pl-[14px] py-3">113</td>
                              <td className="md:px-2 pl-[14px] py-3">45.50</td>
                              <td className="md:px-2 pl-[14px] py-3">145.70</td>
                              <td className="md:px-2 pl-[14px] py-3">38</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#ffffff] mb-4 p-4">
                    <h3 className="text-1xl font-semibold mb-3 pl-[7px] border-l-[3px] border-[#229ED3]">
                      Purple Cap-Most Wickets
                    </h3>
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
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                Avg
                              </th>
                              <th className="md:px-2 pl-[14px] py-3 font-medium">
                                Eco
                              </th>
                              <th className="px-3 pl-[14px] py-3 font-medium">
                                5W
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr className="bg-[#9E26BC] text-white">
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-[5px] md:w-[240px] w-[185px]">
                                  <div>
                                    <Image
                                      loading="lazy"
                                      src="/assets/img/player/8.png"
                                      className="h-[33px] w-[33px] rounded-lg"
                                      width={33}
                                      height={33}
                                      alt="1"
                                    />
                                  </div>
                                  <Link href="/player/playername/overview">
                                    <div>
                                      <p className="font-medium">
                                        Harshal Patel
                                      </p>
                                      <p className="text-[12px]">PBKS</p>
                                    </div>
                                  </Link>
                                </div>
                              </td>
                              <td className="md:px-2 pl-[14px] py-3">15</td>
                              <td className="md:px-2 pl-[14px] py-3">741</td>
                              <td className="md:px-2 pl-[14px] py-3">113</td>
                              <td className="md:px-2 pl-[14px] py-3">45.50</td>
                              <td className="md:px-2 pl-[14px] py-3">145.70</td>
                              <td className="md:px-2 pl-[14px] py-3">38</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-[5px] md:w-[240px] w-[185px]">
                                  <div>
                                    <Image
                                      loading="lazy"
                                      src="/assets/img/player/8.png"
                                      className="h-[33px] w-[33px] rounded-lg"
                                      width={33}
                                      height={33}
                                      alt="1"
                                    />
                                  </div>
                                  <Link href="/player/playername/overview">
                                    <div>
                                      <p className="text-[#3e3e3e] font-medium">
                                        Varun Chakaravarthy
                                      </p>
                                      <p className="text-[12px]">KKR</p>
                                    </div>
                                  </Link>
                                </div>
                              </td>
                              <td className="md:px-2 pl-[14px] py-3">15</td>
                              <td className="md:px-2 pl-[14px] py-3">741</td>
                              <td className="md:px-2 pl-[14px] py-3">113</td>
                              <td className="md:px-2 pl-[14px] py-3">45.50</td>
                              <td className="md:px-2 pl-[14px] py-3">145.70</td>
                              <td className="md:px-2 pl-[14px] py-3">38</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-3 md:w-[240px] w-[185px]">
                                <div className="flex items-center gap-[5px]">
                                  <div>
                                    <Image
                                      loading="lazy"
                                      src="/assets/img/player/8.png"
                                      className="h-[33px] w-[33px] rounded-lg"
                                      width={33}
                                      height={33}
                                      alt="1"
                                    />
                                  </div>
                                  <Link href="/player/playername/overview">
                                    <div>
                                      <p className="text-[#3e3e3e] font-medium">
                                        Jasprit Bumrah
                                      </p>
                                      <p className="text-[12px]">MI</p>
                                    </div>
                                  </Link>
                                </div>
                              </td>
                              <td className="md:px-2 pl-[14px] py-3">15</td>
                              <td className="md:px-2 pl-[14px] py-3">741</td>
                              <td className="md:px-2 pl-[14px] py-3">113</td>
                              <td className="md:px-2 pl-[14px] py-3">45.50</td>
                              <td className="md:px-2 pl-[14px] py-3">145.70</td>
                              <td className="md:px-2 pl-[14px] py-3">38</td>
                            </tr>
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
              </div>
              <div className="mb-4">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 items-center gap-2">
                  {seriesKeystats?.mostRuns?.stats?.[0]?.player?.short_name && (
                    <div className="col-span-1">
                      <Link
                        href={
                          "/player/" +
                          urlStringEncode(
                            seriesKeystats?.mostRuns?.stats?.[0]?.player?.first_name
                          ) +
                          "/" +
                          seriesKeystats?.mostRuns?.stats?.[0]?.player?.pid
                        }
                      >
                        <div className="rounded-lg bg-[#ffffff] p-4 flex flex-col items-center">
                          <p className="mb-2 font-medium text-[#3e3e3e]">Most Runs</p>

                          <PlayerImage
                           key={seriesKeystats?.mostRuns?.stats?.[0]?.player?.pid}
                            player_id={seriesKeystats?.mostRuns?.stats?.[0]?.player?.pid}
                            height={45}
                            width={45}
                            className="rounded-full h-[45px]"
                          />

                          <h3 className="mt-2 text-[14px] font-semibold text-gray-800">
                            {seriesKeystats?.mostRuns?.stats?.[0]?.player?.short_name}
                          </h3>
                          <p className="text-[#586577]">
                            {seriesKeystats?.mostRuns?.stats?.[0]?.team?.abbr}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-[16px] font-semibold">
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
                          urlStringEncode(
                            seriesKeystats?.highStrike?.stats?.[0]?.player?.first_name
                          ) +
                          "/" +
                          seriesKeystats?.highStrike?.stats?.[0]?.player?.pid
                        }
                      >
                        <div className="rounded-lg bg-[#ffffff] p-4 flex flex-col items-center">
                          <p className="mb-2 font-medium text-[#3e3e3e]">Highest Strike</p>
                          <PlayerImage
                          key={seriesKeystats?.highStrike?.stats?.[0]?.player?.pid}
                            player_id={seriesKeystats?.highStrike?.stats?.[0]?.player?.pid}
                            height={45}
                            width={45}
                            className="rounded-full h-[45px]"
                          />
                          <h3 className="mt-2 text-[14px] font-semibold text-gray-800">
                            {seriesKeystats?.highStrike?.stats?.[0]?.player?.short_name}
                          </h3>
                          <p className="text-[#586577]">
                            {seriesKeystats?.highStrike?.stats?.[0]?.team?.abbr}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-[16px] font-semibold">
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
                          urlStringEncode(
                            seriesKeystats?.topWickets?.stats?.[0]?.player?.first_name
                          ) +
                          "/" +
                          seriesKeystats?.topWickets?.stats?.[0]?.player?.pid
                        }
                      >
                        <div className="rounded-lg bg-[#ffffff] p-4 flex flex-col items-center">
                          <p className="mb-2 font-medium text-[#3e3e3e]">Most Wickets</p>
                          <PlayerImage
                          key={seriesKeystats?.topWickets?.stats?.[0]?.player?.pid}
                            player_id={seriesKeystats?.topWickets?.stats?.[0]?.player?.pid}
                            height={45}
                            width={45}
                            className="rounded-full h-[45px]"
                          />
                          <h3 className="mt-2 text-[14px] font-semibold text-gray-800">
                            {seriesKeystats?.topWickets?.stats?.[0]?.player?.short_name}
                          </h3>
                          <p className="text-[#586577]">
                            {seriesKeystats?.topWickets?.stats?.[0]?.team?.abbr}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-[16px] font-semibold">
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
                          urlStringEncode(
                            seriesKeystats?.bestBowling?.stats?.[0]?.player?.first_name
                          ) +
                          "/" +
                          seriesKeystats?.bestBowling?.stats?.[0]?.player?.pid
                        }
                      >
                        <div className="rounded-lg bg-[#ffffff] p-4 flex flex-col items-center">
                          <p className="mb-2 font-medium text-[#3e3e3e]">Best Figures</p>
                          <PlayerImage
                          key={seriesKeystats?.bestBowling?.stats?.[0]?.player?.pid}
                            player_id={seriesKeystats?.bestBowling?.stats?.[0]?.player?.pid}
                            height={45}
                            width={45}
                            className="rounded-full h-[45px]"
                          />
                          <h3 className="mt-2 text-[14px] font-semibold text-gray-800">
                            {seriesKeystats?.bestBowling?.stats?.[0]?.player?.short_name}
                          </h3>
                          <p className="text-[#586577]">
                            {seriesKeystats?.bestBowling?.stats?.[0]?.team?.abbr}
                          </p>  
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-[16px] font-semibold">
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
                <h3 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  Team Name
                </h3>
                <div className="border-t-[1px] border-[#E4E9F0]" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
                  {seriesInfo?.teams?.map((teams: any, index: number) => (
                    <Link
                      href={
                        "/team/" +
                        urlStringEncode(teams.alt_name) +
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
                        <p className="font-medium">{teams?.abbr}</p>
                      </div>
                    </Link>
                  ))}
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
                      worldwide and the finals of the gran...
                    </p>
                    <p className="text-[#1A80F8] font-semibold flex items-center text-[13px] pt-2 underline">
                      Read more{" "}
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
                    </p>
                  </>
                )}
              </div>
              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                <h3 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                  News
                </h3>
                <div className="border-t-[1px] border-[#E4E9F0]" />

                <NewsSection urlString={""}></NewsSection>
              </div>
            </div>
            <div className="lg:col-span-4 md:col-span-5">

              <WeeklySlider/>

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
                        <button
                          className="w-full flex text-[14px] justify-between items-center pb-3 pt-4"
                          onClick={() => toggleOpen("mostRuns")}
                        >
                          <span className="flex items-center font-medium text-[#394351]">
                            Most Runs in IPL
                          </span>
                          <span className="transform transition-transform ">
                            <Image
                              loading="lazy"
                              src="/assets/img/arrow.png"
                              className="h-[7px]"
                              width={10}
                              height={15}
                              alt="arrow"
                            />
                          </span>
                        </button>
                        {open.mostRuns && (
                          <div className="pl-8 py-2 space-y-2 font-normal text-[14px] text-[#51555E]">
                            <p className="flex items-center"><svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg> Bangabandhu T20 C</p>
                          </div>
                        )}
                      </div>

                      <div className="border-b mb-4">
                        <button
                          className="w-full flex text-[14px] justify-between items-center pb-3"
                          onClick={() => toggleOpen("mostHundreds")}
                        >
                          <span className="flex items-center font-medium text-[#394351]">
                            Most Hundreds in IPL
                          </span>
                          <span className="transform transition-transform ">
                            <Image
                              loading="lazy"
                              src="/assets/img/arrow.png"
                              className="h-[7px]"
                              width={10}
                              height={15}
                              alt="arrow"
                            />
                          </span>
                        </button>
                        {open.mostHundreds && (
                          <div className="pl-8 py-2 space-y-2 font-normal text-[14px] text-[#51555E]">
                            <p className="flex items-center"> <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg> Bangabandhu T20 C</p>
                          </div>
                        )}
                      </div>

                      <div className="border-b mb-4">
                        <button
                          className="w-full flex text-[14px] justify-between items-center pb-3"
                          onClick={() => toggleOpen("mostFifties")}
                        >
                          <span className="flex items-center font-medium text-[#394351]">
                            Most Fifties in IPL
                          </span>
                          <span className="transform transition-transform ">
                            <Image
                              loading="lazy"
                              src="/assets/img/arrow.png"
                              className="h-[7px]"
                              width={10}
                              height={15}
                              alt="arrow"
                            />
                          </span>
                        </button>
                        {open.mostFifties && (
                          <div className="pl-8 py-2 space-y-2 font-normal text-[14px] text-[#51555E]">
                            <p className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                              Bangabandhu T20 C
                            </p>
                            <p className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                              Bangladesh Premier
                            </p>
                            <p className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                              Bangladesh Tri-Series
                            </p>
                            <p className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                              BCB Presidents Cup
                            </p>
                            <p className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                              Dhaka Premier League
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="border-b mb-4">
                        <button
                          className="w-full flex text-[14px] justify-between items-center pb-3"
                          onClick={() => toggleOpen("mostDucks")}
                        >
                          <span className="flex items-center font-medium text-[#394351]">
                            Most Ducks in IPL
                          </span>
                          <span className="transform transition-transform ">
                            <Image
                              loading="lazy"
                              src="/assets/img/arrow.png"
                              className="h-[7px]"
                              width={10}
                              height={15}
                              alt="arrow"
                            />
                          </span>
                        </button>
                        {open.mostDucks && (
                          <div className="pl-8 py-2 space-y-2 font-normal text-[14px] text-[#51555E]">
                            <p className="flex items-center"> <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg> Bangabandhu T20 C</p>
                          </div>
                        )}
                      </div>

                      <div className="border-b mb-4">
                        <button
                          className="w-full flex text-[14px] justify-between items-center pb-3"
                          onClick={() => toggleOpen("highestBattingAverage")}
                        >
                          <span className="flex items-center font-medium text-[#394351]">
                            Highest Batting Average in IPL
                          </span>
                          <span className="transform transition-transform ">
                            <Image
                              loading="lazy"
                              src="/assets/img/arrow.png"
                              className="h-[7px]"
                              width={10}
                              height={15}
                              alt="arrow"
                            />
                          </span>
                        </button>
                        {open.highestBattingAverage && (
                          <div className="pl-8 py-2 space-y-2 font-normal text-[14px] text-[#51555E]">
                            <p className="flex items-center"> <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg> Bangabandhu T20 C</p>
                          </div>
                        )}
                      </div>

                      <div className="border-b mb-4">
                        <button
                          className="w-full flex text-[14px] justify-between items-center pb-3"
                          onClick={() => toggleOpen("highestScore")}
                        >
                          <span className="flex items-center font-medium text-[#394351]">
                            Highest Individual Score in IPL
                          </span>
                          <span className="transform transition-transform ">
                            <Image
                              loading="lazy"
                              src="/assets/img/arrow.png"
                              className="h-[7px]"
                              width={10}
                              height={15}
                              alt="arrow"
                            />
                          </span>
                        </button>
                        {open.highestScore && (
                          <div className="pl-8 py-2 space-y-2 font-normal text-[14px] text-[#51555E]">
                            <p className="flex items-center"> <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg> Bangabandhu T20 C</p>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <button
                          className="w-full flex text-[14px] justify-between items-center pb-3"
                          onClick={() => toggleOpen("mostMatchesAsCaptain")}
                        >
                          <span className="flex items-center font-medium text-[#394351]">
                            Most Matches as Captain in IPL
                          </span>
                          <span className="transform transition-transform ">
                            <Image
                              loading="lazy"
                              src="/assets/img/arrow.png"
                              className="h-[7px]"
                              width={10}
                              height={15}
                              alt="arrow"
                            />
                          </span>
                        </button>
                        {open.mostMatchesAsCaptain && (
                          <div className="pl-8 py-2 space-y-2 font-normal text-[14px] text-[#51555E]">
                            <p className="flex items-center"> <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3 text-[#1A80F8] mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                              </svg> Bangabandhu T20 C</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <PLSeries />
                </>
              )}

              <FantasyTips />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

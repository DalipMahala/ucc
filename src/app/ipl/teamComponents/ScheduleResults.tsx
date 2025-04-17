"use client";

import React, { useState, useEffect } from "react";
import WeeklySlider from "@/app/components/WeeklySlider";
import Link from "next/link";
import Image from "next/image";
import { urlStringEncode } from "../../../utils/utility";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "../../components/countdownTimer";
import FantasyTips from "@/app/components/FantasyTips";

interface ScheduleResults {
  seriesMatches: any;
  seriesId:number;
  pointTables: any;
  teamPlayers: any;
  params: any;
}
export default function ScheduleResults({
  params,
  seriesMatches,
  seriesId,
  pointTables,
  teamPlayers
}: ScheduleResults) {
  const teamId = params?.teamId;
  const teams = teamPlayers[0]?.team;
  
  let completedMatch = seriesMatches?.resultMatch?.filter((m: { teama: { team_id: any; }; teamb: { team_id: any; }; }) => [m?.teama?.team_id, m?.teamb?.team_id].includes(Number(teamId)));
  let liveMatch = seriesMatches?.liveMatch?.filter((m: { teama: { team_id: any; }; teamb: { team_id: any; }; }) => [m?.teama?.team_id, m?.teamb?.team_id].includes(Number(teamId)));
  let upcomingMatch = seriesMatches?.scheduledMatch?.filter((m: { teama: { team_id: any; }; teamb: { team_id: any; }; }) => [m?.teama?.team_id, m?.teamb?.team_id].includes(Number(teamId)));
  // console.log(liveMatch);

  useEffect(() => {
      const elements = document.querySelectorAll("#all-tab, #live-tab, #completed-tab, #upcoming-tab");
  
      // Ensure elements exist before adding event listeners
      if (elements.length === 0) {
        console.error("Tabs not found in the DOM!");
        return;
      }
  
      function handleClick(event: Event) {
        const target = event.target as HTMLElement;
        console.log("Clicked ID:", target.id);
  
        // Remove active styles from all tabs
        document.querySelectorAll("#all-tab, #live-tab, #completed-tab, #upcoming-tab").forEach((el) => {
          el.classList.remove("bg-[#1A80F8]", "text-white");
        });
  
        // Add active style to clicked tab
        target.classList.add("bg-[#1A80F8]", "text-white");
  
        // Hide all sections initially
        document.querySelectorAll(".liveMatch, .completedMatch, .upcomingMatch").forEach((el) => {
          el.classList.add("hidden");
        });
  
        // Show only the relevant section
        const sectionMap: Record<string, string> = {
          "live-tab": ".liveMatch",
          "completed-tab": ".completedMatch",
          "upcoming-tab": ".upcomingMatch",
          "all-tab": ".liveMatch, .completedMatch, .upcomingMatch",
        };
  
        if (sectionMap[target.id]) {
          document.querySelectorAll(sectionMap[target.id]).forEach((el) => el.classList.remove("hidden"));
        }
      }
  
      // Add event listeners
      elements.forEach((element) => element.addEventListener("click", handleClick));
  
      // Cleanup function to remove event listeners when component unmounts
      return () => {
        elements.forEach((element) => element.removeEventListener("click", handleClick));
      };
    }, []); // Run only once when component mounts
  
    const [activeMainTab, setActiveMainTab] = useState("info1");

    const [pageHtml, setPageHtml] = useState<string>('');
        useEffect(() => {
            async function fetchMatches() {
              if (!seriesId || seriesId === 0) return;
        
              try {
                
                  const response = await fetch(`/api/series/SeriesHtml`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
                    },
                    body: JSON.stringify({ cid: seriesId }), 
                  });
        
                  if (!response.ok) {
                    console.error(
                      `Error: API returned ${response.status} for CID ${seriesId}`
                    );
                    return null; // Skip failed requests
                  }
                  
                  const result = await response.json();
                  let items = result?.data?.[0]?.matchViewHtml || '';
                  setPageHtml(items);
              } catch (error) {
                console.error("Error fetching matches:", error);
              }
            }
        
            fetchMatches();
          }, [seriesId]);

  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
      <div id="tabs" className="my-4">
          <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
          <Link href={"/ipl/"+pointTables?.season+"/"+urlStringEncode(teams?.title)+"/"+teams?.tid}>
              <button
               
                className="font-medium py-2 px-3 whitespace-nowrap"
              >
                Overview
              </button>
            </Link>
            <Link href={"/ipl/"+pointTables?.season+"/"+urlStringEncode(teams?.title)+"/"+teams?.tid+"/schedule-results"}>
              <button
               
                className="font-medium py-2 px-3 whitespace-nowrap  bg-[#1A80F8] text-white rounded-md"
              >
                Schedule & Results

              </button>
            </Link>
            <Link href={"/ipl/"+pointTables?.season+"/"+urlStringEncode(teams?.title)+"/"+teams?.tid+"/squads"}>
              <button
                className="font-medium py-2 px-3 whitespace-nowrap"
              >
                Squads
              </button>
            </Link>
            <Link
              href={
                "/series/" +
                urlStringEncode(
                  pointTables?.title +
                    "-" +
                    pointTables?.season
                ) +
                "/" +
                pointTables?.cid +
                "/points-table"
              }
            >
              <button
                className="font-medium py-2 px-3 whitespace-nowrap"
              >
                Points Table
              </button>
            </Link>
            <Link
              href={
                "/series/" +
                urlStringEncode(
                  pointTables?.title +
                    "-" +
                    pointTables?.season
                ) +
                "/" +
                pointTables?.cid +
                "/news"
              }
            >
              <button
                className="font-medium py-2 px-3 whitespace-nowrap"
              >
                News
              </button>
            </Link>
            <Link
              href={
                "/series/" +
                urlStringEncode(
                  pointTables?.title +
                    "-" +
                    pointTables?.season
                ) +
                "/" +
                pointTables?.cid +
                "/stats/most-run"
              }
            >
              <button
                className="font-medium py-2 px-3 whitespace-nowrap"
              >
                Stats
              </button>
            </Link>
            
          </div>
        </div>
      <div id="live" className="">
        <div className="md:grid grid-cols-12 gap-4">
          <div className="lg:col-span-8 md:col-span-7">
            <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
              <div className="flex space-x-4">
              <button  id="all-tab"
                      className={`font-medium py-2 px-5 whitespace-nowrap ${
                        activeMainTab === "info1"
                          ? "bg-[#1A80F8] text-white"
                          : ""
                      } rounded-md`}
                    >
                      All
                    </button>
                      {liveMatch.length > 0 &&
                    <button id="live-tab"
                      className={`font-medium py-2 px-5 whitespace-nowrap ${
                        activeMainTab === "live1"
                          ? "bg-[#1A80F8] text-white"
                          : ""
                      } rounded-md`}
                    >
                      Live
                    </button>
                  }{completedMatch.length > 0 &&
                    <button  id="completed-tab"
                      className={`font-medium py-2 px-5 whitespace-nowrap ${
                        activeMainTab === "finished1"
                          ? "bg-[#1A80F8] text-white"
                          : ""
                      } rounded-md`}
                    >
                      Finished
                    </button>
                  }{upcomingMatch.length > 0 &&
                    <button  id="upcoming-tab"
                      className={`font-medium py-2 px-5 whitespace-nowrap ${
                        activeMainTab === "scorecard1"
                          ? "bg-[#1A80F8] text-white"
                          : ""
                      } rounded-md`}
                    >
                      Scheduled
                    </button>
                }
              </div>
            </div>
            <div className="tab-content-container">
              <div
                id="info1"
                className={`tab-content ${
                  activeMainTab === "info1" ? "" : "hidden"
                }`}
              >
                {/* <!-- live match desktop view start --> */}
                <div className="liveMatch">
                  {liveMatch && liveMatch?.map((items:any, index: number) => (
                    <div key={index}>
                      <div
                        data-key={items.match_id}
                        data-id="aaa"
                        className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className="flex items-center text-[#A70B0B] rounded-full pr-3  font-semibold"
                              style={{ gap: "3px" }}
                            >
                              <span className="rounded-full">
                                <svg className="h-[10px] w-[11px]">
                                  <circle
                                    fill="#ff0000"
                                    stroke="none"
                                    cx="5"
                                    cy="5"
                                    r="5"
                                  >
                                    <animate
                                      attributeName="opacity"
                                      dur="1s"
                                      values="0;1;0"
                                      repeatCount="indefinite"
                                      begin="0.1"
                                    />
                                  </circle>
                                </svg>
                              </span>{" "}
                              {items.status_str}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                                {items.competition.title} -{" "}
                                {items.competition.season}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[13px] font-medium">
                              {items.teama.short_name}
                            </span>
                            <span className="flex items-center bg-[#FAFFFC] border-[1px] border-[#0B773C] rounded-full text-[#0B773C] pr-2">
                              <span className="">
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
                              </span>
                              <span className={"oddback" + items.match_id}>
                                0
                              </span>
                            </span>
                            <span className="flex items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B]  rounded-full text-[#A70B0B] pr-2">
                              <span className="">
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
                              </span>
                              <span className={"oddlay" + items.match_id}>
                                0
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="border-t-[1px] border-[#E7F2F4]"></div>

                        <div className="py-4 px-3">
                          <Link
                            href={
                              "/live-score/" +
                              urlStringEncode(
                                items?.teama?.short_name +
                                  "-vs-" +
                                  items?.teamb?.short_name +
                                  "-match-" +
                                  items?.match_number +
                                  "-" +
                                  items?.competition?.title
                              ) +
                              "/" +
                              items.match_id
                            }
                          >
                            <div className="flex justify-between items-center text-[14px]">
                              <div className="">
                                <p className="text-[#586577] text-[12px] mb-4 font-medium">
                                  {items.subtitle} ,{items.format_str}, {items.venue.location}
                                </p>
                                <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Image  loading="lazy" 
                                      src={items.teama.logo_url}
                                      className="h-[30px] rounded-full"
                                      width={30}
                                      height={30}
                                      alt={items.teama.short_name}
                                    />
                                    <span className="text-[#909090] font-semibold">
                                      {items.teama.short_name} -{" "}
                                    </span>
                                  </div>
                                  <p
                                    className={
                                      "flex items-center gap-[1px] match" +
                                      items.match_id +
                                      "-" +
                                      items.teama.team_id
                                    }
                                  >
                                    {items.teama.scores === undefined ||
                                    items.teama.scores === null ||
                                    items.teama.scores === "" ? (
                                      <span className="font-semibold">
                                        {" "}
                                        (Yet to bat){" "}
                                      </span>
                                    ) : (
                                      <>
                                        <span className="font-semibold">
                                          {items.teama.scores}
                                        </span>
                                        <span className="text-[#909090] text-[13px]">
                                          {" "}
                                          ({items.teama.overs}){" "}
                                        </span>
                                      </>
                                    )}
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <div className="flex items-center space-x-2">
                                      <Image  loading="lazy" 
                                        src={items.teamb.logo_url}
                                        className="h-[30px]"
                                        width={30}
                                        height={30}
                                        alt={items.teamb.short_name}
                                      />
                                      <span className="text-[#909090] font-semibold">
                                        {items.teamb.short_name} -
                                      </span>
                                    </div>
                                    <p
                                      className={
                                        "flex items-center gap-[1px] match" +
                                        items.match_id +
                                        "-" +
                                        items.teamb.team_id
                                      }
                                    >
                                      {items.teamb.scores === undefined ||
                                      items.teamb.scores === null ||
                                      items.teamb.scores === "" ? (
                                        <span className="font-semibold">
                                          {" "}
                                          (Yet to bat){" "}
                                        </span>
                                      ) : (
                                        <>
                                          <span className="font-semibold">
                                            {items.teamb.scores}
                                          </span>
                                          <span className="text-[#909090] text-[13px]">
                                            {" "}
                                            ({items.teamb.overs}){" "}
                                          </span>
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className=" font-medium text-center">
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
                                  {items.status_note}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>

                        
                      </div>

                      {/* mobile */}

                      <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center text-[#a70b0b] rounded-full font-semibold">
                              <span className="rounded-full">
                                <svg className="h-[8px] w-[10px]">
                                  <circle
                                    fill="#ff0000"
                                    stroke="none"
                                    cx="3"
                                    cy="3"
                                    r="3"
                                  >
                                    <animate
                                      attributeName="opacity"
                                      dur="1s"
                                      values="0;1;0"
                                      repeatCount="indefinite"
                                      begin="0.1"
                                    />
                                  </circle>
                                </svg>
                              </span>
                              {items.status_str}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                {items.competition.title} -{" "}
                                {items.competition.season}
                              </h4>
                            </div>
                            <span className="absolute right-4 top-[19px]">
                              <button className="arro-button">
                                <Image  loading="lazy" 
                                  src="/assets/img/arrow.png"
                                  className=""
                                  width={10}
                                  height={15}
                                  alt=""
                                />
                              </button>
                            </span>
                          </div>
                        </div>

                        <div className="border-t-[1px] border-[#E7F2F4]"></div>
                        <div className="open-Performance-data">
                          <Link
                            href={
                              "/live-score/" +
                              urlStringEncode(
                                items?.teama?.short_name +
                                  "-vs-" +
                                  items?.teamb?.short_name +
                                  "-match-" +
                                  items?.match_number +
                                  "-" +
                                  items?.competition?.title
                              ) +
                              "/" +
                              items.match_id
                            }
                          >
                            <div className="py-2 pb-3">
                              <p className="text-[#586577] text-[11px] mb-4 font-normal">
                                {items.subtitle} ,{items.format_str}, {items.venue.location}
                              </p>
                              <div className="flex justify-between items-center text-[14px]">
                                <div className="">
                                  <div className="items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image  loading="lazy" 
                                        src={items.teama.logo_url}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={items.teama.short_name}
                                      />
                                      <div>
                                        <span className="flex items-center gap-1">
                                          <span className="text-[#5e5e5e] font-medium">
                                            {items.teama.short_name}
                                          </span>
                                          <Image  loading="lazy" 
                                            src="/assets/img/home/bat.png"
                                            className="h-[15px]"
                                            width={30}
                                            height={30}
                                            alt=""
                                          />
                                        </span>

                                        <p
                                          className={
                                            "flex items-center gap-2 match" +
                                            items.match_id +
                                            "-" +
                                            items.teama.team_id
                                          }
                                        >
                                          {items.teama.scores === undefined ||
                                          items.teama.scores === null ||
                                          items.teama.scores === "" ? (
                                            <span className="font-semibold">
                                              {" "}
                                              (Yet to bat){" "}
                                            </span>
                                          ) : (
                                            <>
                                              <span className="font-semibold">
                                                {items.teama.scores}
                                              </span>
                                              <span className="text-[#909090] text-[12px]">
                                                {" "}
                                                ({items.teama.overs}){" "}
                                              </span>
                                            </>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                      <div className="flex items-center space-x-2">
                                        <Image  loading="lazy" 
                                          src={items.teamb.logo_url}
                                          className="h-[30px]"
                                          width={30}
                                          height={30}
                                          alt={items.teamb.short_name}
                                        />
                                        <div>
                                          <span className="text-[#5e5e5e] font-medium">
                                            {items.teamb.short_name}
                                          </span>
                                          <p
                                            className={
                                              "font-normal text-[11px] match" +
                                              items.match_id +
                                              "-" +
                                              items.teamb.team_id
                                            }
                                          >
                                            {items.teamb.scores === undefined ||
                                            items.teamb.scores === null ||
                                            items.teamb.scores === "" ? (
                                              <span className="font-semibold">
                                                {" "}
                                                (Yet to bat){" "}
                                              </span>
                                            ) : (
                                              <>
                                                <span className="font-semibold">
                                                  {items.teamb.scores}
                                                </span>
                                                <span className="text-[#909090] text-[12px]">
                                                  {" "}
                                                  ({items.teamb.overs}){" "}
                                                </span>
                                              </>
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className=" font-medium text-center">
                                  <p
                                    className={
                                      "text-[#2F335C] font-light mt-1 text-[11px]  statusNote" +
                                      items.match_id
                                    }
                                  >
                                    {items.status_note}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>

                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="completedMatch">
                  {completedMatch && completedMatch?.map((cmatch: any, index: number) => (
                    <div key={index}>
                      <div className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className="flex items-center text-[#0B773C] rounded-full pr-3  font-semibold"
                              style={{ gap: "3px" }}
                            >
                              <span className="rounded-full">●</span>{" "}
                              {cmatch.status_str}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                                {cmatch.competition.title} -{" "}
                                {cmatch.competition.season}
                              </h4>
                            </div>
                          </div>
                          
                        </div>

                        <div className="border-t-[1px] border-[#E7F2F4]"></div>

                        <div className="py-4 px-3">
                          <div className="flex justify-between items-center text-[14px]">
                            <Link
                              href={
                                "/scorecard/" +
                                urlStringEncode(
                                  cmatch?.teama?.short_name +
                                    "-vs-" +
                                    cmatch?.teamb?.short_name +
                                    "-match-" +
                                    cmatch?.match_number +
                                    "-" +
                                    cmatch?.competition?.title
                                ) +
                                "/" +
                                cmatch.match_id
                              }
                            >
                              <div className="">
                                <p className="text-[#586577] text-[12px] mb-4 font-medium">
                                  {cmatch.subtitle} ,{cmatch.format_str} , {cmatch.venue.location}
                                </p>
                                <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Image  loading="lazy" 
                                      src={cmatch.teama.logo_url}
                                      className="h-[30px] rounded-full"
                                      width={30}
                                      height={30}
                                      alt={cmatch.teama.short_name}
                                    />
                                    <span className="text-[#909090] font-semibold">
                                      {cmatch.teama.short_name} -{" "}
                                    </span>
                                  </div>
                                  <p>
                                    <span className=" font-semibold">
                                      {cmatch.teama.scores}
                                    </span>
                                    <span className="text-[#909090] text-[13px]">
                                      {" "}
                                      ({cmatch.teama.overs})
                                    </span>
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <div className="flex items-center space-x-2">
                                      <Image  loading="lazy" 
                                        src={cmatch.teamb.logo_url}
                                        className="h-[30px]"
                                        width={30}
                                        height={30}
                                        alt={cmatch.teamb.short_name}
                                      />
                                      <span className="text-[#909090] font-semibold">
                                        {cmatch.teamb.short_name} -{" "}
                                      </span>
                                    </div>
                                    <p>
                                      <span className=" font-semibold">
                                        {cmatch.teamb.scores}
                                      </span>
                                      <span className="text-[#909090] text-[13px]">
                                        ({cmatch.teamb.overs})
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            <div className="h-[100px] border-l-[1px] border-[#d0d3d7]"></div>

                            <Link
                              href={
                                "/scorecard/" +
                                urlStringEncode(
                                  cmatch?.teama?.short_name +
                                    "-vs-" +
                                    cmatch?.teamb?.short_name +
                                    "-match-" +
                                    cmatch?.match_number +
                                    "-" +
                                    cmatch?.competition?.title
                                ) +
                                "/" +
                                cmatch.match_id
                              }
                            >
                              <div className=" font-semibold flex flex-col items-center">
                                <Image  loading="lazy" 
                                  src="/assets/img/home/win.png"
                                  width={30}
                                  height={30}
                                  style={{ width: "auto", height: "auto" }}
                                  alt=""
                                />
                                <p className="text-[#0B773C] text-1xl w-[75%] text-center">
                                  {cmatch.result}
                                </p>
                              </div>
                            </Link>

                            <div className="h-[100px] border-l-[1px] border-[#d0d3d7] hidden"></div>

                            <div className="hidden flex-col items-center">
                              <Image  loading="lazy" 
                                src="/assets/img/default.png"
                                width={40}
                                height={40}
                                alt=""
                              />

                              <p className=" font-semibold">{cmatch?.man_of_the_match?.name}</p>
                              <p>Man of the match</p>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                      {/* Mobile */}

                      <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className="flex items-center text-[#0B773C] rounded-full  font-semibold"
                              style={{ gap: "3px" }}
                            >
                              <span className="rounded-full">●</span>{" "}
                              {cmatch.status_str}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                {cmatch.competition.title} -{" "}
                                {cmatch.competition.season}
                              </h4>
                            </div>
                            <span className="absolute right-4 top-[19px]">
                              <button className="arro-button">
                                <Image  loading="lazy" 
                                  src="/assets/img/arrow.png"
                                  className=""
                                  width={10}
                                  height={15}
                                  alt=""
                                />
                              </button>
                            </span>
                          </div>
                        </div>

                        <div className="border-t-[1px] border-[#E7F2F4]"></div>

                        <div className="open-Performance-data">
                          <Link
                            href={
                              "/scorecard/" +
                              urlStringEncode(
                                cmatch?.teama?.short_name +
                                  "-vs-" +
                                  cmatch?.teamb?.short_name +
                                  "-match-" +
                                  cmatch?.match_number +
                                  "-" +
                                  cmatch?.competition?.title
                              ) +
                              "/" +
                              cmatch.match_id
                            }
                          >
                            <div className="py-2 pb-3">
                              <p className="text-[#586577] text-[11px] mb-4 font-normal">
                                {cmatch.subtitle} ,{cmatch.format_str}, {cmatch.venue.location}
                              </p>
                              <div className="flex justify-between items-center text-[14px]">
                                <div className="">
                                  <div className="items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image  loading="lazy" 
                                        src={cmatch.teama.logo_url}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={cmatch.teama.short_name}
                                      />
                                      <div>
                                        <span className="flex items-center gap-1">
                                          <span className="text-[#5e5e5e] font-medium">
                                            {cmatch.teama.short_name}
                                          </span>
                                        </span>
                                        <p className="flex items-end gap-2">
                                          <span className=" font-semibold">
                                            {cmatch.teama.scores}
                                          </span>

                                          <span className="text-[#909090] text-[12px] font-normal">
                                            ({cmatch.teama.overs})
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                      <div className="flex items-center space-x-2">
                                        <Image  loading="lazy" 
                                          src={cmatch.teamb.logo_url}
                                          className="h-[30px] rounded-full"
                                          width={30}
                                          height={30}
                                          alt={cmatch.teamb.short_name}
                                        />
                                        <div>
                                          <span className="flex items-center gap-1">
                                            <span className="text-[#5e5e5e] font-medium">
                                              {cmatch.teamb.short_name}
                                            </span>
                                          </span>
                                          <p className="flex items-end gap-2">
                                            <span className=" font-semibold">
                                              {cmatch.teamb.scores}
                                            </span>

                                            <span className="text-[#909090] text-[12px] font-normal">
                                              ({cmatch.teama.overs})
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* <!-- <div className="h-[100px] border-l-[1px] border-[#d0d3d7]"></div> --> */}

                                <div className=" font-semibold flex flex-col items-center">
                                  <Image  loading="lazy" 
                                    src="/assets/img/home/win.png"
                                    width={30}
                                    height={30}
                                    style={{ width: "auto", height: "auto" }}
                                    alt=""
                                  />
                                  <p className="text-[#0B773C] font-semibold mt-1 text-[13px] w-[75%] text-center">
                                    {cmatch.result}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>

                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="upcomingMatch">
                  {upcomingMatch && upcomingMatch?.map((ucmatch: any, index: number) => (
                    <div key={index}>
                      <div className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className="flex items-center text-[#A45B09] rounded-full pr-3  font-semibold"
                              style={{ gap: "3px" }}
                            >
                              <span className="rounded-full">●</span>{" "}
                              {ucmatch.status_str}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                                {ucmatch.competition.title} -{" "}
                                {ucmatch.competition.season}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[13px] font-medium">AUS</span>
                            <span className="flex items-center bg-[#FAFFFC] border-[1px] border-[#0B773C] rounded-full text-[#0B773C] pr-2">
                              <span className="">
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
                              </span>
                              41
                            </span>
                            <span className="flex items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B]  rounded-full text-[#A70B0B] pr-2">
                              <span className="">
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
                              </span>
                              45
                            </span>
                          </div>
                        </div>

                        <div className="border-t-[1px] border-[#E7F2F4]"></div>
                        <Link
                          href={
                            "/moreinfo/" +
                            urlStringEncode(
                              ucmatch?.teama?.short_name +
                                "-vs-" +
                                ucmatch?.teamb?.short_name +
                                "-match-" +
                                ucmatch?.match_number +
                                "-" +
                                ucmatch?.competition?.title
                            ) +
                            "/" +
                            ucmatch.match_id
                          }
                        >
                          <div className="py-4 px-3">
                            <div className="flex justify-between items-center text-[14px]">
                              <div className="">
                                <p className="text-[#586577] text-[12px] mb-4 font-medium">
                                  {ucmatch.subtitle} ,{ucmatch.format_str}, {ucmatch.venue.location}
                                </p>
                                <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Image  loading="lazy" 
                                      src={ucmatch.teama.logo_url}
                                      className="h-[30px] rounded-full"
                                      width={30}
                                      height={30}
                                      alt={ucmatch.teama.short_name}
                                    />
                                    <span className="font-semibold">
                                      {ucmatch.teama.short_name}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <div className="flex items-center space-x-2">
                                      <Image  loading="lazy" 
                                        src={ucmatch.teamb.logo_url}
                                        className="h-[30px]"
                                        width={30}
                                        height={30}
                                        alt={ucmatch.teamb.short_name}
                                      />
                                      <span className="font-semibold">
                                        {ucmatch.teamb.short_name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="font-semibold text-center">
                                <div className="text-[#144280]">
                                  <div className=" font-medium text-center">
                                    {isSameDay(
                                      new Date(),
                                      new Date(ucmatch.date_start_ist)
                                    ) ? (
                                      <CountdownTimer
                                        targetTime={ucmatch.date_start_ist}
                                      />
                                    ) : (
                                      <p className="text-[#2F335C] text-[14px]">
                                        {format(
                                          new Date(ucmatch.date_start_ist),
                                          "dd MMMM - EEEE"
                                        )}
                                        , <br />
                                        {format(
                                          new Date(ucmatch.date_start_ist),
                                          "hh:mm:aa"
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                       
                      </div>

                      {/* Mobile */}
                      <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className="flex items-center text-[#A45B09] rounded-full font-semibold"
                              style={{ gap: "3px" }}
                            >
                              <span className="rounded-full">●</span>{" "}
                              {ucmatch.status_str}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                {ucmatch.competition.title} -{" "}
                                {ucmatch.competition.season}
                              </h4>
                            </div>
                            <span className="absolute right-[12px] top-[19px]">
                              <button className="arro-button">
                                <Image  loading="lazy" 
                                  src="/assets/img/arrow.png"
                                  className=""
                                  width={10}
                                  height={15}
                                  alt=""
                                />
                              </button>
                            </span>
                          </div>
                        </div>

                        <div className="border-t-[1px] border-[#E7F2F4]"></div>
                        <Link
                          href={
                            "/moreinfo/" +
                            urlStringEncode(
                              ucmatch?.teama?.short_name +
                                "-vs-" +
                                ucmatch?.teamb?.short_name +
                                "-match-" +
                                ucmatch?.match_number +
                                "-" +
                                ucmatch?.competition?.title
                            ) +
                            "/" +
                            ucmatch.match_id
                          }
                        >
                          <div className="open-Performance-data">
                            <div className="py-2 pb-3">
                              <p className="text-[#586577] text-[12px] mb-4 font-medium">
                                {ucmatch.subtitle} ,{ucmatch.format_str}, {ucmatch.venue.location}
                              </p>
                              <div className="flex justify-between items-center text-[14px]">
                                <div>
                                  <div className="items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image  loading="lazy" 
                                        src={ucmatch.teama.logo_url}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={ucmatch.teama.short_name}
                                      />
                                      <div>
                                        <span className="flex items-center gap-1">
                                          <span className="text-[#5e5e5e] font-medium">
                                            {ucmatch.teama.short_name}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <div className="flex items-center space-x-2">
                                      <Image  loading="lazy" 
                                        src={ucmatch.teamb.logo_url}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={ucmatch.teamb.short_name}
                                      />
                                      <div>
                                        <span className="flex items-center gap-1">
                                          <span className="text-[#5e5e5e] font-medium">
                                            {ucmatch.teamb.short_name}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className=" font-medium text-center">
                                    {isSameDay(
                                      new Date(),
                                      new Date(ucmatch.date_start_ist)
                                    ) ? (
                                      <CountdownTimer
                                        targetTime={ucmatch.date_start_ist}
                                      />
                                    ) : (
                                      <p className="text-[#2F335C] text-[14px]">
                                        {format(
                                          new Date(ucmatch.date_start_ist),
                                          "dd MMMM - EEEE"
                                        )}
                                        , <br />
                                        {format(
                                          new Date(ucmatch.date_start_ist),
                                          "hh:mm:aa"
                                        )}
                                      </p>
                                    )}
                                  </div>
                                
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="border-t-[1px] border-[#E7F2F4]"></div>

                        <div className="flex items-center justify-between space-x-5 mt-2">
                         

                          <div className="flex items-center space-x-2 text-[11px]">
                            <span className="text-[#909090] font-medium">
                            {ucmatch.teama.short_name}
                            </span>
                            <span className="flex items-center bg-[#FAFFFC] border-[1px] border-[#0B773C] rounded-md text-[#0B773C] pr-2">
                              <span>
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
                              </span>
                             0
                            </span>
                            <span className="flex items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B] rounded-md text-[#A70B0B] pr-2">
                              <span>
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
                              </span>
                              0
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

             
              </div>
            </div>

            
          </div>

          <div className="lg:col-span-4 md:col-span-5">
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex gap-1 items-center justify-between">
                <div className="flex gap-1 items-center">
                  <div className="col-span-4 relative">
                    <Image  loading="lazy" 
                      src="/assets/img/home/trofi.png"
                      className="h-[75px]"
                      width={75}
                      height={75}
                      alt="1"
                    />
                  </div>
                  <div className="col-span-8 relative">
                    <h3 className="font-semibold text-[19px] mb-1">
                      Weekly challenge
                    </h3>
                    <p className="font-semibold text-[13px] text-[#1a80f8]">
                      <span className="text-[#586577]">Time Left:</span>2 Days
                      12h
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
                    />
                  </svg>
                </div>
              </div>
            </div>

            <WeeklySlider />

            <FantasyTips/>
            
          </div>
        </div>
      </div>
    </section>
  );
}

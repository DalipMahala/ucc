"use client";

import React, { useState, useEffect } from "react";
import WeeklySlider from "@/app/components/WeeklySlider";
import Link from "next/link";
import Image from "next/image";
import { urlStringEncode } from "../../../utils/utility";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "../../components/countdownTimer";
import FantasyTips from "@/app/components/FantasyTips";
import TabMenu from "./menu";
import PlayerImage from "@/app/components/PlayerImage";

interface ScheduleResults {
  urlString: string;
  seriesMatches: any;
  statsType: string;
  isPointTable: boolean;
  seriesId: number;
}
export default function ScheduleResults({
  urlString,
  seriesMatches,
  statsType,
  isPointTable,
  seriesId
}: ScheduleResults) {


  let completedMatch = seriesMatches?.resultMatch;
  let liveMatch = seriesMatches?.liveMatch;
  let upcomingMatch = seriesMatches?.scheduledMatch;


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
        el.classList.remove("bg-[#000000]", "text-white");
        el.classList.add("bg-[#ffffff]");
      });

      // Add active style to clicked tab
      target.classList.add("bg-[#000000]", "text-white");
      target.classList.remove("bg-[#ffffff]");

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

    if (statsType === 'schedule') {
      const upcomingTab = document.querySelector("#upcoming-tab") as HTMLElement;
      if (upcomingTab) {
        upcomingTab.click();
      }
    }
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
      <TabMenu urlString={urlString} isPointTable={isPointTable} />
      <div id="live" className="">
        <div className="md:grid grid-cols-12 gap-4 mb-4">
          <div className="lg:col-span-8 md:col-span-7">
            <div className="rounded-lg mb-4">
              <div className="flex space-x-4">
                <button id="all-tab"
                  className={`font-medium py-1 md:px-7 px-6 whitespace-nowrap border-[1px] border-[#E5E8EA]  ${activeMainTab === "info1"
                    ? "bg-[#000000] text-white"
                    : ""
                    } rounded-full`}
                >
                  All
                </button>
                {liveMatch.length > 0 &&
                  <button id="live-tab"
                    className={`font-medium py-1 md:px-7 px-6 bg-[#ffffff] whitespace-nowrap border-[1px] border-[#E5E8EA] ${activeMainTab === "live1"
                      ? "bg-[#000000] text-white"
                      : ""
                      } rounded-full`}
                  >
                    Live
                  </button>
                }{completedMatch.length > 0 &&
                  <button id="completed-tab"
                    className={`font-medium py-1 md:px-7 px-6 bg-[#ffffff] whitespace-nowrap border-[1px] border-[#E5E8EA] ${activeMainTab === "finished1"
                      ? "bg-[#000000] text-white"
                      : ""
                      } rounded-full`}
                  >
                    Finished
                  </button>
                }{upcomingMatch.length > 0 &&
                  <button id="upcoming-tab"
                    className={`font-medium py-1 md:px-7 px-6 bg-[#ffffff] whitespace-nowrap border-[1px] border-[#E5E8EA] ${activeMainTab === "scorecard1"
                      ? "bg-[#000000] text-white"
                      : ""
                      } rounded-full`}
                  >
                    Scheduled
                  </button>
                }
              </div>
            </div>
            <div className="tab-content-container">
              <div
                id="info1"
                className={`tab-content ${activeMainTab === "info1" ? "" : "hidden"
                  }`}
              >
                {/* <!-- live match desktop view start --> */}
                <div className="liveMatch">
                  {liveMatch && liveMatch?.map((items: any, index: number) => (
                    <div key={index}>
                      <div
                        data-key={items.match_id}
                        data-id="aaa"
                        className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 w-[75%]">
                            <div
                              className="flex items-center text-[12px] text-[#A70B0B] rounded-full pr-3 uppercase font-semibold"
                              style={{ gap: "3px" }}
                            >
                              <span className="rounded-full">
                                <svg className="h-[9px] w-[9px]">
                                  <circle
                                    fill="#ff0000"
                                    stroke="none"
                                    cx="4"
                                    cy="4"
                                    r="4"
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
                              <h4 className="text-[15px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                {items.competition.title} -{" "}
                                {items.competition.season}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[13px] font-medium">
                              {items.teama.short_name}
                            </span>
                            <span className="flex font-semibold items-center bg-[#FAFFFC] border-[1px] border-[#00a632] rounded-full text-[#00a632] pr-2">
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
                            <span className="flex font-semibold items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B]  rounded-full text-[#A70B0B] pr-2">
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
                                "-" +
                                items?.subtitle +
                                "-" +
                                items?.competition?.title +
                                "-" +
                                items?.competition?.season
                              ) +
                              "/" +
                              items.match_id
                            }
                          >
                            <div className="flex justify-between items-center text-[14px]">
                              <div className="w-[55%]">
                                <p className="text-[#586577] text-[12px] mb-4 font-medium">
                                  {items.subtitle} ,{items.format_str}, {items.venue.location}
                                </p>
                                <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Image loading="lazy"
                                      src={items.teama.logo_url}
                                      className="h-[30px] rounded-full"
                                      width={30}
                                      height={30}
                                      alt={items.teama.short_name}
                                    />
                                    <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : "text-[#757A82] font-semibold text-[14px]"}`}>
                                      {items.teama.short_name} -{" "}
                                    </span>
                                  </div>
                                  <p
                                    className={
                                      "flex items-center gap-[4px] match" +
                                      items.match_id +
                                      "-" +
                                      items.teama.team_id
                                    }
                                  >
                                    {items.teama.scores === undefined ||
                                      items.teama.scores === null ||
                                      items.teama.scores === "" ? (
                                      <span className="text-[14px] font-semibold">
                                        {" "}
                                        (Yet to bat){" "}
                                      </span>
                                    ) : (
                                      <>
                                        <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : " font-semibold text-[14px]"}`}>
                                          {items.teama.scores}
                                        </span>
                                        <span className={`${(items.teama.team_id === items?.live?.live_inning?.batting_team_id) ? " text-[13px] text-[black]" : "text-[#757A82] text-[13px]"}`}>
                                          {" "}
                                          ({items.teama.overs}){" "}
                                        </span>
                                        {(items.teama.team_id === items?.live?.live_inning?.batting_team_id) &&
                                          <Image loading="lazy" src="/assets/img/home/bat.png" width={12} height={12} className="h-[12px] mb-[3px]" alt="bat" />
                                        }
                                      </>
                                    )}
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2 font-medium md:w-full">
                                    <div className="flex items-center space-x-2">
                                      <Image loading="lazy"
                                        src={items.teamb.logo_url}
                                        className="h-[30px]"
                                        width={30}
                                        height={30}
                                        alt={items.teamb.short_name}
                                      />
                                      <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : "text-[#757A82] font-semibold text-[14px]"}`}>
                                        {items.teamb.short_name} -
                                      </span>
                                    </div>
                                    <p
                                      className={
                                        "flex items-center gap-[4px] match" +
                                        items.match_id +
                                        "-" +
                                        items.teamb.team_id
                                      }
                                    >
                                      {items.teamb.scores === undefined ||
                                        items.teamb.scores === null ||
                                        items.teamb.scores === "" ? (
                                        <span className="text-[14px] font-semibold">
                                          {" "}
                                          (Yet to bat){" "}
                                        </span>
                                      ) : (
                                        <>
                                          <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? "font-semibold text-[14px] text-[black]" : "font-semibold text-[14px]"}`}>
                                            {items.teamb.scores}
                                          </span>
                                          <span className={`${(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) ? " text-[13px] text-[black]" : "text-[#757A82] text-[13px]"}`}>
                                            {" "}
                                            ({items.teamb.overs}){" "}
                                          </span>
                                          {(items.teamb.team_id === items?.live?.live_inning?.batting_team_id) &&
                                            <Image loading="lazy" src="/assets/img/home/bat.png" width={12} height={12} className="h-[12px] mb-[3px]" alt="bat" />
                                          }
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="w-[38%] font-medium text-center">
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

                        <div className="border-t-[1px] border-[#E7F2F4]"></div>

                        <div className="flex items-center justify-between space-x-5 mt-3">
                          <div className="flex items-center">
                            {isPointTable &&
                              <>
                                <Link
                                  href=
                                  {urlString + "/points-table"}
                                >
                                  <p className=" text-[#757A82] font-medium">
                                    {" "}
                                    Points Table
                                  </p>
                                </Link>
                                {/* <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div> */}
                              </>}
                            {/* <Link href="#">
                              <p className="text-[#909090] font-semibold">
                                Schedule
                              </p>
                            </Link> */}
                          </div>

                          {items?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(items.format_str) &&
                            <Link href={("/h2h/" + urlStringEncode(items?.competition?.title === 'Indian Premier League' ? items?.short_title : items?.title) + "-head-to-head-in-" + items?.format_str).toLowerCase()}>

                              <div className="flex justify-end items-center space-x-2">
                                <Image loading="lazy"
                                  src="/assets/img/home/handshake.png"
                                  width={25}
                                  height={25}
                                  alt=""
                                  style={{ width: "25px", height: "25px" }}
                                />
                                <span className="text-[#757A82] font-medium">
                                  H2H
                                </span>
                              </div>
                            </Link>
                          }
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
                                "-" +
                                items?.subtitle +
                                "-" +
                                items?.competition?.title +
                                "-" +
                                items?.competition?.season
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
                                      <Image loading="lazy"
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
                                          <Image loading="lazy"
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
                                        <Image loading="lazy"
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

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>

                          <div className="flex items-center justify-between space-x-5 mt-2">
                            <div className="flex items-center">
                              {isPointTable &&
                                <>
                                  <Link
                                    href={urlString + "/points-table"}
                                  >
                                    <p className=" text-[#586577] text-[13px] font-medium">
                                      {" "}
                                      Points Table
                                    </p>
                                  </Link>

                                  <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                </>}
                              {items?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(items.format_str) &&
                                <Link href={("/h2h/" + urlStringEncode(items?.competition?.title === 'Indian Premier League' ? items?.short_title : items?.title) + "-head-to-head-in-" + items?.format_str).toLowerCase()}>

                                  <div className="flex justify-end items-center space-x-2">
                                    <Image loading="lazy"
                                      src="/assets/img/home/handshake.png"
                                      className="h-[17px] w-[17px]"
                                      width={17}
                                      height={17}
                                      style={{ width: "17px", height: "17px" }}
                                      alt=""
                                    />
                                    <span className="text-[#586577] text-[13px] font-medium">
                                      H2H
                                    </span>
                                  </div>
                                </Link>
                              }
                            </div>

                            <div className="flex items-center space-x-2 text-[11px]">
                              <span className="text-[#909090] font-medium">
                                {items.teama.short_name}
                              </span>
                              <span className="flex items-center bg-[#FAFFFC] border-[1px] border-[#0B773C] rounded-md text-[#0B773C] pr-2">
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
                              <span className="flex items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B]  rounded-md text-[#A70B0B] pr-2">
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
                              className="flex items-center text-[13px] text-[#0B773C] rounded-full pr-3 uppercase  font-semibold"
                              style={{ gap: "3px" }}
                            >
                              <div className="w-[8px] h-[8px] bg-[#0B773C] rounded-full"></div>{" "}
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
                                  "-" +
                                  cmatch?.subtitle +
                                  "-" +
                                  cmatch?.competition?.title +
                                  "-" +
                                  cmatch?.competition?.season
                                ) +
                                "/" +
                                cmatch.match_id
                              }
                            >
                              <div className="">
                                <p className="text-[#586577] text-[12px] mb-4 font-medium">
                                  {cmatch.subtitle} ,{cmatch.format_str}, {cmatch.venue.location}
                                </p>
                                <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Image loading="lazy"
                                      src={cmatch.teama.logo_url}
                                      className="h-[30px] rounded-full"
                                      width={30}
                                      height={30}
                                      alt={cmatch.teama.short_name}
                                    />
                                    <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "text-[#757A82] font-semibold text-[14px]"}`}>
                                      {cmatch.teama.short_name} -{" "}
                                    </span>
                                  </div>
                                  <p>
                                    <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : " font-semibold text-[14px]"}`}>
                                      {cmatch.teama.scores}  {" "}
                                    </span>
                                    <span className={`${(cmatch.teama.team_id === cmatch?.winning_team_id) ? "text-[13px] text-[black]" : "text-[#757A82] text-[13px]"}`}>
                                      {" "}
                                      ({cmatch.teama.overs})
                                    </span>
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                    <div className="flex items-center space-x-2">
                                      <Image loading="lazy"
                                        src={cmatch.teamb.logo_url}
                                        className="h-[30px]"
                                        width={30}
                                        height={30}
                                        alt={cmatch.teamb.short_name}
                                      />
                                      <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "text-[#757A82] font-semibold text-[14px]"}`}>
                                        {cmatch.teamb.short_name} -{" "}
                                      </span>
                                    </div>
                                    <p>
                                      <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "font-semibold text-[14px] text-[black]" : "text-[14px] font-semibold "}`}>
                                        {cmatch.teamb.scores}{" "}
                                      </span>
                                      <span className={`${(cmatch.teamb.team_id === cmatch?.winning_team_id) ? "text-[13px] text-[black]" : "text-[#757A82] text-[13px]"}`}>
                                        ({cmatch.teamb.overs})
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            <div className="h-[100px] border-l-[1px] border-[#efefef]"></div>

                            <Link
                              href={
                                "/scorecard/" +
                                urlStringEncode(
                                  cmatch?.teama?.short_name +
                                  "-vs-" +
                                  cmatch?.teamb?.short_name +
                                  "-" +
                                  cmatch?.subtitle +
                                  "-" +
                                  cmatch?.competition?.title
                                ) +
                                "/" +
                                cmatch.match_id
                              }
                            >
                              <div className=" font-semibold flex flex-col items-center">
                                <Image loading="lazy"
                                  src="/assets/img/home/win.png"
                                  width={30}
                                  height={30}
                                  style={{ width: "30px", height: "30px" }}
                                  alt=""
                                />
                                <p className="text-[#0B773C] text-[15px] w-[75%] text-center">
                                  {cmatch.result}
                                </p>
                              </div>
                            </Link>
                            {(cmatch.man_of_the_match && !Array.isArray(cmatch.man_of_the_match)) &&
                              <>
                                <div className="h-[100px] border-l-[1px] border-[#efefef] "></div>
                                <Link
                                  href={
                                    "/player/" +
                                    urlStringEncode(cmatch?.man_of_the_match?.name) + "/" + cmatch?.man_of_the_match?.pid
                                  }>
                                  <div className="flex flex-col items-center">
                                    <PlayerImage key={cmatch?.man_of_the_match?.pid} player_id={cmatch?.man_of_the_match?.pid} height={40} width={40} className="rounded-full" />

                                    <p className="text-[14px] font-semibold">{cmatch?.man_of_the_match?.name}</p>
                                    <p className="text-[14px]">Man of the match</p>
                                  </div>
                                </Link>
                              </>
                            }
                          </div>
                        </div>
                        <div className="border-t-[1px] border-[#E7F2F4]"></div>

                        <div className="flex items-center justify-between space-x-5 mt-3">
                          <div className="flex items-center">
                            {isPointTable &&
                              <>
                                <Link
                                  href=
                                  {urlString + "/points-table"}
                                >
                                  <p className=" text-[#757A82] font-medium">
                                    {" "}
                                    Points Table
                                  </p>
                                </Link>
                                {/* <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div> */}
                              </>}
                            {/* <Link href="#">
                              <p className="text-[#909090] font-semibold">
                                Schedule
                              </p>
                            </Link> */}
                          </div>

                          {cmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(cmatch.format_str) &&
                            <Link href={("/h2h/" + urlStringEncode(cmatch?.competition?.title === 'Indian Premier League' ? cmatch?.short_title : cmatch?.title) + "-head-to-head-in-" + cmatch?.format_str).toLowerCase()}>

                              <div className="flex mt-2 justify-end items-center space-x-2">
                                <Image loading="lazy"
                                  src="/assets/img/home/handshake.png"
                                  width={25}
                                  height={25}
                                  style={{ width: "25px", height: "25px" }}
                                  alt=""
                                />
                                <span className="text-[#757A82] font-medium">
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
                              style={{ gap: "3px" }}
                            >
                              <div className="w-[6px] h-[6px] bg-[#00a632] rounded-full"></div> {" "}
                              {cmatch.status_str}
                            </div>
                            <div>
                              <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                {cmatch.competition.title} -{" "}
                                {cmatch.competition.season}
                              </h4>
                            </div>

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
                                "-" +
                                cmatch?.subtitle +
                                "-" +
                                cmatch?.competition?.title +
                                "-" +
                                cmatch?.competition?.season
                              ) +
                              "/" +
                              cmatch.match_id
                            }
                          >
                            <div className="py-2 pb-3">
                              <p className="text-[#586577] text-[13px] mb-4 font-normal">
                                {cmatch.subtitle} ,{cmatch.format_str}, {cmatch.venue.location}
                              </p>
                              <div className="flex justify-between items-center text-[14px]">
                                <div className="w-[100%]">
                                  <div className="items-center space-x-2 font-medium md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image loading="lazy"
                                        src={cmatch.teama.logo_url}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={cmatch.teama.short_name}
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
                                  <div>
                                    <div className="flex items-center space-x-2 font-medium w-[162px] md:w-full">
                                      <div className="flex items-center space-x-2">
                                        <Image loading="lazy"
                                          src={cmatch.teamb.logo_url}
                                          className="h-[30px] rounded-full"
                                          width={30}
                                          height={30}
                                          alt={cmatch.teamb.short_name}
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

                                <div className="h-[100px] border-l-[1px] border-[#efefef]"></div>

                                <div className=" w-[50%] font-semibold flex flex-col items-center">
                                  <Image loading="lazy"
                                    src="/assets/img/home/win.png"
                                    width={30}
                                    height={30}
                                    style={{ width: "30px", height: "30px" }}
                                    alt=""
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
                              {isPointTable &&
                                <>
                                  <Link
                                    href={urlString + "/points-table"}
                                  >
                                    <p className=" text-[#586577] text-[13px] font-medium">
                                      {" "}
                                      Points Table
                                    </p>
                                  </Link>

                                  <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                </>}
                              {cmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(cmatch.format_str) &&
                                <Link href={("/h2h/" + urlStringEncode(cmatch?.competition?.title === 'Indian Premier League' ? cmatch?.short_title : cmatch?.title) + "-head-to-head-in-" + cmatch?.format_str).toLowerCase()}>

                                  <div className="flex justify-end items-center space-x-2">
                                    <Image loading="lazy"
                                      src="/assets/img/home/handshake.png"
                                      className="h-[17px] w-[17px]"
                                      width={17}
                                      height={17}
                                      style={{ width: "17px", height: "17px" }}
                                      alt=""
                                    />
                                    <span className="text-[#586577] text-[13px] font-medium">
                                      H2H
                                    </span>
                                  </div>
                                </Link>
                              }
                            </div>

                            <div className="hidden md:flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Image loading="lazy"
                                  src="/assets/img/player-2.png"
                                  className="h-[32px]"
                                  width={30}
                                  height={30}
                                  alt=""
                                />
                                <div>
                                  <p className=" font-semibold">Adam Zampa</p>
                                  <p className="text-[11px]">
                                    Man of the match
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
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
                              className="flex items-center text-[13px] text-[#A45B09] rounded-full pr-3 uppercase font-semibold"
                              style={{ gap: "3px" }}
                            >
                              <div className="w-[8px] h-[8px] bg-[#A45B09] rounded-full animate-blink"></div>{" "}
                              {ucmatch.status_str}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                                {ucmatch.competition.title} -{" "}
                                {ucmatch.competition.season}
                              </h4>
                            </div>
                          </div>
                          <div className="hidden items-center space-x-2">
                            <span className="text-[13px] font-medium text-[#1F2937] oddsTeam">AUS</span>
                            <span className="flex font-semibold items-center bg-[#FAFFFC] border-[1px] border-[#00a632] rounded-full text-[#00a632] pr-2">
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
                            <span className="flex font-semibold items-center bg-[#FFF7F7] border-[1px] border-[#A70B0B]  rounded-full text-[#A70B0B] pr-2">
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
                              "-" +
                              ucmatch?.subtitle +
                              "-" +
                              ucmatch?.competition?.title +
                              "-" +
                              ucmatch?.competition?.season
                            ) +
                            "/" +
                            ucmatch.match_id
                          }
                        >
                          <div className="py-3 px-3">
                            <div className="flex justify-between items-center text-[14px]">
                              <div className="w-[50%]">
                                <p className="text-[#586577] text-[12px] mb-4 font-medium">
                                  {ucmatch.subtitle} ,{ucmatch.format_str}, {ucmatch.venue.location}
                                </p>
                                <div className="flex items-center space-x-2 font-medium x md:w-full mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Image loading="lazy"
                                      src={ucmatch.teama.logo_url}
                                      className="h-[30px] rounded-full"
                                      width={30}
                                      height={30}
                                      alt={ucmatch.teama.short_name}
                                    />
                                    <span className="font-semibold text-[14px]">
                                      {ucmatch?.teama?.name}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2 font-medium md:w-full">
                                    <div className="flex items-center space-x-2">
                                      <Image loading="lazy"
                                        src={ucmatch.teamb.logo_url}
                                        className="h-[30px]"
                                        width={30}
                                        height={30}
                                        alt={ucmatch.teamb.short_name}
                                      />
                                      <span className="font-semibold text-[14px]">
                                        {ucmatch?.teamb?.name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* <div className="h-[100px] border-l-[1px] border-[#efefef]"></div> */}

                              <div className="w-[50%] font-semibold text-center flex justify-end">
                                <div className="text-[#144280]">
                                  <div className=" font-medium text-center">
                                    {isSameDay(
                                      new Date(),
                                      new Date(ucmatch.date_start_ist)
                                    ) ? (
                                      <>

                                        <span className="text-[13px] font-normal text-[#a45b09]">Start in</span>
                                        <CountdownTimer
                                          targetTime={ucmatch.date_start_ist}

                                        />
                                      </>
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
                        <div className="border-t-[1px] border-[#E7F2F4]"></div>

                        <div className="flex items-center justify-between space-x-5 mt-3">
                          <div className="flex items-center">
                            {isPointTable &&
                              <>
                                <Link
                                  href={urlString + "/points-table"}
                                >
                                  <p className=" text-[#757A82] font-medium">
                                    {" "}
                                    Points Table
                                  </p>
                                </Link>
                                {/* <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div> */}
                              </>}
                            {/* <Link href="#">
                              <p className="text-[#909090] font-semibold">
                                Schedule
                              </p>
                            </Link> */}
                          </div>

                          {ucmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(ucmatch.format_str) &&
                            <Link href={("/h2h/" + urlStringEncode(ucmatch?.competition?.title === 'Indian Premier League' ? ucmatch?.short_title : ucmatch?.title) + "-head-to-head-in-" + ucmatch?.format_str).toLowerCase()}>

                              <div className="flex mt-2 justify-end items-center space-x-2">
                                <Image loading="lazy"
                                  src="/assets/img/home/handshake.png"
                                  width={25}
                                  height={25}
                                  alt=""
                                  style={{ width: "25px", height: "25px" }}
                                />
                                <span className="text-[#757A82] font-medium">
                                  H2H
                                </span>
                              </div>
                            </Link>
                          }
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className="flex text-[12px] items-center uppercase text-[#A45B09] rounded-full font-semibold"
                              style={{ gap: "2px" }}
                            >
                              <div className="w-[6px] h-[6px] bg-[#A45B09] rounded-full"></div>{" "}
                              {ucmatch.status_str}
                            </div>
                            <div>
                              <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                {ucmatch.competition.title} -{" "}
                                {ucmatch.competition.season}
                              </h4>
                            </div>

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
                              "-" +
                              ucmatch?.subtitle +
                              "-" +
                              ucmatch?.competition?.title +
                              "-" +
                              ucmatch?.competition?.season
                            ) +
                            "/" +
                            ucmatch.match_id
                          }
                        >
                          <div className="open-Performance-data">
                            <div className="py-2 pb-3">
                              <p className="text-[#586577] text-[13px] mb-4 font-medium">
                                {ucmatch.subtitle} ,{ucmatch.format_str}, {ucmatch.venue.location}
                              </p>
                              <div className="flex justify-between items-center text-[14px]">
                                <div className="w-[80%]">
                                  <div className="items-center space-x-2 font-medium md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image loading="lazy"
                                        src={ucmatch.teama.logo_url}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={ucmatch.teama.short_name}
                                      />
                                      <div>
                                        <span className="flex items-center gap-1">
                                          <span className="text-[#5e5e5e] font-medium">
                                            {ucmatch?.teama?.name}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 font-medium md:w-full">
                                    <div className="flex items-center space-x-2">
                                      <Image loading="lazy"
                                        src={ucmatch.teamb.logo_url}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={ucmatch.teamb.short_name}
                                      />
                                      <div>
                                        <span className="flex items-center gap-1">
                                          <span className="text-[#5e5e5e] font-medium">
                                            {ucmatch?.teamb?.name}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>


                                <div className="h-[100px] border-l-[1px] border-[#f2fafd]"></div>

                                <div className="w-[80%] font-semibold text-center">
                                  {isSameDay(
                                    new Date(),
                                    new Date(ucmatch.date_start_ist)
                                  ) ? (
                                    <><span className="text-[13px] font-normal text-[#a45b09]">Start in</span>
                                      <CountdownTimer
                                        targetTime={ucmatch.date_start_ist}
                                      />
                                    </>
                                  ) : (
                                    <p className="text-[13px] font-medium">
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
                          <div className="flex items-center">
                            {isPointTable &&
                              <>
                                <Link
                                  href={urlString + "/points-table"}
                                >
                                  <p className="text-[#586577] text-[13px] font-medium">
                                    Points Table
                                  </p>
                                </Link>
                                <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                              </>}
                            {ucmatch?.format_str && ['T20I', 'T20', 'Test', 'Odi'].includes(ucmatch.format_str) &&
                              <Link href={("/h2h/" + urlStringEncode(ucmatch?.competition?.title === 'Indian Premier League' ? ucmatch?.short_title : ucmatch?.title) + "-head-to-head-in-" + ucmatch?.format_str).toLowerCase()}>

                                <div className="flex justify-end items-center space-x-2">
                                  <Image loading="lazy"
                                    src="/assets/img/home/handshake.png"
                                    className="h-[17px] w-[17px]"
                                    width={17}
                                    height={17}
                                    style={{ width: "17px", height: "17px" }}
                                    alt=""
                                  />
                                  <span className="text-[#586577] text-[13px] font-medium">
                                    H2H
                                  </span>
                                </div>
                              </Link>
                            }
                          </div>

                          <div className="hidden items-center space-x-2 text-[13px]">
                            <span className="text-[#586577] font-medium">
                              {ucmatch.teama.short_name}
                            </span>
                            <span className="flex font-semibold items-center bg-[#00a632] border-[1px] border-[#00a632] rounded-md text-[#ffffff] pr-2">
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
                            <span className="flex font-semibold items-center bg-[#ea2323] border-[1px] border-[#ea2323] rounded-md text-[#ffffff] pr-2">
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

          <div className="lg:col-span-4 md:col-span-5 md:-mt-4">


            <WeeklySlider />
            <div className="sticky top-[82px]">
              <FantasyTips />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

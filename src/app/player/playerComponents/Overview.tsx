"use client"

import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { format } from "date-fns";
import { getAgeDetails } from "@/utils/timerUtils";
import { urlStringEncode } from "@/utils/utility";

import PlayerImage from "@/app/components/PlayerImage";
import PlayerNews from "@/app/components/PlayerNews";
import FantasyTips from "@/app/components/FantasyTips";
import WeeklySlider from "@/app/components/WeeklySlider";
import ReadMoreCard from "@/app/components/ReadMoreCard";


interface Overview {
  playerAdvanceStats: any | null;
  playerStats: any | null;
  urlString: string;
  ranking: any | null;
  playerProfile: any | null;
}


export default function Overview({ playerAdvanceStats, playerStats, urlString, ranking, playerProfile }: Overview) {

  const profile = playerStats?.player;
  const playerBatting = playerStats?.batting ?? {};
  const playerBowling = playerStats?.bowling ?? {};
  const last10Match = playerAdvanceStats?.last10_matches ?? {};
  const teamsPlayedFor = playerAdvanceStats?.teams_played_for ?? [];
  const playerDebutData = playerAdvanceStats?.player?.debut_data ?? {};
  // console.log(teamTitleShortName('Tigers XI vs Lions XI'));
  // Determine Player Role
  const playerRole =
    profile?.playing_role === "bat"
      ? "Batting"
      : profile?.playing_role === "bowl"
        ? "Bowler"
        : profile?.playing_role === "all"
          ? "All-Rounder"
          : "Unknown";

  // Player Rankings (Handles missing ranking data safely)
  let odiRank = "",
    testRank = "",
    t20Rank = "";
  const playerRank = ranking?.ranks ?? {};


  if (profile?.playing_role === "bat") {
    odiRank =
      playerRank?.batsmen?.odis?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    testRank =
      playerRank?.batsmen?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    t20Rank =
      playerRank?.batsmen?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
  } else if (profile?.playing_role === "bowl") {
    odiRank =
      playerRank?.bowlers?.odis?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    testRank =
      playerRank?.bowlers?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    t20Rank =
      playerRank?.bowlers?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
  } else if (profile?.playing_role === "all") {
    odiRank =
      playerRank?.["all-rounders"]?.odis?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    testRank =
      playerRank?.["all-rounders"]?.tests?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
    t20Rank =
      playerRank?.["all-rounders"]?.t20s?.find(
        (item: { pid: number }) => Number(item.pid) === profile?.pid
      )?.rating ?? "";
  }

  // Convert Batting/Bowling Stats to Array
  const battingArray = Object.keys(playerBatting)?.map((key) => ({
    formatType: key.toUpperCase(),
    ...playerBatting[key],
  }));

  const bowlingArray = Object.keys(playerBowling)?.map((key) => ({
    formatType: key.toUpperCase(),
    ...playerBowling[key],
  }));

  // Career Tab Handling
  const [careerTab, setCareerTab] = useState("cust-box-click-batting");

  const handleCareerTabClick = (tab: string) => {
    setCareerTab(tab);
  };

  // Top Player Tab Handling
  const [topTab, setTopTab] = useState("batsmen");

  const handleTopTabClick = (tab: string) => {
    setTopTab(tab);
  };

  // Last 10 Match Stats (Handles undefined data safely)
  const slides =
    last10Match?.batting?.map((match: any, index: number) => ({
      id: index,
      text: `${match.runs}(${match.balls})`,
      match: match.match_title,
    })) ?? [];

  const slidesBol =
    last10Match?.bowling?.map((match: any, index: number) => ({
      id: index,
      text: `${match.runs}-${match.wickets}(${match.overs})`,
      match: match.match_title,
    })) ?? [];

  // console.log("Bowling Stats:", battingArray);

  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleSlides = 3;
  const totalSlides = slides.length;

  const nextSlide = () => {
    if (currentIndex + visibleSlides < totalSlides) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const [selectedValue, setSelectedValue] = useState<string>("odi");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  let topPlayer = [];
  if (selectedValue === "odi") {
    topPlayer = ranking?.ranks?.[topTab]?.odis;
  } else if (selectedValue === "test") {
    topPlayer = ranking?.ranks?.[topTab]?.tests;
  } else if (selectedValue === "t20") {
    topPlayer = ranking?.ranks?.[topTab]?.t20s;
  }
  const newsUrl = playerProfile[0]?.newUrl;


  return (
    <section className="lg:w-[1000px] md:mx-auto mx-2">
      <div className="">



        <div id="tab-content">
          <div id="overview">
            <div className="md:grid grid-cols-12 gap-4">
              {/* Tabs */}
              <div className="lg:col-span-8 md:col-span-7">


                <div id="tabs" className="my-4">
                  <div className="flex text-[13px] space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                    <Link href={"/player/" + urlString}>
                      <button className="font-semibold uppercase py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md"
                      >
                        Overview
                      </button>
                    </Link>
                    <Link href={"/player/" + urlString + "/stats"}>
                      <button className="font-semibold uppercase py-2 px-3 whitespace-nowrap "
                      >
                        Stats
                      </button>
                    </Link>

                    <Link href={"/player/" + urlString + "/news"}>
                      <button
                        className="font-semibold uppercase py-2 px-3 whitespace-nowrap"
                      >
                        News
                      </button>
                    </Link>
                    {/* <Link href={"/player/" + urlString + "/photos"}>
              <button className="font-semibold uppercase py-2 px-3 whitespace-nowrap"
              >
                Photos
              </button>
            </Link> */}
                  </div>
                </div>


                <div className="md:hidden rounded-lg bg-white p-4 mb-4">
                  <h3 className="text-[15px] font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                    ICC Ranking
                  </h3>
                  <div className="border-t-[1px] border-[#E7F2F4]" />
                  <div className="grid md:grid-cols-1 grid-cols-1 gap-4 mt-4">
                    <div className="bg-[#f2f7ff] w-full  border-[1px] rounded-md">
                      <h6 className=" px-6 py-1 font-semibold rounded-t-md bg-[#c7dcff] text-[14px]">
                        {playerRole}
                      </h6>
                      <div className="flex font-semibold text-[#0F55A5] text-center px-6 justify-between space-x-4 my-2">
                        <p>
                          {testRank} <br /> <span className=""> TEST </span>
                        </p>
                        <div className="border-solid border-l-[1px] border-gray-400" />
                        <p>
                          {odiRank} <br /> <span className=""> ODI</span>
                        </p>
                        <div className="border-solid border-l-[1px] border-gray-400" />
                        <p>
                          {t20Rank} <br /> <span className=""> T20</span>
                        </p>
                      </div>
                    </div>
                    {/* <div className="bg-[#f2f7ff] w-full border-[1px] rounded-lg">
                      <h6 className="px-6 py-1 font-semibold rounded-t-md bg-[#c7dcff] text-[14px]">
                        Bowling
                      </h6>
                      <div className="flex px-6 font-semibold text-[#0F55A5] text-center justify-between space-x-4 mt-2">
                        <p>
                          154 <br /> <span className=""> TEST </span>
                        </p>
                        <div className="border-solid border-l-[1px] border-gray-400" />
                        <p>
                          328 <br /> <span className=""> ODI</span>
                        </p>
                        <div className="border-solid border-l-[1px] border-gray-400" />
                        <p>
                          799 <br /> <span className=""> T20</span>
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>


                <div className="flex justify-between items-center pb-2">

                  <h3 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                    Personal Information
                  </h3>

                </div>

                <div className="rounded-lg px-4 py-2 bg-[#ffffff]">


                  <div className="relative overflow-x-auto">
                    <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400 text-[13px]">
                      <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Full Name
                          </th>
                          <td className="px-6 py-2 text-[#2F335C] font-medium">
                            {profile?.first_name}
                          </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Date of Birth
                          </th>
                          <td className="px-6 py-2 text-[#2F335C] font-medium">
                            {profile?.birthdate !== undefined && profile?.birthdate !== '' ? format(new Date(profile?.birthdate), "dd MMM yyyy") : ""}
                          </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Age
                          </th>
                          <td className="px-6 py-2 text-[#2F335C] font-medium">
                            {profile?.birthdate !== undefined && profile?.birthdate !== '' ? getAgeDetails(profile?.birthdate) : ""}
                          </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Nationality
                          </th>
                          <td className="px-6 py-2 text-[#2F335C] font-medium">{profile?.nationality}</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Birth Place
                          </th>
                          <td className="px-6 py-2 text-[#2F335C] font-medium">
                            {profile?.birthplace}
                          </td>
                        </tr>

                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Role
                          </th>
                          <td className="px-6 py-2 text-[#2F335C] font-medium">{playerRole}</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Batting Style
                          </th>
                          <td className="px-6 py-2 text-[#2F335C] font-medium">
                            {profile?.batting_style}
                          </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Bowling Style
                          </th>
                          <td className="px-6 py-2 text-[#2F335C] font-medium">
                            {profile?.bowling_style}
                          </td>
                        </tr>
                        {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Debut
                          </th>
                          <td className="px-6 py-2 text-[#2F335C]">
                            March 13, 2010
                          </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Jersey No.
                          </th>
                          <td className="px-6 py-2 text-[#2F335C]">63</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                          >
                            Family
                          </th>
                          <td className="px-6 py-2 text-[#2F335C]">
                            Devisha Shetty (wife)
                          </td> 
                        </tr>*/}
                      </tbody>
                    </table>
                  </div>
                </div>


                <div className="cust-box-click-container">
                  <div className="flex justify-between items-center pt-4 pb-2">
                    <div id="careerstats">
                      <h3 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                        Career &amp; Stats
                      </h3>
                    </div>
                    <div>
                      <button
                        onClick={() => handleCareerTabClick('cust-box-click-batting')}
                        className={`cust-box-click-button font-medium px-5 py-1 ${careerTab === 'cust-box-click-batting' ? 'bg-[#081736] text-white' : ''} rounded-full`}
                      >
                        <span>Batting</span>
                      </button>
                      <button
                        onClick={() => handleCareerTabClick('cust-box-click-bowling')}
                        className={`cust-box-click-button font-medium px-5 py-1 ${careerTab === 'cust-box-click-bowling' ? 'bg-[#081736] text-white' : ''} rounded-full`}
                      >
                        <span>Bowling</span>
                      </button>
                    </div>
                  </div>
                  <div className={`cust-box-click-content cust-box-click-batting ${careerTab === 'cust-box-click-batting' ? "" : "hidden"}`}>
                    <div className="rounded-lg p-4 bg-[#ffffff]">
                      <div className="md:flex items-center justify-between">
                        <h3 className="text-[13px] font-semibold text-[#586577] mb-2">
                          {profile?.first_name} Recent Form
                        </h3>
                        <div className="text-right">
                          {/* <p className="text-[#1A80F8] font-semibold flex items-center text-[13px]">
                            Recent Form
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-3 ml-1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </p> */}
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[#E7F2F4]" />

                      <div className="cust-slider-container w-full overflow-hidden relative mt-4">
                        <div
                          className="cust-slider flex gap-4 transition-transform duration-500 ease-in-out"
                          style={{ transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)` }}
                        >
                          {slides?.map((slide: any) => (
                            <div key={slide.id} className="cust-slide md:w-1/4 w-1/3 flex-shrink-0 rounded-lg border-[1px] border-[#ebebeb]">
                              <div className="bg-white p-4 text-center rounded-lg">
                                <p className="text-1xl text-[#1A80F8] font-semibold mb-2">{slide.text}</p>
                                <p className="text-gray-500 font-medium text-[12px]">{slide.match}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="cust-slider-nav flex justify-between items-center">
                          {currentIndex > 0 && (
                            <button
                              onClick={prevSlide}
                              className="cust-prev-btn bg-[#ffffff] p-[7px] rounded-full border-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                            >
                              <span className="text-[20px] font-bold"> <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                              </svg></span>
                            </button>
                          )}
                          {currentIndex + visibleSlides < totalSlides && (
                            <button
                              onClick={nextSlide}
                              className="cust-next-btn bg-[#ffffff] p-[7px] rounded-full border-2 absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                            >
                              <span className="text-[20px] font-bold"><svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                              </svg></span>
                            </button>
                          )}
                        </div>
                      </div>


                      <h3 className="text-[13px] font-semibold text-[#586577] mt-4 mb-2">
                        {profile?.first_name} Career Stats
                      </h3>
                      <div className="border-t-[1px] border-[#E7F2F4]" />
                      <h3 className="text-[13px] font-semibold text-[#2c323b] mt-2 mb-1">Batting</h3>
                      <div>
                        <div
                          className="relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                                  [&::-webkit-scrollbar-track]:bg-gray-100 
                                  [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                        >
                          <table className="w-full text-[13px] text-left text-gray-500">
                            <thead className="border-b text-gray-700 bg-[#C3DBFF33]">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-3 bg-[#f3f8ff] font-semibold sticky left-0"
                                >
                                  Format
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Mat
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Inns
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Runs
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Avg
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  4s
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  6s
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  SR
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Not Out
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Balls
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Highest
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Fifty
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Century
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-xs">
                              {battingArray?.map((item, index) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                  <th
                                    scope="row"
                                    className="px-4 py-4 font-medium text-gray-900 bg-[#f3f8ff] whitespace-nowrap dark:text-white sticky left-0"
                                  >
                                    {item.formatType}
                                  </th>
                                  <td className="px-4 py-4">{item.matches}</td>
                                  <td className="px-4 py-4">{item.innings}</td>
                                  <td className="px-4 py-4">{item.runs}</td>
                                  <td className="px-4 py-4">{item.average}</td>
                                  <td className="px-4 py-4">{item.run4}</td>
                                  <td className="px-4 py-4">{item.run6}</td>
                                  <td className="px-4 py-4">{item.strike}</td>
                                  <td className="px-4 py-4">{item.notout}</td>
                                  <td className="px-4 py-4">{item.balls}</td>
                                  <td className="px-4 py-4">{item.highest}</td>
                                  <td className="px-4 py-4">{item.run50}</td>
                                  <td className="px-4 py-4">{item.run100}</td>
                                </tr>
                              ))}


                            </tbody>
                          </table>
                        </div>
                      </div>
                      <h3 className="text-[13px] font-semibold text-[#586577] mt-3 mb-1">Teams</h3>
                      <div className="mt-1">
                        <div className="grid md:grid-cols-5 grid-cols-2 gap-4">
                          {teamsPlayedFor?.map((teams: any, index: number) => (
                            <div className="col-span-1" key={index}>
                              <Link href={"/team/" + urlStringEncode(teams.abbr) + "/" + teams.tid}>
                                <div className="bg-white p-2 rounded-lg border-[1px] border-[#ebebeb] text-center mb-2">
                                  <div className="flex items-center justify-center">
                                    {teams.logo_url ? (
                                      <Image loading="lazy"
                                        src={teams.logo_url}
                                        width={42} height={42} alt={teams.alt_name}
                                        className="h-[42px] w-[42px] rounded-full"
                                      />
                                    ) : (
                                      "")}
                                  </div>
                                  <p className=" font-semibold text-[12px] pt-1">
                                    {teams.abbr}
                                  </p>
                                </div>
                              </Link>
                            </div>
                          ))}

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`cust-box-click-content cust-box-click-batting ${careerTab === 'cust-box-click-bowling' ? "" : "hidden"}`}>
                    <div className="rounded-lg p-6 bg-[#ffffff]">
                      <div className="md:flex items-center justify-between">
                        <h3 className="text-1xl font-medium mb-2">
                          {profile?.first_name} Recent Form
                        </h3>
                        <div className="text-right">
                          {/* <p className="text-[#1A80F8] font-semibold flex items-center text-[13px]">
                            Recent Form
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-3 ml-1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </p> */}
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[#E7F2F4]" />

                      <div className="cust-slider-container w-full overflow-hidden relative mt-4">
                        <div
                          className="cust-slider flex gap-4 transition-transform duration-500 ease-in-out"
                          style={{ transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)` }}
                        >
                          {slidesBol?.map((slide: any) => (
                            <div key={slide.id} className="cust-slide w-1/4 flex-shrink-0 rounded-lg border-[1px] border-[#ebebeb]">
                              <div className="bg-white p-4 text-center">
                                <p className="text-1xl text-[#1A80F8] font-semibold mb-2">{slide.text}</p>
                                <p className="text-gray-500 font-medium text-[12px]">{slide.match}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="cust-slider-nav flex justify-between items-center">
                          {currentIndex > 0 && (
                            <button
                              onClick={prevSlide}
                              className="cust-prev-btn bg-[#ffffff] p-[7px] rounded-full border-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                            >
                              <span className="text-[20px] font-bold"> <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                              </svg></span>
                            </button>
                          )}
                          {currentIndex + visibleSlides < totalSlides && (
                            <button
                              onClick={nextSlide}
                              className="cust-next-btn bg-[#ffffff] p-[7px] rounded-full border-2 absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                            >
                              <span className="text-[20px] font-bold"><svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                              </svg></span>
                            </button>
                          )}
                        </div>
                      </div>


                      <h3 className="text-1xl font-medium mt-4 mb-2">
                        {profile?.first_name} Career Stats
                      </h3>
                      <div className="border-t-[1px] border-[#E7F2F4]" />
                      <h3 className="text-[14px] font-normal mt-2 mb-1">Bowling</h3>
                      <div>
                        <div
                          className="relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                                  [&::-webkit-scrollbar-track]:bg-gray-100 
                                  [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                        >
                          <table className="w-full text-[13px] text-left text-gray-500">
                            <thead className="border-b text-gray-700 bg-[#C3DBFF33]">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-3 bg-[#C3DBFF33] font-semibold"
                                >
                                  Format
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Mat
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Inns
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Runs
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Avg
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Wicket4i
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Wicket5i
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  SR
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Econ
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Balls
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Wickets
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                  Overs
                                </th>

                              </tr>
                            </thead>
                            <tbody className="text-xs">
                              {bowlingArray?.map((item, index) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                  <th
                                    scope="row"
                                    className="px-4 py-4 font-medium text-gray-900 bg-[#C3DBFF33] whitespace-nowrap dark:text-white"
                                  >
                                    {item.formatType}
                                  </th>
                                  <td className="px-4 py-4">{item.matches}</td>
                                  <td className="px-4 py-4">{item.innings}</td>
                                  <td className="px-4 py-4">{item.runs}</td>
                                  <td className="px-4 py-4">{item.average}</td>
                                  <td className="px-4 py-4">{item.wicket4i}</td>
                                  <td className="px-4 py-4">{item.wicket5i}</td>
                                  <td className="px-4 py-4">{item.strike}</td>
                                  <td className="px-4 py-4">{item.econ}</td>
                                  <td className="px-4 py-4">{item.balls}</td>
                                  <td className="px-4 py-4">{item.wickets}</td>
                                  <td className="px-4 py-4">{item.overs}</td>
                                </tr>
                              ))}


                            </tbody>
                          </table>
                        </div>
                      </div>
                      <h3 className="text-[14px] font-normal mt-2 mb-1">Teams</h3>
                      <div className="mt-4">
                        <div className="grid md:grid-cols-5 grid-cols-2 gap-4">
                          {teamsPlayedFor?.map((teams: any, index: number) => (
                            <div className="col-span-1" key={index}>
                              <Link href={"/team/" + urlStringEncode(teams.abbr) + "/" + teams.tid}>
                                <div className="bg-white p-2 rounded-lg border-[1px] border-[#ebebeb] text-center mb-2">
                                  <div className="flex items-center justify-center">
                                    {teams.logo_url ? (
                                      <Image loading="lazy"
                                        src={teams.logo_url}
                                        width={20} height={20} alt={teams.alt_name}
                                        className="h-[30px] w-[30px] rounded-full"
                                      />
                                    ) : ("")}
                                  </div>
                                  <p className=" font-semibold text-[12px] pt-1">
                                    {teams.abbr}
                                  </p>
                                </div>
                              </Link>
                            </div>
                          ))}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>



                <div className="pt-4 mb-2">
                  <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
                    Debut &amp; Last Matches
                  </h3>
                </div>
                {playerDebutData.length > 0 &&
                  <div className=" rounded-lg p-4 bg-[#ffffff] mb-4">
                    <div className="relative overflow-x-auto mb-4">
                      <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <tbody>
                          {playerDebutData?.map((debut: any, index: number) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                              <th
                                scope="row"
                                className="px-6 py-2 text-[#586577] whitespace-nowrap dark:text-white font-normal"
                              >
                                {debut.format_str}
                              </th>
                              <td className="px-6 py-2 text-[#2F335C] font-medium">
                                <p className="text-[#217AF7]">
                                  {debut.match_title}, {format(new Date(debut.match_date), "dd MMM yyyy")}
                                </p>
                              </td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>
                    <div className="flex md:items-center items-end justify-between py-4">
                      <form action="" className="w-[50%] md:w-[auto]">
                        <div className="md:flex items-center md:space-x-2">
                          <p>Popular Players</p>
                          <div className="mt-2 md:mt-0">
                            {/* select opction */}
                            <select
                              className="border-[1px] border-border-gray-700 md:w-[154px] w-full py-1 px-2 rounded-md"
                              name="select"
                              id=""
                              value={selectedValue} onChange={handleChange}
                            >

                              <option value="odi">ODI</option>
                              <option value="test">Test</option>
                              <option value="t20">T20</option>
                            </select>
                          </div>
                        </div>
                      </form>
                      <div className='flex'>
                        <button
                          onClick={() => handleTopTabClick('batsmen')}
                          className={`cust-box-click-button font-medium md:px-5 px-4 py-1 ${topTab === 'batsmen' ? 'bg-[#081736] text-white' : ''} rounded-full`}
                        >
                          <span>Batsmen</span>
                        </button>
                        <button
                          onClick={() => handleTopTabClick('bowlers')}
                          className={`cust-box-click-button font-medium md:px-5 px-4 py-1 ${topTab === 'bowlers' ? 'bg-[#081736] text-white' : ''} rounded-full`}
                        >
                          <span>Bowlers</span>
                        </button>
                      </div>
                    </div>
                    <div className={`grid md:grid-cols-4 grid-cols-2 gap-4 `}>
                      {topPlayer?.slice(0, 4)?.map((players: any, index: number) => (
                        <div className="col-span-1 bg-white p-4 rounded-lg border-[1px] border-[#ebebeb] " key={index}>
                          <Link href={"/player/" + urlStringEncode(players?.player) + "/" + players?.pid}>
                            <div className="text-center">
                              <div className="flex justify-center mb-2">
                                <div className="relative">
                                  <PlayerImage player_id={players?.pid} height={47} width={47} className="w-[47px] h-[47px] mx-auto rounded-full mb-2" key={players?.pid} />

                                  <Image loading="lazy"
                                    src={topTab === 'bowlers' ? "/assets/img/player/ball.png" : "/assets/img/player/bat.png"}
                                    className="h-[24px] absolute right-[-12px] bottom-0 bg-white rounded-full p-[4px]"
                                    width={24} height={24} alt=""
                                  />

                                </div>
                              </div>
                              <p className="text-[14px] font-medium">{players?.player}</p>
                              <p className="text-gray-500 font-medium text-[12px]">
                                {topTab === 'bowlers' ? "Bowler" : "Batter"}
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}


                    </div>

                  </div>
                }
                <div className="rounded-lg bg-[#ffffff] p-4 mb-4 hidden">
                  <ReadMoreCard
                    title="India vs Zimbabwe 2025"
                    content="The biggest tournament in the cricketing circuit, the ICC T20
  WORLD Cup is underway in the USAs and the West Indies. The
  tournament received excellent response from the fans worldwide"
                    wordLimit={10} // 💥 Dynamic!
                  />
                </div>
                {newsUrl !== undefined && newsUrl !== null && newsUrl !== "" ?
                  <PlayerNews newsUrl={newsUrl}></PlayerNews> : ""
                }

                <div className="rounded-lg bg-[#ffffff] p-4 mb-4">

                  <ReadMoreCard
                    title="India vs Zimbabwe 2025"
                    content="The biggest tournament in the cricketing circuit, the ICC T20
  WORLD Cup is underway in the USAs and the West Indies. The
  tournament received excellent response from the fans worldwide"
                    wordLimit={10} // 💥 Dynamic!
                  />


                </div>


              </div>
              {/* Right Sidebar Section */}
              <div className="lg:col-span-4 md:col-span-5">
                <div className="">

                  <WeeklySlider />

                  <FantasyTips />




                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
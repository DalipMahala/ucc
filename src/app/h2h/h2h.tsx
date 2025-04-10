"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import WeeklySlider from "@/app/components/WeeklySlider";
import Image from "next/image";
import { format } from "date-fns";
import { urlStringEncode } from "@/utils/utility";
import NewsSection from "./NewsSection";
import PLSeries from "@/app/components/popularSeries";
import FantasyTips from "@/app/components/FantasyTips";

interface H2h {
    featuredMatch: any | null;
    teamDetails: any | null;
    teamADetails: any | null;
    teamBDetails: any | null;
}
export default function H2h({featuredMatch,teamDetails,teamADetails,teamBDetails}:H2h) {

const teamaWon = (teamDetails?.teama_won_match * teamDetails?.teamAB_total_match)/100;
const teambWon = (teamDetails?.teamb_won_match * teamDetails?.teamAB_total_match)/100;
const teamaLoss = (teamDetails?.teama_lost_match * teamDetails?.teamAB_total_match)/100;
const teambLoss = (teamDetails?.teamb_lost_match * teamDetails?.teamAB_total_match)/100;
  const [activeTab, setActiveTab] = useState("test");
  const [show, setShow] = useState(false);

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const showHandler = () => {
    setShow(true);
  };


  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("https://uccricket.live/wp-json/wp/v2/posts?_embed&&categories=21")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  return (
    <><section className="bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3">
              <div className="border-t-[1px] border-[#E4E9F01A]">
                  <div className="lg:w-[1000px] mx-auto md:py-8 tracking-[1px]">
                      <div className="flex py-8 justify-between items-center">
                          <div className="flex flex-col md:flex-row text-[#FF912C] font-bold uppercase  md:items-center items-start ">
                              <Image  loading="lazy" 
                                  className="md:h-[42px] md:w-[42px] h-[30px] w-[30px]"
                                  src={teamADetails?.logo_url}
                                  width={20}
                                  height={20}
                                  alt="ind" />
                              <p className="text-[#BDCCECA8] md:mx-3 mx-0 md:text-[19px] text-[14px] font-semibold uppercase">
                                  {teamADetails?.abbr}
                              </p>
                          </div>
                          <div className="text-[#8192B4] font-normal  text-center">
                              <p className="text-[#FFBD71] md:text-[20px] text-[16px] font-semibold">
                              {teamADetails?.abbr} vs {teamBDetails?.abbr} Head to Head in Test
                              </p>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center items-end text-[#8192B4] font-normal justify-end">
                              <p className="text-[#BDCCECA8] md:block hidden md:text-[19px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                              {teamBDetails?.abbr}
                              </p>
                              <Image  loading="lazy" 
                                  src={teamBDetails?.logo_url}
                                  className="md:h-[42px] md:w-[42px] h-[30px] w-[30px]"
                                  width={20}
                                  height={20}
                                  alt="ban" />
                              <p className="text-[#BDCCECA8] md:hidden md:text-[19px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                              {teamBDetails?.abbr}
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </section><section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
              <div id="tabs" className="my-4">
                  <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                      <button
                          onClick={() => handleTabClick("test")}
                          className={`font-medium py-2 px-5 whitespace-nowrap ${activeTab === "test" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                      >
                          Test
                      </button>
                      <button
                          onClick={() => handleTabClick("odi")}
                          className={`font-medium py-2 px-5 whitespace-nowrap ${activeTab === "odi" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                      >
                          ODI
                      </button>
                      <button
                          onClick={() => handleTabClick("t20")}
                          className={`font-medium py-2 px-5 whitespace-nowrap ${activeTab === "t20" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                      >
                          T20
                      </button>
                      <button
                          onClick={() => handleTabClick("t20wc")}
                          className={`font-medium py-2 px-5 whitespace-nowrap ${activeTab === "t20wc" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                      >
                          T20 WC
                      </button>
                  </div>
              </div>
              <div id="tab-content">
                  <div
                      id="test"
                      // className="tab-content"
                      className={`tab-content ${activeTab === "test" ? "" : "hidden"}`}
                  >
                      <div className="md:grid grid-cols-12 gap-4">
                          <div className="lg:col-span-8 md:col-span-7">
                              <div className="rounded-lg bg-[#ffffff] p-4">
                                  <h3 className="text-[15px] font-semibold pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                                      India vs Bangladesh Head to Head in Test Records
                                  </h3>
                                  <div className="border-t-[1px] border-[#E4E9F0]" />
                                  {/* Main Section */}
                                  <div className="mt-4">
                                      <div className="mb-6">
                                          <p className="text-gray-700">
                                              India and South Africa have faced each other in 94
                                              matches in ODI. Out of these 94 games, India have won 40
                                              whereas South Africa have come out victorious on 51
                                              occasions. 3 matches ended without a result.
                                          </p>
                                      </div>
                                      {/* Dropdowns and Matches */}
                                      <div className="flex flex-col gap-2 md:gap-0 sm:flex-row justify-between items-center mb-4">
                                          {/* First Dropdown */}
                                          <div className="w-full relative">
                                              <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                                                  <span id="selected1" className="flex items-center">
                                                      <Image  loading="lazy" 
                                                          src={teamADetails?.logo_url}
                                                          width={30}
                                                          height={30}
                                                          alt="India"
                                                          className="h-[16px] mr-2" />{" "}
                                                      {teamADetails?.title}
                                                  </span>
                                              </div>
                                          </div>
                                          {/* Center Text */}
                                          <div className="text-center font-bold md:text-1xl">
                                              VS
                                          </div>
                                          {/* Second Dropdown */}
                                          <div className="w-full text-right">
                                              <div className="relative flex justify-end">
                                                  <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                                                      <span id="selected2" className="flex items-center">
                                                          <Image  loading="lazy" 
                                                              src={teamBDetails?.logo_url}
                                                              width={30}
                                                              height={30}
                                                              alt="Bangladesh"
                                                              className="h-[16px] mr-2" />{" "}
                                                          {teamADetails?.title}
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="flex justify-center text-center">
                                          <div className="border-[1px] border-[#E4E9F0] p-2 rounded-md font-semibold text-1xl">
                                              <p>{teamDetails?.teamAB_total_match}</p>
                                              <p>Mactches</p>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: teamaWon+"%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_won_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_won_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: teambWon+"%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#B7132B] h-2"
                                                          style={{ width: teamaLoss+"%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_lost_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Lost</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_lost_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#B7132B] h-2"
                                                          style={{ width: teambLoss+"%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_nr_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">No Result</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_nr_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_tied_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Tied</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_tied_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_home_won_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Home Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_home_won_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_away_won_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Away Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_away_won_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>{teamDetails?.teama_neutral_won_match}</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Neutral Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>{teamDetails?.teamb_neutral_won_match}</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className=" bg-[white] p-4 rounded-lg my-4">
                                  <div className="md:flex justify-between items-center mb-3">
                                      <h3 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                                          India Vs bangladesh Recent T20 Matches
                                      </h3>
                                  </div>
                                  <div className="grid grid-cols-12 gap-4 cust-tp-pera-card-section">
                                      <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                          <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                              <div className="flex justify-between items-center pb-1">
                                                  <div>
                                                      <h2 className="text-1xl font-semibold">Match 29</h2>
                                                      <p className="text-[#7B4C09] font-medium">
                                                          Tue, 19 Oct - 09:30 AM
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="flex items-center justify-between py-3">
                                                  <a href="#">
                                                      <div className="flex space-x-2 ">
                                                          <div className="flex items-center space-x-1 flex-col">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-8.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="wiw" />
                                                              <span className="text-[#909090]">IND</span>
                                                          </div>
                                                          <div className="mt-1">
                                                              <p className="text-1xl font-semibold">120/8</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                      </div>
                                                  </a>
                                                  <div className="text-gray-500 text-2xl font-semibold">
                                                      ↔
                                                  </div>
                                                  <a href="#">
                                                      <div className="flex space-x-2 justify-end">
                                                          <div className="mt-1 text-end">
                                                              <p className="text-1xl font-semibold">128/9</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                          <div className="flex items-center space-x-1 flex-col font-medium">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-10.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="nz" />
                                                              <span className="text-[#909090]">BAN</span>
                                                          </div>
                                                      </div>
                                                  </a>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="text-center mt-3">
                                                  <a href="#">
                                                      <p className="text-green-600 font-semibold">
                                                          IND won by 7 Wicket
                                                      </p>
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                          <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                              <div className="flex justify-between items-center pb-1">
                                                  <div>
                                                      <h2 className="text-1xl font-semibold">Match 29</h2>
                                                      <p className="text-[#7B4C09] font-medium">
                                                          Tue, 19 Oct - 09:30 AM
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="flex items-center justify-between py-3">
                                                  <a href="#">
                                                      <div className="flex space-x-2 ">
                                                          <div className="flex items-center space-x-1 flex-col">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-8.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="wiw" />
                                                              <span className="text-[#909090]">IND</span>
                                                          </div>
                                                          <div className="mt-1">
                                                              <p className="text-1xl font-semibold">120/8</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                      </div>
                                                  </a>
                                                  <div className="text-gray-500 text-2xl font-semibold">
                                                      ↔
                                                  </div>
                                                  <a href="#">
                                                      <div className="flex space-x-2 justify-end">
                                                          <div className="mt-1 text-end">
                                                              <p className="text-1xl font-semibold">128/9</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                          <div className="flex items-center space-x-1 flex-col font-medium">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-10.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="nz" />
                                                              <span className="text-[#909090]">BAN</span>
                                                          </div>
                                                      </div>
                                                  </a>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="text-center mt-3">
                                                  <a href="#">
                                                      <p className="text-green-600 font-semibold">
                                                          IND won by 7 Wicket
                                                      </p>
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                          <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                              <div className="flex justify-between items-center pb-1">
                                                  <div>
                                                      <h2 className="text-1xl font-semibold">Match 29</h2>
                                                      <p className="text-[#7B4C09] font-medium">
                                                          Tue, 19 Oct - 09:30 AM
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="flex items-center justify-between py-3">
                                                  <a href="#">
                                                      <div className="flex space-x-2 ">
                                                          <div className="flex items-center space-x-1 flex-col">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-8.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="wiw" />
                                                              <span className="text-[#909090]">IND</span>
                                                          </div>
                                                          <div className="mt-1">
                                                              <p className="text-1xl font-semibold">120/8</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                      </div>
                                                  </a>
                                                  <div className="text-gray-500 text-2xl font-semibold">
                                                      ↔
                                                  </div>
                                                  <a href="#">
                                                      <div className="flex space-x-2 justify-end">
                                                          <div className="mt-1 text-end">
                                                              <p className="text-1xl font-semibold">128/9</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                          <div className="flex items-center space-x-1 flex-col font-medium">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-10.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="nz" />
                                                              <span className="text-[#909090]">BAN</span>
                                                          </div>
                                                      </div>
                                                  </a>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="text-center mt-3">
                                                  <a href="#">
                                                      <p className="text-green-600 font-semibold">
                                                          IND won by 7 Wicket
                                                      </p>
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                          <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                              <div className="flex justify-between items-center pb-1">
                                                  <div>
                                                      <h2 className="text-1xl font-semibold">Match 29</h2>
                                                      <p className="text-[#7B4C09] font-medium">
                                                          Tue, 19 Oct - 09:30 AM
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="flex items-center justify-between py-3">
                                                  <a href="#">
                                                      <div className="flex space-x-2 ">
                                                          <div className="flex items-center space-x-1 flex-col">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-8.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="wiw" />
                                                              <span className="text-[#909090]">IND</span>
                                                          </div>
                                                          <div className="mt-1">
                                                              <p className="text-1xl font-semibold">120/8</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                      </div>
                                                  </a>
                                                  <div className="text-gray-500 text-2xl font-semibold">
                                                      ↔
                                                  </div>
                                                  <a href="#">
                                                      <div className="flex space-x-2 justify-end">
                                                          <div className="mt-1 text-end">
                                                              <p className="text-1xl font-semibold">128/9</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                          <div className="flex items-center space-x-1 flex-col font-medium">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-10.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="nz" />
                                                              <span className="text-[#909090]">BAN</span>
                                                          </div>
                                                      </div>
                                                  </a>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="text-center mt-3">
                                                  <a href="#">
                                                      <p className="text-green-600 font-semibold">
                                                          IND won by 7 Wicket
                                                      </p>
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                      {show && (
                                          <>
                                              <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                                  <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                                      <div className="flex justify-between items-center pb-1">
                                                          <div>
                                                              <h2 className="text-1xl font-semibold">
                                                                  Match 29
                                                              </h2>
                                                              <p className="text-[#7B4C09] font-medium">
                                                                  Tue, 19 Oct - 09:30 AM
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="flex items-center justify-between py-3">
                                                          <a href="#">
                                                              <div className="flex space-x-2 ">
                                                                  <div className="flex items-center space-x-1 flex-col">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-8.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="wiw" />
                                                                      <span className="text-[#909090]">IND</span>
                                                                  </div>
                                                                  <div className="mt-1">
                                                                      <p className="text-1xl font-semibold">
                                                                          120/8
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                          <div className="text-gray-500 text-2xl font-semibold">
                                                              ↔
                                                          </div>
                                                          <a href="#">
                                                              <div className="flex space-x-2 justify-end">
                                                                  <div className="mt-1 text-end">
                                                                      <p className="text-1xl font-semibold">
                                                                          128/9
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                                  <div className="flex items-center space-x-1 flex-col font-medium">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-10.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="nz" />
                                                                      <span className="text-[#909090]">BAN</span>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="text-center mt-3">
                                                          <a href="#">
                                                              <p className="text-green-600 font-semibold">
                                                                  IND won by 7 Wicket
                                                              </p>
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                                  <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                                      <div className="flex justify-between items-center pb-1">
                                                          <div>
                                                              <h2 className="text-1xl font-semibold">
                                                                  Match 29
                                                              </h2>
                                                              <p className="text-[#7B4C09] font-medium">
                                                                  Tue, 19 Oct - 09:30 AM
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="flex items-center justify-between py-3">
                                                          <a href="#">
                                                              <div className="flex space-x-2 ">
                                                                  <div className="flex items-center space-x-1 flex-col">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-8.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="wiw" />
                                                                      <span className="text-[#909090]">IND</span>
                                                                  </div>
                                                                  <div className="mt-1">
                                                                      <p className="text-1xl font-semibold">
                                                                          120/8
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                          <div className="text-gray-500 text-2xl font-semibold">
                                                              ↔
                                                          </div>
                                                          <a href="#">
                                                              <div className="flex space-x-2 justify-end">
                                                                  <div className="mt-1 text-end">
                                                                      <p className="text-1xl font-semibold">
                                                                          128/9
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                                  <div className="flex items-center space-x-1 flex-col font-medium">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-10.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="nz" />
                                                                      <span className="text-[#909090]">BAN</span>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="text-center mt-3">
                                                          <a href="#">
                                                              <p className="text-green-600 font-semibold">
                                                                  IND won by 7 Wicket
                                                              </p>
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                                  <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                                      <div className="flex justify-between items-center pb-1">
                                                          <div>
                                                              <h2 className="text-1xl font-semibold">
                                                                  Match 29
                                                              </h2>
                                                              <p className="text-[#7B4C09] font-medium">
                                                                  Tue, 19 Oct - 09:30 AM
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="flex items-center justify-between py-3">
                                                          <a href="#">
                                                              <div className="flex space-x-2 ">
                                                                  <div className="flex items-center space-x-1 flex-col">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-8.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="wiw" />
                                                                      <span className="text-[#909090]">IND</span>
                                                                  </div>
                                                                  <div className="mt-1">
                                                                      <p className="text-1xl font-semibold">
                                                                          120/8
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                          <div className="text-gray-500 text-2xl font-semibold">
                                                              ↔
                                                          </div>
                                                          <a href="#">
                                                              <div className="flex space-x-2 justify-end">
                                                                  <div className="mt-1 text-end">
                                                                      <p className="text-1xl font-semibold">
                                                                          128/9
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                                  <div className="flex items-center space-x-1 flex-col font-medium">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-10.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="nz" />
                                                                      <span className="text-[#909090]">BAN</span>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="text-center mt-3">
                                                          <a href="#">
                                                              <p className="text-green-600 font-semibold">
                                                                  IND won by 7 Wicket
                                                              </p>
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                                  <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                                      <div className="flex justify-between items-center pb-1">
                                                          <div>
                                                              <h2 className="text-1xl font-semibold">
                                                                  Match 29
                                                              </h2>
                                                              <p className="text-[#7B4C09] font-medium">
                                                                  Tue, 19 Oct - 09:30 AM
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="flex items-center justify-between py-3">
                                                          <a href="#">
                                                              <div className="flex space-x-2 ">
                                                                  <div className="flex items-center space-x-1 flex-col">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-8.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="wiw" />
                                                                      <span className="text-[#909090]">IND</span>
                                                                  </div>
                                                                  <div className="mt-1">
                                                                      <p className="text-1xl font-semibold">
                                                                          120/8
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                          <div className="text-gray-500 text-2xl font-semibold">
                                                              ↔
                                                          </div>
                                                          <a href="#">
                                                              <div className="flex space-x-2 justify-end">
                                                                  <div className="mt-1 text-end">
                                                                      <p className="text-1xl font-semibold">
                                                                          128/9
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                                  <div className="flex items-center space-x-1 flex-col font-medium">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-10.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="nz" />
                                                                      <span className="text-[#909090]">BAN</span>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="text-center mt-3">
                                                          <a href="#">
                                                              <p className="text-green-600 font-semibold">
                                                                  IND won by 7 Wicket
                                                              </p>
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                          </>
                                      )}
                                      {!show && (
                                          <div className="col-span-12 text-center flex justify-center">
                                              <button
                                                  className="cust-tp-pera-load-more text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-2 underline"
                                                  onClick={() => showHandler()}
                                              >
                                                  Load More{" "}
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
                                                          d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                                  </svg>
                                              </button>
                                          </div>
                                      )}
                                  </div>
                              </div>
                              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                                  <h3 className="text-1xl font-semibold mb-1">
                                  {teamADetails?.title} vs {teamBDetails?.title} 2025
                                  </h3>
                                  <p className="text-gray-500 font-normal">
                                      The biggest tournament in the cricketing circuit, the ICC
                                      T20 WORLD Cup is underway in the USAs and the West Indies.
                                      The tournament received excellent response from the fans
                                      worldwide...
                                  </p>
                                  <a href="#">
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
                                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                          </svg>
                                      </p>
                                  </a>
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
                              <div className="bg-white rounded-lg p-4 mb-4">
                                  <div className="flex gap-1 items-center justify-between">
                                      <div className="flex gap-1 items-center">
                                          <div className="col-span-4 relative">
                                              <Image  loading="lazy" 
                                                  src="/assets/img/home/trofi.png"
                                                  className="h-[75px]"
                                                  alt=""
                                                  width={75}
                                                  height={75} />
                                          </div>
                                          <div className="col-span-8 relative">
                                              <h3 className="font-semibold text-[19px] mb-1">
                                                  Weekly challenge
                                              </h3>
                                              <p className="font-semibold text-[13px] text-[#1a80f8]">
                                                  <span className="text-[#586577]">Time Left:</span>2
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
                                                  d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                          </svg>
                                      </div>
                                  </div>
                              </div>
                              <WeeklySlider featuredMatch={featuredMatch}/>
                              <PLSeries />
                              <FantasyTips />
                          </div>
                      </div>
                  </div>
                  <div
                      id="odi"
                      className={`tab-content ${activeTab === "odi" ? "" : "hidden"}`}
                  >
                      cvxhgchzx22
                  </div>
                  <div
                      id="t20"
                      className={`tab-content ${activeTab === "t20" ? "" : "hidden"}`}
                  >
                      cvxhgchzx965
                  </div>
                  <div
                      id="t20wc"
                      className={`tab-content ${activeTab === "t20wc" ? "" : "hidden"}`}
                  >
                      cvxhgchzx95
                  </div>
              </div>
          </section></>
    
  );
}

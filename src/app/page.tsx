
export const dynamic = "force-dynamic";
import Layout from "./components/Layout";
import WeeklySlider from "./components/WeeklySlider";
import CardSlider from "./components/CardSlider";
import Link from "next/link";
import ChatComponent from "./components/websocket";
import Image from "next/image";
import {truncateText} from "@/utils/utility";
import { notFound } from "next/navigation";
import TabButtons from "./components/buttonclick";
import { urlStringEncode } from "../utils/utility";
import { format, isSameDay } from "date-fns";
import CountdownTimer from "./components/countdownTimer";
import { Ranking } from "@/controller/playerController";
import News from "@/app/components/News";
import FeatureSeries from "@/app/components/FeatureSeries";
import {
  liveSeries, GetCountryCompitition, FeaturedMatch, FeaturedSeries
} from "@/controller/homeController";
import type { Metadata } from "next";
import CountriesList from "./components/CountriesList";
import PLSeries from "./components/popularSeries";
import PlayerImage from "@/app/components/PlayerImage";
import React from "react";

export const metadata: Metadata = {
  title: "UC Cricket - Live Scores, IPL 2025, T20, ODI, Test News &amp; Stats",
  description: "Stay updated with UC Cricket live cricket scores, match schedules, news, stats, and videos on UcCricket.live. Follow all the action from IPL, T20 World Cup, and your favorite cricket tournaments.",
  robots: "nofollow, noindex",
  alternates: {
    canonical: "https://uccricket.live/",
  },
};

interface MatchItem {
  game_state_str: string;
  man_of_the_match: any;
  live_odds: any;
  man_of_the_match_pname: string;
  match_number: string;
  commentary: number;
  live: string;
  match_id: number;
  status_str: string;
  competition: {
    total_teams: number;
    cid: string;
    title: string;
    season: string;
  };
  teama: {
    short_name: string;
    logo_url: string;
    scores?: string;
    overs?: string;
    team_id?: string;
  };
  teamb: {
    short_name: string;
    logo_url: string;
    scores?: string;
    overs?: string;
    team_id?: string;
  };
  subtitle: string;
  format_str: string;
  venue: {
    name: string;
    location: string;
  };
  status_note: string;
  result: string;
  date_start_ist: string;
  match_info: any;
}

function updateStatusNoteDirect(matchInfo: any) {
  if (!matchInfo?.status_note) return;
  
  return matchInfo.status_note = matchInfo.status_note
    .replace(new RegExp(matchInfo.teama.name, 'gi'), matchInfo.teama.short_name)
    .replace(new RegExp(matchInfo.teamb.name, 'gi'), matchInfo.teamb.short_name);
}

type Params = Promise<{ matchType: string }>;

export default async function Home(props: { params: Params }) {
  // const { matchType } = await params;
  const params = await props.params;
  const matchType = params.matchType;
  if (matchType && !["live", "upcoming", "result"].includes(matchType)) {
    notFound();
  }
  
  const open = null;
  let activeTabValue = "";


  if (matchType === "live") {
    activeTabValue = "live1";
  } else if (matchType === "upcoming") {
    activeTabValue = "scorecard1";
  } else if (matchType === "result") {
    activeTabValue = "finished1";
  } else {
    activeTabValue = "info1";
  }


  const activeMainTab = activeTabValue;
  // console.log("open", activeMainTab);
  // let completedMatch: MatchItem[] = await completedMatches();
  let completedresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/completedMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let completedmatchArray = await completedresponse.json();

  const completedfilteredMatches = completedmatchArray?.data?.map(({ match_info, ...rest }: MatchItem) => ({
    ...match_info,
    ...rest
  }));
  let completedMatch: MatchItem[] = completedfilteredMatches;
  // console.log(completedMatch);
  // let upcomingMatch: MatchItem[] = await upcomingMatches();
  let upcomingresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/upcomingMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let upcomingmatchArray = await upcomingresponse.json();

  const upcomingfilteredMatches = upcomingmatchArray?.data?.map(({ match_info, ...rest }: MatchItem) => ({
    ...match_info,
    ...rest
  }));
  let upcomingMatch: MatchItem[] = upcomingfilteredMatches;
  // let liveMatch: MatchItem[] = await liveMatches();
  let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/liveMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let livematchArray = await response.json();

  const filteredMatches = livematchArray?.data?.map(({ match_info, ...rest }: MatchItem) => ({
    ...match_info,
    ...rest
  }));
  let liveMatch: MatchItem[] = filteredMatches;
  // let featuredMatch: MatchItem[] = await FeaturedMatch();
  let frresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/featuredMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let featuredmatchArray = await frresponse.json();
  
  const futuredMatches = featuredmatchArray?.data?.map(({ match_info, ...rest }:MatchItem) => ({
    ...match_info,
    ...rest
  }));
  const featuredMatch = futuredMatches;
  // console.log("liveMatch",completedMatch);
  completedMatch = completedMatch?.filter((item: { commentary: number }) => Number(item.commentary) === 1);
  upcomingMatch = upcomingMatch?.filter((item: { commentary: number }) => Number(item.commentary) === 1);
  liveMatch = liveMatch?.filter((item: { commentary: number }) => Number(item.commentary) === 1);
  // liveMatch = [...liveMatch].sort((a, b) => ({'Toss':1,'Play Ongoing':2}[a.game_state_str]||3 - ({'Toss':1,'Play Ongoing':2}[b.game_state_str]||3));
  liveMatch = liveMatch && liveMatch.sort((a, b) => ({ Toss: 1, 'Play Ongoing': 2 }[a.game_state_str] || 3) - ({ Toss: 1, 'Play Ongoing': 2 }[b.game_state_str] || 3));

  const liveSeriesData = await liveSeries();
  const ranking = await Ranking();
  const featuredSeries = await FeaturedSeries();
  // const  matchData = ChatComponent();
   const countryCompitition = await GetCountryCompitition();

  
  return (
    <Layout headerData={liveSeriesData}>
      <ChatComponent></ChatComponent>
      <TabButtons></TabButtons>
      <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
        <div className="mt-2 mb-2 hidden">
          <Image
            src="/assets/img/home.png"
            className="w-[100%]"
            alt=""
            width={1000}
            height={50}
            loading="lazy"
          />
        </div>
        

        <div className="md:grid grid-cols-12 gap-4">
          <div className="lg:col-span-8 md:col-span-7">
            <div className="tab-section">
              <div className="md:relative sticky md:top-0 top-[50px] z-[9] tabs ml-[-8px] w-[104.2%] md:ml-[0] md:w-auto mb-3 md:my-4">
                <div
                  className="flex justify-between md:justify-start text-[13px] md:space-x-8 space-x-4 md:p-2 pt-[2px] pb-2 px-2 md:bg-[#ffffff] md:text-[#000000] text-[#ffffff] bg-[#081736] md:rounded-lg overflow-auto relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
                              [&::-webkit-scrollbar-track]:bg-gray-100 
                              [&::-webkit-scrollbar-thumb]:bg-[#DFE9F6] 
                               dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
                                 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                >

                  <button id="all-tab"
                    className={`font-semibold py-2 md:px-5 px-4 whitespace-nowrap uppercase ${activeMainTab === "info1"
                      ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                      : ""
                      } md:rounded-md`}
                  >
                    All
                  </button>

                  <button id="live-tab"
                    className={`font-semibold py-2 md:px-5 px-4  whitespace-nowrap uppercase ${activeMainTab === "live1"
                      ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                      : ""
                      } md:rounded-md`}
                  >
                    Live
                  </button>

                  <button id="completed-tab"
                    className={`font-semibold py-2 md:px-5 px-4 whitespace-nowrap uppercase ${activeMainTab === "finished1"
                      ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                      : ""
                      } md:rounded-md`}
                  >
                    Finished
                  </button>

                  <button id="upcoming-tab"
                    className={`font-semibold py-2 md:px-5 px-4 whitespace-nowrap uppercase ${activeMainTab === "scorecard1"
                      ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                      : ""
                      } md:rounded-md`}
                  >
                    Scheduled
                  </button>

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
                    {liveMatch?.map((items) => (
                      <div key={items.match_id}>
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
                                      fill="#a70b0b"
                                      stroke="none"
                                      cx="4"
                                      cy="4"
                                      r="4"
                                    >
                                      {items.game_state_str === 'Play Ongoing' &&
                                        <animate
                                          attributeName="opacity"
                                          dur="1s"
                                          values="0;1;0"
                                          repeatCount="indefinite"
                                          begin="0.1"
                                        />
                                      }
                                    </circle>
                                  </svg>
                                </span>{" "}
                                {items?.game_state_str === 'Play Ongoing' ? items?.status_str : items?.game_state_str}
                              </div>
                              <div>
                                <h4 className="text-[13px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                                  {items.competition.title} -{" "}
                                  {items.competition.season}
                                </h4>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={"text-[11px] font-medium oddsTeam" + items.match_id}>
                                {items?.[parseFloat(items?.live_odds?.matchodds?.teama?.back) < parseFloat(items?.live_odds?.matchodds?.teamb?.back) ? 'teama' : 'teamb'].short_name}
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
                                  {
                                    (parseFloat(items?.live_odds?.matchodds?.teama?.back) < parseFloat(items?.live_odds?.matchodds?.teamb?.back)
                                      ? items?.live_odds?.matchodds?.teama?.back
                                      : items?.live_odds?.matchodds?.teamb?.back) > 0
                                      ? Math.round((parseFloat(items?.live_odds?.matchodds?.teama?.back) < parseFloat(items?.live_odds?.matchodds?.teamb?.back)
                                        ? items?.live_odds?.matchodds?.teama?.back
                                        : items?.live_odds?.matchodds?.teamb?.back) * 100 - 100)
                                      : 0
                                  }
                                  {/* {items?.live_odds?.matchodds?.teama?.back > 0  ? Math.round((items?.live_odds?.matchodds?.teama?.back)*100-100) : 0} */}
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
                                  {
                                    (parseFloat(items?.live_odds?.matchodds?.teama?.lay) < parseFloat(items?.live_odds?.matchodds?.teamb?.lay)
                                      ? items?.live_odds?.matchodds?.teama?.lay
                                      : items?.live_odds?.matchodds?.teamb?.lay) > 0
                                      ? Math.round((parseFloat(items?.live_odds?.matchodds?.teama?.lay) < parseFloat(items?.live_odds?.matchodds?.teamb?.lay)
                                        ? items?.live_odds?.matchodds?.teama?.lay
                                        : items?.live_odds?.matchodds?.teamb?.lay) * 100 - 100)
                                      : 0
                                  }
                                  {/* {items?.live_odds?.matchodds?.teama?.lay > 0 ? Math.round((items?.live_odds?.matchodds?.teama?.lay)*100-100) : 0} */}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>

                          <div className="py-3 px-3">
                            <Link href={"/live-score/" + urlStringEncode(items?.teama?.short_name + "-vs-" + items?.teamb?.short_name + "-match-" + items?.match_number + "-" + items?.competition?.title + "-" + items?.competition?.season) + "/" + items.match_id}>
                              <div className="flex justify-between items-center text-[14px]">
                                <div className="">
                                  <p className="text-[#586577] text-[13px] mb-4 font-medium">
                                    {items.subtitle}, {items.format_str}, {items.venue.location}
                                  </p>
                                  <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image
                                        // src={items.teama.logo_url}
                                        src={`${items.teama.logo_url}?tr=f-webp`}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={items.teama.short_name}
                                        loading="lazy"
                                      />
                                      <span className="text-[#586577] font-medium text-[14px]">
                                        {items.teama.short_name} -{" "}
                                      </span>
                                    </div>
                                    <p
                                      className={
                                        "flex items-end gap-[4px] match" +
                                        items.match_id +
                                        "-" +
                                        items.teama.team_id
                                      }
                                    >
                                      {items.teama.scores === undefined ||
                                        items.teama.scores === null ||
                                        items.teama.scores === "" ? (
                                        <span className="text-[14px] font-medium text-[#586577]">
                                          {" "}
                                          (Yet to bat){" "}
                                        </span>
                                      ) : (
                                        <>
                                          <span className="font-medium text-[#586577]">
                                            {items.teama.scores}
                                          </span>
                                          <span className="text-[#586577] text-[12px]">
                                            {" "}
                                            ({items.teama.overs}){" "}
                                          </span>
                                        </>
                                      )}
                                    </p>
                                  </div>

                                  <div>
                                    <div className="flex items-center space-x-2 font-medium md:w-full">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${items.teamb.logo_url}?tr=f-webp`}
                                          className="h-[30px]"
                                          width={30}
                                          height={30}
                                          alt={items.teamb.short_name}
                                          loading="lazy"
                                        />
                                        <span className="text-[#586577] font-medium text-[14px]">
                                          {items.teamb.short_name} -
                                        </span>
                                      </div>
                                      <p
                                        className={
                                          "flex items-end  gap-[4px] match" +
                                          items.match_id +
                                          "-" +
                                          items.teamb.team_id
                                        }
                                      >
                                        {items.teamb.scores === undefined ||
                                          items.teamb.scores === null ||
                                          items.teamb.scores === "" ? (
                                          <span className="font-medium text-[14px] text-[#586577]">
                                            {" "}
                                            (Yet to bat){" "}
                                          </span>
                                        ) : (
                                          <>
                                            <span className="font-medium text-[14px] text-[#586577]">
                                              {items.teamb.scores}
                                            </span>
                                            <span className="text-[#586577] text-[12px]">
                                              {" "}
                                              ({items.teamb.overs}){" "}
                                            </span>
                                          </>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className=" font-semibold text-center">
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
                                   { updateStatusNoteDirect(items) }
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>

                          <div className="flex items-center justify-between space-x-5 mt-3">
                            <div className="flex items-center">
                              {items?.competition?.total_teams > 2 &&
                                <>
                                  <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items.competition?.cid + "/points-table"}>
                                    <p className=" text-[#586577] font-medium">
                                      {" "}
                                      Points Table
                                    </p>
                                  </Link>
                                  <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                </>
                              }
                              <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items?.competition?.cid + "/schedule-results/schedule"}>
                                <p className="text-[#586577] font-medium">
                                  Schedule
                                </p>
                              </Link>
                            </div>

                            <Link href="/h2h">
                              <div className="flex justify-end items-center space-x-2">
                                <Image
                                  src="/assets/img/home/handshake.png"
                                  style={{ width: "25px", height: "25px" }}
                                  width={25}
                                  height={25}
                                  alt=""
                                  loading="lazy"
                                />
                                <span className="text-[#586577] font-medium">
                                  H2H
                                </span>
                              </div>
                            </Link>
                          </div>
                        </div>

                        {/* mobile */}

                        <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative hover:shadow-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex gap-[2px] items-center text-[#ea2323] rounded-full font-semibold uppercase text-[12px]">
                                <span className="rounded-full">
                                  <svg className="h-[7px] w-[7px]">
                                    <circle
                                      fill="#ea2323"
                                      stroke="none"
                                      cx="3"
                                      cy="3"
                                      r="3"
                                    >
                                      {items.game_state_str === 'Play Ongoing' &&
                                        <animate
                                          attributeName="opacity"
                                          dur="1s"
                                          values="0;1;0"
                                          repeatCount="indefinite"
                                          begin="0.1"
                                        />
                                      }
                                    </circle>
                                  </svg>
                                </span>
                                {items.game_state_str === 'Play Ongoing' ? items.status_str : items.game_state_str}
                              </div>
                              <div>
                                <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                  {truncateText(items.competition.title,5)} -{" "}
                                  {items.competition.season}
                                </h4>
                              </div>
                              <span className="absolute right-4 top-[19px]">
                                <button className="arro-button">
                                  <Image
                                    src="/assets/img/arrow.png"
                                    className=""
                                    width={10}
                                    height={15}
                                    alt=""
                                    loading="lazy"
                                  />
                                </button>
                              </span>
                            </div>
                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>
                          <div className="open-Performance-data">
                            <Link href={"/live-score/" + urlStringEncode(items?.teama?.short_name + "-vs-" + items?.teamb?.short_name + "-match-" + items?.match_number + "-" + items?.competition?.title + "-" + items?.competition?.season) + "/" + items.match_id}>
                              <div className="py-2 pb-3">
                                <p className="text-[#586577] text-[13px] mb-4 font-normal">
                                  {items.subtitle}, {items.format_str}, {items.venue.location}
                                </p>
                                <div className="flex justify-between items-center text-[14px]">

                                  <div className="w-[82%]">
                                    <div className="items-center space-x-2 font-medium md:w-full mb-4">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${items.teama.logo_url}?tr=f-webp`}
                                          className="h-[30px] rounded-full"
                                          width={30}
                                          height={30}
                                          alt={items.teama.short_name}
                                          loading="lazy"
                                        />
                                        <div>
                                          <span className="flex items-center gap-1">
                                            <span className="text-[#586577] font-medium text-[14px]">
                                              {items.teama.short_name}
                                            </span>

                                          </span>

                                          <p className={
                                            "flex items-center gap-2 match" +
                                            items.match_id +
                                            "-" +
                                            items.teama.team_id
                                          }>
                                            {items.teama.scores === undefined ||
                                              items.teama.scores === null ||
                                              items.teama.scores === "" ? (
                                              <span className="font-medium text-[#434c59]">
                                                {" "}
                                                (Yet to bat){" "}
                                              </span>
                                            ) : (
                                              <>
                                                <span className="font-medium text-[#434c59]">
                                                  {items.teama.scores}
                                                </span>
                                                <span className="text-[#586577] text-[12px]">
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
                                      <div className="flex items-center space-x-2 font-medium md:w-full">
                                        <div className="flex items-center space-x-2">
                                          <Image
                                            src={`${items.teamb.logo_url}?tr=f-webp`}
                                            className="h-[30px]"
                                            width={30}
                                            height={30}
                                            alt={items.teamb.short_name}
                                            loading="lazy"
                                          />
                                          <div>
                                            <span className="text-[#5e5e5e] font-medium">
                                              {items.teamb.short_name}
                                            </span>
                                            <p
                                              className={
                                                "flex items-center gap-2 font-normal text-[14px] match" +
                                                items.match_id +
                                                "-" +
                                                items.teamb.team_id
                                              }
                                            >
                                              {items.teamb.scores === undefined ||
                                                items.teamb.scores === null ||
                                                items.teamb.scores === "" ? (
                                                <span className="font-medium text-[#586577]">
                                                  {" "}
                                                  (Yet to bat){" "}
                                                </span>
                                              ) : (
                                                <>
                                                  <span className="font-medium text-[#434c59]">
                                                    {items.teamb.scores}
                                                  </span>
                                                  <span className="text-[#586577] text-[12px]">
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

                                  <div className="h-[100px] border-l-[1px] border-[#f2fafd]"></div>

                                  <div className="w-[44%] font-semibold text-center">
                                    <p className={"mt-1 mx-2 text-[#2F335C] text-[14px]  statusNote" +
                                      items.match_id
                                    }>
                                      {items.status_note}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Link>

                            <div className="border-t-[1px] border-[#E7F2F4]"></div>

                            <div className="flex items-center justify-between space-x-5 mt-2">
                              <div className="flex items-center">
                                {items?.competition?.total_teams > 2 &&
                                  <>
                                    <Link href={"/series/" + urlStringEncode(items?.competition?.title + "-" + items?.competition?.season) + "/" + items.competition?.cid + "/points-table"}>
                                      <p className=" text-[#586577] text-[13px] font-medium">
                                        {" "}
                                        Points Table
                                      </p>
                                    </Link>

                                    <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                  </>
                                }
                                <Link href="#">
                                  <div className="flex justify-end items-center space-x-2">
                                    <Image
                                      src="/assets/img/home/handshake.png"
                                      className="h-[15px]"
                                      width={17}
                                      height={17}
                                      style={{ width: "17px", height: "17px" }}
                                      alt=""
                                      loading="lazy"
                                    />
                                    <span className="text-[#586577] text-[13px] font-medium">
                                      H2H
                                    </span>
                                  </div>
                                </Link>
                              </div>

                              <div className="flex items-center space-x-2 text-[13px]">
                                <span className={"text-[#586577] font-medium oddsTeam" + items.match_id}>
                                  {items?.[parseFloat(items?.live_odds?.matchodds?.teama?.back) < parseFloat(items?.live_odds?.matchodds?.teamb?.back) ? 'teama' : 'teamb'].short_name}
                                </span>
                                <span className="flex items-center bg-[#00a632] border-[1px] border-[#00a632] rounded-md text-[#ffffff] pr-2">
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
                                    {
                                      (parseFloat(items?.live_odds?.matchodds?.teama?.back) < parseFloat(items?.live_odds?.matchodds?.teamb?.back)
                                        ? items?.live_odds?.matchodds?.teama?.back
                                        : items?.live_odds?.matchodds?.teamb?.back) > 0
                                        ? Math.round((parseFloat(items?.live_odds?.matchodds?.teama?.back) < parseFloat(items?.live_odds?.matchodds?.teamb?.back)
                                          ? items?.live_odds?.matchodds?.teama?.back
                                          : items?.live_odds?.matchodds?.teamb?.back) * 100 - 100)
                                        : 0
                                    }
                                    {/* {items?.live_odds?.matchodds?.teama?.back > 0  ? Math.round((items?.live_odds?.matchodds?.teama?.back)*100-100) : 0} */}
                                  </span>
                                </span>
                                <span className="flex items-center bg-[#ea2323] border-[1px] border-[#ea2323]  rounded-md text-[#ffffff] pr-2">
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
                                    {
                                      (parseFloat(items?.live_odds?.matchodds?.teama?.lay) < parseFloat(items?.live_odds?.matchodds?.teamb?.lay)
                                        ? items?.live_odds?.matchodds?.teama?.lay
                                        : items?.live_odds?.matchodds?.teamb?.lay) > 0
                                        ? Math.round((parseFloat(items?.live_odds?.matchodds?.teama?.lay) < parseFloat(items?.live_odds?.matchodds?.teamb?.lay)
                                          ? items?.live_odds?.matchodds?.teama?.lay
                                          : items?.live_odds?.matchodds?.teamb?.lay) * 100 - 100)
                                        : 0
                                    }
                                    {/* {items?.live_odds?.matchodds?.teama?.lay > 0  ? Math.round((items?.live_odds?.matchodds?.teama?.lay)*100-100) : 0} */}
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
                    {completedMatch?.map((cmatch) => (
                      <div key={cmatch.match_id}>
                        <div
                          className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div
                                className="flex items-center text-[12px] text-[#00a632] rounded-full pr-3 uppercase  font-semibold"
                                style={{ gap: "3px" }}
                              >
                                <div className="w-[8px] h-[8px] bg-[#00a632] rounded-full"></div>{" "}
                                {cmatch.status_str}
                              </div>
                              <div>
                                <h4 className="text-[13px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                                  {cmatch.competition.title} -{" "}
                                  {cmatch.competition.season}
                                </h4>
                              </div>
                            </div>

                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>

                          <div className="py-3 px-3">
                            <div className="flex justify-between items-center text-[14px]">
                              <Link className="w-[61%]" href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-match-" + cmatch?.match_number + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
                                <div className="">
                                  <p className="text-[#586577] text-[13px] mb-4 font-medium">
                                    {cmatch.subtitle}, {cmatch.format_str}, {cmatch.venue.location}
                                  </p>
                                  <div className="flex items-center space-x-2 font-medium md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image
                                        src={`${cmatch.teama.logo_url}?tr=f-webp`}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={cmatch.teama.short_name}
                                        loading="lazy"
                                      />
                                      <span className="text-[#586577] font-medium text-[14px]">
                                        {cmatch.teama.short_name} -{" "}
                                      </span>
                                    </div>
                                    <p className="text-[14px] flex gap-[4px] items-end">
                                      <span className=" font-medium text-[#586577] ">
                                        {cmatch.teama.scores}
                                      </span>
                                      <span className="text-[#586577] text-[13px]">
                                        {" "}
                                        ({cmatch.teama.overs})
                                      </span>
                                    </p>
                                  </div>

                                  <div>
                                    <div className="flex items-center space-x-2 font-medium md:w-full">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${cmatch.teamb.logo_url}?tr=f-webp`}
                                          className="h-[30px]"
                                          width={30}
                                          height={30}
                                          alt={cmatch.teamb.short_name}
                                          loading="lazy"
                                        />
                                        <span className="text-[#586577] font-medium text-[14px]">
                                          {cmatch.teamb.short_name} -{" "}
                                        </span>
                                      </div>
                                      <p className="text-[14px] flex gap-[4px] items-end">
                                        <span className=" font-medium text-[#586577]">
                                          {cmatch.teamb.scores}
                                        </span>
                                        <span className="font-medium text-[#586577]">
                                          ({cmatch.teamb.overs})
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                              <div className="h-[100px] border-l-[1px] border-[#e7f2f4]"></div>

                              <Link className="w-[38%]" href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-match-" + cmatch?.match_number + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
                                <div className=" font-semibold flex flex-col items-center">
                                  <Image
                                    src="/assets/img/home/win.png"
                                    width={30}
                                    height={30}
                                    style={{ width: "30px", height: "30px" }}
                                    alt=""
                                    loading="lazy"
                                  />
                                  <p className="text-[#00a632] text-[14px] w-[75%] text-center">
                                    {cmatch.result}
                                  </p>
                                </div>
                              </Link>
                              {(cmatch.man_of_the_match && !Array.isArray(cmatch.man_of_the_match)) &&
                                <>
                                  <div className="h-[100px] border-l-[1px] border-[#e7f2f4]"></div>
                                  <Link className="w-[45%]"
                                    href={
                                      "/player/" +
                                      urlStringEncode(cmatch?.man_of_the_match?.name) +
                                      "/" +
                                      cmatch?.man_of_the_match?.pid
                                    }>
                                    <div className="flex flex-col items-center">

                                      <PlayerImage key={cmatch?.man_of_the_match?.pid} player_id={cmatch?.man_of_the_match?.pid} height={38} width={30} className="rounded-full" />
                                      <p className="text-[13px] font-semibold">{cmatch?.man_of_the_match?.name}</p>
                                      <p className="text-[11px]">Man of the match</p>
                                    </div>
                                  </Link>
                                </>
                              }
                            </div>

                          </div>
                          <div className="border-t-[1px] border-[#E7F2F4]"></div>

                          <div className="flex items-center justify-between space-x-5 mt-3">
                            <div className="flex items-center">
                              {cmatch?.competition?.total_teams > 2 &&
                                <>
                                  <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.competition?.cid + "/points-table"}>
                                    <p className=" text-[#586577] font-medium">
                                      {" "}
                                      Points Table
                                    </p>
                                  </Link>
                                  <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                </>}
                              <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch?.competition?.cid + "/schedule-results/schedule"}>
                                <p className="text-[#586577] font-medium">
                                  Schedule
                                </p>
                              </Link>
                            </div>

                            <Link href="/h2h">
                              <div className="flex justify-end items-center space-x-2">
                                <Image
                                  src="/assets/img/home/handshake.png"
                                  style={{ width: "25px", height: "25px" }}
                                  width={25}
                                  height={25}
                                  alt=""
                                  loading="lazy"
                                />
                                <span className="text-[#586577] font-medium">
                                  H2H
                                </span>
                              </div>
                            </Link>
                          </div>
                        </div>
                        {/* Mobile */}

                        <div className="lg:hidden rounded-lg p-4 mb-4 bg-[#ffffff] performance-section relative">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div
                                className="flex text-[12px] items-center text-[#00a632] rounded-full uppercase font-semibold"
                                style={{ gap: "2px" }}
                              >
                                <div className="w-[6px] h-[6px] bg-[#00a632] rounded-full"></div> {cmatch.status_str}
                              </div>
                              <div>
                                <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                  {truncateText(cmatch.competition.title,2)} -{" "}
                                  {cmatch.competition.season}
                                </h4>
                              </div>
                              <span className="absolute right-4 top-[19px]">
                                <button className="arro-button">
                                  <Image
                                    src="/assets/img/arrow.png"
                                    className=""
                                    width={10}
                                    height={15}
                                    alt=""
                                    loading="lazy"
                                  />
                                </button>
                              </span>
                            </div>
                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>

                          <div className="open-Performance-data">
                            <Link href={"/scorecard/" + urlStringEncode(cmatch?.teama?.short_name + "-vs-" + cmatch?.teamb?.short_name + "-match-" + cmatch?.match_number + "-" + cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.match_id}>
                              <div className="py-2 pb-3">
                                <p className="text-[#586577] text-[13px] mb-4 font-normal">
                                  {cmatch.subtitle}, {cmatch.format_str}, {cmatch.venue.location}
                                </p>
                                <div className="flex justify-between items-center text-[14px]">
                                  <div className="w-[98%]">
                                    <div className="items-center space-x-2 font-medium md:w-full mb-4">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${cmatch.teama.logo_url}?tr=f-webp`}
                                          className="h-[30px] rounded-full"
                                          width={30}
                                          height={30}
                                          alt={cmatch.teama.short_name}
                                          loading="lazy"
                                        />
                                        <div>
                                          <span className="flex items-center gap-1">
                                            <span className="text-[#5e5e5e] font-medium">
                                              {cmatch.teama.short_name}
                                            </span>
                                          </span>
                                          <p className="flex items-end gap-2">
                                            <span className=" font-medium text-[#434c59]">
                                              {cmatch.teama.scores}
                                            </span>

                                            <span className="text-[#586577] text-[12px] font-normal">
                                              ({cmatch.teama.overs})
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="flex items-center space-x-2 font-medium md:w-full">
                                        <div className="flex items-center space-x-2">
                                          <Image
                                            src={`${cmatch.teamb.logo_url}?tr=f-webp`}
                                            className="h-[30px] rounded-full"
                                            width={30}
                                            height={30}
                                            alt={cmatch.teamb.short_name}
                                            loading="lazy"
                                          />
                                          <div>
                                            <span className="flex items-center gap-1">
                                              <span className="text-[#5e5e5e] font-medium">
                                                {cmatch.teamb.short_name}
                                              </span>
                                            </span>
                                            <p className="flex items-end gap-2">
                                              <span className=" font-medium text-[#434c59]">
                                                {cmatch.teamb.scores}
                                              </span>

                                              <span className="text-[#586577] text-[12px] font-normal">
                                                ({cmatch.teama.overs})
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                   <div className="h-[100px] border-l-[1px] border-[#f2fafd]"></div>

                                  <div className=" w-[50%] font-semibold flex flex-col items-center">
                                    <Image
                                      src="/assets/img/home/win.png"
                                      width={30}
                                      height={30}
                                      style={{ width: "30px", height: "30px" }}
                                      alt=""
                                      loading="lazy"
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
                                {cmatch?.competition?.total_teams > 2 &&
                                  <>
                                    <Link href={"/series/" + urlStringEncode(cmatch?.competition?.title + "-" + cmatch?.competition?.season) + "/" + cmatch.competition?.cid + "/points-table"}>
                                      <p className=" text-[#586577] text-[13px] font-medium">
                                        {" "}
                                        Points Table
                                      </p>
                                    </Link>

                                    <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                  </>}
                                <Link href="#">
                                  <div className="flex justify-end items-center space-x-2">
                                    <Image
                                      src="/assets/img/home/handshake.png"
                                      className="h-[15px]"
                                      width={17}
                                      height={17}
                                      style={{ width: "17px", height: "17px" }}
                                      alt=""
                                      loading="lazy"
                                    />
                                    <span className="text-[#586577] text-[13px] font-medium">
                                      H2H
                                    </span>
                                  </div>
                                </Link>
                              </div>
                              {(cmatch.man_of_the_match && !Array.isArray(cmatch.man_of_the_match)) &&
                                <>
                                  <Link
                                    href={
                                      "/player/" +
                                      urlStringEncode(cmatch?.man_of_the_match?.name) +
                                      "/" +
                                      cmatch?.man_of_the_match?.pid
                                    }>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2" >
                                        <PlayerImage  key={cmatch?.man_of_the_match?.pid} player_id={cmatch?.man_of_the_match?.pid}
                                         height={22}
                                          width={22}
                                         
                                          className="rounded-full"  />
                                        <div className="text-center">
                                          <p className=" font-semibold">{truncateText(cmatch?.man_of_the_match?.name,1)}</p>
                                          <p className="text-[11px]">Man of the match </p>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                </>}
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}

                  </div>

                  <div className="upcomingMatch">
                    {upcomingMatch?.map((ucmatch) => (
                      <div key={ucmatch.match_id}>
                        <div
                          className="lg:block hidden rounded-lg p-4 mb-4 bg-[#ffffff] hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div
                                className="flex items-center text-[12px] text-[#A45B09] rounded-full pr-3 uppercase font-semibold"
                                style={{ gap: "3px" }}
                              >
                                <div className="w-[8px] h-[8px] bg-[#A45B09] rounded-full animate-blink"></div>{" "}
                                {ucmatch.status_str}
                              </div>
                              <div>
                                <h4 className="text-[13px] font-semibold pl-[15px] border-l-[1px] border-[#E4E9F0]">
                                  {ucmatch.competition.title} -{" "}
                                  {ucmatch.competition.season}
                                </h4>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                            <span className={"text-[11px] font-medium oddsTeam" + ucmatch.match_id}>
                                {ucmatch?.[parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back) ? 'teama' : 'teamb'].short_name}
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
                                {
                                    (parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back)
                                      ? ucmatch?.live_odds?.matchodds?.teama?.back
                                      : ucmatch?.live_odds?.matchodds?.teamb?.back) > 0
                                      ? Math.round((parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back)
                                        ? ucmatch?.live_odds?.matchodds?.teama?.back
                                        : ucmatch?.live_odds?.matchodds?.teamb?.back) * 100 - 100)
                                      : 0
                                  }
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
                                {
                                    (parseFloat(ucmatch?.live_odds?.matchodds?.teama?.lay) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.lay)
                                      ? ucmatch?.live_odds?.matchodds?.teama?.lay
                                      : ucmatch?.live_odds?.matchodds?.teamb?.lay) > 0
                                      ? Math.round((parseFloat(ucmatch?.live_odds?.matchodds?.teama?.lay) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.lay)
                                        ? ucmatch?.live_odds?.matchodds?.teama?.lay
                                        : ucmatch?.live_odds?.matchodds?.teamb?.lay) * 100 - 100)
                                      : 0
                                  }
                              </span>
                            </div>
                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>
                          <Link href={"/moreinfo/" + urlStringEncode(ucmatch?.teama?.short_name + "-vs-" + ucmatch?.teamb?.short_name + "-match-" + ucmatch?.match_number + "-" + ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.match_id}>
                            <div className="py-3 px-3">
                              <div className="flex justify-between items-center text-[14px]">
                                <div className="">
                                  <p className="text-[#586577] text-[13px] mb-4 font-medium">
                                    {ucmatch.subtitle}, {ucmatch.format_str}, {ucmatch.venue.location}
                                  </p>
                                  <div className="flex items-center space-x-2 font-medium x md:w-full mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Image
                                        src={`${ucmatch.teama.logo_url}?tr=f-webp`}
                                        className="h-[30px] rounded-full"
                                        width={30}
                                        height={30}
                                        alt={ucmatch.teama.short_name}
                                        loading="lazy"
                                      />
                                      <span className="text-[#586577] font-medium text-[14px]">
                                        {ucmatch.teama.short_name}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex items-center space-x-2 font-medium md:w-full">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${ucmatch.teamb.logo_url}?tr=f-webp`}
                                          className="h-[30px]"
                                          width={30}
                                          height={30}
                                          alt={ucmatch.teamb.short_name}
                                          loading="lazy"
                                        />
                                        <span className="text-[#586577] font-medium text-[14px]">
                                          {ucmatch.teamb.short_name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="font-semibold text-center">
                                  <div className="text-[#144280]">
                                    <div className=" font-medium text-center">
                                      
                                      {isSameDay(new Date(), new Date(ucmatch.date_start_ist)) ? (
                                       <>
                                       <span className="text-[13px] font-normal text-[#a45b09]">Start in</span> 

                                        <CountdownTimer targetTime={ucmatch.date_start_ist} />
                                        </> 

                                      ) : (
                                        <p className="text-[#2F335C] text-[14px]">

                                          {format(new Date(ucmatch.date_start_ist), "dd MMMM - EEEE")}, <br />
                                          {format(new Date(ucmatch.date_start_ist), "hh:mm:aa")}


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
                              {ucmatch?.competition?.total_teams > 2 &&
                                <>
                                  <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.competition?.cid + "/points-table"}>
                                    <p className=" text-[#586577] font-medium">
                                      {" "}
                                      Points Table
                                    </p>
                                  </Link>
                                  <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                </>}
                              <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch?.competition?.cid + "/schedule-results/schedule"}>
                                <p className="text-[#586577] font-medium">
                                  Schedule
                                </p>
                              </Link>
                            </div>

                            <Link href="#">
                              <div className="flex justify-end items-center space-x-2">
                                <Image
                                  src="/assets/img/home/handshake.png"
                                  width={25}
                                  height={25}
                                  style={{ width: "25px", height: "25px" }}
                                  alt=""
                                  loading="lazy"
                                />
                                <span className="text-[#586577] font-medium">
                                  H2H
                                </span>
                              </div>
                            </Link>
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
                                <div className="w-[6px] h-[6px] bg-[#A45B09] rounded-full"></div> {ucmatch.status_str}
                              </div>
                              <div>
                                <h4 className="text-[14px] font-semibold pl-[10px] border-l-[1px] border-[#E4E9F0]">
                                  {truncateText(ucmatch.competition.title,3)} -{" "}
                                  {ucmatch.competition.season}
                                </h4>
                              </div>
                              <span className="absolute right-[12px] top-[19px]">
                                <button className="arro-button">
                                  <Image
                                    src="/assets/img/arrow.png"
                                    className=""
                                    width={10}
                                    height={15}
                                    alt=""
                                    loading="lazy"
                                  />
                                </button>
                              </span>
                            </div>
                          </div>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>
                          <Link href={"/moreinfo/" + urlStringEncode(ucmatch?.teama?.short_name + "-vs-" + ucmatch?.teamb?.short_name + "-match-" + ucmatch?.match_number + "-" + ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.match_id}>
                            <div className="open-Performance-data">
                              <div className="py-2 pb-3">
                                <p className="text-[#586577] text-[13px] mb-4 font-medium">
                                  {ucmatch.subtitle}, {ucmatch.format_str}, {ucmatch.venue.location}
                                </p>
                                <div className="flex justify-between items-center text-[14px]">
                                  <div className="w-[80%]">
                                    <div className="items-center space-x-2 font-medium md:w-full mb-4">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${ucmatch.teama.logo_url}?tr=f-webp`}
                                          className="h-[30px] rounded-full"
                                          width={30}
                                          height={30}
                                          alt={ucmatch.teama.short_name}
                                          loading="lazy"
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
                                    <div className="flex items-center space-x-2 font-medium md:w-full">
                                      <div className="flex items-center space-x-2">
                                        <Image
                                          src={`${ucmatch.teamb.logo_url}?tr=f-webp`}
                                          className="h-[30px] rounded-full"
                                          width={30}
                                          height={30}
                                          alt={ucmatch.teamb.short_name}
                                          loading="lazy"
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

                                  <div className="h-[100px] border-l-[1px] border-[#f2fafd]"></div>

                                  <div className="w-[80%] font-semibold text-center">
                                    <div className="text-[#144280] mt-1">
                                      <div
                                        className="flex space-x-1 justify-center countdown"
                                        data-time="28800"
                                      >
                                        {/* <!-- 08:00:00 = 8 * 60 * 60 = 28800 seconds --> */}
                                        <div className="flex flex-col items-center">
                                          {isSameDay(new Date(), new Date(ucmatch.date_start_ist)) ? (

                                            <CountdownTimer targetTime={ucmatch.date_start_ist} />

                                          ) : (
                                            <p className="text-[13px] font-medium">
                                              {format(new Date(ucmatch.date_start_ist), "dd MMMM - EEEE")}, <br />
                                              {format(new Date(ucmatch.date_start_ist), "hh:mm:aa")}


                                            </p>
                                          )}

                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>

                          <div className="border-t-[1px] border-[#E7F2F4]"></div>

                          <div className="flex items-center justify-between space-x-5 mt-2">
                            <div className="flex items-center">
                              {ucmatch?.competition?.total_teams > 2 &&
                                <>
                                  <Link href={"/series/" + urlStringEncode(ucmatch?.competition?.title + "-" + ucmatch?.competition?.season) + "/" + ucmatch.competition?.cid + "/points-table"}>
                                    <p className="text-[#586577] text-[13px] font-medium">
                                      Points Table
                                    </p>
                                  </Link>
                                  <div className="h-[20px] border-l-[1px] mx-5 border-[#d0d3d7]"></div>
                                </>}
                              <Link href="#">
                                <div className="flex justify-end items-center space-x-2">
                                  <Image
                                    src="/assets/img/home/handshake.png"
                                    className="h-[15px]"
                                    width={17}
                                    height={17}
                                    style={{ width: "17px", height: "17px" }}
                                    alt=""
                                    loading="lazy"
                                  />
                                  <span className="text-[#586577] text-[13px] font-medium">
                                    H2H
                                  </span>
                                </div>
                              </Link>
                            </div>

                            <div className="flex items-center space-x-2 text-[13px]">
                              <span className={"text-[#586577] font-medium oddsTeam" + ucmatch.match_id}>
                                {ucmatch?.[parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back) ? 'teama' : 'teamb'].short_name}
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
                                {
                                    (parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back)
                                      ? ucmatch?.live_odds?.matchodds?.teama?.back
                                      : ucmatch?.live_odds?.matchodds?.teamb?.back) > 0
                                      ? Math.round((parseFloat(ucmatch?.live_odds?.matchodds?.teama?.back) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.back)
                                        ? ucmatch?.live_odds?.matchodds?.teama?.back
                                        : ucmatch?.live_odds?.matchodds?.teamb?.back) * 100 - 100)
                                      : 0
                                  }
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
                                {
                                    (parseFloat(ucmatch?.live_odds?.matchodds?.teama?.lay) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.lay)
                                      ? ucmatch?.live_odds?.matchodds?.teama?.lay
                                      : ucmatch?.live_odds?.matchodds?.teamb?.lay) > 0
                                      ? Math.round((parseFloat(ucmatch?.live_odds?.matchodds?.teama?.lay) < parseFloat(ucmatch?.live_odds?.matchodds?.teamb?.lay)
                                        ? ucmatch?.live_odds?.matchodds?.teama?.lay
                                        : ucmatch?.live_odds?.matchodds?.teamb?.lay) * 100 - 100)
                                      : 0
                                  }
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
            <News></News>
          </div>

          <div className="lg:col-span-4 md:col-span-5">
            <div className="bg-white rounded-lg p-4 my-4 hidden">
              <div className="flex gap-1 items-center justify-between">
                <div className="flex gap-1 items-center">
                  <div className="col-span-4 relative">
                    <Image
                      src="/assets/img/home/trofi.png"
                      className="h-[75px]"
                      width={75}
                      height={75}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="col-span-8 relative">
                    <h3 className="font-semibold text-[19px] mb-1">
                      Weekly challenge
                    </h3>
                    <p className="font-semibold text-[13px] text-[#1a80f8]">
                      <span className="text-[#586577]">Time Left:</span> 2 Days
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
            <div className="md:h-[260px]">
              <WeeklySlider featuredMatch={featuredMatch} />
            </div>

            <PLSeries />
            <div>
              <CountriesList countries={countryCompitition}></CountriesList>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex justify-between items-center py-4">
            <div>
              <h3 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8]">
                TOP TEAMS
              </h3>
            </div>

          </div>

          <div className="rounded-lg bg-[#ffffff] p-4">
            <div className="grid md:gap-6 gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 py-3 px-2">
              {ranking?.ranks?.teams?.odis.slice(0, 10)?.map((team: any, index: number) => (
                <div className="col-span-1" key={index}>
                  <div className="relative rounded-md overflow-hidden text-white">
                    <Image
                      src={team?.logo_url}
                      alt="Team Logo"
                      fill
                      objectFit="cover"
                      loading="lazy" // Ensures it loads first
                      className="rounded-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#14439e] to-[#14429e] opacity-80"></div>
                    <Link href={"/team/" + urlStringEncode(team?.team) + "/" + team?.tid}>
                      <div className="relative flex items-center space-x-2 justify-center  py-3">
                        <Image
                          src={`${team?.logo_url}`}
                          width={20}
                          height={20}
                          alt={team?.team}
                          priority
                        />
                        <p className="font-semibold">{team?.team}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}


            </div>
          </div>



          <CardSlider></CardSlider>


        </div>
        <FeatureSeries featuredSeries={featuredSeries}></FeatureSeries>
      </section>
    </Layout>
  );
}

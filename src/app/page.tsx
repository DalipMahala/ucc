
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
import ForYouMatches from "./components/forYouMatches";
import LiveMatches from "./components/liveMatches";
import UpcomingMatches from "./components/upcomingMatches";
import CompletedMatches from "./components/completedMatches";

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
    name: string;
    short_name: string;
    logo_url: string;
    scores?: string;
    overs?: string;
    team_id?: string;
  };
  teamb: {
    name: string;
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
    .replace(/^Stumps : /, '')
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
  }  else if (matchType === "upcoming") {
    activeTabValue = "scorecard1";
  } else if (matchType === "result") {
    activeTabValue = "finished1";
  } else {
    activeTabValue = "info1";
  }


  const activeMainTab = activeTabValue;
  
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

                  {/* <button id="all-tab"
                    className={`font-semibold py-2 md:px-5 px-4 whitespace-nowrap uppercase ${activeMainTab === "info1"
                      ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                      : ""
                      } md:rounded-md`}
                  >
                    All
                  </button> */}

                  <button id="live-tab"
                    className={`font-semibold py-2 md:px-5 px-4  whitespace-nowrap uppercase ${activeMainTab === "live1"
                      ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                      : ""
                      } md:rounded-md`}
                  >
                    Live
                  </button>

                  <button id="all-tab"
                    className={`font-semibold py-2 md:px-5 px-4  whitespace-nowrap uppercase ${activeMainTab === "info1"
                      ? "md:bg-[#1A80F8] bg-[#081736] md:bottom-0 border-b-[2px] border-[#ffffff] text-white"
                      : ""
                      } md:rounded-md`}
                  >
                    For You
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
                <div id="info1"  className={`tab-content ${activeMainTab === "info1" ? "" : ""  }`} >
                  {/* <!-- live match desktop view start --> */}
                  <div className="liveMatch hidden">
                   
                  <LiveMatches/>
                  </div>

                  <div className="completedMatch hidden">
                  <CompletedMatches/>

                  </div>

                  <div className="upcomingMatch hidden">
                  <UpcomingMatches/>
                  </div>
                  <div className="foryouMatch">
                    <ForYouMatches/>

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
                    {/* <Image
                      src={team?.logo_url}
                      alt="Team Logo"
                      fill
                      objectFit="cover"
                      loading="lazy"
                      className="rounded-md"
                    /> */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#14439e] to-[#14429e7a] "></div>
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

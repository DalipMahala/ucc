
export const dynamic = "force-dynamic";
import Layout from "./components/Layout";
import WeeklySlider from "./components/WeeklySlider";
import CardSlider from "./components/CardSlider";
import Link from "next/link";
import ChatComponent from "./components/websocket";
import Image from "next/image";
import { notFound } from "next/navigation";
// import TabButtons from "./components/buttonclick";
import { urlStringEncode } from "../utils/utility";
import { Ranking } from "@/controller/playerController";
import News from "@/app/components/News";
import FeatureSeries from "@/app/components/FeatureSeries";
import { GetCountryCompitition, FeaturedSeries } from "@/controller/homeController";
import type { Metadata } from "next";
import CountriesList from "./components/CountriesList";
import PLSeries from "./components/popularSeries";
import React from "react";
import ForYouMatches from "./components/forYouMatches";
import LiveMatches from "./components/liveMatches";
import UpcomingMatches from "./components/upcomingMatches";
import CompletedMatches from "./components/completedMatches";
import TabbedSection from "./components/TabbedSection";

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

type Params = Promise<{ matchType: string }>;

export default async function Home(props: { params: Params }) {


  console.log("btn", props);
  const open = null;
  let activeTabValue = "info1";


  const activeMainTab = activeTabValue;


  const ranking = await Ranking();
  const featuredSeries1 = await FeaturedSeries();
  const featuredSeries = featuredSeries1.reverse();
  // const  matchData = ChatComponent();
  const countryCompitition = await GetCountryCompitition();


  return (
    <Layout>
      <ChatComponent></ChatComponent>
      <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">

        <div className="md:grid grid-cols-12 gap-4">
          <div className="lg:col-span-8 md:col-span-7">
            <TabbedSection
              forYouMatches={<ForYouMatches />}
              liveMatches={<LiveMatches />}
              upcomingMatches={<UpcomingMatches />}
              completedMatches={<CompletedMatches />}
            />
            <News></News>
          </div>

          <div className="lg:col-span-4 md:col-span-5 relative">

            <div className="md:h-[260px]">
              <WeeklySlider />
            </div>

            <PLSeries />
            <div className="sticky top-[93px]">
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
                        <p className="font-semibold text-[14px]">{team?.team}</p>
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

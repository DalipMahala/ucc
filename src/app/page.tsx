
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
import SportsNews from "./components/SportsNews";


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

            <SportsNews></SportsNews>

          </div>

          <div className="lg:col-span-4 md:col-span-5 relative">

            <div className="md:h-[260px]">
              <WeeklySlider />
            </div>

            <PLSeries />
            {/* sticky top-[93px] */}
           
              <CountriesList countries={countryCompitition}></CountriesList>
           
          </div>
        </div>

       


          <h2 className="text-1xl font-semibold pl-[4px] border-l-[3px] border-[#2182F8] my-4">
            TOP TEAMS
          </h2>


         
            <div className="grid md:gap-6 gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-lg bg-[#ffffff] p-6">
              {ranking?.ranks?.teams?.odis.slice(0, 10)?.map((team: any, index: number) => (
                <div className="relative rounded-md overflow-hidden text-white col-span-1" key={index}>

                  <Image
                    src={team?.logo_url}
                    alt={urlStringEncode(team?.team)}
                    fill
                    objectFit="cover"
                    loading="lazy"
                    className="rounded-md"
                  />


                  <div className="absolute inset-0 bg-gradient-to-r from-[#14439e] to-[#14429eb0] "></div>
                  
                  <Link href={"/team/" + urlStringEncode(team?.team) + "/" + team?.tid}>
                    <div className="relative flex items-center space-x-2 md:justify-center  py-3 md:px-0 px-3">
                      <Image
                        src={`${team?.logo_url}`}
                        width={20}
                        height={20}
                        alt={urlStringEncode(team?.team)}
                        priority
                      />
                      <p className="font-semibold text-[14px]">{team?.team}</p>
                    </div>
                  </Link>

                </div>
              ))}


            </div>
        



          <CardSlider></CardSlider>

        <FeatureSeries featuredSeries={featuredSeries}></FeatureSeries>
      </section>
    </Layout>
  );
}

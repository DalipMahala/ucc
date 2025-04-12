export const dynamic = "force-dynamic";
import React, { Children } from "react";
import { notFound } from "next/navigation";
import MoreInfo from "./matchComponents/MoreInfo";
import Banner from "./matchComponents/Banner";
import Layout from "@/app/components/Layout";
import Image from "next/image";
import Live from "./matchComponents/Live";
import Scorecard from "./matchComponents/Scorecard";
import Squads from "./matchComponents/Squad";
import Stats from "./matchComponents/Stats";
import PointsTable from "./matchComponents/PointsTable";
import LiveUpcoming from "./scheduledComponents/Live";
import ScorecardUpcoming from "./scheduledComponents/Scorecard";
import MoreInfoUpcoming from "./scheduledComponents/MoreInfo";
import { isSameDay, format } from "date-fns";
import CountdownTimer from "../components/countdownTimer";
import { liveSeries,  FeaturedMatch, seriesById } from "@/controller/homeController";
import {
  MatcheInfo,
  Last10Match,
  MatchStatistics,
  MatchCommentary,
  SeriesPointsTable,
  SeriesPointsTableMatches
} from "@/controller/matchInfoController";

import ChatComponent from "../components/websocket";

import { Metadata } from "next";

// interface MatchInfo {
//   match_id: number;
//   matchid: number;
//   status_str: string;
//   competition: {
//     title: string;
//     season: string;
//   };
//   teama: {
//     short_name: string;
//     logo_url: string;
//     scores?: string;
//     overs?: string;
//     team_id?: string;
//   };
//   teamb: {
//     short_name: string;
//     logo_url: string;
//     scores?: string;
//     overs?: string;
//     team_id?: string;
//   };
//   subtitle: string;
//   format_str: string;
//   venue: {
//     name: string;
//     location: string;
//   };
//   status_note: string;
//   result: string;
//   date_start_ist: string;
//   matchData: string;
//   matchLast: string;
//   matchStates: string;
//   children?: React.ReactNode;
// }

type Params = Promise<{
  matchType: string;
  matchTab: string;
  matchId: number;
  matchTitle: string;
}>;
interface FrMatch {
  match_info: any;
  // Other properties you expect in each match object
}
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const matchType = params;
  const  matchId = params;
  const matchTitle  = params;

  return {
    title: `${matchTitle} - ${matchType} Match Live | UCCricket`,
    description: `Get live updates, scores, and stats for ${matchTitle}. Stay updated on ${matchType} matches on UCCricket.`,
    keywords: `${matchType}, cricket live, ${matchTitle}, match updates, cricket scores`,
  };
}

export default async function page(props: { params: Params }) {
  // Example server-side event

  const params = await props.params;
  const matchid = params.matchId;
  const matchTab = params.matchTab;
  const matchType = params.matchType;
  const matchTitle = params.matchTitle;

  const liveMatch = await MatcheInfo(matchid);
  const last10Match = await Last10Match(matchid);
  const matchStatistics = await MatchStatistics(matchid);
  const cid = liveMatch?.match_info?.competition?.cid;
  const seriesPointsTable = await SeriesPointsTable(cid);
  const seriesPointsTableMatches = await SeriesPointsTableMatches(Number(cid));
  // let featuredMatch = await FeaturedMatch();
  console.log("matchCommentary",liveMatch);
  let frresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/featuredMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  let featuredmatchArray = await frresponse.json();
  
  const futuredMatches = featuredmatchArray?.data?.map(({ match_info, ...rest }:FrMatch) => ({
    ...match_info,
    ...rest
  }));
  const featuredMatch = futuredMatches;
  const SeriesDetails = await seriesById(cid);
  const standings = SeriesDetails?.standing?.standings;
  const isPointTable = Array.isArray(standings) && standings.length > 0;
  console.log('File',liveMatch);
  let matchCommentary = "";
  if (
    liveMatch?.match_info?.status_str !== "Scheduled" &&
    matchid !== undefined
  ) {
    matchCommentary = await MatchCommentary(
      matchid,
      liveMatch?.live?.live_inning_number
    );
  }
  

  const teamascores = liveMatch?.match_info?.teama?.scores ?? "";
  const teambscores = liveMatch?.match_info?.teamb?.scores ?? "";
  const teamaovers = liveMatch?.match_info?.teama?.overs ?? "";
  const teambovers = liveMatch?.match_info?.teamb?.overs ?? "";

  // Split by " & " to separate both innings
  const [inning1teamarun, inning2teamarun] = teamascores.includes(" & ")
    ? teamascores.split(" & ")
    : [teamascores, ""];
  const [inning1teambrun, inning2teambrun] = teambscores.includes(" & ")
    ? teambscores.split(" & ")
    : [teambscores, ""];
  const [inning1teamaOver, inning2teamaOver] = teamaovers.includes(" & ")
    ? teamaovers.split(" & ")
    : [teamaovers, ""];
  const [inning1teambOver, inning2teambOver] = teambovers.includes(" & ")
    ? teambovers.split(" & ")
    : [teambovers, ""];

  const liveSeriesData = await liveSeries();
  
  return (
    <Layout headerData={liveSeriesData}>
      <ChatComponent></ChatComponent>
      <Banner matchData={liveMatch} match_id={matchid} />

      {liveMatch?.match_info?.status_str !== "Scheduled" ? (
        matchType === "moreinfo" ? (
          
          <MoreInfo
            match_id={matchid}
            matchData={liveMatch}
            matchLast={last10Match}
            matchUrl={matchTab}
            isPointTable={isPointTable}
          />
        ) : matchType === "live-score" ? (
          <Live
            match_id={matchid}
            matchData={liveMatch}
            matchUrl={matchTab}
            matchCommentary={matchCommentary}
            isPointTable={isPointTable}
          />
        ) : matchType === "scorecard" ? (
          <Scorecard
            match_id={matchid}
            matchData={liveMatch}
            matchStates={matchStatistics}
            matchUrl={matchTab}
            isPointTable={isPointTable}
          />
        ) : matchType === "squad" ? (
          <Squads
            match_id={matchid}
            matchData={liveMatch}
            matchUrl={matchTab}
            isPointTable={isPointTable}
          />
        ) : matchType === "stats" ? (
          <Stats
            match_id={matchid}
            matchData={liveMatch}
            matchUrl={matchTab}
            matchTitle={matchTitle}
            isPointTable={isPointTable}
          />
        ) : matchType === "points-table" ? (
          <PointsTable
            match_id={matchid}
            matchData={liveMatch}
            matchUrl={matchTab}
            seriesPointsTable={seriesPointsTable}
            seriesPointsTableMatches={seriesPointsTableMatches}
            featuredMatch={featuredMatch}
          />
        ) : null
      ) : matchType === "moreinfo" ? (
        <MoreInfoUpcoming
          match_id={matchid}
          matchData={liveMatch}
          matchLast={last10Match}
          matchUrl={matchTab}
          isPointTable={isPointTable}
        />
      ) : matchType === "live-score" ? (
        <LiveUpcoming
          match_id={matchid}
          matchData={liveMatch}
          matchUrl={matchTab}
          matchCommentary={matchCommentary}
          isPointTable={isPointTable}
        />
      ) : matchType === "scorecard" ? (
        <ScorecardUpcoming
          match_id={matchid}
          matchData={liveMatch}
          matchStates={matchStatistics}
          matchUrl={matchTab}
          isPointTable={isPointTable}
        />
      ) : matchType === "squad" ? (
        <Squads match_id={matchid} matchData={liveMatch} matchUrl={matchTab} isPointTable={isPointTable}/>
      ) : matchType === "stats" ? (
        <Stats
          match_id={matchid}
          matchData={liveMatch}
          matchUrl={matchTab}
          matchTitle={matchTitle}
          isPointTable={isPointTable}
        />
      ) : matchType === "points-table" ? (
        <PointsTable
          match_id={matchid}
          matchData={liveMatch}
          matchUrl={matchTab}
          seriesPointsTable={seriesPointsTable}
          seriesPointsTableMatches={seriesPointsTableMatches}
          featuredMatch={featuredMatch}
        />
      ) : null}
    </Layout>
  );
}

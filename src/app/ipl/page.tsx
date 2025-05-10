import React from "react";
import Layout from "@/app/components/Layout";
import { SeriesPointsTable, SeriesMatches, MatcheInfo } from "@/controller/matchInfoController";
import {
  TeamDetails,
  TeamLast5match,
  TeamPlayersById,
  isIPLTeamDetails,
  TeamVenue
} from "@/controller/teamController";
import IplBanner from "./teamComponents/iplBanner";
import Overview from "./teamComponents/Overview";
import Squads from "./teamComponents/Squad";
import ScheduleResults from "./teamComponents/ScheduleResults";
import { notFound } from "next/navigation";
import { urlStringEncode } from "@/utils/utility";

type Params = Promise<{ year: string; teamType: string; teamName: string; teamId: number; }>;

export default async function page(props: { params: Params }) {
  const params = await props.params;
  const teamName = params?.teamName;
  const teamYear = params?.year;
  const teamId = params?.teamId;
  const teamType = params?.teamType;
  

  const teamDetails = await TeamDetails(teamId);
  if (teamDetails){
    if (!teamDetails || teamName?.toLowerCase() !== urlStringEncode(teamDetails?.title)?.toLowerCase() || teamId?.toString() !== teamDetails?.tid?.toString()) {
      notFound();
    }
}else{
  notFound();
}
  const teamPlayers = await TeamPlayersById(teamId);
  const teamLast5match = await TeamLast5match(teamId, 2);
  const teamUpcomingMatch = await TeamLast5match(teamId, 1);
  const cid = await isIPLTeamDetails(teamId, Number(teamYear));
  const venueDetails = await TeamVenue(teamId);
  const pointTables = await SeriesPointsTable(cid);
  const seriesMatches =  await SeriesMatches(cid);
  let matcheInfo = [];
  if(seriesMatches?.scheduledMatch?.length > 0){
    const  matchid = seriesMatches?.scheduledMatch?.filter((m: { teama: { team_id: any; }; teamb: { team_id: any; }; }) => [m?.teama?.team_id, m?.teamb?.team_id].includes(Number(teamId)))?.[0]?.match_id;
    matcheInfo = await MatcheInfo(matchid);
  }else{
    const  matchid = seriesMatches?.resultMatch?.filter((m: { teama: { team_id: any; }; teamb: { team_id: any; }; }) => [m?.teama?.team_id, m?.teamb?.team_id].includes(Number(teamId)))?.[0]?.match_id;
    matcheInfo = await MatcheInfo(matchid);
  }
  // console.log("scheduledMatch", seriesMatches?.scheduledMatch.length);

  return (
    <Layout>
      <IplBanner cid={cid} params={params} teamPlayers={teamPlayers} venueDetails={venueDetails}></IplBanner>
      {teamType === "" || teamType === undefined? (
      <Overview  cid={cid} params={params} teamPlayers={teamPlayers} teamLast5match={teamLast5match} pointTables={pointTables} matcheInfo={matcheInfo} seriesMatches={seriesMatches} venueDetails={venueDetails}/>
      ): teamType === "squads" ? (
      <Squads  pointTables={pointTables} teamPlayers={teamPlayers} matcheInfo={matcheInfo}/>
      ): teamType === "schedule-results" ? (
        <ScheduleResults seriesId={cid} params={params} seriesMatches={seriesMatches} teamPlayers={teamPlayers} pointTables={pointTables} />
        ): null
    }
    </Layout>
  );
}

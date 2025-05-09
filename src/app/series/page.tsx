export const dynamic = "force-dynamic";
import React from 'react'
import Layout from "@/app/components/Layout";


import Overview from './seriesComponents/Overview';
import Banner from './seriesComponents/Banner';
import ScheduleResults from './seriesComponents/ScheduleResults';
import Squads from './seriesComponents/Squads';
import PointsTable from './seriesComponents/PointsTable';
import News from './seriesComponents/News';
import Stats from './seriesComponents/Stats';
import SeriesList from './seriesComponents/SeriesList';
import { liveSeries, seriesById, AllSeriesList } from "@/controller/homeController";
import { SeriesKeyStats, SeriesMatches } from "@/controller/matchInfoController";

type Params = Promise<{ seriesName: string; seriesId: number; seriesTap: string; seriesStatsType: string }>
interface FrMatch {
  match_info: any;
  // Other properties you expect in each match object
}
interface Match {
  status: number;
}
export default async function page(props: { params: Params }) {

  const params = await props.params;
  const seriesName = params?.seriesName;
  const seriesId = Number(params?.seriesId);
  const seriesTab = params?.seriesTap;
  const statsType = params?.seriesStatsType;

  const liveSeriesData = await liveSeries();
  const SeriesDetails = await seriesById(seriesId);
  const urlString = "/series/"+seriesName+"/"+seriesId;
  const seriesKeystats =  await SeriesKeyStats(seriesId);
  // const seriesMatches =  await SeriesMatches(seriesId);

  const tournamentsList = await AllSeriesList();
  

  const standings = SeriesDetails?.standing?.standings;
  const isPointTable = Array.isArray(standings) && standings.length > 0;
  //  console.log('teamIds', seriesMatches);

  let seriesMatchesList = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series/SeriesMatches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
    body: JSON.stringify({ cid: seriesId }),
  });
  const allMatches = await seriesMatchesList.json();

  const categorizedMatches: {
    scheduledMatch: Match[];
    resultMatch: Match[];
    liveMatch: Match[];
    allMatch: Match[];
  } = { scheduledMatch: [], resultMatch: [], liveMatch: [],allMatch: [] };
  
  allMatches?.data?.forEach((match: { status: number }) => {
    if (match.status === 1) categorizedMatches.scheduledMatch.push(match);
    else if (match.status === 2) categorizedMatches.resultMatch.push(match);
    else if (match.status === 3) categorizedMatches.liveMatch.push(match);
    else categorizedMatches.allMatch.push(match);
  });

  const seriesMatches = categorizedMatches;
  return (
    <Layout>
          {seriesName === '' || seriesName === undefined ? (
          <SeriesList tournamentsList={tournamentsList}></SeriesList>
          ):(
            <>
          <Banner seriesData={liveSeriesData} seriesInfo={SeriesDetails}></Banner>

          {seriesTab === ""  || seriesTab === undefined && <Overview  seriesInfo={SeriesDetails} seriesKeystats={seriesKeystats} urlString={urlString} isPointTable={isPointTable}/>}
          {seriesTab === "schedule-results" && <ScheduleResults seriesId={seriesId} seriesMatches={seriesMatches} urlString={urlString} statsType={statsType} isPointTable={isPointTable}/>}
          {seriesTab === "squads" && <Squads seriesInfo={SeriesDetails} urlString={urlString} isPointTable={isPointTable}/>}
          {seriesTab === "points-table" && <PointsTable seriesInfo={SeriesDetails} urlString={urlString} isPointTable={isPointTable} />}
          {seriesTab === "news" && <News  urlString={urlString} isPointTable={isPointTable}/>}
          {seriesTab === "stats" && <Stats seriesId={seriesId} urlString={urlString} statsType={statsType} isPointTable={isPointTable} seriesInfo={SeriesDetails}/>}
          
          </>
          )
        }
    </Layout>
  )
}
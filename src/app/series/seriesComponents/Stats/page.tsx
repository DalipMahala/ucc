import React from "react";
import Link from 'next/link';
import { MatcheStats } from "@/controller/matchInfoController";
import { urlStringEncode } from "@/utils/utility";
import ReadMoreCard from "@/app/components/ReadMoreCard";
import StatsList from "./StatsList";
import StatsMenu from "./StatsMenu";

interface Stats {
    urlString: string;
    seriesId: number;
    isPointTable: boolean;
    seriesInfo: any;
    status: boolean;
}
interface PlayerUrlResponse {
    [key: string]: string;
  }
// type Params = Promise<{ seriesName: string; seriesId: number; seriesTap: string; seriesStatsType: string }>


interface PageParams {
    urlString: string;
  seriesName: string;
  seriesId: number;
  seriesTap: string;
  seriesStatsType: string;
}

interface PageProps {
  params: PageParams;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Use this if you are passing other props like Stats via context or server functions.
export default async function Page({ params }: PageProps) {
  // Destructure from params
// const {  seriesStatsType, urlString } = params;

  const statsType = "";//seriesStatsType;
  const urlString = "sdsd";

  console.log('teamIds',params );
  return (
    <section>
          {/* {statsType === ""  || statsType === undefined && <StatsList  seriesInfo={SeriesDetails} seriesKeystats={seriesKeystats} urlString={urlString} isPointTable={isPointTable} />} */}
          {statsType === ""   || statsType === undefined &&  <StatsMenu urlString={urlString}  />}
          </section>
         
  )
}
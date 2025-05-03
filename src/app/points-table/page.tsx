export const dynamic = "force-dynamic";
import React from 'react'
import Layout from "@/app/components/Layout";

import SeriesList from './SeriesList';
import { liveSeries} from "@/controller/homeController";
type Params = Promise<{ seriesName: string; seriesId: number; seriesTap: string; seriesStatsType: string }>
interface FrMatch {
  match_info: any;
  // Other properties you expect in each match object
}
export default async function page(props: { params: Params }) {

  const params = await props.params;
  const seriesName = params?.seriesName;
  const seriesId = Number(params?.seriesId);

  const liveSeriesData = await liveSeries();


  return (
    <Layout>
          <SeriesList tournamentsList={liveSeriesData}></SeriesList>
    </Layout>
  )
}
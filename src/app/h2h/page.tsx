import React from 'react'
import Layout from "@/app/components/Layout";
import Image from 'next/image';
import WeeklySlider from "@/app/components/WeeklySlider";
import H2h from './h2h';
import { liveSeries,FeaturedMatch } from "@/controller/homeController";

interface FrMatch {
  match_info: any;
  // Other properties you expect in each match object
}
export default async function Page() {

  const liveSeriesData = await liveSeries();
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


    return (
        <Layout  headerData={liveSeriesData}>
            
        <H2h featuredMatch={featuredMatch}></H2h>

        </Layout>
    )
}
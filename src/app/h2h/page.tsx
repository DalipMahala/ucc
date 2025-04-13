import React from 'react'
import Layout from "@/app/components/Layout";
import Image from 'next/image';
import WeeklySlider from "@/app/components/WeeklySlider";
import H2h from './h2h';
import { liveSeries,FeaturedMatch } from "@/controller/homeController";
import { H2hDetails, getTeamId, h2hMatch } from "@/controller/h2hController";
import { TeamDetails } from "@/controller/teamController";


type Params = Promise<{
  teamvsteam: string;
}>;
interface FrMatch {
  match_info: any;
  // Other properties you expect in each match object
}

export default async function Page(props: { params: Params }) {

  const params = await props.params;

  const urlString = params?.teamvsteam ?? '';
  // const parts = urlString.split('-');

  const [firstPart, secondPart] = urlString.split('-vs-');
  const teamA = firstPart;
  // const [teamB, matchType] = secondPart.split('-head-to-head-in-');
  const [teamB, matchType] = secondPart.includes('-head-to-head-in-')
    ? secondPart.split('-head-to-head-in-')
    : ['', ''];

  const tblName = matchType === 'odi' ? 'h2h_odi' : matchType === 'test' ? 'h2h_test' : 'h2h_t20'; 
  
  const teama_id = await getTeamId(teamA);
  const teamb_id = await getTeamId(teamB);
  const teamDetails = await H2hDetails(tblName,teama_id,teamb_id);
  let completedMatch = await h2hMatch(matchType,teama_id,teamb_id);
  const teamADetails = await TeamDetails(teama_id);
  const teamBDetails = await TeamDetails(teamb_id);
  const liveSeriesData = await liveSeries();
  // console.log(teamA);
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
            
        <H2h featuredMatch={featuredMatch} teamDetails={teamDetails} teamADetails={teamADetails} teamBDetails={teamBDetails} urlStrings={urlString} completedMatch={completedMatch}></H2h>

        </Layout>
    )
}
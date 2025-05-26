import React from 'react'
import Layout from "@/app/components/Layout";
import H2h from './h2h';
import H2hipl from './h2hipl';
import { H2hDetails, getTeamId, h2hMatch } from "@/controller/h2hController";
import { TeamDetails, isIPLTeamDetails, AllIntTeam } from "@/controller/teamController";
import { notFound } from 'next/navigation';

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
  if (urlString === '' || urlString === undefined) {
    return notFound();
  }

  // const parts = urlString.split('-');

  const [firstPart, secondPart] = urlString.split('-vs-');
  const teamA = firstPart;
  if (!secondPart.length) {
    return notFound();
  }
  // const [teamB, matchType] = secondPart.split('-head-to-head-in-');
  const [teamB, matchType] = secondPart.includes('-head-to-head-in-')
    ? secondPart.split('-head-to-head-in-')
    : ['', ''];

  let tblName = '';
  const teama_id = await getTeamId(teamA);
  const teamb_id = await getTeamId(teamB);
  const cid = await isIPLTeamDetails(teama_id,2025);
  let allTeams:any = [];
  if(cid !== null && matchType === 'ipl'){
    tblName = 'h2h_ipl'
    allTeams = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/series/SeriesTeams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
      },
      body: JSON.stringify({ cid: cid}),
      cache: "no-store",
    });
   allTeams = await allTeams.json();

    }else{
      tblName = 'h2h'; 
      allTeams = await AllIntTeam();
    }
  const  matchFormate = matchType === 'ipl' ? 't20' : matchType; 
  const teamDetails = await H2hDetails(tblName,matchFormate,teama_id,teamb_id);
  let completedMatch = await h2hMatch(matchFormate,teama_id,teamb_id);
  const teamADetails = await TeamDetails(teamDetails?.teama_id);
  const teamBDetails = await TeamDetails(teamDetails?.teamb_id);


  // console.log("matchType",allIntTeam);
    return (
        <Layout>
        {(cid != null && matchType === 'ipl') ? (
            <H2hipl teamDetails={teamDetails} teamADetails={teamADetails} teamBDetails={teamBDetails} urlStrings={urlString} completedMatch={completedMatch} allTeams={allTeams} />
        ):(
        <H2h teamDetails={teamDetails} teamADetails={teamADetails} teamBDetails={teamBDetails} urlStrings={urlString} completedMatch={completedMatch} allTeams={allTeams} />
        )}
        </Layout>
    )
}
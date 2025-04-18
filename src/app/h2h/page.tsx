import React from 'react'
import Layout from "@/app/components/Layout";
import H2h from './h2h';
import { H2hDetails, getTeamId, h2hMatch } from "@/controller/h2hController";
import { TeamDetails, isIPLTeamDetails } from "@/controller/teamController";
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
  if(cid !== null && matchType === 't20'){
    tblName = 'h2h_ipl'
    }else{
      tblName = matchType === 'odi' ? 'h2h_odi' : matchType === 'test' ? 'h2h_test' : 'h2h_t20'; 
    }
   
  const teamDetails = await H2hDetails(matchType,teama_id,teamb_id);
  let completedMatch = await h2hMatch(matchType,teama_id,teamb_id);
  const teamADetails = await TeamDetails(teamDetails?.teama_id);
  const teamBDetails = await TeamDetails(teamDetails?.teamb_id);
  // console.log(teamA);
 

    return (
        <Layout>
            
        <H2h teamDetails={teamDetails} teamADetails={teamADetails} teamBDetails={teamBDetails} urlStrings={urlString} completedMatch={completedMatch}></H2h>

        </Layout>
    )
}
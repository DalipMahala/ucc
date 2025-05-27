import React from 'react'
import Layout from "@/app/components/Layout";
import { TeamDetails, TeamLast5match, TeamPlayersById, isIPLTeamDetails } from "@/controller/teamController";
// import { Ranking } from "@/controller/playerController";
import Teams from './teamComponents/teamDetails';
import { redirect } from 'next/navigation';
import { notFound } from "next/navigation";
import { urlStringEncode } from "@/utils/utility";

type Params = Promise<{ teamType: string; teamName: string; teamId: number }>

export default async function page(props: { params: Params }) {

  const params = await props.params;
  const teamName = params?.teamName;
  const teamType = params?.teamType;
  const teamId = params?.teamId;

  const teamDetails = await TeamDetails(teamId);
  const teamPlayers = await TeamPlayersById(teamId);
  const teamLast5match = await TeamLast5match(teamId,2);
  const teamUpcomingMatch = await TeamLast5match(teamId,1);
  const cid = await isIPLTeamDetails(teamId,2025);
  if(cid !== null){
    const newPath = '/ipl/2025/'+teamName+'/'+teamId;
    redirect(newPath);
  }

  if (teamDetails){
    if (!teamDetails || teamName?.toLowerCase() !== urlStringEncode(teamDetails?.title)?.toLowerCase() || teamId?.toString() !== teamDetails?.tid?.toString()) {
      notFound();
    }
  }else{
    notFound();
  }
 
  return (
    <Layout >
      
      <Teams  teamLast5match={teamLast5match} teamUpcomingMatch={teamUpcomingMatch} teamDetails={teamDetails} params={params} teamPlayers={teamPlayers}/>
  
    </Layout>
  )
  
}
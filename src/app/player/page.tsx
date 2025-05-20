import React from 'react'
import { notFound } from "next/navigation";
import Layout from "@/app/components/Layout";
import Overview from './playerComponents/Overview';
import Banner from './playerComponents/Banner';
import Stats from './playerComponents/Stats';
import News from './playerComponents/News';
import Photos from './playerComponents/Photos';
import { PlayerStats, PlayerAdvanceStats, Ranking, PlayerProfile } from "@/controller/playerController";
import { urlStringEncode} from "@/utils/utility";


type Params = Promise<{ playerId: number; playerTap: string; playerName: string;}>

interface FrMatch {
    match_info: any;
    // Other properties you expect in each match object
  }

export default async function page(props: { params: Params }) {

  const params = await props.params;
  const playerTab = params?.playerTap;
  const playerId = params?.playerId;
  const playerName = params?.playerName;
  
  const playerStats = await PlayerStats(playerId);
  const playerAdvanceStats = await PlayerAdvanceStats(playerId);
  const playerProfile = await PlayerProfile(playerId,playerName);
  const ranking = await Ranking();
  const urlString = playerName+"/"+playerId;
     console.log('params', params);

  if (playerProfile.length <= 0 || playerName === 'undefined') {
      notFound();
    }


    // let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/featuredMatches`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    //     },
    //     cache: "no-store",
    //   });
    //   let featuredmatchArray = await response.json();
      
    //   const filteredMatches = featuredmatchArray?.data?.map(({ match_info, ...rest }:FrMatch) => ({
    //     ...match_info,
    //     ...rest
    //   }));
    //   const featuredMatch = filteredMatches;


    return (
        <Layout>

            <Banner playerStats={playerStats} ranking={ranking} ></Banner>

            {playerTab === "" || playerTab === undefined && <Overview playerAdvanceStats={playerAdvanceStats} playerStats={playerStats}  urlString={urlString} ranking={ranking} playerProfile={playerProfile} />}
            {playerTab === "stats" && <Stats playerAdvanceStats={playerAdvanceStats} playerStats={playerStats}  urlString={urlString} />}
            {playerTab === "news" && <News  urlString={urlString}/>}
            {playerTab === "photos" && <Photos  urlString={urlString}/>}

            {/* <Overview></Overview> */}

        </Layout>
    )
}
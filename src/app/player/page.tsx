import React from 'react'
import Layout from "@/app/components/Layout";
import Overview from './playerComponents/Overview';
import Banner from './playerComponents/Banner';
import Stats from './playerComponents/Stats';
import News from './playerComponents/News';
import Photos from './playerComponents/Photos';
import { PlayerStats, PlayerAdvanceStats, Ranking, PlayerProfile } from "@/controller/playerController";
import { urlStringEncode} from "@/utils/utility";
import { liveSeries } from "@/controller/homeController";



type Params = Promise<{ playerId: number; playerTap: string; }>

interface FrMatch {
    match_info: any;
    // Other properties you expect in each match object
  }

export default async function page(props: { params: Params }) {

  const params = await props.params;
  const playerTab = params?.playerTap;
  const playerId = params?.playerId;

  const playerStats = await PlayerStats(playerId);
  const playerAdvanceStats = await PlayerAdvanceStats(playerId);
  const playerProfile = await PlayerProfile(playerId);
  const ranking = await Ranking();
  const urlString = urlStringEncode(playerStats?.player?.first_name)+"/"+playerStats?.player?.pid;
  const liveSeriesData = await liveSeries();
    //  console.log('params', playerStats);


    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/featuredMatches`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
        },
        cache: "no-store",
      });
      let featuredmatchArray = await response.json();
      
      const filteredMatches = featuredmatchArray?.data?.map(({ match_info, ...rest }:FrMatch) => ({
        ...match_info,
        ...rest
      }));
      const featuredMatch = filteredMatches;


    return (
        <Layout  headerData={liveSeriesData}>

            <Banner playerStats={playerStats}></Banner>

            {playerTab === "" || playerTab === undefined && <Overview playerAdvanceStats={playerAdvanceStats} playerStats={playerStats}  urlString={urlString} ranking={ranking} playerProfile={playerProfile} featuredMatch = {featuredMatch} />}
            {playerTab === "stats" && <Stats playerAdvanceStats={playerAdvanceStats}  urlString={urlString} />}
            {playerTab === "news" && <News  urlString={urlString}/>}
            {playerTab === "photos" && <Photos  urlString={urlString}/>}

            {/* <Overview></Overview> */}

        </Layout>
    )
}
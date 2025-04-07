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


    return (
        <Layout  headerData={liveSeriesData}>

            <Banner playerStats={playerStats}></Banner>

            {playerTab === "" || playerTab === undefined && <Overview playerAdvanceStats={playerAdvanceStats} playerStats={playerStats}  urlString={urlString} ranking={ranking} playerProfile={playerProfile}/>}
            {playerTab === "stats" && <Stats playerAdvanceStats={playerAdvanceStats}  urlString={urlString} />}
            {playerTab === "news" && <News  urlString={urlString}/>}
            {playerTab === "photos" && <Photos  urlString={urlString}/>}

            {/* <Overview></Overview> */}

        </Layout>
    )
}
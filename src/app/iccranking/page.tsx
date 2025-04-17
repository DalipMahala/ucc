import React from 'react'
import Layout from '../components/Layout'


import Rank from './iccComponents/Ranking';
import { Ranking } from "@/controller/playerController";

type Params = Promise<{ iccRankingName: string; iccRankType: string; iccRankTap: string; }>

export default async function page(props: { params: Params }) {

  const params = await props.params;
  const iccRankingTap = params?.iccRankTap;
  const iccRankingType = params?.iccRankType;
  const iccRankingName = params?.iccRankingName;

  const ranking = await Ranking();

// console.log(data);


  return (
    <Layout>

           <Rank ranking={ranking} iccRankingName={iccRankingName} iccRankingType={iccRankingType} iccRankingTap={iccRankingTap} />          

    </Layout>
  )
}
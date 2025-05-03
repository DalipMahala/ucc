import React from 'react'
import Link from 'next/link'
import { urlStringEncode} from "@/utils/utility";
import MatchTabs from "./../matchComponents/Menu";

interface Live {
    match_id: number;
  
    matchData: any | null;
  
    matchUrl: string | null;
  
    matchCommentary: any | null;
    isPointTable: boolean;
  
    // matchLast:any | null;
  }
  
  export default function Live({
    match_id,
    matchData,
    matchUrl,
    matchCommentary,
    isPointTable
  }: // matchLast,
  Live) {
    const matchDetails = matchData?.match_info;
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
         <MatchTabs matchUrl={matchUrl} match_id={match_id} matchDetails={matchDetails} isPointTable={isPointTable}/>

        <div className='bg-white p-4 rounded-md mb-8'>
              <div className='text-[18px] text-center text-red-600 font-semibold'>
              Match not started, stay tuned.
              </div>
        </div>
        
    </section>
  )
}
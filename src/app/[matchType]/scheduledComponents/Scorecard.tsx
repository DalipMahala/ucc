import Image from "next/image";
import Link from 'next/link';
import { urlStringEncode} from "@/utils/utility";
interface Scorecard {
    match_id: number;
  
    matchData:any | null;
  
    // matchLast:any | null;
  
    matchStates:any | null;
  
    matchUrl :string | null;
    isPointTable: boolean;
  }
  export default function Scorecard({
    match_id,
    matchData,
    // matchLast,
    matchStates,
    matchUrl,
    isPointTable
  }: Scorecard) {
  return (
    <section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
        <div className="my-4">
      <div id="tabs" className="my-4">
        <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
        <Link href={"/moreinfo/"+matchUrl+"/" + match_id}>
            <button
              className="font-medium py-2 px-3 whitespace-nowrap "
            >
              More Info
            </button>
          </Link>
          <Link href={"/live-score/"+matchUrl+"/" + match_id}>
            <button
              className="font-medium py-2 px-3 whitespace-nowrap"
            >
              Live
            </button>
          </Link>
          <Link href={"/scorecard/"+matchUrl+"/" + match_id}>
            <button
              className="font-medium py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md"
            >
              Scorecard
            </button>
          </Link>
          <Link href={"/squad/"+matchUrl+"/"+ match_id}>
            <button
              className="font-medium py-2 px-3 whitespace-nowrap"
            >
              Squad
            </button>
          </Link>
          {isPointTable && (
          <Link href={"/series/"+urlStringEncode(matchData?.match_info?.competition?.title+"-"+matchData?.match_info?.competition?.season)+"/"+matchData?.match_info?.competition?.cid+"/points-table"}>
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Points Table
            </button>
          </Link>
          )}
          <Link href={"/series/"+urlStringEncode(matchData?.match_info?.competition?.title+"-"+matchData?.match_info?.competition?.season)+"/"+matchData?.match_info?.competition?.cid+"/stats/most-run"}>
            <button className="font-medium py-2 px-3 whitespace-nowrap">
              Stats
            </button>
          </Link>
        </div>
      </div>
    </div>
        <div className='bg-white p-4 rounded-md mb-8'>
              <div className='text-[18px] text-center text-red-600 font-semibold'>
              Match not started, stay tuned.
              </div>
        </div>
        
    </section>
  )
}
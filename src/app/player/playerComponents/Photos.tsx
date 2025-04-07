import React from 'react'
import Link from 'next/link'

interface Photos {
    urlString: string;
  }
export default function Photos({urlString}: Photos) {
    return (
        <section className="lg:w-[1000px] md:mx-auto my-5 mx-2">
            <div className="">
                <div id="tabs" className="my-4">
                    <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                        <Link href={"/player/"+urlString}>
                            <button className="font-medium py-2 px-3 whitespace-nowrap"
                            >
                                Overview
                            </button>
                        </Link>
                        <Link href={"/player/"+urlString+"/stats"}>
                            <button className="font-medium py-2 px-3 whitespace-nowrap "
                            >
                                Stats
                            </button>
                        </Link>

                        <Link href={"/player/"+urlString+"/news"}>
                            <button
                                className="font-medium py-2 px-3 whitespace-nowrap"
                            >
                                News
                            </button>
                        </Link>
                        <Link href={"/player/"+urlString+"/photos"}>
                            <button className="font-medium py-2 px-3 whitespace-nowrap bg-[#1A80F8] text-white rounded-md"
                            >
                                Photos
                            </button>
                        </Link>
                    </div>
                </div>
                <div id="tab-content">
                    photos
                </div>
            </div>
          </section>
        
  )
}
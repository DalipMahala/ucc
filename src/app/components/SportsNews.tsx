"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import { truncateText } from "@/utils/utility";
import { format, isSameDay } from "date-fns";

export default function SportsNews() {
    const [activeTab, setActiveTab] = useState("Football");
  const [catids, setCatids] = useState("161");
  const [news, setNews] = useState([]);

  const handleTabClick = (tab: string) => {
    const currentId = (() => {
      switch (tab) {
        case "Football":
          return "161";
        case "Kabaddi":
          return "131";
        case "Hockey":
          return "169";
        case "Tennis":
          return "193";
        case "NFL":
          return "189";
      
        default:
          return "161";
      }
    })(); // Call the function immediately

    setCatids(currentId); // Update category ID
    setActiveTab(tab); // Update active tab
  };

  useEffect(() => {
    fetch(`https://uccricket.live/wp-json/wp/v2/posts?_embed&&categories=${catids}`)
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Error fetching news:", err));
  }, [catids]);
  // console.log("id",news);

  let newsUrls = "sports/football/";
  if(activeTab === 'Kabaddi'){
    newsUrls = "sports/kabaddi/";
  }else if(activeTab === 'Hockey'){
    newsUrls = "sports/hockey/";
  }else if(activeTab === 'Tennis'){
    newsUrls = "sports/tennis/";
  }else if(activeTab === 'NFL'){
    newsUrls = "sports/nfl/";
  }
  return (
    <div className="tab-section mt-5">

      <div className="my-4 flex text-1xl space-x-4 p-2 bg-[#ffffff] rounded-lg relative overflow-x-auto  [&::-webkit-scrollbar] [&::-webkit-scrollbar]:h-[5px] 
         [&::-webkit-scrollbar-track]:bg-gray-100  md:[&::-webkit-scrollbar-thumb]:bg-[#DFE9F6]  [&::-webkit-scrollbar-thumb]:bg-[#c2d7ef]  dark:[&::-webkit-scrollbar-track]:bg-neutral-700  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
         <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'Football' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('Football')}>
          Football
        </button>
        <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'Kabaddi' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('Kabaddi')}>
          Kabaddi
        </button>
        <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'Hockey' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('Hockey')}>
          Hockey
        </button>
        <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'Tennis' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `}  onClick={() => handleTabClick('Tennis')}>
                    Tennis
                  </button>
        
        <button className={`font-medium py-2 px-3 whitespace-nowrap ${activeTab === 'NFL' ? 'bg-[#1A80F8] text-white rounded-md' : ''}  `} onClick={() => handleTabClick('NFL')}>
         NFL
        </button>
       
       
      </div>

     
        <div id="sports" className={`tab-content tab-content-container ${activeTab === 'sports' ? '' : ''}`}>
          <div className="rounded-lg py-4 px-4 bg-[#ffffff]">
            {news.slice(0, 1)?.map((post: any, index: number) => (
              <div className="lg:grid grid-cols-12 gap-4" key={index}>
                <div className="col-span-6 lg:mb-0 mb-2">
                  {post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large?.source_url && (
                    <Link href={post?.link}>
                      <Image 
                      priority={true}
                      loading="eager"
                        // src={post._embedded["wp:featuredmedia"]?.[0]?.source_url}
                        src={post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large?.source_url}
                        quality={75}
                        width={360}
                        height={192}
                        alt="sports News"
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    </Link>
                  )}
                </div>

                <div className="col-span-6 flex flex-col justify-between" >

                  <div>
                  
                    <Link href={post?.link}>
                      <h2 className="text-[18px] font-semibold mb-2 leading-[24px] hover:text-[#1a80f8]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(post?.title?.rendered, 10)) }} >

                      </h2>
                    </Link>
                    <p className="text-gray-500 font-normal" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(post?.uagb_excerpt, 30)) }} >

                    </p>
                  </div>
                  <p className="text-gray-500 font-normal text-[13px] mt-4 flex gap-1 items-center">
                   
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                        />
                      </svg>
                    
                    <span>
                      {format(new Date(post?.modified), "dd MMM, yyyy")}
                    </span>

                  </p>

                </div>
              </div>
            ))}

            <div className="lg:grid grid-cols-12 gap-4 mt-5">
              {news.slice(1, 9)?.map((post: any, index: number) => (

                <div className="col-span-6 border-t-[1px] border-[#E7F2F4] lg:pb-0 pb-4 flex gap-3 mt-4" key={index}>

                 
                    <Link className="w-[45%]" href={post?.link}>
                      {post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium?.source_url && (
                        <Image priority = {index < 2}
                          src={post._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium?.source_url}
                          width={300}
                          height={144}
                          alt={post?.title.rendered}
                          className="rounded-lg h-[90px] object-cover w-[100%]" />
                      )}
                    </Link>
                    <div className="w-[55%] flex flex-col justify-between">
                      <Link className="" href={post?.link}>
                        <h2 className="hidden md:block text-[14px] font-semibold mb-2 hover:text-[#1a80f8]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(post?.title.rendered, 7)) }} >

                        </h2>
                        <h2 className="md:hidden text-[14px] font-semibold mb-2 hover:text-[#1a80f8]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(post?.title.rendered, 11)) }} >

                        </h2>
                      </Link>
                      <p className="text-[12px] text-gray-500 flex gap-1 items-center">

                        {/* <Link href={post?._embedded?.author[0]?.link}>{post._embedded?.author[0]?.name}{" "}</Link> */}
                        <span className=" pr-[1px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                            ></path>
                          </svg>
                        </span>{" "}
                        {format(new Date(post?.modified), "dd MMM, yyyy")}
                      </p>
                    
                  </div>

                </div>


              ))}
            </div>

            <Link href={"https://uccricket.live/" + newsUrls}>
              <div className="text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-8 underline">
                More from {activeTab}{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-3 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
     
    </div>

  );
}
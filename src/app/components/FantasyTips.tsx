"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";
import { truncateText } from "@/utils/utility";
import { format, isSameDay } from "date-fns";
import Parser from "rss-parser";

// interface H2h {
//   feed: any | null;
// }
const FantasyTips = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
      fetch(`https://uccricket.live/wp-json/wp/v2/posts?_embed&&categories=80`)
        .then((res) => res.json())
        .then((data) => setNews(data))
        .catch((err) => console.error("Error fetching news:", err));
    }, []);
  // console.log("id", news[0]);
  return (
    <div className=" my-4">
      <div className="py-2 mb-2">
        <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
          Fantasy Tips
        </h3>
      </div>
      <div className="bg-[#ffffff] rounded-lg ">
        <div className="p-4">
          {news?.slice(0,10)?.map((tips:any, index:number) =>(
          <div className={`pb-2 mb-4 ${index !== 9 ? "border-b-[1px] border-border-gray-700":""} `} key={index}>
            <Link href={tips.link}>
            
            <p className="text-[13px] font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tips.title.rendered)}}>
             
            </p>
            </Link>
            <p className="text-[#586577] pt-2">{((d=>(d<0?`in ${Math.ceil(-d/3.6e6)}h`:d<3.6e6?`${Math.floor(d/6e4)} minutes ago`:d<8.64e7?`${Math.floor(d/3.6e6)} hrs ago`:`${Math.floor(d/8.64e7)} day ago`))(Date.now()-new Date(tips.date_gmt).getTime()))}</p>
          </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};
export default FantasyTips;

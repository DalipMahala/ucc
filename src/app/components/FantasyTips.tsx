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
    const parser = new Parser();

    const fetchNews = async () => {
      try {
        // Note: You may need a CORS proxy if the feed doesn't allow direct access
        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            "https://uccricket.live/fantasy-cricket/feed/"
          )}`
        );
        const data = await response.json();
        const base64Content = data.contents.split("base64,")[1];

        // Decode from base64
        const decodedContent = atob(base64Content);
        const normalizedContent = decodedContent
        .replace(/â/g, "'") // Fix common encoding artifacts
        .replace(/â/g, "-")  // Fix en-dash encoding
        .normalize("NFKD");
        // Clean the content if needed
        const cleanedContent = normalizedContent
          .replace(/^[\s\uFEFF\xA0]+/, "") // Remove BOM and whitespace
          .trim();

        const parser = new Parser();
        const feed: any = await parser.parseString(cleanedContent);
        setNews(feed.items || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, []);
  // console.log("id", news);
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
            
            <p className="text-[13px] font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tips.title)}}>
             
            </p>
            </Link>
            <p className="text-[#586577] pt-2">{((d=>(d<0?`in ${Math.ceil(-d/3.6e6)}h`:d<3.6e6?`${Math.floor(d/6e4)} minutes ago`:d<8.64e7?`${Math.floor(d/3.6e6)} hrs ago`:`${Math.floor(d/8.64e7)} day ago`))(Date.now()-new Date(tips.pubDate).getTime()))}</p>
          </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};
export default FantasyTips;

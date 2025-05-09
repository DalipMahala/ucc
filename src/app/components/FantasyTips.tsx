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

      <h2 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8] my-2">
        Fantasy Tips
      </h2>

      <div className="bg-[#ffffff] rounded-lg ">
        <div className="p-4">
          {news?.slice(0, 10)?.map((tips: any, index: number) => (
            <div className={`pb-2 mb-4 flex items-start gap-1 ${index !== 9 ? "border-b-[1px] border-border-gray-700" : ""} `} key={index}>
              {/* <span className="pt-[2px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#1a80f8" className="size-4">
                  <path fillRule="evenodd" d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z" clipRule="evenodd" />
                </svg>
              </span> */}

            <span className="text-[18px] leading-[22px] text-[#1A80F8] font-normal">  {index + 1 }. </span>

              <Link href={tips.link}>
                <h3 className="text-[13px] font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(tips.title.rendered, 15)) }}>

                </h3>
                <p className="text-[#586577] pt-2">{((d => (d < 0 ? `in ${Math.ceil(-d / 3.6e6)}h` : d < 3.6e6 ? `${Math.floor(d / 6e4)} minutes ago` : d < 8.64e7 ? `${Math.floor(d / 3.6e6)} hrs ago` : `${Math.floor(d / 8.64e7)} day ago`))(Date.now() - new Date(tips.date_gmt).getTime()))}</p>

              </Link>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};
export default FantasyTips;

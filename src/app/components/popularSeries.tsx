"use client"
import React,{useState,useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";


export default function PLSeries() {
  const [popularSeries, setPopularSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/series/PopularSeries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        
        if (res.success) {
          setPopularSeries(res.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  // console.log("Popular", popularSeries);
  return (
    <div className=" pb-2 my-4">
      <div className="py-2">
        <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
          POPULAR SERIES
        </h3>
      </div>
      <div className="">
        {popularSeries?.map((series: any, index: number) => (
          <Link
            href={
              "/series/" +
              urlStringEncode(series.title + "-" + series.title) +
              "/" +
              series.cid
            }
            key={index}
          >
            <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2">
              <div>
                <Image
                  src={series?.logo ? series?.logo : "/assets/img/series/series.svg"}
                  width={20}
                  height={20}
                  alt=""
                  loading="lazy"
                  className="rounded-full"
                />
              </div>
              <div className="font-medium text-[#394351]">{series?.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

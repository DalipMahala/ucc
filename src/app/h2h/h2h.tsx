"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import WeeklySlider from "@/app/components/WeeklySlider";
import Image from "next/image";
import { format } from "date-fns";
import { urlStringEncode } from "@/utils/utility";

interface H2h {
    featuredMatch: any | null;
}
export default function H2h({featuredMatch}:H2h) {
  const [activeTab, setActiveTab] = useState("test");
  const [show, setShow] = useState(false);

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const showHandler = () => {
    setShow(true);
  };


  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("https://uccricket.live/wp-json/wp/v2/posts?_embed&&categories=21")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  return (
    <><div className="p-4">
          <h2 className="text-xl font-bold mb-4">Latest News</h2>
          {news.length === 0 ? (
              <p>Loading...</p>
          ) : (
              <ul>
                  {news?.map((post: any) => (
                      <li key={post.id} className="mb-6 border-b pb-4">
                          {/* Featured Image */}
                          {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                              <img
                                  src={post._embedded["wp:featuredmedia"][0].source_url}
                                  alt={post.title.rendered}
                                  className="w-full h-48 object-cover rounded-md mb-2" />
                          )}

                          {/* News Title */}
                          <a
                              href={post.link}
                              target="_blank"
                              className="text-blue-600 font-semibold text-lg"
                          >
                              {post.title.rendered}
                          </a>

                          {/* News Excerpt */}
                          <p
                              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                              className="text-gray-700"
                          ></p>
                      </li>
                  ))}
              </ul>
          )}
      </div><section className="bg-[#0E2149] border-[1px] border-[#E4E9F01A] lg:px-0 px-3">
              <div className="border-t-[1px] border-[#E4E9F01A]">
                  <div className="lg:w-[1000px] mx-auto md:py-8 tracking-[1px]">
                      <div className="flex py-8 justify-between items-center">
                          <div className="flex flex-col md:flex-row text-[#FF912C] font-bold uppercase  md:items-center items-start ">
                              <Image  loading="lazy" 
                                  className="md:h-[42px] md:w-[42px] h-[30px] w-[30px]"
                                  src="/assets/img/flg-1.png"
                                  width={20}
                                  height={20}
                                  alt="ind" />
                              <p className="text-[#BDCCECA8] md:mx-3 mx-0 md:text-[19px] text-[14px] font-semibold uppercase">
                                  IND
                              </p>
                          </div>
                          <div className="text-[#8192B4] font-normal  text-center">
                              <p className="text-[#FFBD71] md:text-[20px] text-[16px] font-semibold">
                                  IND vs BAN Head to Head in Test
                              </p>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center items-end text-[#8192B4] font-normal justify-end">
                              <p className="text-[#BDCCECA8] md:block hidden md:text-[19px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                                  BAN
                              </p>
                              <Image  loading="lazy" 
                                  src="/assets/img/ban.png"
                                  className="md:h-[42px] md:w-[42px] h-[30px] w-[30px]"
                                  width={20}
                                  height={20}
                                  alt="ban" />
                              <p className="text-[#BDCCECA8] md:hidden md:text-[19px] text-[14px] md:mx-3 mx-0 font-semibold uppercase">
                                  BAN
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </section><section className="lg:w-[1000px] mx-auto md:mb-0 mb-4 px-2 lg:px-0">
              <div id="tabs" className="my-4">
                  <div className="flex text-1xl space-x-8 p-2 bg-[#ffffff] rounded-lg overflow-auto">
                      <button
                          onClick={() => handleTabClick("test")}
                          className={`font-medium py-2 px-5 whitespace-nowrap ${activeTab === "test" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                      >
                          Test
                      </button>
                      <button
                          onClick={() => handleTabClick("odi")}
                          className={`font-medium py-2 px-5 whitespace-nowrap ${activeTab === "odi" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                      >
                          ODI
                      </button>
                      <button
                          onClick={() => handleTabClick("t20")}
                          className={`font-medium py-2 px-5 whitespace-nowrap ${activeTab === "t20" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                      >
                          T20
                      </button>
                      <button
                          onClick={() => handleTabClick("t20wc")}
                          className={`font-medium py-2 px-5 whitespace-nowrap ${activeTab === "t20wc" ? "bg-[#1A80F8] text-white" : ""} rounded-md`}
                      >
                          T20 WC
                      </button>
                  </div>
              </div>
              <div id="tab-content">
                  <div
                      id="test"
                      // className="tab-content"
                      className={`tab-content ${activeTab === "test" ? "" : "hidden"}`}
                  >
                      <div className="md:grid grid-cols-12 gap-4">
                          <div className="lg:col-span-8 md:col-span-7">
                              <div className="rounded-lg bg-[#ffffff] p-4">
                                  <h3 className="text-[15px] font-semibold pl-[7px] border-l-[3px] mb-3 border-[#229ED3]">
                                      India vs Bangladesh Head to Head in Test Records
                                  </h3>
                                  <div className="border-t-[1px] border-[#E4E9F0]" />
                                  {/* Main Section */}
                                  <div className="mt-4">
                                      <div className="mb-6">
                                          <p className="text-gray-700">
                                              India and South Africa have faced each other in 94
                                              matches in ODI. Out of these 94 games, India have won 40
                                              whereas South Africa have come out victorious on 51
                                              occasions. 3 matches ended without a result.
                                          </p>
                                      </div>
                                      {/* Dropdowns and Matches */}
                                      <div className="flex flex-col gap-2 md:gap-0 sm:flex-row justify-between items-center mb-4">
                                          {/* First Dropdown */}
                                          <div className="w-full relative">
                                              <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                                                  <span id="selected1" className="flex items-center">
                                                      <Image  loading="lazy" 
                                                          src="/assets/img/in.png"
                                                          width={30}
                                                          height={30}
                                                          alt="India"
                                                          className="h-[16px] mr-2" />{" "}
                                                      India
                                                  </span>
                                              </div>
                                          </div>
                                          {/* Center Text */}
                                          <div className="text-center font-bold md:text-1xl">
                                              VS
                                          </div>
                                          {/* Second Dropdown */}
                                          <div className="w-full text-right">
                                              <div className="relative flex justify-end">
                                                  <div className="border border-gray-300 rounded-md p-2 text-gray-700 md:w-[70%] w-full cursor-pointer">
                                                      <span id="selected2" className="flex items-center">
                                                          <Image  loading="lazy" 
                                                              src="/assets/img/bd.png"
                                                              width={30}
                                                              height={30}
                                                              alt="Bangladesh"
                                                              className="h-[16px] mr-2" />{" "}
                                                          Bangladesh
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="flex justify-center text-center">
                                          <div className="border-[1px] border-[#E4E9F0] p-2 rounded-md font-semibold text-1xl">
                                              <p>42</p>
                                              <p>Mactches</p>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "60%" }}
                                                      ></div>
                                                  </div>
                                                  <span>32</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>8</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "20%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#B7132B] h-2"
                                                          style={{ width: "20%" }}
                                                      ></div>
                                                  </div>
                                                  <span>8</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Lost</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>32</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#B7132B] h-2"
                                                          style={{ width: "60%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>1</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">No Result</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>1</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>0</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Tied</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>0</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>4</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Home Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>6</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>18</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Away Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>0</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="my-4">
                                          <div className="flex justify-between items-center">
                                              <div className="flex justify-between items-center w-full">
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                                  <span>10</span>
                                              </div>
                                              <div className="md:w-[50%] w-full text-center">
                                                  <span className="font-semibold">Neutral Won</span>
                                              </div>
                                              <div className="flex justify-between items-center w-full">
                                                  <span>2</span>
                                                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                                                      <div
                                                          className="bg-[#13b76dbd] h-2"
                                                          style={{ width: "0%" }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className=" bg-[white] p-4 rounded-lg my-4">
                                  <div className="md:flex justify-between items-center mb-3">
                                      <h3 className="text-1xl font-semibold pl-[7px] border-l-[3px] border-[#229ED3]">
                                          India Vs bangladesh Recent T20 Matches
                                      </h3>
                                  </div>
                                  <div className="grid grid-cols-12 gap-4 cust-tp-pera-card-section">
                                      <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                          <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                              <div className="flex justify-between items-center pb-1">
                                                  <div>
                                                      <h2 className="text-1xl font-semibold">Match 29</h2>
                                                      <p className="text-[#7B4C09] font-medium">
                                                          Tue, 19 Oct - 09:30 AM
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="flex items-center justify-between py-3">
                                                  <a href="#">
                                                      <div className="flex space-x-2 ">
                                                          <div className="flex items-center space-x-1 flex-col">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-8.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="wiw" />
                                                              <span className="text-[#909090]">IND</span>
                                                          </div>
                                                          <div className="mt-1">
                                                              <p className="text-1xl font-semibold">120/8</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                      </div>
                                                  </a>
                                                  <div className="text-gray-500 text-2xl font-semibold">
                                                      ↔
                                                  </div>
                                                  <a href="#">
                                                      <div className="flex space-x-2 justify-end">
                                                          <div className="mt-1 text-end">
                                                              <p className="text-1xl font-semibold">128/9</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                          <div className="flex items-center space-x-1 flex-col font-medium">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-10.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="nz" />
                                                              <span className="text-[#909090]">BAN</span>
                                                          </div>
                                                      </div>
                                                  </a>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="text-center mt-3">
                                                  <a href="#">
                                                      <p className="text-green-600 font-semibold">
                                                          IND won by 7 Wicket
                                                      </p>
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                          <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                              <div className="flex justify-between items-center pb-1">
                                                  <div>
                                                      <h2 className="text-1xl font-semibold">Match 29</h2>
                                                      <p className="text-[#7B4C09] font-medium">
                                                          Tue, 19 Oct - 09:30 AM
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="flex items-center justify-between py-3">
                                                  <a href="#">
                                                      <div className="flex space-x-2 ">
                                                          <div className="flex items-center space-x-1 flex-col">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-8.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="wiw" />
                                                              <span className="text-[#909090]">IND</span>
                                                          </div>
                                                          <div className="mt-1">
                                                              <p className="text-1xl font-semibold">120/8</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                      </div>
                                                  </a>
                                                  <div className="text-gray-500 text-2xl font-semibold">
                                                      ↔
                                                  </div>
                                                  <a href="#">
                                                      <div className="flex space-x-2 justify-end">
                                                          <div className="mt-1 text-end">
                                                              <p className="text-1xl font-semibold">128/9</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                          <div className="flex items-center space-x-1 flex-col font-medium">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-10.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="nz" />
                                                              <span className="text-[#909090]">BAN</span>
                                                          </div>
                                                      </div>
                                                  </a>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="text-center mt-3">
                                                  <a href="#">
                                                      <p className="text-green-600 font-semibold">
                                                          IND won by 7 Wicket
                                                      </p>
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                          <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                              <div className="flex justify-between items-center pb-1">
                                                  <div>
                                                      <h2 className="text-1xl font-semibold">Match 29</h2>
                                                      <p className="text-[#7B4C09] font-medium">
                                                          Tue, 19 Oct - 09:30 AM
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="flex items-center justify-between py-3">
                                                  <a href="#">
                                                      <div className="flex space-x-2 ">
                                                          <div className="flex items-center space-x-1 flex-col">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-8.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="wiw" />
                                                              <span className="text-[#909090]">IND</span>
                                                          </div>
                                                          <div className="mt-1">
                                                              <p className="text-1xl font-semibold">120/8</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                      </div>
                                                  </a>
                                                  <div className="text-gray-500 text-2xl font-semibold">
                                                      ↔
                                                  </div>
                                                  <a href="#">
                                                      <div className="flex space-x-2 justify-end">
                                                          <div className="mt-1 text-end">
                                                              <p className="text-1xl font-semibold">128/9</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                          <div className="flex items-center space-x-1 flex-col font-medium">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-10.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="nz" />
                                                              <span className="text-[#909090]">BAN</span>
                                                          </div>
                                                      </div>
                                                  </a>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="text-center mt-3">
                                                  <a href="#">
                                                      <p className="text-green-600 font-semibold">
                                                          IND won by 7 Wicket
                                                      </p>
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                          <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                              <div className="flex justify-between items-center pb-1">
                                                  <div>
                                                      <h2 className="text-1xl font-semibold">Match 29</h2>
                                                      <p className="text-[#7B4C09] font-medium">
                                                          Tue, 19 Oct - 09:30 AM
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="flex items-center justify-between py-3">
                                                  <a href="#">
                                                      <div className="flex space-x-2 ">
                                                          <div className="flex items-center space-x-1 flex-col">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-8.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="wiw" />
                                                              <span className="text-[#909090]">IND</span>
                                                          </div>
                                                          <div className="mt-1">
                                                              <p className="text-1xl font-semibold">120/8</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                      </div>
                                                  </a>
                                                  <div className="text-gray-500 text-2xl font-semibold">
                                                      ↔
                                                  </div>
                                                  <a href="#">
                                                      <div className="flex space-x-2 justify-end">
                                                          <div className="mt-1 text-end">
                                                              <p className="text-1xl font-semibold">128/9</p>
                                                              <p className="text-[#909090]">(20.0 overs)</p>
                                                          </div>
                                                          <div className="flex items-center space-x-1 flex-col font-medium">
                                                              <Image  loading="lazy" 
                                                                  src="/assets/img/flag/b-10.png"
                                                                  className="h-[30px] rounded-full"
                                                                  width={30}
                                                                  height={30}
                                                                  alt="nz" />
                                                              <span className="text-[#909090]">BAN</span>
                                                          </div>
                                                      </div>
                                                  </a>
                                              </div>
                                              <div className="border-t-[1px] border-[#E4E9F0]" />
                                              <div className="text-center mt-3">
                                                  <a href="#">
                                                      <p className="text-green-600 font-semibold">
                                                          IND won by 7 Wicket
                                                      </p>
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                      {show && (
                                          <>
                                              <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                                  <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                                      <div className="flex justify-between items-center pb-1">
                                                          <div>
                                                              <h2 className="text-1xl font-semibold">
                                                                  Match 29
                                                              </h2>
                                                              <p className="text-[#7B4C09] font-medium">
                                                                  Tue, 19 Oct - 09:30 AM
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="flex items-center justify-between py-3">
                                                          <a href="#">
                                                              <div className="flex space-x-2 ">
                                                                  <div className="flex items-center space-x-1 flex-col">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-8.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="wiw" />
                                                                      <span className="text-[#909090]">IND</span>
                                                                  </div>
                                                                  <div className="mt-1">
                                                                      <p className="text-1xl font-semibold">
                                                                          120/8
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                          <div className="text-gray-500 text-2xl font-semibold">
                                                              ↔
                                                          </div>
                                                          <a href="#">
                                                              <div className="flex space-x-2 justify-end">
                                                                  <div className="mt-1 text-end">
                                                                      <p className="text-1xl font-semibold">
                                                                          128/9
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                                  <div className="flex items-center space-x-1 flex-col font-medium">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-10.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="nz" />
                                                                      <span className="text-[#909090]">BAN</span>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="text-center mt-3">
                                                          <a href="#">
                                                              <p className="text-green-600 font-semibold">
                                                                  IND won by 7 Wicket
                                                              </p>
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                                  <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                                      <div className="flex justify-between items-center pb-1">
                                                          <div>
                                                              <h2 className="text-1xl font-semibold">
                                                                  Match 29
                                                              </h2>
                                                              <p className="text-[#7B4C09] font-medium">
                                                                  Tue, 19 Oct - 09:30 AM
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="flex items-center justify-between py-3">
                                                          <a href="#">
                                                              <div className="flex space-x-2 ">
                                                                  <div className="flex items-center space-x-1 flex-col">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-8.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="wiw" />
                                                                      <span className="text-[#909090]">IND</span>
                                                                  </div>
                                                                  <div className="mt-1">
                                                                      <p className="text-1xl font-semibold">
                                                                          120/8
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                          <div className="text-gray-500 text-2xl font-semibold">
                                                              ↔
                                                          </div>
                                                          <a href="#">
                                                              <div className="flex space-x-2 justify-end">
                                                                  <div className="mt-1 text-end">
                                                                      <p className="text-1xl font-semibold">
                                                                          128/9
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                                  <div className="flex items-center space-x-1 flex-col font-medium">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-10.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="nz" />
                                                                      <span className="text-[#909090]">BAN</span>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="text-center mt-3">
                                                          <a href="#">
                                                              <p className="text-green-600 font-semibold">
                                                                  IND won by 7 Wicket
                                                              </p>
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                                  <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                                      <div className="flex justify-between items-center pb-1">
                                                          <div>
                                                              <h2 className="text-1xl font-semibold">
                                                                  Match 29
                                                              </h2>
                                                              <p className="text-[#7B4C09] font-medium">
                                                                  Tue, 19 Oct - 09:30 AM
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="flex items-center justify-between py-3">
                                                          <a href="#">
                                                              <div className="flex space-x-2 ">
                                                                  <div className="flex items-center space-x-1 flex-col">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-8.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="wiw" />
                                                                      <span className="text-[#909090]">IND</span>
                                                                  </div>
                                                                  <div className="mt-1">
                                                                      <p className="text-1xl font-semibold">
                                                                          120/8
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                          <div className="text-gray-500 text-2xl font-semibold">
                                                              ↔
                                                          </div>
                                                          <a href="#">
                                                              <div className="flex space-x-2 justify-end">
                                                                  <div className="mt-1 text-end">
                                                                      <p className="text-1xl font-semibold">
                                                                          128/9
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                                  <div className="flex items-center space-x-1 flex-col font-medium">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-10.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="nz" />
                                                                      <span className="text-[#909090]">BAN</span>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="text-center mt-3">
                                                          <a href="#">
                                                              <p className="text-green-600 font-semibold">
                                                                  IND won by 7 Wicket
                                                              </p>
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="md:col-span-6 col-span-12 cust-tp-pera-card">
                                                  <div className="bg-[#f2f7ff] rounded-lg max-w-md w-full p-4 border-[1px]">
                                                      <div className="flex justify-between items-center pb-1">
                                                          <div>
                                                              <h2 className="text-1xl font-semibold">
                                                                  Match 29
                                                              </h2>
                                                              <p className="text-[#7B4C09] font-medium">
                                                                  Tue, 19 Oct - 09:30 AM
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="flex items-center justify-between py-3">
                                                          <a href="#">
                                                              <div className="flex space-x-2 ">
                                                                  <div className="flex items-center space-x-1 flex-col">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-8.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="wiw" />
                                                                      <span className="text-[#909090]">IND</span>
                                                                  </div>
                                                                  <div className="mt-1">
                                                                      <p className="text-1xl font-semibold">
                                                                          120/8
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                          <div className="text-gray-500 text-2xl font-semibold">
                                                              ↔
                                                          </div>
                                                          <a href="#">
                                                              <div className="flex space-x-2 justify-end">
                                                                  <div className="mt-1 text-end">
                                                                      <p className="text-1xl font-semibold">
                                                                          128/9
                                                                      </p>
                                                                      <p className="text-[#909090]">
                                                                          (20.0 overs)
                                                                      </p>
                                                                  </div>
                                                                  <div className="flex items-center space-x-1 flex-col font-medium">
                                                                      <Image  loading="lazy" 
                                                                          src="/assets/img/flag/b-10.png"
                                                                          className="h-[30px] rounded-full"
                                                                          width={30}
                                                                          height={30}
                                                                          alt="nz" />
                                                                      <span className="text-[#909090]">BAN</span>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      </div>
                                                      <div className="border-t-[1px] border-[#E4E9F0]" />
                                                      <div className="text-center mt-3">
                                                          <a href="#">
                                                              <p className="text-green-600 font-semibold">
                                                                  IND won by 7 Wicket
                                                              </p>
                                                          </a>
                                                      </div>
                                                  </div>
                                              </div>
                                          </>
                                      )}
                                      {!show && (
                                          <div className="col-span-12 text-center flex justify-center">
                                              <button
                                                  className="cust-tp-pera-load-more text-[#1A80F8] font-semibold flex items-center justify-center text-[13px] pt-2 underline"
                                                  onClick={() => showHandler()}
                                              >
                                                  Load More{" "}
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
                                                          d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                                  </svg>
                                              </button>
                                          </div>
                                      )}
                                  </div>
                              </div>
                              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                                  <h3 className="text-1xl font-semibold mb-1">
                                      India vs Zimbabwe 2024
                                  </h3>
                                  <p className="text-gray-500 font-normal">
                                      The biggest tournament in the cricketing circuit, the ICC
                                      T20 WORLD Cup is underway in the USAs and the West Indies.
                                      The tournament received excellent response from the fans
                                      worldwide...
                                  </p>
                                  <a href="#">
                                      <p className="text-[#1A80F8] font-semibold flex items-center text-[13px] pt-2 underline">
                                          Read more{" "}
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
                                                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                          </svg>
                                      </p>
                                  </a>
                              </div>
                              <div className="rounded-lg bg-[#ffffff] p-4 mb-4">
                                  <h3 className="text-1xl font-semibold mb-2 pl-[7px] border-l-[3px] border-[#229ED3]">
                                      News
                                  </h3>
                                  <div className="border-t-[1px] border-[#E4E9F0]" />
                                  <div className="lg:grid grid-cols-12 gap-4 mt-4">
                                      {/* Main News Item */}
                                      <div className="col-span-6 border-r-[1px] border-[#E7F2F4] pr-[16px]">
                                          <Image  loading="lazy" 
                                              src="/assets/img/team-1.png"
                                              alt="Main news"
                                              className="rounded-lg w-full h-48 object-cover mb-3"
                                              width={300}
                                              height={300} />
                                          <h3 className="text-1xl font-semibold mb-1">
                                              Live - Jagadeesan hits a century; Haryana trounce
                                          </h3>
                                          <p className="text-gray-500 font-normal">
                                              India will go into the home Test series against New
                                              Zealand with pretty much the same squad that took on
                                              Bangladesh in September - Indias last red-ball action
                                              ahead of the five-Test...
                                          </p>
                                          <div className="border-l-[1px] border-[#E7F2F4]" />
                                      </div>
                                      {/* Side News Items */}
                                      <div className="col-span-6">
                                          {/* Single News Item */}
                                          <div className="flex gap-3 my-3">
                                              <Image  loading="lazy" 
                                                  src="/assets/img/team-2.png"
                                                  alt="News thumbnail"
                                                  className="rounded-lg h-[77px]"
                                                  width={77}
                                                  height={77} />
                                              <div>
                                                  <h4 className="text-[13px] font-semibold mb-2">
                                                      Womens T20 World Cup, 2nd Semifinal | WI-W Vs NZ-W
                                                      Playing 11 Prediction
                                                  </h4>
                                                  <p className="text-[12px] text-gray-500 flex items-center">
                                                      <span className="ml-2 pr-[1px]">
                                                          <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              x="0px"
                                                              y="0px"
                                                              width={15}
                                                              height={15}
                                                              viewBox="0 0 48 48"
                                                          >
                                                              <polygon
                                                                  fill="#42a5f5"
                                                                  points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
                                                              ></polygon>
                                                              <polygon
                                                                  fill="#fff"
                                                                  points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
                                                              ></polygon>
                                                          </svg>
                                                      </span>{" "}
                                                      Akshita Patel{" "}
                                                      <span className="ml-2 pr-[1px]">
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
                                                      October 9, 2024
                                                  </p>
                                              </div>
                                          </div>
                                          <div className="border-t-[1px] border-[#E7F2F4]" />
                                          <div className="flex gap-3 my-3">
                                              <Image  loading="lazy" 
                                                  src="/assets/img/team-3.png"
                                                  alt="News thumbnail"
                                                  className="rounded-lg h-[77px]"
                                                  width={77}
                                                  height={77} />
                                              <div>
                                                  <h4 className="text-[13px] font-semibold mb-2">
                                                      AUS-W Vs SA-W Highlights: Anneke Bosch Overpowers
                                                      Australia To Guide South Africa.
                                                  </h4>
                                                  <p className="text-[12px] text-gray-500 flex items-center">
                                                      <span className="ml-2 pr-[1px]">
                                                          <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              x="0px"
                                                              y="0px"
                                                              width={15}
                                                              height={15}
                                                              viewBox="0 0 48 48"
                                                          >
                                                              <polygon
                                                                  fill="#42a5f5"
                                                                  points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
                                                              ></polygon>
                                                              <polygon
                                                                  fill="#fff"
                                                                  points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
                                                              ></polygon>
                                                          </svg>
                                                      </span>{" "}
                                                      Akshita Patel{" "}
                                                      <span className="ml-2 pr-[1px]">
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
                                                      October 9, 2024
                                                  </p>
                                              </div>
                                          </div>
                                          <div className="border-t-[1px] border-[#E7F2F4]" />
                                          <div className="flex gap-3 my-3">
                                              <Image  loading="lazy" 
                                                  src="/assets/img/team-4.png"
                                                  alt="News thumbnail"
                                                  className="rounded-lg h-[77px]"
                                                  width={77}
                                                  height={77} />
                                              <div>
                                                  <h4 className="text-[13px] font-semibold mb-2">
                                                      WI-W vs NZ-W Dream11 Prediction Today Match, Fantasy
                                                      Cricket Tips, Pitch Report
                                                  </h4>
                                                  <p className="text-[12px] text-gray-500 flex items-center">
                                                      <span className="ml-2 pr-[1px]">
                                                          <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              x="0px"
                                                              y="0px"
                                                              width={15}
                                                              height={15}
                                                              viewBox="0 0 48 48"
                                                          >
                                                              <polygon
                                                                  fill="#42a5f5"
                                                                  points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
                                                              ></polygon>
                                                              <polygon
                                                                  fill="#fff"
                                                                  points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
                                                              ></polygon>
                                                          </svg>
                                                      </span>{" "}
                                                      P Bhattachar{" "}
                                                      <span className="ml-2 pr-[1px]">
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
                                                      October 9, 2024
                                                  </p>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="lg:col-span-4 md:col-span-5">
                              <div className="bg-white rounded-lg p-4 mb-4">
                                  <div className="flex gap-1 items-center justify-between">
                                      <div className="flex gap-1 items-center">
                                          <div className="col-span-4 relative">
                                              <Image  loading="lazy" 
                                                  src="/assets/img/home/trofi.png"
                                                  className="h-[75px]"
                                                  alt=""
                                                  width={75}
                                                  height={75} />
                                          </div>
                                          <div className="col-span-8 relative">
                                              <h3 className="font-semibold text-[19px] mb-1">
                                                  Weekly challenge
                                              </h3>
                                              <p className="font-semibold text-[13px] text-[#1a80f8]">
                                                  <span className="text-[#586577]">Time Left:</span>2
                                                  Days 12h
                                              </p>
                                          </div>
                                      </div>
                                      <div className="">
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth="1.5"
                                              stroke="currentColor"
                                              className="size-4"
                                          >
                                              <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                          </svg>
                                      </div>
                                  </div>
                              </div>
                              <WeeklySlider featuredMatch={featuredMatch}/>
                              <div className=" pb-2 my-4">
                                  <div className="py-2">
                                      <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
                                          POPULAR
                                      </h3>
                                  </div>
                                  <div className="">
                                      <a href="#">
                                          <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2">
                                              <div>
                                                  <Image  loading="lazy" 
                                                      src="/assets/img/1.png"
                                                      width={20}
                                                      height={20}
                                                      alt="" />
                                              </div>
                                              <div className="font-medium text-[#394351]">
                                                  ICC World cup
                                              </div>
                                          </div>
                                      </a>
                                      <a href="#">
                                          <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                              <div>
                                                  <Image  loading="lazy" 
                                                      src="/assets/img/2.png"
                                                      width={20}
                                                      height={20}
                                                      alt="" />
                                              </div>
                                              <div className="font-medium text-[#394351]">
                                                  ICC Champion Trophy
                                              </div>
                                          </div>
                                      </a>
                                      <a href="#">
                                          <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                              <div>
                                                  <Image  loading="lazy" 
                                                      src="/assets/img/3.png"
                                                      width={20}
                                                      height={20}
                                                      alt="" />
                                              </div>
                                              <div className="font-medium text-[#394351]">
                                                  T20 World Cup
                                              </div>
                                          </div>
                                      </a>
                                      <a href="#">
                                          <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                              <div>
                                                  <Image  loading="lazy" 
                                                      src="/assets/img/4.png"
                                                      width={20}
                                                      height={20}
                                                      alt="" />
                                              </div>
                                              <div className="font-medium text-[#394351]">
                                                  Indian Premium League
                                              </div>
                                          </div>
                                      </a>
                                      <a href="#">
                                          <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                              <div>
                                                  <Image  loading="lazy" 
                                                      src="/assets/img/5.png"
                                                      width={20}
                                                      height={20}
                                                      alt="" />
                                              </div>
                                              <div className="font-medium text-[#394351]">
                                                  Pakistan Super League
                                              </div>
                                          </div>
                                      </a>
                                      <a href="#">
                                          <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                              <div>
                                                  <Image  loading="lazy" 
                                                      src="/assets/img/6.png"
                                                      width={20}
                                                      height={20}
                                                      alt="" />
                                              </div>
                                              <div className="font-medium text-[#394351]">
                                                  Bangladesh Premium Leaguge
                                              </div>
                                          </div>
                                      </a>
                                      <a href="#">
                                          <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3 mb-2 ">
                                              <div>
                                                  <Image  loading="lazy" 
                                                      src="/assets/img/7.png"
                                                      width={20}
                                                      height={20}
                                                      alt="" />
                                              </div>
                                              <div className="font-medium text-[#394351]">
                                                  Big Bash Leaguge
                                              </div>
                                          </div>
                                      </a>
                                      <a href="#">
                                          <div className="bg-[#ffffff] text-[14px] rounded-lg px-4 flex items-center space-x-3 py-3">
                                              <div>
                                                  <Image  loading="lazy" 
                                                      src="/assets/img/8.png"
                                                      width={20}
                                                      height={20}
                                                      alt="" />
                                              </div>
                                              <div className="font-medium text-[#394351]">
                                                  Super Smash
                                              </div>
                                          </div>
                                      </a>
                                  </div>
                              </div>
                              <div className=" my-4">
                                  <div className="py-2 mb-2">
                                      <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
                                          Fantasy Tips
                                      </h3>
                                  </div>
                                  <div className="bg-[#ffffff] rounded-lg ">
                                      <div className="p-4">
                                          <div className=" pb-2 mb-4 border-b-[1px] border-border-gray-700 ">
                                              <p className="text-[13px] font-semibold">
                                                  NZ-W Vs WI-W Highlights: Eden Carson, Amelia Kerr
                                                  Pummel West Indies In Semis As NZ Set Date With SA
                                              </p>
                                              <p className="text-[#586577] pt-2">15 hrs ago</p>
                                          </div>
                                          <div className=" pb-2 mb-4 border-b-[1px] border-border-gray-700 ">
                                              <p className="text-[13px] font-semibold">
                                                  Probably Took Wrong Risk: Alyssa Healy Regrets Sitting
                                                  Out As SA Stuns AUS In T20 WC
                                              </p>
                                              <p className="text-[#586577] pt-2">17 hrs ago</p>
                                          </div>
                                          <div className=" pb-2 mb-4 border-b-[1px] border-border-gray-700 ">
                                              <p className="text-[13px] font-semibold">
                                                  Womens T20 World Cup, NZ vs WI: Unchanged New Zealand
                                                  Opt To Bat; Check Out The Playing XIs
                                              </p>
                                              <p className="text-[#586577] pt-2">19 hrs ago</p>
                                          </div>
                                          <div className=" pb-2 mb-4 border-b-[1px] border-border-gray-700 ">
                                              <p className="text-[13px] font-semibold">
                                                  SA Cricketers Get Emotional After Historic Win Against
                                                  Australia To Enter T20 World Cup 2024 Final - Watch
                                              </p>
                                              <p className="text-[#586577] pt-2">18 Oct 2024</p>
                                          </div>
                                          <div className=" pb-2 mb-2">
                                              <p className="text-[13px] font-semibold">
                                                  Probably Took Wrong Risk: Alyssa Healy Regrets Sitting
                                                  Out As SA Stuns AUS In T20 WC
                                              </p>
                                              <p className="text-[#586577] pt-2">18 Oct 2024</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div
                      id="odi"
                      className={`tab-content ${activeTab === "odi" ? "" : "hidden"}`}
                  >
                      cvxhgchzx22
                  </div>
                  <div
                      id="t20"
                      className={`tab-content ${activeTab === "t20" ? "" : "hidden"}`}
                  >
                      cvxhgchzx965
                  </div>
                  <div
                      id="t20wc"
                      className={`tab-content ${activeTab === "t20wc" ? "" : "hidden"}`}
                  >
                      cvxhgchzx95
                  </div>
              </div>
          </section></>
    
  );
}

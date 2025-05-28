"use client";

import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { urlStringEncode } from "./../../utils/utility";
import { usePathname } from 'next/navigation';
import logoPlaceholder from 'public/assets/img/logo.webp';
import Head from "next/head";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Header = () => {
  const pathname = usePathname();
  const isMoreInfoPage = pathname.includes('/moreinfo/') || pathname.includes('/live-score/') || pathname.includes('/scorecard/') || pathname.includes('/squad/');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMouseOverDropdown, setIsMouseOverDropdown] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const closeNav = () => {
    setActiveDropdown(null);
  };

  const toggleDropdown = (open: boolean, clicked = false) => {
    setIsDropdownOpen(open);
    setIsClicked(clicked);
  };

  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);


const dropdownRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setActiveDropdown(null);
    }
  }

  if (activeDropdown) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [activeDropdown]);



  useEffect(() => {
    fetch("/api/series/liveSeries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setSeries(res.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const data = series;
  let items: any[] = [];
  if (data) {
    items = data?.map((item: any) => ({
      href: "/series/" + urlStringEncode(item.title + "-" + item.season) + "/" + item.cid,
      imgSrc: item?.header_logo ? item?.header_logo : "/assets/img/series/series-1.png",
      alt: item.abbr,
      label: item.abbr,
    }));
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 7;

  const handleNext = () => {
    if (currentIndex + itemsPerPage < items.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  return (
    <>
      <Head>
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/dvqccxtdm/image/upload/q_auto/v1747648962/logo_c1fpuc.webp"
        />
      </Head>
      <div className='md:hidden hidden items-center justify-between py-2 px-2 bg-[#3793ff] text-white'>
        <p> Uc Cricket is better on App, Get now! </p>
        <button className='border-[1px] border-white px-4 rounded-full py-1'>Use App</button>
      </div>

      <header className={`bg-[#081736] lg:px-0 px-3 sticky top-0 z-[999] ${isMoreInfoPage ? 'hidden md:block' : 'block'}`}>
        <div className="lg:w-[1000px] w-full mx-auto text-white md:py-5 pt-3 pb-3 flex items-center md:justify-between justify-center">
          <div>
            <Link href="/">
              <img
                src="https://res.cloudinary.com/dvqccxtdm/image/upload/q_auto/v1747648962/logo_c1fpuc.webp"
                alt="UC Cricket Logo"
                width={150}
                height={33}
                decoding="sync"
                loading="eager"
                style={{ height: '33px', width: '150px', color: 'transparent' }}
              />
            </Link>
          </div>

          <nav id="menu" className="hidden lg:flex space-x-4 text-1xl items-center">
            <Link href="/" className="hover:text-[#6aaefe]" prefetch={true}>Home</Link>

            <div className="flex items-center">
              <Link href="/series" className="hover:text-[#6aaefe] flex items-center">Series</Link>
              
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'series' ? null : 'series')}
                className="hover:text-[#6aaefe] flex items-center"
              >
                <MdOutlineKeyboardArrowDown className='text-[22px] mt-[2px]' />
              </button>
            </div>





            <Link href="https://uccricket.live/news/" className="hover:text-[#6aaefe]" prefetch={true}>News</Link>

            {/* Cricket Dropdown */}
            <div className="relative" ref={activeDropdown === 'news' ? dropdownRef : null}>
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'news' ? null : 'news')}
                className="w-full flex justify-between items-center text-left hover:text-[#6aaefe]"
              >
                <span> Cricket </span> <MdOutlineKeyboardArrowDown className='text-[22px] mt-[2px]' />
              </button>
              {activeDropdown === 'news' && (
                <div className="py-2 px-4 rounded-lg space-y-2 bg-[#081736] absolute right-[-64px] top-[30px] w-[142px]">
                  <Link href="https://uccricket.live/cricket/ipl/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>IPL</Link>
                  <Link href="https://uccricket.live/cricket/t10/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>T10</Link>
                  <Link href="https://uccricket.live/cricket/t20/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>T20</Link>
                  <Link href="https://uccricket.live/cricket/t20-world-cup/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>T20 World Cup</Link>
                  <Link href="https://uccricket.live/cricket/stadium/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Stadium</Link>
                  <Link href="https://uccricket.live/cricket/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>View All</Link>
                </div>
              )}
            </div>

            {/* Sports Dropdown */}
            <div className="relative" ref={activeDropdown === 'sports' ? dropdownRef : null}>
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'sports' ? null : 'sports')}
                className="w-full flex justify-between items-center text-left hover:text-[#6aaefe]"
              >
                <span> Sports </span> <MdOutlineKeyboardArrowDown className='text-[22px] mt-[2px]' />
              </button>
              {activeDropdown === 'sports' && (
                <div className="py-2 px-4 rounded-lg space-y-2 bg-[#081736] absolute right-[-64px] top-[30px] w-[142px]">
                  <Link href="https://uccricket.live/sports/kabaddi/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Kabaddi</Link>
                  <Link href="https://uccricket.live/sports/football/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Football</Link>
                  <Link href="https://uccricket.live/sports/hockey/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Hockey</Link>
                  <Link href="https://uccricket.live/sports/tennis/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Tennis</Link>
                  <Link href="https://uccricket.live/sports/nfl/" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>NFL</Link>
                </div>
              )}
            </div>

            <Link href="/points-table" className="hover:text-[#6aaefe]" prefetch={true}>Points Table</Link>

            {/* ICC Ranking Dropdown */}
            <div className="relative" ref={activeDropdown === 'ranking' ? dropdownRef : null}>
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'ranking' ? null : 'ranking')}
                className="w-full flex justify-between items-center text-left hover:text-[#6aaefe]"
              >
                <span> ICC Ranking </span> <MdOutlineKeyboardArrowDown className='text-[22px] mt-[2px]' />
              </button>
              {activeDropdown === 'ranking' && (
                <div className="py-2 px-4 rounded-lg space-y-2 bg-[#081736] absolute right-0 top-[30px] w-full">
                  <Link href="/iccranking/men/team/odi" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Men</Link>
                  <Link href="/iccranking/women/team/odi" className="block hover:text-[#6aaefe] pb-2" onClick={closeNav}>Women</Link>
                </div>
              )}
            </div>

            <Link href="https://uccricket.live/fantasy-cricket/dream11-prediction/" className="hover:text-[#6aaefe]" prefetch={true}>Fantasy Tips</Link>
          </nav>
        </div>
      </header>

     {activeDropdown === 'series' && (
  <div
    id="drop-series-slider"
    className="text-white overflow-hidden transition-all duration-300 z-[99] fixed w-full h-[100%] bg-[#0000004f]"
    onClick={() => setActiveDropdown(null)}
  >
    <div className="bg-[#081736]" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center lg:w-[1000px] w-full mx-auto relative">
        <button
          onClick={handlePrev}
          className={`text-[#6aaefe] text-xl p-2 bg-gray-700 rounded-full ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={currentIndex === 0}
        >
          ❮
        </button>

        <div id="drop-slider" className="flex gap-4 overflow-hidden scroll-smooth mx-[25px] mt-4 mb-6">
          {items.slice(currentIndex, currentIndex + itemsPerPage).map((item: any, index: number) => (
            <Link href={item.href || "#"} key={index}>
              <div className="flex-shrink-0 w-[140px] flex items-center flex-col">
                <Image
                  loading="lazy"
                  src={item.imgSrc}
                  alt={item.alt}
                  className="rounded-full w-[80px] h-[80px] border-2 border-[#3A7BD5] shadow-[0px_0px_10px_rgba(0,0,255,0.6)]"
                  width={80} height={80}
                />
                <p className="mt-2 text-center">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={handleNext}
          className={`text-[#6aaefe] text-xl p-2 bg-gray-700 rounded-full ${currentIndex + itemsPerPage >= items.length ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={currentIndex + itemsPerPage >= items.length}
        >
          ❯
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Header;

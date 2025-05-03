"use client";

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { urlStringEncode } from "./../../utils/utility";
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const isMoreInfoPage = pathname.includes('/moreinfo/') || pathname.includes('/live-score/') || pathname.includes('/scorecard/') || pathname.includes('/squad/');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMouseOverDropdown, setIsMouseOverDropdown] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // 👈 New state for click

  const toggleDropdown = (open: boolean, clicked = false) => {
    setIsDropdownOpen(open);
    setIsClicked(clicked);
  };

  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

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
  } else {
    items = [];
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
      <div className='md:hidden hidden items-center justify-between py-2 px-2 bg-[#3793ff] text-white'>
        <p> Uc Cricket is better on App, Get now! </p>
        <button className='border-[1px] border-white px-4 rounded-full py-1'>Use App</button>
      </div>

      <header className={`bg-[#081736] lg:px-0 px-3 sticky top-0 z-[999] ${isMoreInfoPage ? 'hidden md:block' : 'block'}`}>
       
        <div className="lg:w-[1000px] w-full mx-auto text-white md:py-5 pt-3 pb-3 flex items-center md:justify-between justify-center">
          <div>
            <Link href="/">
              <Image priority fetchPriority="high" className="h-[39px] w-[173px]" src="/assets/img/logo.png" alt="logo" width={150} height={50} />
            </Link>
          </div>

          <button
            id="menu-toggle"
            className="lg:hidden text-white focus:outline-none hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          <nav id="menu" className="hidden lg:flex space-x-4 text-1xl">
            <Link href="/" className="hover:text-yellow-400" prefetch={true}>
              Home
            </Link>
            {/* <Link href="#" className="hover:text-yellow-400" prefetch={true}>
              Fixtures
            </Link> */}

            <div className="flex items-center">
              <Link
                href="/series"
                className="hover:text-yellow-400 flex items-center"
              >
                Series
              </Link>
            </div>

            <div
              className="group relative"
              onMouseEnter={() => !isClicked && toggleDropdown(true)}
              onMouseLeave={() => {
                if (!isMouseOverDropdown && !isClicked) {
                  toggleDropdown(false);
                }
              }}
            >
              <div
                onClick={() => toggleDropdown(!isDropdownOpen, !isDropdownOpen)} // 👈 Toggle on click
                className='hover:text-yellow-400 cursor-pointer absolute left-[-18px] h-[70px] w-[32px] top-[2px]'
              >
                <svg
                  className="w-5 h-5 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* <Link href="" className="hover:text-yellow-400" prefetch={true}>
              Teams
            </Link> */}
            <Link href="/iccranking/man/team/odis" className="hover:text-yellow-400" prefetch={true}>
              ICC Ranking
            </Link>
            <Link href="https://uccricket.live/news/" className="hover:text-yellow-400" prefetch={true}>
              News
            </Link>
            <Link href="https://uccricket.live/fantasy-cricket/dream11-prediction/" className="hover:text-yellow-400" prefetch={true}>
              Fantasy Tips
            </Link>
          </nav>
        </div>
      </header>

      {isDropdownOpen &&
        <div
          id="drop-series-slider"
          className="text-white overflow-hidden transition-all duration-300 z-[99] fixed w-full h-[100%] bg-[#0000004f]"
          onClick={() => {
            toggleDropdown(false);
            setIsClicked(false); // 👈 Reset click state
          }}
          onMouseEnter={() => setIsMouseOverDropdown(true)}
          onMouseLeave={() => {
            setIsMouseOverDropdown(false);
            if (!isClicked) toggleDropdown(false);
          }}
        >
          <div
            className="bg-[#081736]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center lg:w-[1000px] w-full mx-auto relative">
              <button
                onClick={handlePrev}
                className={`text-yellow-400 text-xl ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={currentIndex === 0}
              >
                ❮
              </button>

              <div
                id="drop-slider"
                className="flex gap-4 overflow-hidden scroll-smooth mx-[25px] mt-4 mb-6"
              >
                {items
                  .slice(currentIndex, currentIndex + itemsPerPage)
                  ?.map((item: any, index: number) => (
                    <Link href={item.href || "#"} key={index}>
                      <div className="flex-shrink-0 w-[140px] flex items-center flex-col">
                        <Image loading="lazy"
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
                className={`text-yellow-400 text-xl ${currentIndex + itemsPerPage >= items.length ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={currentIndex + itemsPerPage >= items.length}
              >
                ❯
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Header;

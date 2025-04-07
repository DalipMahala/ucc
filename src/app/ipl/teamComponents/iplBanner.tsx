"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { usePathname } from "next/navigation";
interface Banner{
    cid: number,
    params: any,
    teamPlayers: any,
    venueDetails: any,
}
export default function IplBanner({cid,params, teamPlayers, venueDetails}: Banner) {
  const teamId = params?.teamId;
  const year = params?.year;
 
  const teams = teamPlayers[0]?.team;
  const captain = teamPlayers[0]?.captains?.[0];
  // console.log("IplTeams", teams?.title);
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = event.target.value;
    
    // Construct the new URL (Assuming year is in the second segment)
    const newPath = pathname.replace(/\d{4}/, selectedYear);
    
    router.push(newPath); // Update the URL
  };

  return (
    <section className="bg-[#0E2149]">
      <div
        className="lg:w-[1000px] mx-auto text-white pt-5 pb-10"
        style={{ paddingTop: "37px" }}
      >
        <div className="flex items-center justify-between md:p-4 max-w-6xl mx-auto">
                    
          {/* Content Section */}
          {/* Content Section full screen  */}
          <div className="hidden md:flex flex-grow items-center justify-between px-6">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Image
                src={teams?.logo_url}
                alt="Event Logo"
                width={120}
                height={120}
                className="md:h-[70px] lg:h-[auto]"
              />
              <div>
              {venueDetails?.win_years &&
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/img/home/win.png"
                    alt=""
                    width={35}
                    height={35}
                    className="h-[35px]"
                  />
                  <p className="bg-[#3d548736] px-4 py-1 rounded-full font-medium">
                    {venueDetails?.win_years}
                  </p>
                </div>
              }
                <h2 className="lg:text-2xl md:text-[17px] font-semibold">
                {teams?.title}
                </h2>
                <select className="border border-gray-500 rounded px-2 bg-[#0e2149]"  onChange={handleSelectChange} value={year}>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
            {/* Right Section */}
            <div className="bg-[#3d548736] py-5 rounded-lg px-[30px] font-semibold">
              <div className="flex space-x-4 pb-[13px]">
                <p className="text-[#92a3bb]">Owener :</p>
                <p>{teams?.team_owner}</p>
              </div>
              <div className="border-[1px] border-b border-[#3D5487]" />
              <div className="flex space-x-6 py-[13px]">
                <p className="text-[#92a3bb]">Coach :</p>
                <p>{teams?.head_coach}</p>
              </div>
              <div className="border-[1px] border-b border-[#3D5487]" />
              <div className="flex space-x-4 pt-[13px]">
                <p className="text-[#92a3bb]">Captain :</p>
                <p>{captain?.title}</p>
              </div>
            </div>
          </div>
          {/* Content Section mobile screen  */}
          <div className="md:hidden">
            <div className=" relative">
              <button
                id="left-arrow"
                className="absolute left-[6px] top-1/2 -translate-y-1/2  bg-[#ffffff] p-[7px] rounded-full border-2 hidden"
                style={{ zIndex: "1", display: "none" }}
              >
                <span className="text-[20px] font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-3 text-[black]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    ></path>
                  </svg>
                </span>
              </button>
              <div className="relative overflow-hidden mx-6">
                {/* Left Arrow */}
                {/* series Wrapper */}
                <div
                  id="series"
                  className="flex gap-3 transition-transform duration-300"
                  style={{ transform: "translateX(0px)" }}
                >
                  <div className="flex-none w-1/5">
                    <Link href="#">
                      <Image
                        src="/assets/img/series/series-1.png"
                        width={70}
                        height={70}
                        className=""
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="flex-none w-1/5">
                    <Link href="#">
                      <Image
                        src="/assets/img/series/series-1.png"
                        width={70}
                        height={70}
                        className=""
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="flex-none w-1/5">
                    <Link href="#">
                      <Image
                        src="/assets/img/series/series-1.png"
                        width={70}
                        height={70}
                        className=""
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="flex-none w-1/5">
                    <Link href="#">
                      <Image
                        src="/assets/img/series/series-1.png"
                        width={70}
                        height={70}
                        className=""
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="flex-none w-1/5">
                    <Link href="#">
                      <Image
                        src="/assets/img/series/series-1.png"
                        className=""
                        width={70}
                        height={70}
                        alt=""
                      />
                    </Link>
                  </div>
                </div>
                {/* Right Arrow */}
              </div>
              <button
                id="right-arrow"
                className="absolute right-[6px] top-1/2 -translate-y-1/2 bg-[#ffffff] p-[7px] rounded-full border-2"
                style={{ display: "block" }}
              >
                <span className="text-[20px] font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-3 text-[black]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
            <div className="px-4 mt-5">
              <div className="flex items-center gap-1 mb-2">
                <Image
                  src="/assets/img/home/win.png"
                  alt=""
                  width={25}
                  height={25}
                  className="h-[25px]"
                />
                <p className="bg-[#3d548736] px-4 py-1 rounded-full font-medium">
                  2012, 2014, 2024
                </p>
              </div>
              <h2 className="text-[17px] font-semibold">
                Kolkata Knight Riders
              </h2>
              <Link href="#" className="text-green-400 hover:underline mt-2">
                More Seasons »
              </Link>
            </div>
          </div>
         
        </div>
      </div>
    </section>
  );
}

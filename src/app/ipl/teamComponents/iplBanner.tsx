"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
interface Banner {
  cid: number,
  params: any,
  teamPlayers: any,
  venueDetails: any,
}
export default function IplBanner({ cid, params, teamPlayers, venueDetails }: Banner) {
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
        className="lg:w-[1000px] mx-auto text-white pt-5 pb-10 "
      >



        <div className="overflow-auto mb-6">
          <div

            className="w-[850px] md:w-full flex gap-3 justify-between items-center p-2"
          >

            <div className="w-[10%] flex justify-center items-center border-[3px] border-[#8ac0ff] rounded-md p-[8px]" style={{ boxShadow: '0px 0px 9px 0px #7eb9ff' }}>
              <Link href="#">
                <Image
                  src={teams?.logo_url}
                  width={80}
                  height={80}
                  className=""
                  alt=""
                />
              </Link>
            </div>
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
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
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
              <Link href="#">
                <Image
                  src={teams?.logo_url}
                  width={70}
                  height={70}
                  className=""
                  alt=""
                />
              </Link>
            </div>
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
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
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
              <Link href="#">
                <Image
                  src={teams?.logo_url}
                  className=""
                  width={70}
                  height={70}
                  alt=""
                />
              </Link>
            </div>
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
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
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
              <Link href="#">
                <Image
                  src={teams?.logo_url}
                  className=""
                  width={70}
                  height={70}
                  alt=""
                />
              </Link>
            </div>
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
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
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
              <Link href="#">
                <Image
                  src={teams?.logo_url}
                  className=""
                  width={70}
                  height={70}
                  alt=""
                />
              </Link>
            </div>
            <div className="w-[10%] flex justify-center items-center border-[1px] border-[#204878] rounded-md p-[8px]">
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
        </div>


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
                      width={26}
                      height={30}
                      className="h-[26px]"
                    />
                    <p className="bg-[#3d548736] px-4 py-1 rounded-full font-medium">
                      {venueDetails?.win_years} {" "}
                    </p>
                  </div>
                }
                <h1 className="lg:text-2xl md:text-[17px] font-semibold my-3">
                  {teams?.title}
                </h1>
                <select className="border border-gray-500 rounded px-2 bg-[#0e2149]" onChange={handleSelectChange} value={year}>
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
                <p className="text-[#6aaefe]">Owener :</p>
                <p>{teams?.team_owner}</p>
              </div>
              <div className="border-[1px] border-b border-[#3D5487]" />
              <div className="flex space-x-6 py-[13px]">
                <p className="text-[#6aaefe]">Coach :</p>
                <p>{teams?.head_coach}</p>
              </div>
              <div className="border-[1px] border-b border-[#3D5487]" />
              <div className="flex space-x-4 pt-[13px]">
                <p className="text-[#6aaefe]">Captain :</p>
                <p>{captain?.title}</p>
              </div>
            </div>
          </div>


          {/* Content Section mobile screen  */}
         

         <div className="md:hidden px-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src={teams?.logo_url}
                alt="Event Logo"
                width={100}
                height={100}
                className="md:h-[70px] lg:h-[auto]"
              />
              <div>
                {venueDetails?.win_years &&
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/img/home/win.png"
                      alt=""
                      width={26}
                      height={30}
                      className="h-[26px]"
                    />
                    <p className="bg-[#3d548736] px-4 py-1 rounded-full font-medium">
                      {venueDetails?.win_years} {" "}
                    </p>
                  </div>
                }
                <h1 className="lg:text-2xl md:text-[17px] font-semibold my-3">
                  {teams?.title}
                </h1>
                <select className="border border-gray-500 rounded px-2 bg-[#0e2149]" onChange={handleSelectChange} value={year}>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
            {/* Right Section */}
            <div className="bg-[#3d548736] py-5 rounded-lg px-[30px] font-semibold">
              <div className="w-full flex space-x-4 pb-[13px]">
                <p className="text-[#6aaefe] w-[20%]">Owener :</p>
                <p className="w-[80%]">{teams?.team_owner}</p>
              </div>
              <div className="border-[1px] border-b border-[#3D5487]" />
              <div className="w-full flex space-x-4 py-[13px]">
                <p className="text-[#6aaefe] w-[20%]">Coach :</p>
                <p className="w-[80%]">{teams?.head_coach}</p>
              </div>
              <div className="border-[1px] border-b border-[#3D5487]" />
              <div className="w-full flex space-x-4 pt-[13px]">
                <p className="text-[#6aaefe] w-[20%]">Captain :</p>
                <p className="w-[80%]">{captain?.title}</p>
              </div>
            </div>
          </div>

        </div>




      </div>
    </section>
  );
}

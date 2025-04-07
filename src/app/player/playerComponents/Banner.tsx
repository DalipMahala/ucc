import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {getAge} from "@/utils/timerUtils";

interface Banner {
    playerStats: any | null;
  }
export default function Banner({playerStats}: Banner) {
    const profile = playerStats?.player;
    return (

        <section
            className=" md:py-8 md:px-8 px-4 py-4"
            style={{ backgroundImage: "linear-gradient(to right, #0c3c5a, #7d7d7d)" }}
        >
            <div className="lg:w-[1000px] mx-auto text-white">
                <div className="md:flex items-center md:space-x-8">
                    <div className="flex justify-center">
                        <Image  loading="lazy" 
                            src="/assets/img/playerProfile/default.png"
                            alt="Player Image"
                            className="h-[15.8125rem] rounded-lg"
                            width={200} height={300}
                        />
                    </div>
                    <div>
                        <div className="mb-4">
                            <h2 className="text-2xl font-medium mb-3">{profile?.first_name}</h2>
                            <div className="lg:flex items-center lg:space-x-5">
                                <div className="flex items-center space-x-2 md:mb-2 lg:mb-0 mb-0 ">
                                    <Link href="#">
                                    <Image  loading="lazy"  src="/assets/img/india.png" alt="" className="h-[1.5rem]" width={24} height={24}/>
                                    </Link>
                                    <span>{profile?.nationality} - {profile?.birthdate !== undefined && profile?.birthdate !== '' ? getAge(profile?.birthdate):""}</span>
                                </div>
                                <div className="md:flex items-center md:space-x-2 m-0">
                                        {profile?.batting_style !=='' ? (
                                        <span className="flex items-center bg-[#E3E9FF12] hover:bg-[#a8bbff45] rounded-full py-[5px] px-[20px] my-2 md:my-0">
                                            <Image  loading="lazy" 
                                                src="/assets/img/bat.png"
                                                alt=""
                                                className="h-[0.8125rem] mr-[0.375rem]"
                                                width={12} height={12}
                                            />{" "}
                                            {profile?.batting_style}
                                        </span>
                                        ):("")}
                                        {profile?.bowling_style !=='' ? (
                                        <span className="flex items-center bg-[#E3E9FF12] hover:bg-[#a8bbff45] rounded-full py-[5px] px-[20px]	">
                                            <Image  loading="lazy" 
                                                src="/assets/img/ball.png"
                                                alt=""
                                                className="h-[0.8125rem] mr-[0.375rem]"
                                                width={12} height={12}
                                            />{" "}
                                            {profile?.bowling_style}
                                        </span>
                                        ):("")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>



    )
}
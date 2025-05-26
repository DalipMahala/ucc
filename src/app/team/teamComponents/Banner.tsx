import React from 'react'
import Image from 'next/image'
import Link from "next/link";

interface Banner {
    teamDetails: any | null;
    teamType: string;
    teamCaptains: any;
    coach: string;
}

export default function Banner({ teamDetails, teamType, teamCaptains, coach }: Banner) {

    const teamType2 = (teamType === 't20i' ? 't20' : teamType);
    const debut = 'debut_match_' + teamType2;

    return (

        <section className='bg-[#0E2149]'>
            <div className='lg:w-[1000px] mx-auto text-white pt-[37px] pb-10 relative'>


                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.05] z-0">
                    <Image
                        src="/assets/img/bg-logo.png"
                        alt="Background"
                        width={70}
                        height={70}
                        className="h-[120px] w-auto"
                    />
                </div>

                
                <div className='md:flex flex-grow items-center justify-between px-6'>
                    <div className='flex items-center space-x-4'>
                        <Image
                            loading="lazy"
                            src={teamDetails?.logo_url}
                            alt={teamDetails?.alt_name}
                            className="md:h-[70px] lg:h-[100px] rounded-full"
                            width={100}
                            height={100}
                        />

                        <h1 className="lg:text-2xl text-[20px] font-semibold flex flex-col">
                           <span> {teamDetails?.title} Cricket Team </span>
                            <span className='text-[15px] font-medium uppercase'>{teamType}</span>
                        </h1>

                    </div>

                    <div className='flex gap-2 flex-col md:w-[30%] mt-3 md:mt-0'>
                        <div className='flex gap-2'>
                            <Image
                                src="/assets/img/home/win.png"
                                width={15}
                                height={15}

                                className="inline-block ml-2"
                                alt=""
                                loading="lazy"
                            />
                            <div className='flex justify-between items-center w-full'>
                                <p>ICC Cricket World Cup</p>
                                <p>1983, 2011</p>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <Image
                                src="/assets/img/home/win.png"
                                width={15}
                                height={15}

                                className="inline-block ml-2"
                                alt=""
                                loading="lazy"
                            />
                            <div className='flex justify-between items-center w-full'>
                                <p>ICC Champions Trophy</p>
                                <p>2013, 2025</p>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <Image
                                src="/assets/img/home/win.png"
                                width={15}
                                height={15}

                                className="inline-block ml-2"
                                alt=""
                                loading="lazy"
                            />
                            <div className='flex justify-between items-center w-full'>
                                <p>ICC World Twenty20</p>
                                <p>2007, 2024</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    )
}

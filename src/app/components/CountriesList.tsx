"use client"; // Mark this file as a client component

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlStringEncode } from "../../utils/utility";

interface Competition {
  cid: number;
  title: string;
}

interface Country {
  map: any;
  name: string;
  flag: string;
  competitions: Competition[];
}

interface countries {
  countries: any;
}

export default function CountriesList({ countries }: countries) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  //   const filteredCountries = countries.filter((country:any) =>
  //     country.country_name.toLowerCase().includes(search.toLowerCase())
  //   );

  const filteredCountries = countries
    ?.map((country: any) => {
      const filteredLeagues = country.competitions.filter((league: any) =>
        league.title.toLowerCase().includes(search.toLowerCase())
      );

      // Show country if its name matches OR if it has matching leagues
      if (
        country.country_name.toLowerCase().includes(search.toLowerCase()) ||
        filteredLeagues.length > 0
      ) {
        return { ...country, competitions: filteredLeagues };
      }

      return null;
    })
    .filter(Boolean);



  return (
    <>
      <div className="mb-2">
        <h3 className="text-1xl font-semibold pl-[3px] border-l-[3px] border-[#1a80f8]">
          Domestic Leagues
        </h3>
      </div>

      <div className="bg-white rounded-lg px-4">
        {/* Search Form */}
        <div className="py-2 mb-3">
          <form className="flex justify-between items-center border-2 p-1 px-3 rounded-lg">
            <div>
              <input
                className="font-medium text-[15px] outline-none"
                type="text"
                placeholder="Filter.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Image loading="lazy"
                src="/assets/img/flag/search.png"
                className="h-[14px]"
                width={15}
                height={15}
                style={{ width: "auto", height: "auto" }}
                alt=""
              />
            </div>
          </form>
        </div>

        {/* Country Blocks */}

        {filteredCountries?.map((country: any, index: number) => (
          <div key={index} className="border-b mb-4">
            <button className="w-full flex text-[14px] justify-between items-center pb-3" onClick={() =>
              setExpanded(expanded === country.country_name ? null : country.country_name)
            }>
              <span className="flex items-center font-medium text-[#394351]">
                <Image loading="lazy"
                  src={`https://flagcdn.com/w320/${country.country_code.toLowerCase() === "wi" ? "kn" : country.country_code.toLowerCase() === "en" ? "gb" : country.country_code.toLowerCase()}.webp`}
                  className="mr-3 rounded-full object-cover"
                  width={20}
                  height={20}
                  style={{ width: "25px", height: "25px" }}
                  alt={`${country.country_name} Flag`}
                />
                {country.country_name}
              </span>
              <span className="transform transition-transform">
                <Image loading="lazy"
                  src="/assets/img/arrow.png"
                  className="h-[7px]"
                  width={10}
                  height={15}
                  style={{ width: "auto", height: "auto" }}
                  alt="Arrow"
                />
              </span>
            </button>
            {expanded === country.country_name && (
              country?.competitions?.map((compt: any, index: number) => (
                <div className="pl-8 py-2 space-y-2 font-normal text-[13px] text-[#51555E]" key={index}>
                  <div className="flex items-center gap-[2px]">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-3 text-[#1A80F8]">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                      </svg>
                    </span>

                    <Link className="hover:text-[#1a80f8]" href={"series/" + urlStringEncode(compt.title + "-" + compt.season) + "/" + compt.cid}>
                      {" "}
                      <p>{compt.title}</p>{" "}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </>
  );
}

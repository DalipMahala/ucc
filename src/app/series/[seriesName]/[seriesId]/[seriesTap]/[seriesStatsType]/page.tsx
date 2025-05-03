import Page from "../../../../page";
import { Metadata } from "next";
import { seriesById } from "@/controller/homeController";
import { urlStringEncode } from "../../../../../../utils/utility";

type Params = Promise<{
  seriesStatsType: string;
  seriesTap: string;
  seriesId: number;
  seriesName: string;
}>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const seriesId = params.seriesId;
  const seriesTap = params.seriesTap;
  const seriesStatsType = params.seriesStatsType;
  const seriesName = params.seriesName;

  const SeriesDetails = await seriesById(seriesId);

  const seriesTitle = SeriesDetails?.title ?? '';
  const seriesSeason = SeriesDetails?.season ?? '';

  const imageUrl = `https://uccricket.live/api/og-image?title=${encodeURIComponent(
    `${seriesTitle}`
  )}&format=webp`;
  console.log(params);

  const robots = "nofollow, noindex";
  const other = {
    googlebot:
      "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
  };
  const openGraphtype = "website";
  const siteName = "UC Cricket";
  const twittercard = "summary_large_image";
  let title = "";
  let description = "";
  let keywords = "";
  let canonical = "";
  let openGraphtitle = "";
  let openGraphdescription = "";
  let openGraphurl = "";
  let twittertitle = "";
  let twitterdescription = "";

  if (seriesStatsType === "batting-highest-average") {
    title = `Best Batting Average in ${seriesTitle} ${seriesSeason} | Top Performers`;
    description = `Find players with the highest batting average in ${seriesTitle} ${seriesSeason}. Check out consistent top scorers with the best average.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/batting-highest-average"
    }`;
  } else if (seriesStatsType === "batting-highest-strike-rate") {
    title = `Best Batting Strike Rate in ${seriesTitle} ${seriesSeason}`;
    description = `Discover the batsmen with the highest strike rate in ${seriesTitle} ${seriesSeason}. Find the most aggressive players with quick scoring rates.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/batting-highest-strike-rate"
    }`;
  } else if (seriesStatsType === "batting-most-hundreds") {
    title = `Most Hundreds in ${seriesTitle} ${seriesSeason} | Century Scorers`;
    description = `Check out players with the most hundreds in ${seriesTitle} ${seriesSeason}. Track the top century scorers of the tournament.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/batting-most-hundreds"
    }`;
  } else if (seriesStatsType === "batting-most-fifties") {
    title = `Most Fifties in ${seriesTitle} ${seriesSeason} | Half-Century Makers`;
    description = `Find the players with the most fifties in ${seriesTitle} ${seriesSeason}. Track batsmen with consistent half-centuries.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/batting-most-fifties"
    }`;
  } else if (seriesStatsType === "batting-most-fours") {
    title = `Most Fours in ${seriesTitle} ${seriesSeason} | Boundaries Hit`;
    description = `Discover the players with the most fours in ${seriesTitle} ${seriesSeason}. Track the batsmen with the highest number of boundaries.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/batting-most-fours"
    }`;
  } else if (seriesStatsType === "batting-most-sixes") {
    title = `Most Sixes in ${seriesTitle} ${seriesSeason} | Boundaries Hit`;
    description = `Check out the biggest hitters of ${seriesTitle} ${seriesSeason} with the most sixes. Find out who cleared the boundary the most times.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/batting-most-sixes"
    }`;
  } else if (seriesStatsType === "bowling-most-wicket") {
    title = `Most Wickets in ${seriesTitle} ${seriesSeason} | Leading Bowlers`;
    description = `Check the list of top wicket-takers in ${seriesTitle} ${seriesSeason}. Track the best bowlers and match-winning performances.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/bowling-most-wicket"
    }`;
  } else if (seriesStatsType === "bowling-best-average") {
    title = `Best Bowling Average in ${seriesTitle} ${seriesSeason}`;
    description = `Find the bowlers with the best bowling average in ${seriesTitle} ${seriesSeason}. Check out the most effective wicket-takers.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/bowling-best-average"
    }`;
  } else if (seriesStatsType === "bowling-best-figures") {
    title = `Best Bowling Figures in ${seriesTitle} ${seriesSeason}`;
    description = `Check the best individual bowling performances in ${seriesTitle} ${seriesSeason}. Track match-winning spells and best figures.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/bowling-best-figures"
    }`;
  } else if (seriesStatsType === "bowling-most-five-wicket-hauls") {
    title = `Most Five-Wicket Hauls in ${seriesTitle} ${seriesSeason}`;
    description = `Check the list of bowlers with the most five-wicket hauls in ${seriesTitle} ${seriesSeason}. Find top bowling performances.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/bowling-most-five-wicket-hauls"
    }`;
  } else if (seriesStatsType === "bowling-best-economy-rates") {
    title = `Best Bowling Economy in ${seriesTitle} ${seriesSeason}`;
    description = `Find the bowlers with the best economy rate in ${seriesTitle} ${seriesSeason}. Track the most economical bowlers.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/bowling-best-economy-rates"
    }`;
  } else if (seriesStatsType === "bowling-best-strike-rates") {
    title = `Best Bowling Strike Rate in ${seriesTitle} ${seriesSeason}`;
    description = `Check out the bowlers with the best bowling strike rate in ${seriesTitle} ${seriesSeason}. Track quick wicket-takers.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/bowling-best-strike-rates"
    }`;
  } else {
    title = `Most Runs in ${seriesTitle} ${seriesSeason} | Leading Run Scorers`;
    description = `Check the list of players with the most runs in ${seriesTitle} ${seriesSeason}. Find top run scorers, highest individual scores, and batting performances.`;
    keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
    canonical = `https://uccricket.live/series/${
      urlStringEncode(seriesTitle + "-" + seriesSeason) +
      "/" +
      seriesId +
      "/stats/batting-most-run"
    }`;
  }

//   else {
//     title = `${seriesTitle} ${seriesSeason} Stats: Most Runs, Most Wickets & Records`;
//     description = `Check ${seriesTitle} ${seriesSeason} player and team stats, including most runs, most wickets, best batting average, strike rates, and top performances. Follow the latest tournament records and milestones.`;
//     keywords = `${seriesTitle} ${seriesSeason} stats, most runs in ICC ${seriesSeason}, most wickets in ${seriesTitle}, top players ICC ${seriesSeason}, ICC ${seriesSeason} batting records, ICC ${seriesSeason} bowling stats, player rankings`;
//     canonical = `https://uccricket.live/series/${
//       urlStringEncode(seriesTitle + "-" + seriesSeason) +
//       "/" +
//       seriesId +
//       "/stats"
//     }`;
//   }

  openGraphtitle = `${seriesTitle} ${seriesSeason} Stats: Most Runs, Most Wickets & Records`;
  openGraphdescription = `Follow ${seriesTitle} ${seriesSeason} player and team stats, including most runs, most wickets, best batting average, and top performances of the tournament.`;
  openGraphurl = `https://uccricket.live/series/${
    urlStringEncode(seriesTitle + "-" + seriesSeason) +
    "/" +
    seriesId +
    "/stats"
  }`;

  twittertitle = `${seriesTitle} ${seriesSeason} Stats: Most Runs, Most Wickets & Records`;
  twitterdescription = `Track ${seriesTitle} ${seriesSeason} player and team stats, including most runs, most wickets, top strike rates, and bowling averages.`;

  return {
    title: title,
    description: description,
    keywords: keywords,

    robots: robots,
    other: other,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: openGraphtitle,
      description: openGraphdescription,
      url: openGraphurl,
      siteName: siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Points Tables",
          type: "image/webp",
        },
      ],
      type: openGraphtype,
    },

    twitter: {
      card: twittercard,
      title: twittertitle,
      description: twitterdescription,
      images: [imageUrl],
    },
  };
}
export default Page;

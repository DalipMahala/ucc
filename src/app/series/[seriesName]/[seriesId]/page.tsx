import Page from '../../page'
import { Metadata } from "next";
import { seriesById } from "@/controller/homeController";
import { urlStringEncode } from "../../../../utils/utility";
import { format } from "date-fns";

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
  
  const fromDate = SeriesDetails.datestart ? format(new Date(SeriesDetails.datestart), "dd MMM") : "";
  const toDate = SeriesDetails.dateend ? format(new Date(SeriesDetails.dateend), "dd MMM, yyyy") : "";
  const imageUrl = `https://uccricket.live/api/og-image?title=${encodeURIComponent(
    `${seriesTitle}`
  )}&format=webp`;
  // console.log(params);

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


    title = `${seriesTitle} ${seriesSeason}: Schedule, Teams, Matches & Stats`;
    description = `Get the full details of ${seriesTitle} ${seriesSeason} including schedule, teams, fixtures, key stats, most runs, most wickets, and live updates. Follow the tournament from ${fromDate} - ${toDate}.`;
    keywords = `${seriesTitle} ${seriesSeason}, ICC ${seriesSeason} schedule, ${seriesTitle} team, ${seriesTitle} fixtures, ICC ${seriesSeason} matches, ICC ${seriesSeason} stats, most runs, most wickets, series overview`;

    canonical = `https://uccricket.live/series/${
      urlStringEncode(
        seriesTitle+
        "-" +
        seriesSeason
      ) +
      "/" +
      seriesId
    }`;
    openGraphtitle = `${seriesTitle} ${seriesSeason}: Schedule, Teams, Matches & Stats`;
    openGraphdescription = `Full coverage of ${seriesTitle} ${seriesSeason} with schedule, teams, fixtures, key stats, and live updates. Stay tuned for match results and top player performances.`;
    openGraphurl = `https://uccricket.live/series/${
      urlStringEncode(
        seriesTitle+
        "-" +
        seriesSeason
      ) +
      "/" +
      seriesId
    }`;

    twittertitle = `${seriesTitle} ${seriesSeason}: Schedule, Teams, Matches & Stats`;
    twitterdescription = `Follow ${seriesTitle} ${seriesSeason} tournament overview, teams, fixtures, and key stats. Check the full schedule and latest match updates.`;
  

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
          alt: "Series",
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
export default Page
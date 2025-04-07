import Page from '../../page'
import { Metadata } from "next";
import { PlayerStats } from "@/controller/playerController";
import { urlStringEncode } from "../../../../utils/utility";

type Params = Promise<{ playerId: number; playerTap: string; }>

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const playerTab = params?.playerTap;
  const playerId = params?.playerId;

  const playerStats = await PlayerStats(playerId);

  const profile = playerStats?.player;
  const name = profile?.first_name ?? '';
  const imageUrl = `https://uccricket.live/api/og-image?title=${encodeURIComponent(
    `${name}`
  )}&format=webp`;
  console.log(params);

  const robots = "nofollow, noindex";
  const other = {
    googlebot:
      "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
  };
  const openGraphtype = "profile";
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


    title = `${name} Profile: ICC Ranking, Age, Career Stats & Records`;
    description = `Get complete details on ${name}'s profile including his stats, career records, batting & bowling averages, recent form, and ICC rankings. Follow his latest performances and match updates.`;
    keywords = `${name} profile, ${name} ICC Ranking, ${name} Age, ${name} stats, ${name} career records, ${name} batting stats, ${name} bowling stats, ${name} biography.`;

    canonical = `https://uccricket.live/player/${
      urlStringEncode(
        name
      ) +
      "/" +
      playerId
    }`;
    openGraphtitle = `${name} Profile: ICC Ranking, age, Career Stats & Record`;
    openGraphdescription = `Check out ${name}'s full player profile including batting, bowling stats, career records, ICC rankings, and latest match performances.`;
    openGraphurl = `https://uccricket.live/player/${
      urlStringEncode(
        name
      ) +
      "/" +
      playerId
    }`;

    twittertitle = `${name} Profile: ICC Ranking, Age, Career Stats & Record`;
    twitterdescription = `Follow ${name}'s career stats, age, latest performances, batting & bowling records, and ICC rankings.`;
  

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
          alt: "Player",
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
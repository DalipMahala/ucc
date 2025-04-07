import Page from '../../../page'
import { Metadata } from "next";
import { PlayerStats } from "@/controller/playerController";
import { urlStringEncode } from "../../../../../utils/utility";

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

  if (playerTab === "stats"){
    title = `${name} Stats: Career Batting & Bowling Records (ODI, Test, T20)`;
    description = `Check ${name}'s career statistics, batting & bowling records across formats (Test, ODI, T20). See his tournament performance, recent matches, and stats vs teams.`;
    keywords = `${name} stats, ${name} career records, ${name} batting stats, ${name} bowling performance, ${name} ODI stats, ${name} Test records, ICC rankings, IPL records, Champions Trophy stats`;

    canonical = `https://uccricket.live/player/${
      urlStringEncode(
        name
      ) +
      "/" +
      playerId+"/stats"
    }`;
    openGraphtitle = `${name} Stats: Career Batting & Bowling Records (ODI, Test, T20)`;
    openGraphdescription = `Explore ${name}'s full career stats, including batting & bowling records in international and league cricket. See tournament-wise and team-wise performance.`;
    openGraphurl = `https://uccricket.live/player/${
      urlStringEncode(
        name
      ) +
      "/" +
      playerId+"/stats"
    }`;

    twittertitle = `${name} Stats: Career Batting & Bowling Records (ODI, Test, T20)`;
    twitterdescription = `See ${name}'s career stats, including batting & bowling records in ODIs, Tests, and T20s. Get performance breakdowns from tournaments & series.`;
  
  }else if (playerTab === "news"){
    title = `${name} Latest News & Updates | Cricket Headlines`;
    description = `Get the latest news and updates on ${name}. Follow match reports, injury updates, press conferences, and exclusive interviews.`;
    keywords = `${name} news, latest cricket news, ${name} updates, ${name} match reports, ${name} interview, ${name} latest updates, cricket breaking news`;

    canonical = `https://uccricket.live/player/${
      urlStringEncode(
        name
      ) +
      "/" +
      playerId+"/news"
    }`;
    openGraphtitle = `${name} Latest News & Updates | Cricket Headlines`;
    openGraphdescription = `Read all the latest news about ${name}, including match updates, team announcements, and exclusive insights.`;
    openGraphurl = `https://uccricket.live/player/${
      urlStringEncode(
        name
      ) +
      "/" +
      playerId+"/news"
    }`;

    twittertitle = `${name} Latest News & Updates | Cricket Headlines`;
    twitterdescription = `Follow ${name}'s latest cricket news, match updates, injury reports, and expert analysis.`;
  
  }else if (playerTab === "photos"){
    title = `${name} Photos & Gallery | Best Cricket Moments`;
    description = `View ${name}'s best cricket photos and moments. Explore his match pictures, on-field highlights, and behind-the-scenes images.`;
    keywords = `${name} photos, ${name} cricket pictures, ${name} gallery, ${name} HD images, ${name} best moments, ${name} IPL photos, Indian cricketers pictures`;

    canonical = `https://uccricket.live/player/${
      urlStringEncode(
        name
      ) +
      "/" +
      playerId+"/photos"
    }`;
    openGraphtitle = `${name} Photos & Gallery | Best Cricket Moments`;
    openGraphdescription = `Check out stunning cricket photos of ${name}. Browse his top match moments, behind-the-scenes images, and IPL snapshots.`;
    openGraphurl = `https://uccricket.live/player/${
      urlStringEncode(
        name
      ) +
      "/" +
      playerId+"/photos"
    }`;

    twittertitle = `${name} Photos & Gallery | Best Cricket Moments`;
    twitterdescription = `Explore a collection of ${name}'s cricket photos, including match-winning performances and best action shots.`;
  
  }
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
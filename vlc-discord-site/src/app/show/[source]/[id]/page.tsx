import { notFound } from "next/navigation";
import { getShowDetails } from "@/lib/api";
import MediaHero from "@/components/MediaHero";
import CastList from "@/components/CastList";
import MediaNavigation from "@/components/MediaNavigation";
import MediaFooter from "@/components/MediaFooter";
import { Metadata } from "next";

type Props = {
  params: Promise<{ source: string; id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const source = params.source as 'tmdb' | 'tvmaze';
    if (source !== 'tmdb' && source !== 'tvmaze') return { title: "Show Not Found" };
    
    const media = await getShowDetails(params.id, source);
    return {
      title: `${media.title} | VLC Discord RPC`,
      description: media.overview,
    };
  } catch {
    return {
      title: "Show Not Found",
    };
  }
}

export default async function ShowPage(props: Props) {
  const params = await props.params;
  const source = params.source as 'tmdb' | 'tvmaze';
  
  if (source !== 'tmdb' && source !== 'tvmaze') {
    notFound();
  }

  let media;
  try {
    media = await getShowDetails(params.id, source);
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <>
      <main className="min-h-screen bg-black flex flex-col relative z-0">
        <MediaNavigation />
        <MediaHero media={media} />
        <CastList cast={media.cast} />
        <MediaFooter />
      </main>
    </>
  );
}

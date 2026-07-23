import { notFound } from "next/navigation";
import { getMovieDetails } from "@/lib/api";
import MediaHero from "@/components/MediaHero";
import CastList from "@/components/CastList";
import MediaNavigation from "@/components/MediaNavigation";
import MediaFooter from "@/components/MediaFooter";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const media = await getMovieDetails(params.id);
    return {
      title: `${media.title} | VLC Discord RPC`,
      description: media.overview,
    };
  } catch {
    return {
      title: "Movie Not Found",
    };
  }
}

export default async function MoviePage(props: Props) {
  const params = await props.params;
  let media;

  try {
    media = await getMovieDetails(params.id);
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

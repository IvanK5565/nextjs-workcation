import Header from "@/components/Header";
import LocationCards from "@/components/LocationCards";
import SearchBar from "@/components/SearchBar";
import { getHousesData, Location } from "@/pages/api/data";
import { GetStaticProps } from "next";

export const getStaticProps = (async () => {
  const data = await getHousesData();
  return {
    props: {
      data: data,
    }
  }
}) satisfies GetStaticProps<{
  data: Location[]
}>

export default function Home({ data }: { data: Location[] }) {
  return (
    <div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
      <Header />
      <div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
        <SearchBar />
        <main className="py-6 xl:flex-1 xl:overflow-x-hidden">
          {Array.from({length: data.length},(_,i) => 
            <LocationCards data={data[i]} key={i} />
          )}
        </main>
      </div>
    </div>
  );
}


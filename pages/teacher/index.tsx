import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import { useSession } from "next-auth/react";
import { GetLayout } from "../_app";


const Page = () => {
  const {data} = useSession();
  if(!data) return <div>Unauth</div>
  return (<div>
    <h2>Hello {data.user.firstName}</h2>
    <h3>Your Journalles:</h3>
    <div className="flex">
      <JournalPreview/>
      <JournalPreview/>
      <JournalPreview/>
      <JournalPreview/>
      <JournalPreview/>
      <JournalPreview/>
    </div>
    <h3>Your Classes</h3>
  </div>)
}

function JournalPreview(){
  return <div className="w-50 border-2">
    <div className="border-b-2">Journal name</div>
    <div className="h-50">Some data</div>
  </div>
}

Page.getLayout = ((page) => <Layout>{page}</Layout>) as GetLayout

export default Page;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
          <Header />
          <div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
            <SearchBar />
            <main className="py-6 xl:flex-1 xl:overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
  );
}
import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";


export default function Layout({ children }: { children: React.ReactNode }) {
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
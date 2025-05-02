import Header from "@/components/Header";
import LocationCards from "@/components/LocationCards";
import NoData from "@/components/NoData";
import SearchBar from "@/components/SearchBar";
import type { Location } from "@/pages/api/data";
import ctx from "@/server/container";
import { User } from "next-auth";

export default function Home({
	data,
	user,
	...props
}: {
	data: Location[];
	user: User | undefined;
}) {
	console.log('Other props: ', props)
	return (
		<div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
			<Header />
			<div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
				<SearchBar />
				<main className="py-6 xl:flex-1 xl:overflow-x-hidden">
					<p>{user?.email}</p>
					{data ? (
						data.map((d, i) => <LocationCards data={d} key={i} />)
					) : (
						<NoData />
					)}
				</main>
			</div>
		</div>
	);
}

export const getServerSideProps = ctx.resolve("getServerSideProps")(
	["UsersController"]
	// '/',
);

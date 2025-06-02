import Header from "@/components/Header";
import LocationCards from "@/components/LocationCards";
import NoData from "@/components/NoData";
import SearchBar from "@/components/SearchBar";
import { getHousesData } from "@/pages/api/data";
import ctx from "@/server/container/container";
import { User } from "next-auth";

export default function Home() {
	const data = getHousesData();
	return (
		<div>
			{data && Array.isArray(data) ? (
				data.map((d, i) => <LocationCards data={d} key={i} />)
			) : (
				<NoData />
			)}
		</div>
	);
}

export const getServerSideProps = ctx.resolve("getServerSideProps")(
	["UsersController"]
	// '/',
);

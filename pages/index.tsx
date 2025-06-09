import LocationCards from "@/components/workcation/LocationCards";
import NoData from "@/components/NoData";
import { getHousesData } from "@/pages/api/data";
import container from "@/server/container/container";

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

export const getServerSideProps = container.resolve("getServerSideProps")(
	[]
);
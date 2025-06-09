import { Location } from "@/pages/api/data";
import HouseCard from "@/components/workcation/HouseCard";
import clsx from "clsx";

export default function LocationCards({ data }: { data: Location }) {
	return (
		<div className="mt-6">
			<div className="px-4">
				<h3 className="text-gray-900 text-xl">{data.title}</h3>
				<p className="text-gray-600">{data.description}</p>
			</div>
			<div className="mt-6 sm:overflow-x-auto">
				<div className="px-4 sm:inline-flex sm:pb-8">
					{data.properties.map((d, i) => (
						<HouseCard
							data={d}
							className={clsx(
								{ "mt-10": i > 0 },
								"sm:mt-0 sm:w-80 sm:flex-shrink-0 sm:px-2"
							)}
							key={i}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

import { useActions } from "@/client/hooks";
import NoData from "../NoData";
import { useSelector } from "react-redux";
import { entitySelector } from "@/client/store/selectors";
import { useTranslation } from "react-i18next";
import { Null } from "../null";

function DataCard({
	data,
	onDelete,
}: {
	data: (object & { id: string|number }) | null;
	onDelete?: () => void;
}) {
	const { t } = useTranslation("common");
	return data == null ? (
		<Null />
	) : (
		<div className="bg-white shadow rounded-md p-4 border border-gray-200">
			{Object.entries(data).map(([key, value]) => (
				<div key={key} className="flex gap-x-2 space-y-1 text-gray-700">
					<div className="w-32 font-semibold">{key}:</div>
					<div className="truncate">
						{value === null ? <Null /> : String(value)}
					</div>
				</div>
			))}
			{onDelete && (
				<button className="adminButton" onClick={onDelete}>
					{t("delete")}
				</button>
			)}
		</div>
	);
}

function EntitiesExplorer({
	collection,
	reverse,
}: {
	collection: "users" | "classes" | "subjects";
	reverse?: boolean;
}) {
	const entities = useSelector(entitySelector(collection));
	const entries = Object.entries(entities);

	const { deleteUser } = useActions("UserEntity");
	const { deleteClass } = useActions("ClassEntity");
	const { deleteSubject } = useActions("SubjectEntity");

	const actions = {
		["users"]: deleteUser,
		["classes"]: deleteClass,
		["subjects"]: deleteSubject,
	};

	if (!entities || entries.length < 1)
		return (
			<div className="mt-4">
				<NoData />
			</div>
		);

	return (
		<section className="space-y-4 mt-4">
			{(reverse ? entries.reverse() : entries).map((item, index) => (
				<DataCard
					key={index}
					data={item[1]}
					onDelete={() =>
						actions[collection]({ [collection]: { [item[0]]: item[1] } })
					}
				/>
			))}
		</section>
	);
}

export { DataCard, EntitiesExplorer };

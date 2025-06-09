import { useState } from "react";
import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import NoData from "@/components/NoData";
import clsx from "clsx";
import { entitySelector } from "@/client/store/selectors";
import { deleteEntities } from "@/client/store/actions";
import { useActions } from "@/client/hooks";
import { Entities } from "@/client/store/types";

const Home = () => {
	const session = useSession();
	const [entity, setEntity] = useState<keyof Entities>("users");
	const [direction, setDirection] =
		useState<"straight" | "reverse">("straight");
	const entities = useSelector(entitySelector(entity));

	// const test = useSelector<RootState, RootState['entities']>(state=>state.entities);
	// console.log("page entities", test);
	return (
		<div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
			<Header />
			<div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
				<GetEntityBar entity={entity} />
				<main className="py-6 px-2 xl:flex-1 xl:overflow-x-hidden">
					<p>{session.data?.user?.email}</p>
					<p>{entity}</p>
					<div className="">
						<Filter
							count={String(Object.keys(entities).length)}
							onEntitySelect={(e) => setEntity(e)}
							onDirectionSelect={(e) => setDirection(e)}
						/>
					</div>
					{entities && Object.keys(entities).length > 0 ? (
						<EntitiesExplorer
							reverse={direction === "reverse"}
							collection={entity}
						/>
					) : (
						<div className="mt-4">
							<NoData />
						</div>
					)}
				</main>
			</div>
		</div>
	);
};
export default Home;
Home.getLayout = (page: React.ReactNode) => page;

const buttonStyle =
	"block xl:w-32 sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block";

const Null = () => <span className="text-gray-400 italic">null</span>;

function DataCard({
	data,
	onDelete,
}: {
	data: (object & { id: string }) | null;
	onDelete: () => void;
}) {
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
			<button className={buttonStyle} onClick={onDelete}>
				Delete
			</button>
		</div>
	);
}

function EntitiesExplorer({
	collection,
	reverse,
}: {
	collection: 'users'|'classes'|'subjects';
	reverse?: boolean;
}) {
	const dispatch = useDispatch();
	const entities = useSelector(entitySelector(collection));
	const entries = Object.entries(entities);

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
						dispatch(deleteEntities({ [collection]: { [item[0]]: item[1] } }))
					}
				/>
			))}
		</section>
	);
}

const NavButtonStyle =
	"block w-full sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block xl:w-full xl:my-2";

function GetEntityBar({ entity }: { entity: keyof Entities }) {
	const [input, setInput] = useState("1");
	const dispatch = useDispatch();
	const { getUserById, getAllUsers } = useActions("UserEntity");
	const { getClassById, getAllClasses } = useActions("ClassEntity");
	const { getAllSubjects, getSubjectById } = useActions("SubjectEntity");

	const baseUrl = `/api/${entity}`;
	const actions = {
		['users']: {
			['getAll']: getAllUsers,
			['getById']: getUserById
		},
		['classes']: {
			['getAll']: getAllClasses,
			['getById']: getClassById
		},
		['subjects']: {
			['getAll']: getAllSubjects,
			['getById']: getSubjectById
		},
	}
	const getById = () => {
		console.log("getById");
		actions[entity as 'users'|'classes'|'subjects']['getById']({ id: input })
		// dispatch({ type: actions[entity][0], payload: { id: input } });
	};
	const getData = () => {
		actions[entity as 'users'|'classes'|'subjects']['getAll']()
		// dispatch({ type: actions[entity][1] });
	};
	return (
		<section className="bg-gray-800 xl:w-72">
			<div
				className={clsx(
					{ hidden: false },
					"xl:h-full xl:flex xl:flex-col xl:justify-between"
				)}
			>
				<div className="lg:flex xl:block xl:overflow-y-auto">
					<div className="px-4 py-4 border-t border-gray-900 lg:w-1/3 xl:border-t-0 xl:w-full">
						<div className="relative max-w-sm w-full">
							<div className="absolute inset-y-0 left-0 flex items-center pl-2">
								<SearchIcon />
							</div>
							<input
								className="block w-full bg-gray-900 focus:outline-none focus:bg-white focus:text-gray-900 text-white rounded-lg pl-10 pr-4 py-2"
								type="text"
								onChange={(e) => setInput(e.target.value)}
								onFocus={(e) => (e.target.value = "")}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										getById();
									}
								}}
							/>
						</div>
						<button className={NavButtonStyle} onClick={() => getById()}>
							{baseUrl}/{input}
						</button>
						<button
							className={NavButtonStyle}
							onClick={() => {
								getData();
							}}
						>
							{baseUrl}
						</button>
						<button
							className={NavButtonStyle}
							onClick={() => dispatch({ type: "DELETE_ALL" })}
						>
							Delete all
						</button>
						<button
							className={NavButtonStyle}
							onClick={() => dispatch({ type: "getError" })}
						>
							Call Error
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

function SearchIcon() {
	return (
		<svg
			className="h-6 w-6 fill-current text-gray-600"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{" "}
			<path d="M16.32 14.9l1.1 1.1c.4-.02.83.13 1.14.44l3 3a1.5 1.5 0 0 1-2.12 2.12l-3-3a1.5 1.5 0 0 1-.44-1.14l-1.1-1.1a8 8 0 1 1 1.41-1.41l.01-.01zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />{" "}
		</svg>
	);
}

function Filter({
	count,
	className,
	onEntitySelect,
	onDirectionSelect,
}: {
	count: string;
	className?: string;
	onEntitySelect: (data: keyof Entities) => void;
	onDirectionSelect: (dir: "straight" | "reverse") => void;
}) {
	return (
		<div className={className}>
			<div className="max-w-md mt-6 bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm text-sm text-gray-700">
				<div className="flex justify-between mb-1">
					<span className="font-medium">Count:</span>
					<span>{count}</span>
				</div>
			</div>
			<div className="flex gap-5">
				<div className="flex flex-wrap -mx-2">
					<label className="mt-4 block w-full px-2 sm:mt-0 sm:w-1/2 lg:mt-4 lg:w-full">
						<span className="text-sm font-semibold text-gray-500">
							Choose Collection
						</span>
						<select
							className="mt-1 form-select rounded-lg block w-full text-white shadow"
							onChange={(e) =>
								onEntitySelect(e.target.value as keyof Entities)
							}
						>
							<option>users</option>
							<option>classes</option>
							<option>subjects</option>
						</select>
					</label>
				</div>
				<div className="flex flex-wrap -mx-2">
					<label className="block w-full px-2 sm:mt-0 sm:w-1/2 lg:mt-4 lg:w-full">
						<span className="text-sm font-semibold text-gray-500">
							Direction
						</span>
						<select
							className="mt-1 form-select rounded-lg block w-full text-white shadow"
							onChange={(e) => {
								if (
									e.target.value === "straight" ||
									e.target.value === "reverse"
								) {
									onDirectionSelect(e.target.value);
								}
							}}
						>
							<option>straight</option>
							<option>reverse</option>
						</select>
					</label>
				</div>
			</div>
		</div>
	);
}

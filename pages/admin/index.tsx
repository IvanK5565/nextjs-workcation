import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { Response } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import NoData from "@/components/NoData";
import clsx from "clsx";
import { AppState } from "@/client/store/ReduxStore";
import { entitySelector } from "@/client/store/selectors";

export default function Home() {
	const session = useSession();
	const [entity, setEntity] = useState<keyof AppState["entities"]>("users");
	const entities = useSelector(entitySelector(entity));
	const response = useSelector<AppState, Response>(
		(state) => state.latestResponse
	);
	// const test = useSelector<RootState, RootState['entities']>(state=>state.entities);
	// console.log("page entities", test);
	return (
		<div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
			<Header />
			<div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
				<NavBar onEntitySelect={(e) => setEntity(e)} />
				<main className="py-6 px-2 xl:flex-1 xl:overflow-x-hidden">
					<p>{session.data?.user?.email}</p>
					<p>{entity}</p>
					<ResponseHeader res={response} />
					<div className="max-w-md mt-6 bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm text-sm text-gray-700">
						<div className="flex justify-between mb-1">
							<span className="font-medium">Count:</span>
							<span>{String(Object.keys(entities).length)}</span>
						</div>
					</div>
					{entities && Object.keys(entities).length > 0 ? (
						<DataBody data={entities} />
					) : (
						<NoData />
					)}
				</main>
			</div>
		</div>
	);
}

function ResponseHeader({
	res: { code, success, type, message },
}: {
	res: Response;
}) {
	return (
		<div className="max-w-md mt-6 bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm text-sm text-gray-700">
			<div className="flex justify-between mb-1">
				<span className="font-medium">Code:</span>
				<span>{code}</span>
			</div>
			<div className="flex justify-between mb-1">
				<span className="font-medium">Success:</span>
				<span className={success ? "text-green-600" : "text-red-600"}>
					{success ? "True" : "False"}
				</span>
			</div>
			<div className="flex justify-between">
				<span className="font-medium">Type:</span>
				<span>{type}</span>
			</div>
			{message && (
				<div className="mt-2 text-blue-600 italic">
					<span>Message: </span>
					<span>{message}</span>
				</div>
			)}
		</div>
	);
}

const buttonStyle =
	"block xl:w-32 sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block";

const Null = () => <span className="text-gray-400 italic">null</span>;

function DataCard({ data }: { data: object | null }) {
	return data == null ? (
		<Null />
	) : (
		<div className="bg-white shadow rounded-md p-4 border border-gray-200">
			{Object.entries(data).map(([key, value]) => (
				<div key={key} className="flex gap-x-2 space-y-1 text-gray-700">
					<div className="w-32 font-semibold">{key}:</div>
					<div>{value === null ? <Null /> : String(value)}</div>
				</div>
			))}
			<button className={buttonStyle}>Click</button>
		</div>
	);
}

function DataBody({ data }: { data: object | null }) {
	if (data == null)
		return <span className="font-medium text-gray-800">null</span>;

	return (
		<section className="space-y-4 mt-4">
			{Object.entries(data).map((item, index) => (
				<DataCard key={index} data={item[1]} />
			))}
		</section>
	);
}
const actions: { [key in keyof AppState["entities"]]: [string, string] } = {
	users: ["getUserById", "getAllUsers"],
	classes: ["getClassById", "getAllClasses"],
	subjects: ["getSubjectById", "getAllSubjects"],
};

const NavButtonStyle =
	"block w-full sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block xl:w-full xl:my-2";

function NavBar({
	onEntitySelect,
}: {
	onEntitySelect: (data: keyof AppState["entities"]) => void;
}) {
	const [input, setInput] = useState("1");
	const [entity, setEntity] = useState<keyof AppState["entities"]>("users");
	const dispatch = useDispatch();
	const baseUrl = `/api/${entity}`;
	const getById = () => {
		console.log("getById");
		dispatch({ type: actions[entity][0], payload: { id: input } });
	};
	const getData = () => {
		dispatch({ type: actions[entity][1] });
	};
	useEffect(() => onEntitySelect(entity), [entity, onEntitySelect]);
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
						<div className="flex flex-wrap -mx-2">
							<label className="mt-4 block w-full px-2 sm:mt-0 sm:w-1/2 lg:mt-4 lg:w-full">
								<span className="text-sm font-semibold text-gray-500">
									Price Range
								</span>
								<select
									className="mt-1 form-select rounded-lg block w-full text-white shadow"
									onChange={(e) =>
										setEntity(e.target.value as keyof AppState["entities"])
									}
								>
									<option>users</option>
									<option>classes</option>
									<option>subjects</option>
								</select>
							</label>
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

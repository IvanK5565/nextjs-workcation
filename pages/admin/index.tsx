import { useState } from "react";
import NavBar from "@/components/admin/navbar";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { Response } from "@/types";
import { xRead } from "./xFetch";
import { useDispatch, useSelector } from "react-redux";
import { AddUsers } from "../store/action";
import { User } from "@/server/models";
import { State } from "../store/types";

export default function Home() {
	const [data, setData] = useState({});
	const session = useSession();
	const store = useSelector((state) => state as State);
	const dispatch = useDispatch();
	const [URL, setURL] = useState("NONE");

	function onClick(url: string) {
		console.log("admin url:", url);
		// fetch(url, {
		// 	method: "GET",
		// })
		// 	.then((data) => data.json())
		setURL(url);
		xRead(url).then((data) => {
			setData(data);
			if (data.data && url.startsWith("/api/users")){
				console.log('dispatch')
				dispatch(AddUsers(data.data as User[]));
			}
		});
	}
	return (
		<div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
			<Header />
			<div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
				<NavBar onClick={onClick} />
				<main className="py-6 px-2 xl:flex-1 xl:overflow-x-hidden">
					<p>{session.data?.user?.email}</p>
					<p>{URL}</p>
					<ResponseHeader res={data as Response} />
						{/* <DataBody data={(data as Response).data ?? null} /> */}
						<DataBody data={store.classes ?? null} />
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
			{(Array.isArray(data) ? data : [data]).map((item, index) => (
				<DataCard key={index} data={item} />
			))}
		</section>
	);
}

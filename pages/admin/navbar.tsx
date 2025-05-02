import clsx from "clsx";
import { useState } from "react";

export default function NavBar({
	onClick,
}: {
	onClick: (data:string)=>void
}) {
	const [input, setInput] = useState("1");
	const [entity, setEntity] = useState("users");
	const buttonStyle =
		"block w-full sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block xl:w-full xl:my-2";
  const baseUrl = `/api/${entity}`
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
						<SearchEntityBar setInput={setInput} />
            <SelectEntity setEntity={setEntity} />
						<button
							className={buttonStyle}
							onClick={()=>onClick(`${baseUrl}/${input}`)}
						>
							{baseUrl}/{input}
						</button>
						<button className={buttonStyle} onClick={()=>onClick(baseUrl)}>
							{baseUrl}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

function SelectEntity({ setEntity }: { setEntity: (v: string) => void }) {
	return (
		<div className="flex flex-wrap -mx-2">
			<label className="mt-4 block w-full px-2 sm:mt-0 sm:w-1/2 lg:mt-4 lg:w-full">
				<span className="text-sm font-semibold text-gray-500">Price Range</span>
				<select
					className="mt-1 form-select rounded-lg block w-full text-white shadow"
					onChange={(e) => setEntity(e.target.value)}
					onFocus={(e) => (e.target.value = "")}
				>
					<option>users</option>
					<option>classes</option>
					<option>subjects</option>
					<option>usersInClass</option>
				</select>
			</label>
		</div>
	);
}

function SearchEntityBar({ setInput }: { setInput: (v: string) => void }) {
	return (
		<div className="relative max-w-sm w-full">
			<div className="absolute inset-y-0 left-0 flex items-center pl-2">
				<svg
					className="h-6 w-6 fill-current text-gray-600"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					{" "}
					<path d="M16.32 14.9l1.1 1.1c.4-.02.83.13 1.14.44l3 3a1.5 1.5 0 0 1-2.12 2.12l-3-3a1.5 1.5 0 0 1-.44-1.14l-1.1-1.1a8 8 0 1 1 1.41-1.41l.01-.01zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />{" "}
				</svg>
			</div>
			<input
				className="block w-full bg-gray-900 focus:outline-none focus:bg-white focus:text-gray-900 text-white rounded-lg pl-10 pr-4 py-2"
				type="text"
				onChange={(e) => setInput(e.target.value)}
				onFocus={(e) => (e.target.value = "")}
			/>
		</div>
	);
}

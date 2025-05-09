import ctx from "@/server/context/container";
import { FormEvent } from "react";
import type { Classes as Class } from "@/server/models/classes";
import type { User as User } from "@/server/models/users";
import Button from "@/components/ui/button";
import NoData from "@/components/NoData";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import AccessDenied from "@/components/AccessDenied";

export default function Home({
	data,
	code,
}: {
	data?: {
		teachers: User[];
		_class: Class;
	},
	code:number
}) {
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		const id = formData.get("class_id")?.toString();
		console.log('formData on page:' ,JSON.parse(JSON.stringify(data)));

		await fetch(`/api/classes/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		});
	};
	return (
		<div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
			<Header />
			<div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
				<SearchBar />
				<main className="py-6 xl:flex-1 xl:overflow-x-hidden">
					{!!data ? (
						<div>
						<p className="pl-10">id:{data._class.id}</p>
						<form onSubmit={handleSubmit} className="flex flex-col w-min pl-10">
							<input
								type="hidden"
								name="class_id"
								className="block"
								defaultValue={data._class.id}
							/>
							<input
								type="text"
								name="title"
								className=""
								defaultValue={data._class.title}
								required
							/>
							<select
								name="teacher_id"
								id="teacher_id"
								defaultValue={data._class.teacher_id}
								required
							>
								<option value="">Teacher</option>
								{data.teachers.map((t, i) => (
									<option key={i} value={t.id}>
										{t.lastName} {t.role}
									</option>
								))}
							</select>
							<select
								name="status"
								id="status"
								defaultValue={data._class.status}
								required
							>
								<option value="">Status</option>
								<option value="active">Active</option>
								<option value="closed">Closed</option>
								<option value="draft">Draft</option>
							</select>
							<input
								type="number"
								name="year"
								defaultValue={data._class.year}
								required
							/>
							<Button type="submit" className="border mt-5">
								Submit
							</Button>
						</form>
					</div>
					) : code == 403 ?
					(
						<AccessDenied />
					) : (
						<NoData />
					)}
				</main>
			</div>
		</div>
	);
}

export const getServerSideProps = ctx.resolve("getServerSideProps")(
	["ClassesController", "UsersController"]
	// "/classes/[id]"
);
import ctx from "@/server/container/container";
import { FormEvent } from "react";
import Button from "@/components/ui/button";
import NoData from "@/components/NoData";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { classesSelector, usersSelector } from "@/client/store/selectors";
import { UserRole } from "@/constants";
import { IClass, IUser } from "@/client/store/types";

function ClassEditForm({
	data,
	handleSubmit,
}: {
	data: { _class: IClass; teachers: IUser[] };
	handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
	return (
		<div>
			<p className="pl-10">id:{data._class.id}</p>
			<form onSubmit={handleSubmit} className="flex flex-col w-min pl-10">
				<input
					type="hidden"
					name="id"
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
	);
}

export default function Home() {
	const param = useParams();
	const id = param?.id as string;
	const users = useSelector(usersSelector) as Record<string, IUser>;
	const state = useSelector(classesSelector);
	const _class = state[id] ?? null;
	if(!_class) console.error('no class', state)
	if(!users) console.error('no users')

	const teachers =
		Object.entries(users)
			.map((u) => u[1])
			.filter((u) => u.role === UserRole.TEACHER) ?? null;
	const data = { _class, teachers };

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		const id = formData.get("class_id")?.toString();
		console.log("formData on page:", JSON.parse(JSON.stringify(data)));

		await fetch(`/api/classes/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		});
	};
	return (
		<div>
			{!!data && data._class && data.teachers ? (
				<ClassEditForm data={data} handleSubmit={handleSubmit} />
			) : (
				<NoData />
			)}
		</div>
	);
}

export const getServerSideProps = ctx.resolve("getServerSideProps")(
	["ClassesController", "UsersController"]
	// "/classes/[id]"
);

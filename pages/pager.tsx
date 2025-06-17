import { useActions } from "@/client/hooks";
import { AppState } from "@/client/store/ReduxStore";
import { usersSelector } from "@/client/store/selectors";
import Button from "@/components/ui/button";
import { Field, Form, Formik } from "formik";
import { get } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";

function Pager() {
	const [page, setPage] = useState(1);
	const { fetchProjectPage } = useActions("UserEntity");
	const usersPage =
		useSelector<AppState, AppState["pagination"]>((state) => state.pagination)[
			"users"
		]?.pages?.[page] ?? [];
	const users = useSelector(usersSelector);
	return (
		<div>
			<Formik<{ page: string }>
				initialValues={{ page: "1" }}
				onSubmit={({ page }) => setPage(parseInt(page))}
			>
				<Form className="flex flex-col w-min gap-1 m-1">
					<Field as="select" name="page" id="page">
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
					</Field>
					<div className="flex gap-1">
						<Button type="submit">Submit</Button>
						<Button
							type="button"
							onClick={() =>
								fetchProjectPage({ pageName: "users", page: page, perPage: 10 })
							}
						>
							Fetch
						</Button>
					</div>
				</Form>
			</Formik>
			{usersPage.map((u, key) => (
				<div key={key} className="flex w-min gap-2 border-b-1 p-2">
					<div className="flex flex-col">
						{Object.keys(get(users, [u])??{}).map((key, i) => {
							return <p key={i}>{key}</p>;
						})}
					</div>
					<div className="flex flex-col">
						{Object.values(get(users, [u])??{}).map((value, i) => {
							return <p key={i}>{value}</p>;
						})}
					</div>
				</div>
			))}
		</div>
	);
}

export default Pager;

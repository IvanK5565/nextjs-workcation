import ctx from "@/server/container/container";
import { useState } from "react";
import type { User as User } from "@/server/models/users";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import NoSuccessResponse from "@/components/NoSuccessResponse";

export default function Home({ data, code }: { data?: User; code: number }) {
	return (
		<div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
			<Header />
			<div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
				<SearchBar />
				<main className="py-6 xl:flex-1 xl:overflow-x-hidden">
					{!!data ? (
						<div>
							<p className="pl-10">id:{data.id}</p>
            <UserForm data={data} />
						</div>
					) : (
						<NoSuccessResponse res={{ code, success: false }} />
					)}
				</main>
			</div>
		</div>
	);
}

export const getServerSideProps = ctx.resolve("getServerSideProps")(
	["UsersController"]
	// "/classes/[id]"
);

function UserForm({data}:{data:User}){
  const [isView, toggleEditView] = useState(true);

  return(
    <form className="flex flex-col w-min pl-10">
    <input
      type="hidden"
      name="id"
      className="block"
      defaultValue={data.id}
    />
    <label>
      {" "}
      First Name:
      <input
        type="text"
        name="firstName"
        className=""
        defaultValue={data.firstName}
        disabled={isView}
        required
      />
    </label>
    <label>
      {" "}
      Last Name:
      <input
        type="text"
        name="lastName"
        className=""
        defaultValue={data.lastName}
        disabled={isView}
        required
      />
    </label>
    <label>
      {" "}
      Email:
      <input
        type="text"
        name="email"
        className=""
        defaultValue={data.email}
        disabled={isView}
        required
      />
    </label>
    <label>
      {" "}
      Role:
      <input
        type="text"
        name="role"
        className=""
        defaultValue={data.role}
        disabled={isView}
        required
      />
    </label>
    <label>
      {" "}
      Status:
      <input
        type="text"
        name="status"
        className=""
        defaultValue={data.status}
        disabled={isView}
        required
      />
    </label>
  </form>
  )
}
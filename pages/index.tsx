import Header from "@/components/Header";
import LocationCards from "@/components/LocationCards";
import SearchBar from "@/components/SearchBar";
import { getHousesData, Location } from "@/pages/api/data";
import ctx from "@/server/container";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next"

export default function Home({ data, user }: { data: Location[], user: any }) {
  return (
    <div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
      <Header />
      <div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
        <SearchBar />
        <main className="py-6 xl:flex-1 xl:overflow-x-hidden">
          <p>{user?.email}</p>
          {data.map((d, i) => <LocationCards data={d} key={i} />)}
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps = ctx.resolve('getServerSideProps')(
  '/',
  ['UsersController'])

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   // const session = await getServerSession(ctx.req, ctx.res, container.resolve('authOptions'))
//   // if (!session) {
//   //   return {
//   //     redirect: {
//   //       destination: "/signIn",
//   //       permanent: false,
//   //     },
//   //   }
//   // }
//   // console.log(session)
//   console.log('URL ', ctx.req.url)
//   const data = getHousesData();
//   return {
//     props: {
//       data,
//       // user:session.user,
//       // session: JSON.parse(JSON.stringify(session)),
//     },
//   }
// }
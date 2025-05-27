import { UserAction } from "@/client/entities/UserEntity";
import { AppState, useAppDispatch } from "@/client/store";
import { IUser } from "@/client/store/types";
import Header from "@/components/Header";
import LocationCards from "@/components/LocationCards";
import SearchBar from "@/components/SearchBar";
import { getHousesData, Location } from "@/pages/api/data";
import container from "@/server/container/container";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { useSelector } from "react-redux";

type Lesson = {
  name: string,
  homework: string,
  mark: "1" | "2" | "3" | "4" | "5" | null,
  teacherId: string,
}
type Day = {
  name: string,
	lesson: Lesson,
}
type Diary = {
  monday: Day,
  tuesday: Day,
  wednessday: Day,
  thursday: Day,
  friday: Day,
  saturday: Day,
}

const day:Day = {
  name:'Monday' as string,
  lesson: {
    name: "Lesson" as string,
    homework:
    "Open page 200 and do execise 1 and 2, next open page 202 and read text 1" as string,
    mark: "4" as "1" | "2" | "3" | "4" | "5" | null,
    teacherId: "2" as string,
  },
};
const diaryData:Diary = {
  monday: day,
  tuesday: day,
  wednessday: day,
  thursday: day,
  friday: day,
  saturday: day,
};

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
			<Header />
			<div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
				<SearchBar />
				<main className="py-4 xl:flex-1 xl:overflow-x-hidden">
					<Diary data={diaryData} />
				</main>
			</div>
		</div>
	);
}

function Diary({ data }: { data: Diary }) {
	return (
		<div className="diary flex flex-col xl:flex-row bg-white w-full">
			<div className="col1 bg-slate-200 w-full px-2">
				<Day data={data.monday} />
				<Day data={data.tuesday} />
				<Day data={data.wednessday} />
			</div>
			<div className="col2 bg-slate-200 w-full px-2">
				<Day data={data.thursday} />
				<Day data={data.friday} />
				<Day data={data.saturday} />
			</div>
		</div>
	);
}

function fullName(user:IUser){
  return user.firstName + ' ' + user.lastName;
}
function initials(user:IUser){
  return user.firstName.slice(0,1) + '. ' + user.lastName.slice(0,1) + '.';
}


function Lesson({ data }: { data: Lesson }) {
  const entities = useSelector<AppState, AppState['entities']>(state => state.entities);
  const teacher = entities.users[data.teacherId]
  const dispatch = useAppDispatch();
  if(!teacher){
    console.log('teacher',!teacher)
    dispatch<UserAction>({type:'getUserById', payload:{id:data.teacherId}})
  }
	return (
		<div className="flex w-full h-full mt-1">
			<div className="w-40 px-1 bg-slate-400">{data.name}</div>
			<div className="w-full px-1 bg-slate-300 relative group cursor-pointer">
        <div className='truncate max-w-40 xl:max-w-full'>{data.homework ?? 'Loading...'}</div>
        <div className='absolute rounded-lg shadow-lg z-50 top-full hidden group-hover:block bg-slate-200 p-1'>{data.homework ?? 'Loading...'}</div>
      </div>
			<div className="w-10 px-1 bg-slate-300 border-l">{data.mark}</div>
			<div className="w-20 px-1 bg-slate-300 border-l relative inline-block group">
        <div className='cursor-pointer'>{teacher ? initials(teacher): 'Loading...'}</div>
        <div className='absolute mt-[1px] w-max rounded-lg shadow-lg z-50 top-full hidden group-hover:block bg-slate-200 p-1 right-0 left-auto'>{teacher ? fullName(teacher) : 'Loading...'}</div>
      </div>
		</div>
	);
}

function Day({ data }: { data: Day }) {
	return (
		<div className="flex flex-col h-70 mt-2">
			<div className="flex w-full h-full mt-1 px-1 bg-slate-300">{data.name}</div>
			<Lesson data={data.lesson} />
			<Lesson data={data.lesson} />
			<Lesson data={data.lesson} />
			<Lesson data={data.lesson} />
			<Lesson data={data.lesson} />
			<Lesson data={data.lesson} />
			<Lesson data={data.lesson} />
			<Lesson data={data.lesson} />
		</div>
	);
}

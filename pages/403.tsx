import AccessDenied from "@/components/AccessDenied";
import container from "@/server/container/container";

export const getServerSideProps = container.resolve('getServerSideProps')([])

const Page = () => {
	return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center">
		<div className="w-1/2 h-1/2">
			<AccessDenied />
		</div>
    </div>
	);
};

// Page.getLayout = (page: React.ReactNode) => page;
export default Page;

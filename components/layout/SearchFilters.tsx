import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "next-i18next";

function NavButton({
	href,
  onClick,
	children,
}: {
	href: string;
  onClick?: () => void;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-gray-900 px-4 py-4 sm:rounded-sm xl:w-full">
			<Link onClick={onClick} href={href} className={"block w-full text-center sm:w-50 sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block xl:w-full"}>
				{children}
			</Link>
		</div>
	);
}
export default function Navigation({ isHidden, onClose }: { isHidden: boolean, onClose:()=>void }) {
	const {t} = useTranslation('common');
	return (
		<div
			className={clsx(
				"sm:relative xl:h-full xl:flex xl:flex-col xl:justify-between",
				{ hidden: isHidden },
			)}
		>
      <button onClick={onClose} type="button" className="z-30 block fixed inset-0 w-full h-full cursor-default xl:hidden"></button>
			<div className="sm:absolute sm:z-40 sm:right-0 sm:rounded-lg lg:flex xl:block xl:overflow-y-auto xl:w-full">
				<NavButton onClick={onClose} href="/">{t('main')}</NavButton>
				<NavButton onClick={onClose} href="/classes/new">{t('createClass')}</NavButton>
				<NavButton onClick={onClose} href="/users/new">{t('createUser')}</NavButton>
				<NavButton onClick={onClose} href="/classes">{t('classes')}</NavButton>
				<NavButton onClick={onClose} href="/diary">{t('diary')}</NavButton>
				<NavButton onClick={onClose} href="/admin">{t('admin')}</NavButton>
			</div>
			{/* <div className="bg-gray-900 px-4 py-4 sm:text-right">
      <button className={buttonStyle}>Update results</button>
    </div> */}
		</div>
	);
}

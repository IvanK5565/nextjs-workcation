import { useTranslation } from "next-i18next";
import { NavButton } from "./layout/SearchFilters";

export default function AccessDenied() {
  const {t} = useTranslation('common')
  const title = t('accessDenied-title');
  const describe = t('accessDenied-describe');
	return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 bg-indigo-200 rounded-md border border-dashed border-gray-300">
      <AccessDeniedSVG />
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{describe}</p>
			<NavButton className="w-min m-2" href="/signIn" >{t('signIn')}</NavButton>
    </div>
  );
}

const AccessDeniedSVG = () => (
  <svg
  width={800}
  height={800}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="w-12 h-12 text-gray-400 mb-3"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M10 1a1 1 0 0 0-.707.293l-6 6A1 1 0 0 0 3 8v12a3 3 0 0 0 3 3h2a1 1 0 1 0 0-2H6a1 1 0 0 1-1-1V9h5a1 1 0 0 0 1-1V3h7a1 1 0 0 1 1 1v2a1 1 0 1 0 2 0V4a3 3 0 0 0-3-3zM9 7H6.414L9 4.414zm8 2a4 4 0 0 0-4 4v1.304a3 3 0 0 0-2 2.83V20a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-2.867a3 3 0 0 0-2-2.829V13a4 4 0 0 0-4-4m2 4v1.133h-4V13a2 2 0 1 1 4 0m-6 4.133a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1z"
    fill="#000"
  />
</svg>
);
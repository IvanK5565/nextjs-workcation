export default function NoData({ message = "No Data Available", subMessage = "Please check back later." }) {
	return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
      <NoDataSVG width={800} height={800} className="w-12 h-12 text-gray-400 mb-3" />
      <h3 className="text-lg font-medium text-gray-700">{message}</h3>
      <p className="text-gray-500 text-sm mt-1">{subMessage}</p>
    </div>
  );
}

const NoDataSVG = ({width,height,className}:{width:number,height:number,className?:string}) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 12.042h2v-1.99h-2zM10 20h2v-1.99h-2zm4 0h2v-1.99h-2zm4 0h2v-1.99h-2zM2 15.916H0v3.98h4v-1.99H2zM0 2.094h2V.104H0zm18 13.927h2v-1.99h-2zM4 2.094h2V.104H4zm4 0h2V.104H8zm-8 3.98h2v-1.99H0zm0 7.957h2v-1.99H0zM6 20h2v-1.99H6zm8-20h-2v7.958h8V6.073zM0 10.052h2v-1.99H0z"
      fillRule="evenodd"
    />
  </svg>
);
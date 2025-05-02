export default function NoData({ message = "No Data Available", subMessage = "Please check back later." }) {
	return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
      <svg
        className="w-12 h-12 text-gray-400 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75zM12 17.25c2.623 0 4.75-2.127 4.75-4.75S14.623 7.75 12 7.75 7.25 9.877 7.25 12.5 9.377 17.25 12 17.25z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-700">{message}</h3>
      <p className="text-gray-500 text-sm mt-1">{subMessage}</p>
    </div>
  );
}

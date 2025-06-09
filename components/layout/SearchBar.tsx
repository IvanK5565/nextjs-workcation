import Navigation from "./SearchFilters"
import { useState } from "react"
import clsx from "clsx";

export default function SearchBar() {
  const [filtersHidden, setFiltersHidden] = useState(true);

  return <section className="bg-gray-800 xl:w-72">
    <div className="flex justify-between px-4 py-3 xl:hidden">
      <div className="relative max-w-sm w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg className="h-6 w-6 fill-current text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M16.32 14.9l1.1 1.1c.4-.02.83.13 1.14.44l3 3a1.5 1.5 0 0 1-2.12 2.12l-3-3a1.5 1.5 0 0 1-.44-1.14l-1.1-1.1a8 8 0 1 1 1.41-1.41l.01-.01zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /> </svg>
        </div>
        <input className="block w-full bg-gray-900 focus:outline-none focus:bg-white focus:text-gray-900 text-white rounded-lg pl-10 pr-4 py-2" type="text" name="search" id="search" placeholder="Search by keywords" />
      </div>
      <button onClick={() => { setFiltersHidden(!filtersHidden) }}
        className={clsx("ml-4 inline-flex bg-gray-700 hover:bg-gray-600 focus:outline-none focus:shodow-outline rounded-lg shadow px-3 items-center",
          {
            "bg-gray-500": !filtersHidden,
            "bg-gray-700": filtersHidden,
          })}
      >
        <svg className="h-6 w-6 fill-current text-gray-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm3 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1zm4 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4z" /> </svg>
        <span className="ml-1 text-white font-medium">Filters</span>
      </button>
    </div>
    <Navigation onClose={() => {setFiltersHidden(!filtersHidden)}} isHidden={filtersHidden} />
  </section>
}
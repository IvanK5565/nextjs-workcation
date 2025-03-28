import clsx from "clsx"

function CustomRadioBoxes({ value, text }: { value: string, text: string }) {
  return <label className="mt-3 sm:w-1/4 sm:px-2 flex items-center lg:w-full lg:px-0">
    <input className="form-radio" type="radio" name="propertyType" value={value} />
    <span className="ml-2 text-white">{text}</span>
  </label>
}

function CustomCheckBoxes({ name, text, last }: { name: string, text: string, last?: boolean }) {
  return <label className={clsx("mt-3 flex items-center sm:px-2",
    { "sm:w-1/2 lg:w-full": last },
    { "sm:w-1/4 lg:w-1/2 xl:w-full": !last })}>
    <input className="form-checkbox" type="checkbox" name={name} />
    <span className="ml-2 text-white">{text}</span>
  </label>
}

export default function SearchFilters({ isHidden }: { isHidden: boolean }) {
  return <form className={clsx({ "hidden": isHidden }, "xl:h-full xl:flex xl:flex-col xl:justify-between")}>
    <div className="lg:flex xl:block xl:overflow-y-auto">
      <div className="px-4 py-4 border-t border-gray-900 lg:w-1/3 xl:border-t-0 xl:w-full">
        <div className="flex flex-wrap -mx-2">
          <label className="block w-1/2 px-2 sm:w-1/4 lg:w-1/2">
            <span className="text-sm font-semibold text-gray-500">Bedrooms</span>
            <select className="mt-1 form-select rounded-lg block w-full text-white shadow  focus:bg-gray-600">
              <option>4</option>
            </select>
          </label>
          <label className="block w-1/2 px-2 sm:w-1/4 lg:w-1/2">
            <span className="text-sm font-semibold text-gray-500">Bathrooms</span>
            <select className="mt-1 form-select rounded-lg block w-full text-white shadow">
              <option>2</option>
            </select>
          </label>
          <label className="mt-4 block w-full px-2 sm:mt-0 sm:w-1/2 lg:mt-4 lg:w-full">
            <span className="text-sm font-semibold text-gray-500">Price Range</span>
            <select className="mt-1 form-select rounded-lg block w-full text-white shadow">
              <option>Up to $2,000/wk</option>
            </select>
          </label>
        </div>
      </div>
      <div className="px-4 py-4 border-t border-gray-900 lg:w-1/3 lg:border-l xl:w-full">
        <span className='block text-sm font-semibold text-gray-500'>Property Type</span>
        <div className="sm:flex sm:-mx-2 lg:block lg:mx-0">
          <CustomRadioBoxes value="house" text="House" />
          <CustomRadioBoxes value="apartment" text="Apartment" />
          <CustomRadioBoxes value="loft" text="Loft" />
          <CustomRadioBoxes value="townhouse" text="Townhouse" />
        </div>
      </div>
      <div className="px-4 py-4 border-t border-gray-900 lg:w-1/3 lg:border-l xl:w-full">
        <span className='block text-sm font-semibold text-gray-500'>Amenoties</span>
        <div className="sm:flex sm:-mx-2 sm:flex-wrap lg:flex">
          <CustomCheckBoxes name="balcony" text="Balcony" />
          <CustomCheckBoxes name="pool" text="Pool" />
          <CustomCheckBoxes name="beach" text="Beach" />
          <CustomCheckBoxes name="petFriendly" text="Pet friendly" />
          <CustomCheckBoxes name="kidFriendly" text="Kid friendly" />
          <CustomCheckBoxes name="parking" text="Parking" />
          <CustomCheckBoxes name="airConditioning" text="Air Conditioning" last={true} />
        </div>
      </div>
    </div>
    <div className="bg-gray-900 px-4 py-4 sm:text-right">
      <button className="block w-full sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block xl:w-full"> Update results</button>
    </div>
  </form>
}
import Rating from "@/components/Rating"
import { HouseData } from "@/pages/api/data"

function formattedPrice(price: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return formatter.format(price / 100)
}

export default function HouseCard({ data, className }: { data: HouseData, className: string }) {
  return <div className={className}>
    <div className="relative pb-[83%]">
      <img className="absolute inset-0 h-full w-full rounded-lg shadow-md object-cover" src={data.imageUrl} alt="" />
    </div>
    <div className="relative px-4 -mt-16">
      <div className="bg-white rounded-lg px-4 py-4 shadow-lg">
        <div className="flex">
          <span className="inline-block px-2 py-1 leading-none bg-teal-200 text-teal-800 rounded-full font-semibold uppercase tracking-wide text-xs">Plus</span>
          <div className="ml-2 text-xs text-gray-600 font-semibold uppercase tracking-wide">
            {data.beds} beds &bull; {data.baths} baths
          </div>
        </div>
        <h4 className="mt-1 text-gray-900 font-semibold text-base">{data.title}</h4>
        <div className="mt-1">
          <span className="text-gray-900">{formattedPrice(data.price)}</span>
          <span className="ml-1 text-sm text-gray-600">/wk</span>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-600">

          {/* TODO: Ratting */}
          <Rating starCount={data.rating} />
          <span className="ml-2">{data.reviewCount} rewiews</span>
        </div>
      </div>
    </div>
  </div>
}
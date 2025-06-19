import React from 'react';
import ReactPaginate from 'react-paginate';
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
} from '@/components/FaIcons/icons';

interface ILightPaginatorProps {
    currPage: number;
    perPage: number;
    count: number;
    onLoadMore: (page: number) => void;
}

export default function LightPaginator({
    perPage,
    count,
    onLoadMore,
}: ILightPaginatorProps) {
    const pageCount = Math.ceil(count / perPage);

    return (
        <div className="flex justify-center">
            <ReactPaginate
                previousLabel={
                    <FaAngleDoubleLeft className="text-gray-600 group-hover:text-black" />
                }
                nextLabel={
                    <FaAngleDoubleRight className="text-gray-600 group-hover:text-black" />
                }
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={data => onLoadMore(data.selected + 1)}
                containerClassName="flex items-center space-x-2"
                breakClassName="px-2 py-2 block text-[#2A3646] hover:bg-gray-200 transition rounded-lg border border-gray-300"
                pageClassName="rounded-lg overflow-hidden border border-gray-300"
                pageLinkClassName="px-4 py-2 block text-[#2A3646] hover:bg-gray-200 transition"
                activeClassName="bg-[#FC9146] text-white border-blue-500"
                activeLinkClassName="px-4 py-2 text-white block"
                disabledClassName="text-gray-400 cursor-not-allowed"
                previousClassName="border border-gray-300 rounded-md group"
                previousLinkClassName="p-3 flex items-center justify-center w-full h-full hover:bg-gray-200 cursor-pointer"
                nextClassName="border border-gray-300 rounded-md group"
                nextLinkClassName="p-3 flex items-center justify-center w-full h-full hover:bg-gray-200 cursor-pointer"
            />
        </div>
    );
}

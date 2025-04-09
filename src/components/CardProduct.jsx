import { DisplayPriceInRupees } from '@/utilis/DisplayPriceInRupees';
import { pricewithDiscount } from '@/utilis/PriceWithDiscount';
import React, { useState } from 'react';
import Link from 'next/link';

import AddToCartButton from './AddToCart';

const CardProduct = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const url = `/product/${data?._id}`;


    return (
        <Link href={url} className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white">
            <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
                <img
                    src={data?.image?.[0] || '/placeholder-image.jpg'} // Prevents potential errors
                    className="w-full h-full object-scale-down lg:scale-125"
                    alt={data?.name || "Product image"}
                />
            </div>
            <div className="flex items-center gap-1">
                <div className="rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50">
                    10 min
                </div>
                {data?.discount > 0 && (
                    <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">
                        {data.discount}% discount
                    </p>
                )}
            </div>
            <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
                {data?.name}
            </div>
            <div className="w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base">
                {data?.unit}
            </div>
            <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
                <div className="flex items-center gap-1">
                    <div className="font-semibold">
                        {DisplayPriceInRupees(pricewithDiscount(data?.price, data?.discount))}
                    </div>
                </div>
                <div>
                    {data?.stock === 0 ? (
                        <p className="text-red-500 text-sm text-center">Out of stock</p>
                    ) : (
                       <AddToCartButton data={data}></AddToCartButton>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CardProduct;

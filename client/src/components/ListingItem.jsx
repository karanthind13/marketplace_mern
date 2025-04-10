import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
   <div className='bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full sm:w-[320px] hover:scale-[1.02]'>
  <Link to={`/listing/${listing._id}`}>
    <img
      src={listing.imageUrls[0]}
      alt="listing cover"
      className='h-[320px] sm:h-[220px] w-full object-cover transition-transform duration-300 hover:scale-105'
    />

    <div className="p-4 flex-col flex gap-3 w-full">
      <p className='text-lg font-bold text-slate-800 truncate'>{listing.name}</p>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <MdLocationOn className='h-4 w-4 text-emerald-600' />
        <p className='truncate'>{listing.address}</p>
      </div>

      <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>

      <p className='text-blue-700 font-semibold mt-1 text-base'>
        $
        {listing.offer
          ? listing.discountPrice.toLocaleString('en-US')
          : listing.regularPrice.toLocaleString('en-US')}
        {listing.type === 'rent' && <span className="text-sm font-medium text-slate-600">/month</span>}
      </p>

      <div className="flex gap-4 mt-2 text-slate-700 text-xs font-semibold">
        <div>
          {listing.bedrooms > 1
            ? `${listing.bedrooms} beds`
            : `${listing.bedrooms} bed`}
        </div>
        <div>
          {listing.bathrooms > 1
            ? `${listing.bathrooms} baths`
            : `${listing.bathrooms} bath`}
        </div>
      </div>
    </div>
  </Link>
</div>

  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
<div className='bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 min-h-screen'>
  {/* top */}
  <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl animate-fade-in'>
    <h1 className='text-slate-800 font-extrabold text-4xl lg:text-6xl leading-tight tracking-tight'>
      Find your next <span className='text-blue-600'>perfect</span>
      <br />
      place with ease
    </h1>
    <div className='text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed'>
      EMIVilla is the best place to find your next perfect place to live.
      <br />
      We have a wide range of properties for you to choose from.
    </div>
    <Link
      to={'/search'}
      className='text-sm sm:text-base text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full shadow-xl hover:scale-105 hover:from-indigo-600 hover:to-blue-700 transition duration-300 w-fit mx-auto'
    >
      Let’s get started...
    </Link>
  </div>

  {/* swiper */}
  <div className='my-16 px-4'>
    <Swiper navigation>
      {offerListings &&
        offerListings.length > 0 &&
        offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div
              style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='h-[500px] rounded-3xl shadow-2xl border-[4px] border-white'
            ></div>
          </SwiperSlide>
        ))}
    </Swiper>
  </div>

  {/* listing results for offer, sale and rent */}
  <div className='max-w-8xl mx-auto p-6 flex flex-col gap-16 my-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-3xl shadow-xl'>
    {/* Offers */}
    {offerListings && offerListings.length > 0 && (
      <div>
        <div className='mb-6 flex justify-between items-center px-2'>
          <h2 className='text-3xl font-bold text-slate-800 tracking-tight border-b-4 border-blue-100 pb-1 inline-block'>
            💎 Hot Property Deals
          </h2>
          <Link className='text-blue-600 hover:underline text-base font-medium' to={'/search?offer=true'}>
            Show more offers →
          </Link>
        </div>
        <div className='flex flex-wrap gap-6 justify-center'>
          {offerListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}

    {/* Rent */}
    {rentListings && rentListings.length > 0 && (
      <div>
        <div className='mb-6 flex justify-between items-center px-2'>
          <h2 className='text-3xl font-bold text-slate-800 tracking-tight border-b-4 border-indigo-100 pb-1 inline-block'>
            🏡 Latest Rentals
          </h2>
          <Link className='text-blue-600 hover:underline text-base font-medium' to={'/search?type=rent'}>
            Show more for rent →
          </Link>
        </div>
        <div className='flex flex-wrap gap-6 justify-center'>
          {rentListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}

    {/* Sale */}
    {saleListings && saleListings.length > 0 && (
      <div>
        <div className='mb-6 flex justify-between items-center px-2'>
          <h2 className='text-3xl font-bold text-slate-800 tracking-tight border-b-4 border-teal-100 pb-1 inline-block'>
            🏢 Featured Sales
          </h2>
          <Link className='text-blue-600 hover:underline text-base font-medium' to={'/search?type=sale'}>
            Show more for sale →
          </Link>
        </div>
        <div className='flex flex-wrap gap-6 justify-center'>
          {saleListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}
  </div>
</div>

  );
}
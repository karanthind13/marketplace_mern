import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="bg-gray-50 min-h-screen">
  {loading && (
    <p className="text-center my-12 text-3xl font-semibold text-slate-500 tracking-wide">
      Loading...
    </p>
  )}
  {error && (
    <p className="text-center my-12 text-3xl font-semibold text-red-500 tracking-wide">
      Something went wrong!
    </p>
  )}
  {listing && !loading && !error && (
    <div>
      <Swiper navigation>
        {listing.imageUrls.map((url) => (
          <SwiperSlide key={url}>
            <div
              className="h-[550px] w-full"
              style={{
                background: `url(${url}) center center / cover no-repeat`,
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Share Button */}
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-lg cursor-pointer hover:bg-blue-50 transition duration-200">
        <FaShare
          className="text-slate-600 text-lg"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>

      {/* Copied message */}
      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-white border px-3 py-1 text-sm text-slate-700 shadow-md">
          Link copied!
        </p>
      )}

      {/* Listing Details */}
      <div className="flex flex-col max-w-6xl mx-auto p-6 mt-10 gap-6 bg-white rounded-2xl shadow-xl">
        {/* Title & Price */}
        <p className="text-4xl font-bold text-slate-900">
          {listing.name}{' '}
          <span className="text-indigo-600">
            - ${listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </span>
        </p>

        {/* Address */}
        <p className="flex items-center gap-2 text-slate-500 text-base font-medium">
          <FaMapMarkerAlt className="text-green-600" />
          {listing.address}
        </p>

        {/* Labels */}
        <div className="flex flex-col sm:flex-row gap-3">
          <p className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-center shadow-md">
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </p>
          {listing.offer && (
            <p className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-center shadow-md">
              ${+listing.discountPrice} OFF
            </p>
          )}
        </div>

        {/* Description */}
        <div className="text-base text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900">Description: </span>
          {listing.description}
        </div>

        {/* Features */}
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 text-slate-800 font-medium text-sm">
          <li className="flex items-center gap-2">
            <FaBed className="text-xl text-slate-600" />
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Beds`
              : `${listing.bedrooms} Bed`}
          </li>
          <li className="flex items-center gap-2">
            <FaBath className="text-xl text-slate-600" />
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Baths`
              : `${listing.bathrooms} Bath`}
          </li>
          <li className="flex items-center gap-2">
            <FaParking className="text-xl text-slate-600" />
            {listing.parking ? 'Parking Available' : 'No Parking'}
          </li>
          <li className="flex items-center gap-2">
            <FaChair className="text-xl text-slate-600" />
            {listing.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>

        {/* Contact Button */}
        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setContact(true)}
            className="bg-indigo-600 hover:bg-indigo-700 transition duration-200 text-white text-base rounded-lg uppercase py-3 px-6 font-semibold shadow-lg mt-4 w-full sm:w-auto"
          >
            Contact Landlord
          </button>
        )}

        {/* Contact Form */}
        {contact && <Contact listing={listing} />}
      </div>
    </div>
  )}
</main>

  );
}

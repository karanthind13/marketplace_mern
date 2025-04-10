import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarData, setSidebarData] = useState({
        searchTerm:'',
        type:'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order:'desc',
    });

    const [loading, setLoading]= useState(false);
    const [listings, setListings]= useState([]);
    const [showMore, setShowMore]= useState(false);
    

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSidebarData({
                searchTerm:searchTermFromUrl ||'',
                type: typeFromUrl ||'all',
                parking: parkingFromUrl ==='true'?true:false,
                furnished :furnishedFromUrl==='true'?true:false,
                offer: offerFromUrl==='true'? true:false,
                sort: sortFromUrl||'created_at',
                order: orderFromUrl||'desc',
            })
        }

        const fetchListings = async()=>{
            setShowMore(false);
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res =await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length>8){
                setShowMore(true);
            }else{
                setShowMore(false)
            }
            setListings(data);
            setLoading(false);
        };
        fetchListings();


    }, [location.search]);


    const handleChange =(e)=>{

        if(e.target.id ==='all'|| e.target.id==='rent'|| e.target.id ==='sale'){
            setSidebarData({...sidebarData, type:e.target.id})
        }

        if(e.target.id ==='searchTerm'){
            setSidebarData({...sidebarData, searchTerm:e.target.value})
        }

        if(e.target.id ==='parking' || e.target.id === 'furnished'||e.target.id==='offer'){
            setSidebarData({...sidebarData, 
                [e.target.id]:
                e.target.checked||e.target.checked==='true'?true:false,

            });
        }

        if(e.target.id ==='sort_order'){
            const sort = e.target.value.split('_')[0]||'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebarData({...sidebarData, sort, order});
        }
    };

    const handleSubmit=(e)=>{
        e.preventDefault();

        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }


    const onShowMoreClick = async ()=>{
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res =await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.lenght<9){
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

  return (
    <div className='flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen'>
  {/* Sidebar */}
  <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-white/80 backdrop-blur-md shadow-md">
    <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
      {/* Search term */}
      <div className="flex items-center gap-2">
        <label className='whitespace-nowrap font-semibold text-slate-700'>Search term:</label>
        <input
          type="text"
          id='searchTerm'
          placeholder='Search...'
          className='border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-300 outline-none shadow-sm'
          value={sidebarData.searchTerm}
          onChange={handleChange}
        />
      </div>

      {/* Type */}
      <div className="flex gap-2 flex-wrap items-center">
        <label className='font-semibold text-slate-700'>Type:</label>
        <div className="flex gap-2 items-center">
          <input type="checkbox" id='all' className='w-5 h-5 accent-blue-600' onChange={handleChange} checked={sidebarData.type === 'all'} />
          <span>Rent & Sale</span>
        </div>
        <div className="flex gap-2 items-center">
          <input type="checkbox" id='rent' className='w-5 h-5 accent-blue-600' onChange={handleChange} checked={sidebarData.type === 'rent'} />
          <span>Rent</span>
        </div>
        <div className="flex gap-2 items-center">
          <input type="checkbox" id='sale' className='w-5 h-5 accent-blue-600' onChange={handleChange} checked={sidebarData.type === 'sale'} />
          <span>Sale</span>
        </div>
        <div className="flex gap-2 items-center">
          <input type="checkbox" id='offer' className='w-5 h-5 accent-green-600' onChange={handleChange} checked={sidebarData.offer} />
          <span>Offer</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="flex gap-2 flex-wrap items-center">
        <label className='font-semibold text-slate-700'>Amenities:</label>
        <div className="flex gap-2 items-center">
          <input type="checkbox" id='parking' className='w-5 h-5 accent-indigo-600' onChange={handleChange} checked={sidebarData.parking} />
          <span>Parking</span>
        </div>
        <div className="flex gap-2 items-center">
          <input type="checkbox" id='furnished' className='w-5 h-5 accent-indigo-600' onChange={handleChange} checked={sidebarData.furnished} />
          <span>Furnished</span>
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <label className='font-semibold text-slate-700'>Sort:</label>
        <select
          onChange={handleChange}
          defaultValue={'created_at_desc'}
          id="sort_order"
          className='border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 outline-none shadow-sm'
        >
          <option value="regularPrice_desc">Price high to low</option>
          <option value="regularPrice_asc">Price low to high</option>
          <option value="createdAt_desc">Latest</option>
          <option value="createdAt_asc">Oldest</option>
        </select>
      </div>

      {/* Submit Button */}
      <button className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg uppercase font-semibold hover:opacity-90 shadow-md transition'>
        Search
      </button>
    </form>
  </div>

  {/* Results */}
  <div className="flex-1 bg-white/80 rounded-md shadow-sm p-4">
    <h1 className='text-3xl font-bold border-b border-slate-300 p-3 text-slate-800 mt-5'>
      🔍 Listing Results
    </h1>
    <div className="p-7 flex flex-wrap gap-6 justify-center">
      {!loading && listings.length === 0 && (
        <p className='text-xl text-slate-700'>No listing found!</p>
      )}

      {loading && (
        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
      )}

      {!loading && listings && listings.map((listing) => (
        <ListingItem key={listing._id} listing={listing} />
      ))}

      {showMore && (
        <button
          onClick={onShowMoreClick()}
          className='text-green-700 hover:underline p-5 text-center w-full font-semibold'
        >
          Show more
        </button>
      )}
    </div>
  </div>
</div>
  )
}

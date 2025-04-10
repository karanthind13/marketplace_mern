import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import {Link} from 'react-router-dom'

const Profile = () => {
  const fileRef = useRef(null)
  const {currentUser, loading , error} = useSelector((state)=>state.user)
  const [file, setFile]= useState(undefined)
  const [filePerc, setFilePerc]=useState(0)
  const [fileUploadError, setFileUploadError]= useState(false);
  const [formData, setFormData]= useState({});
  const [updateSuccess, setUpdateSuccess]= useState(false);
  const [showListingsError, setShowListingsError]= useState(false);
  const [userListings, setUserListings]= useState([])
  const dispatch = useDispatch(); 
 
  
//firebase clouyd storage
// allow read;
// allow write: if 
// request.resource.size <2*1024*1024 &&
// request.resource.contentType.matches('image/.*')
// }
  useEffect(()=>{
    if(file){
      handleFileUpload()
    }
  },[file]);

  const handleFileUpload=()=>{
    const storage = getStorage(app);
    const fileName= new Date().getTime()+file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress =(snapshot.bytesTransferred /
          snapshot.totalBytes)*100;
          setFilePerc(Math.round(progress))
      },
      (error)=>{
        setFileUploadError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL)=>{
          setFormData({...formData, avatar:downloadURL});
        })
      }
    );
  };

  const handleChange =(e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch (`/api/user/update/${currentUser._id}`,{

        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json()
      if (data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async ()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE",
      });
      const data = await res.json();
      if (data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const  handleSignedOut = async() => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
    }
  }                                                                                                                                                                                                 

  const handleShowListings = async()=>{
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete = async(listingId)=>{
    try {
      const res =await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if (data.success===false){
        console.log(data.message);
        return;
      }

      setUserListings((prev)=>prev.filter((listing)=>listing._id !== listingId));
    } catch (error) {
      console.log(error)
    }
  }

  return (
<div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-3xl border border-gray-200">
  <h1 className="text-4xl font-bold text-center text-gray-800 my-7">Profile</h1>

  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
    <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
    <img 
      onClick={() => fileRef.current.click()} 
      src={formData.avatar || currentUser.avatar} 
      alt="profile" 
      className="h-32 w-32 object-cover cursor-pointer self-center mt-2 border-4 border-transparent hover:border-teal-500 transition-all shadow-lg rounded-full"
    />
    <p className="text-sm self-center mt-2">
      {fileUploadError ? (
        <span className="text-red-600 font-semibold">Error Image Upload</span>
      ) : filePerc > 0 && filePerc < 100 ? (
        <span className="text-slate-700">Uploading {filePerc}%</span>
      ) : filePerc === 100 ? (
        <span className="text-green-600 font-semibold">Image Successfully Uploaded!</span>
      ) : ""}
    </p>

    <input 
      type="text" 
      placeholder="Username" 
      defaultValue={currentUser.username} 
      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" 
      id="username" 
      onChange={handleChange} 
    />
    <input 
      type="email" 
      placeholder="Email" 
      defaultValue={currentUser.email} 
      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" 
      id="email" 
      onChange={handleChange} 
    />
    <input 
      type="password" 
      placeholder="Password" 
      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" 
      id="password" 
      onChange={handleChange} 
    />
    <button 
      disabled={loading} 
      className="bg-teal-600 text-white py-3 px-6 rounded-lg uppercase font-semibold disabled:opacity-60 transition-all hover:bg-teal-700"
    >
      {loading ? 'Loading...' : 'Update'}
    </button>

    <Link 
      className="bg-green-600 text-white py-3 px-6 rounded-lg uppercase text-center font-semibold mt-4 hover:bg-green-700 transition-all"
      to={'/create-listing'}
    >
      Create Listing
    </Link>
  </form>

  <div className="flex justify-between mt-7">
    <span 
      onClick={handleDeleteUser} 
      className="text-red-600 font-semibold cursor-pointer uppercase hover:text-red-700 transition-all"
    >
      Delete Account
    </span>
    <span 
      onClick={handleSignedOut} 
      className="text-red-600 font-semibold cursor-pointer uppercase hover:text-red-700 transition-all"
    >
      Sign Out
    </span>
  </div>

  <p className="text-red-600 mt-5">{error ? error : ''}</p>
  <p className="text-green-600">{updateSuccess ? 'User updated successfully' : ''}</p>
  <button onClick={handleShowListings} className="text-teal-600 font-semibold text-lg mt-5 hover:text-teal-700 transition-all">
    Show Listings
  </button>
  <p className="text-red-600 mt-5">{showListingsError ? 'Error showing listings' : ''}</p>

  {userListings && userListings.length > 0 && (
    <div className="mt-7 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Listings</h1>
      {userListings.map((listing) => (
        <div key={listing._id} className="border border-gray-300 rounded-lg p-5 flex justify-between items-center gap-6 shadow-lg hover:shadow-2xl transition-all">
          <Link to={`/listing/${listing._id}`} className="flex items-center gap-4">
            <img 
              src={listing.imageUrls[0]} 
              alt="listing cover" 
              className="h-20 w-20 object-cover rounded-md shadow-md"
            />
            <p className="text-gray-700 font-semibold text-lg truncate">{listing.name}</p>
          </Link>
          <div className="flex flex-col items-center">
            <button 
              onClick={() => handleListingDelete(listing._id)} 
              className="text-red-600 font-semibold text-sm uppercase hover:text-red-700 transition-all"
            >
              Delete
            </button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className="text-teal-600 font-semibold text-sm uppercase hover:text-teal-700 transition-all">
                Edit
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


  )
}

export default Profile

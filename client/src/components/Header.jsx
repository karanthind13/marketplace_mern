import React, { useEffect, useState } from 'react'
import{FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Header(){
    const {currentUser}=  useSelector(state =>state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate();

    const handleSubmit =(e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    };

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])
    return (
<header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-200">
  <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">

    {/* Logo */}
    <Link to="/">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 transition-transform duration-300 hover:scale-105">
        <span className="text-sky-600 drop-shadow-sm">EMI</span>
        <span className="text-gray-800">Villa</span>
      </h1>
    </Link>

    {/* Search Bar */}
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 bg-white border border-gray-300 rounded-full px-5 py-2 shadow-md focus-within:ring-2 focus-within:ring-sky-500 transition"
    >
      <input
        type="text"
        placeholder="Search properties..."
        className="bg-transparent focus:outline-none w-28 sm:w-64 text-base sm:text-sm text-gray-700 placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">
        <FaSearch className="text-gray-500 hover:text-sky-600 transition duration-200" />
      </button>
    </form>

    {/* Navigation */}
    <ul className="flex items-center gap-6 text-base sm:text-lg font-semibold text-gray-700">
      <Link to="/home">
        <li className="hidden sm:inline hover:text-sky-600 transition hover:underline underline-offset-4 decoration-sky-500 hover:scale-105">
          Home
        </li>
      </Link>

      <Link to="/about">
        <li className="hidden sm:inline hover:text-sky-600 transition hover:underline underline-offset-4 decoration-sky-500 hover:scale-105">
          About
        </li>
      </Link>

      <Link to="/profile">
        {currentUser ? (
          <img
            className="h-11 w-11 rounded-full object-cover ring-2 ring-sky-500 hover:scale-110 transition-transform duration-300 shadow-md"
            src={currentUser.avatar}
            alt="profile"
          />
        ) : (
          <li className="hover:text-sky-600 transition hover:underline hover:scale-105">
            Sign in
          </li>
        )}
      </Link>
    </ul>
    
  </div>
</header>
      
      )
    
}
  



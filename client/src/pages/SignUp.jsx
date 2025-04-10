import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData]= useState({});
  const[error, setError]= useState(null);
  const[loading, setLoading]= useState(false);
  const navigate = useNavigate();
  const handleChange=(e)=>{
    setFormData(
      {
        ...formData,
        [e.target.id]:e.target.value,
      }
    );
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
        setLoading(true);
      const res = await fetch('/api/auth/signup',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      }
      );
      const data = await res.json();
      if(data.success===false){
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    
    // console.log(data);
  }
  console.log(formData);
  return (
    <div className='p-8 max-w-md mx-auto bg-white rounded-xl shadow-xl'>
  <h1 className='text-4xl font-bold text-center text-gray-800 my-6'>
    Sign Up
  </h1>
  <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
    <input
      type='text'
      placeholder='Username'
      className='w-full p-4 text-lg border-2 border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
      id='username'
      onChange={handleChange}
    />
    <input
      type='email'
      placeholder='Email'
      className='w-full p-4 text-lg border-2 border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
      id='email'
      onChange={handleChange}
    />
    <input
      type='password'
      placeholder='Password'
      className='w-full p-4 text-lg border-2 border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
      id='password'
      onChange={handleChange}
    />
    <button
      disabled={loading}
      className='w-full bg-indigo-600 text-white p-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50'
    >
      {loading ? 'Loading...' : 'Sign Up'}
    </button>
    <OAuth />
  </form>
  <div className='flex justify-center gap-2 mt-5'>
    <p className='text-gray-600'>Already have an account?</p>
    <Link to='/sign-in'>
      <span className='text-indigo-600 font-semibold hover:underline'>
        Sign In
      </span>
    </Link>
  </div>
  {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
</div>
  )
}

 

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


export default function SignIn() {
  const [formData, setFormData]= useState({});
  const {loading, error}= useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch= useDispatch();
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
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',
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
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
    
  }
  console.log(formData);
  return (
    <div className='p-8 max-w-md mx-auto bg-white rounded-xl shadow-xl'>
  <h1 className='text-4xl font-bold text-center text-gray-800 my-6'>
    Sign In
  </h1>
  <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
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
      {loading ? 'Loading...' : 'Sign In'}
    </button>
    <OAuth />
  </form>
  <div className='flex justify-center gap-2 mt-5'>
    <p className='text-gray-600'>Don't have an account?</p>
    <Link to='/sign-up'>
      <span className='text-indigo-600 font-semibold hover:underline'>
        Sign Up
      </span>
    </Link>
  </div>
  {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
</div>

 )
}

 

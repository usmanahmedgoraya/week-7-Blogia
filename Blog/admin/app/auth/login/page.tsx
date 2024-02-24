'use client'
import Login from '@/Components/login/Login';
import { useRouter } from 'next/navigation'; // Correct import for useRouter
import React, { useEffect } from 'react';

const Page = () => { // Capitalized 'Page' for consistency
  const router = useRouter();

  useEffect(() => {
    const localAuthToken = localStorage.getItem('Auth'); // Use const for localAuthToken
    if (localAuthToken) {
      const { state: { isLoggedin } } = JSON.parse(localAuthToken);
      if (isLoggedin) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [router]); // Include router in the dependency array

  return (
    <div className='flex justify-center items-center'>
      <Login />
    </div>
  );
};

export default Page;

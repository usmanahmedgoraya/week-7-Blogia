'use client'
import Login from '@/Components/login/Login'
import { useRouter } from 'next/navigation' // Correct import statement for useRouter
import React, { useEffect } from 'react'

const Page = () => { // Changed 'page' to 'Page'
  const router = useRouter()
  useEffect(() => {
    const localAuthToken:any = localStorage.getItem('Auth')
    if (localAuthToken) {
      const { state: { isLoggedin } } = JSON.parse(localAuthToken);
      if (isLoggedin) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    }
  }, [router])
  
  return (
    <div className='flex justify-center items-center'>
        <Login/>
    </div>
  )
}

export default Page 
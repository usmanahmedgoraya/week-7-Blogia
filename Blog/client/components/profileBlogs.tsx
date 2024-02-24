'use client'
import useBlogStore from '@/zustand/useBlogStore'
import React, { useEffect } from 'react'

const profileBlogs = () => {
    const{userBlogs,userBlog} = useBlogStore()
    useEffect(() => {
      userBlogs()
      console.log(userBlog);
      
    }, [])
    
  return (
    <div>profileBlogs</div>
  )
}

export default profileBlogs
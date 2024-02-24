'use client'
import Card from '@/components/Card/Card'
import useBlogStore from '@/zustand/useBlogStore'
import React, { useEffect } from 'react'

const UserBlogs = ({ params }: { params: { id: string } }) => {
  const { userBlog, userBlogs } = useBlogStore()
  useEffect(() => {
    Promise.all([userBlogs()])
  }, [])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-8 md:gap-14 gap-3 flex-wrap md:m-8 m-2'>
      {userBlog?.map((blog: any, index: number) => (
        // <Blog key={blog._id} blog={blog}  />
        <Card  key={blog._id} blog={blog} />
      ))}

    </div>
  )
}

export default UserBlogs
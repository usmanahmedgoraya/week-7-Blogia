'use client'
import useBlogStore from '@/zustand/useBlogStore'
import useUserStore from '@/zustand/useUserStore'
import React, { useEffect } from 'react'

const BlogTable = () => {
  const { blogs, getAllBlog } = useBlogStore()
  useEffect(() => {
    getAllBlog()
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {blogs?.map((blog: any, index) => {
            return (
              <tr key={blog?._id}>
                <th className='w-6'>{index + 1}</th>
                <td className='w-12'>
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={blog?.user?.profileImage || "https://res.cloudinary.com/dyunqrxki/image/upload/v1706809133/cenrjqfsfuo98x3c6ji1.jpg"} />
                    </div>
                  </div>
                </td>
                <td className='w-52'>{blog?.title}</td>
                <td>{blog?.email}</td>
                <td>{blog?.userStatus}</td>
                <td className='capitalize'>{blog?.role}</td>
                <td>
                  <button className="btn btn-active btn-neutral">
                    {blog?.userStatus === 'Block' ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default BlogTable
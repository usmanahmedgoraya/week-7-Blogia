'use client'
import Card from '@/Components/Card/Card'
import Empty from '@/Components/Empty'
import useBlogStore from '@/zustand/useBlogStore'
import { useEffect } from 'react'

const Page = () => {
  const { pendings, getAllBlog } = useBlogStore()
  
  useEffect(() => {
    getAllBlog()
  }, []) // useEffect should be called inside the component

  return (
    <div className='relative flex justify-center items-center flex-col'>
      <h1 className='md:text-4xl my-8 text-center md:ml-20 ml-14'>Pending Blogs</h1>
      {pendings.length === 0 ? <Empty /> :
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8 md:gap-2 gap-3 flex-wrap md:m-4 m-2 relative left-12'>
          {pendings?.map((blog: any) => (
            <Card blog={blog} key={blog?._id} />
          ))}
        </div>
      }
    </div>
  )
}

export default Page

// 'useBlogStore' seems to be a typo, corrected to 'useBlogStore'
import useBlogStore from '@/zustand/useBlogStore';
import React, { useEffect, useState } from 'react';
import Blog, { BlogProps } from './Blog';
import { useRouter } from 'next/navigation';
import Card from '../Card/Card';

const Blogs: React.FC = () => {
  const { blogs, getAllBlog } = useBlogStore();
  const [approvedBlogs, setApprovedBlogs] = useState()
  const router = useRouter()
  useEffect(() => {
    getAllBlog();
    const approved = blogs?.filter((blog: { status: string }) => blog.status === 'Approved')
    const isAuthExist: any = localStorage.getItem('Auth')

    // setApprovedBlogs(approved)
  }, []);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-8 md:gap-14 gap-3 flex-wrap md:m-8 m-2'>
      {blogs?.map((blog: any, index: number) => (
        // <Blog key={blog._id} blog={blog}  />
        <Card key={blog._id} blog={blog} />
      ))}

    </div>
  );
};

export default Blogs;

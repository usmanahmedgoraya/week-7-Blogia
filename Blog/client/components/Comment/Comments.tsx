'use client'
import useBlogStore from '@/zustand/useBlogStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import GetComments from '../GetComments';

interface IComments {
  comments: [];
  blogId: string;
}

const Comments = ({ comments, blogId }: IComments) => {
  const [user, setUser] = useState<any>()
  const router = useRouter();
  const [commentData, setCommentData] = useState({
    content: '',
  });
  const { createComment } = useBlogStore();

  useEffect(() => {
    const isAuthExist: any = localStorage.getItem('Auth');
    const Auth: any = JSON.parse(isAuthExist);
    const user: any = Auth?.state?.user;
    setUser(user)
  }, [])
  

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setCommentData({ ...commentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const isAuthExist: any = localStorage.getItem('Auth');
    const Auth: any = JSON.parse(isAuthExist);
    if (!Auth?.state?.token || Auth?.state?.token === '') {
      router.push('/auth/login');
    }
    const id = blogId;
    createComment(id, commentData);
    setCommentData({ content: '' });
  };

  return (
    <div className='mt-8 w-full md:w-[28rem]'>
      {user?.role === 'user' &&
        <div className="bg-gray-800 border border-slate-200 rounded-xl p-4 text-sm">
          <h1 className="text-center text-slate-200 text-xl font-bold mb-4">Create Comment</h1>
          <textarea
            placeholder="Your comment..."
            className="bg-slate-700 text-slate-100 h-28 placeholder:text-slate-100 placeholder:opacity-50 border border-slate-200 w-full resize-none outline-none rounded-lg p-2 mb-4 duration-300 focus:border-slate-600"
            name='content'
            id='content'
            value={commentData.content}
            onChange={handleChange}
          ></textarea>
          <button
            className="bg-slate-100 stroke-slate-600 border border-slate-200 w-full flex justify-center items-center space-x-2 rounded-lg p-2 duration-300 hover:border-slate-600 hover:text-slate-600 active:stroke-blue-200 active:bg-blue-400"
            onClick={handleSubmit}
          >
            <svg fill="none" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"></path>
              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M10.11 13.6501L13.69 10.0601"></path>
            </svg>
            <span>Post</span>
          </button>
        </div>}
      <GetComments comments={comments} blogId={''} />
    </div>
  );
};

export default Comments;

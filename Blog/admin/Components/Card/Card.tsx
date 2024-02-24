'use client'
import React from 'react'
import './Card.css'
const { TERipple } = require('tw-elements-react')
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useBlogStore from '@/zustand/useBlogStore'

export interface BlogProps {
    key: string;
    blog: {
        _id: string;
        user: {
            _id: string,
            profileImage: string,
            name: string
        };
        reaction: [];
        comments: [];
        categories: {
            name: string
        };
        title: string;
        description: string;
        image: string;
        tags: [];
        status: string;
        createdAt: string;
        updatedAt: string;
    };
}

const Card = ({ blog, key }: BlogProps) => {
    const router = useRouter()
    const { approveBlog, disapproveBlog } = useBlogStore()

    function getFirst84Characters(paragraph: string) {
        // Use substring to get the first 84 characters
        var first84Characters = paragraph.substring(0, 45);
        return first84Characters;
    }

    const formatDate = (): string => {
        const dateString = blog.createdAt; // Replace this with your actual date string
        const date = new Date(dateString);

        // Rest of the code remains the same
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate
    }

    const handleBlogStatus = async (actionType: string) => {
        if (actionType === "approve") {
            approveBlog(blog?._id)
        } else if (actionType === 'disapprove') {
            disapproveBlog(blog?._id)
        }
    }

    return (
        // <div className='cursor-pointer' onClick={() => router.push(`/blog/${blog._id}`)}>
        <div className='cursor-pointer' >

            <div className="card relative">
                <TERipple>
                    <div
                        className="relative overflow-hidden bg-cover bg-no-repeat z-40 p-1.5 rounded-t-3xl h-40">
                        <img
                            className="rounded-t-3xl bg-cover"
                            src={blog?.image}
                            alt={blog?.title} />

                        <div
                            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                    </div>
                </TERipple>
                <div className="md:p-1 mx-3 p-1 h-full text-white z-40 flex flex-col justify-between items-stretch">
                    <div className='flex justify-between items-center mb-2'>
                        <p className='text-purple-500 capitalize font-medium text-xs  '>
                            {blog?.categories?.name}
                        </p>
                        <div className="badge badge-secondary badge-outline p-3 text-xs">{blog?.status}</div>
                    </div>
                    <h5
                        className="text-sm font-bold leading-tight text-white dark:text-neutral-50 mb-2">
                        {blog?.title}
                    </h5>
                    <p className="mb-2 text-xs text-slate-400 dark:text-neutral-200">
                        {blog?.description?.length > 84 ? `${getFirst84Characters(blog?.description)}...` : blog?.description}
                    </p>
                    <div className='flex items-center gap-x-2 mb-3'>
                        <div>
                            <Image src={'https://res.cloudinary.com/dyunqrxki/image/upload/v1706250956/lnha0zjnpjwctkmm1p4u.png'} alt={'Hell'} width={30} height={30} className='rounded-full h-8 w-6' />
                        </div>
                        <div>
                            <h1 className='text-xs'>
                                {blog?.user?.name}
                            </h1>
                            <p className='text-xs'>
                                {formatDate()}
                            </p>
                        </div>
                    </div>
                    <div className='mb-2 flex justify-center space-x-3 items-center'>
                        {blog.status !== 'Approved' && (
                            <button className='text-sm border rounded-full p-2 hover:bg-white hover:text-gray-900 transition-all duration-500' onClick={() => handleBlogStatus("approve")}>
                                Approve
                            </button>
                        )}
                        {(blog.status === 'Pending' || blog.status === 'Approved') && (
                            <button className='text-sm border rounded-full p-2 hover:bg-white hover:text-gray-900 transition-all duration-300' onClick={() => handleBlogStatus("disapprove")}>
                                Disapprove
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Card
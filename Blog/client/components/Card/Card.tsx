'use client'
import React from 'react'
import './Card.css'
import { TERipple } from 'tw-elements-react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Divider } from 'antd'

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
    const path = usePathname()
    function getFirst84Characters(paragraph: string) {
        // Use substring to get the first 84 characters
        let first84Characters = paragraph.substring(0, 84);
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

    function splitFirstEightCharacters() {
        return path.slice(0, 10);
    }
    return (
        <div className='cursor-pointer container' onClick={() => router.push(`/blog/${blog._id}`)}>

            <div className="card relative">
                <TERipple>
                    <div
                        className="relative overflow-hidden bg-cover bg-no-repeat z-40 p-1.5 rounded-t-3xl h-56">
                        <img
                            className="rounded-t-3xl object-cover"
                            src={blog.image}
                            alt={blog.title} />

                        <div
                            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                    </div>
                </TERipple>
                <div className="md:p-2 mx-3 p-1 h-full text-white z-40 flex flex-col justify-between ">
                    <div className='flex justify-between items-center my-2'>
                        <p className='text-purple-400 capitalize font-medium text-xs  '>
                            {blog?.categories?.name}
                        </p>
                        {splitFirstEightCharacters() === '/blog/user' &&
                            <div className="badge badge-secondary badge-outline p-3 text-xs">{blog?.status}</div>}
                    </div>
                    <h5
                        className="mb-2 text-lg font-medium leading-tight text-white dark:text-neutral-50">
                        {blog?.title}
                    </h5>
                    <p className="mb-4 text-sm  text-white dark:text-neutral-200">
                        {blog?.description.length > 84 ? `${getFirst84Characters(blog.description)}...` : blog?.description}
                    </p>
                    <div className='flex items-center gap-x-2 mb-3'>
                        <div>
                            <img src={blog?.user.profileImage || 'https://res.cloudinary.com/dyunqrxki/image/upload/v1706250956/lnha0zjnpjwctkmm1p4u.png'} alt={'Hell'} width={30} height={30} className='rounded-full h-8 w-8' />
                        </div>
                        <div>
                            <h1 className='text-sm'>
                                {blog?.user?.name}
                            </h1>
                            <p className='text-xs'>
                                {formatDate()}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Card
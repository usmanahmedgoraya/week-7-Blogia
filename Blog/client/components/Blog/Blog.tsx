import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'
import { TERipple } from 'tw-elements-react';

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



const Blog = ({ blog, key }: BlogProps) => {

    const router = useRouter()

    function getFirst84Characters(paragraph:string) {
        // Use substring to get the first 84 characters
        var first84Characters = paragraph.substring(0, 84);        
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
    return (
        <>
            <div
                className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 cursor-pointer" onClick={() => router.push(`/blog/${blog._id}`)}>
                <TERipple>
                    <div
                        className="relative overflow-hidden bg-cover bg-no-repeat">
                        <img
                            className="rounded-t-lg"
                            src={blog.image}
                            alt={blog.title} />

                        <div
                            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                    </div>
                </TERipple>
                <div className="md:p-6 p-3">
                    <p className='text-purple-700 capitalize font-medium mb-3'>{blog?.categories?.name}</p>
                    <h5
                        className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                        {blog?.title}
                    </h5>
                    <p className="mb-4 text-base  text-neutral-600 dark:text-neutral-200">
                        {blog?.description.length > 84 ?`${getFirst84Characters(blog.description)}...`:blog?.description}
                    </p>
                    <div className='flex items-center gap-x-2 mt-4'>
                        <div>
                            <Image src={blog?.user?.profileImage || 'https://res.cloudinary.com/dyunqrxki/image/upload/v1706250956/lnha0zjnpjwctkmm1p4u.png'} alt={blog?.user?.name} width={30} height={30} className='rounded-full h-8 w-6' />
                        </div>
                        <div>
                            <h1>{blog?.user?.name}</h1>
                            <p>{formatDate()}</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Blog
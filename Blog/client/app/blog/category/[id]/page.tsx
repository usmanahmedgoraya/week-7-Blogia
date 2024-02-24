'use client'
import Card from '@/components/Card/Card';
import useCategoriesStore from '@/zustand/useCategoriesStore';
import { Empty } from 'antd';
import { useEffect } from 'react';

const Page = ({ params }: { params: { id: string } }) => { // Renamed 'page' to 'Page'
    const { getAllCategoryBlogs, categoriesBlogs } = useCategoriesStore();
    useEffect(() => {
        getAllCategoryBlogs(params.id);
    }, []);

    return (
        <>
            <div className='w-full text-center capitalize text-4xl'>
                <p className='font-bold text-5xl'>{params.id}</p>
                <div className="divider"></div>
            </div>
            {categoriesBlogs.length === 0 ? (
                <div>
                    <Empty className='text-white' />
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-12 md:gap-8 gap-3 flex-wrap md:m-8 m-2 place-items-center'>
                    {categoriesBlogs && categoriesBlogs?.map((blog: any) => {
                        return (
                            <Card key={blog._id} blog={blog} />
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default Page;

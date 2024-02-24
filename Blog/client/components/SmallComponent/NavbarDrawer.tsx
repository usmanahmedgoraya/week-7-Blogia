'use client'
import React, { useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import { MdMenu } from 'react-icons/md';
import Link from 'next/link';
import useCategoriesStore from '@/zustand/useCategoriesStore';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

// NavbarDrawer component
const NavbarDrawer: React.FC = () => {
    // State to manage drawer open/close
    const [open, setOpen] = useState<boolean>(false);

    // State to store user data
    const [user, setUser] = useState<any>();

    // Fetch categories from store
    const { categories } = useCategoriesStore();

    // Function to open drawer
    const showDrawer = () => {
        setOpen(true);
    };

    // Function to close drawer
    const onClose = () => {
        setOpen(false);
    };

    // Fetch user data from local storage on component mount
    useEffect(() => {
        const isAuthExist: any = localStorage.getItem('Auth');
        const Auth: any = JSON.parse(isAuthExist);
        const user: any = Auth?.state?.user;
        setUser(user);
    }, []);

    return (
        <>
            {/* Button to open drawer */}
            <Button type="primary" onClick={showDrawer} className='text-2xl md:hidden'>
                <MdMenu />
            </Button>

            {/* Drawer component */}
            <Drawer title="Blogia" className='bg-primary' onClose={onClose} open={open}>
                <div className="flex items-start flex-col">
                    {/* Home link */}
                    <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none" onClick={onClose}>
                        <Link href={'/'}>Home</Link>
                    </div>

                    {/* Create Blog link visible only for writers */}
                    {user?.role === 'writer' &&
                        <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none" onClick={onClose}>
                            <Link href={'/blog/create-blog'}>Create Blog</Link>
                        </div>
                    }

                    {/* Categories dropdown */}
                    <div className="dropdown dropdown-hover mt-0.5" onClick={onClose}>
                        <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none">
                            Categories
                        </div>
                        {/* Categories list */}
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            {categories &&
                                categories?.map((cat: any) => {
                                    return (
                                        <li key={cat?._id}>
                                            <Link href={`/blog/category/${cat?.name}`}>
                                                <BuildingLibraryIcon className="w-5 h-5" />
                                                {cat?.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default NavbarDrawer;

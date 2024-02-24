'use client'
import useAuthStore from '@/zustand/useAuthStore';
import useCategoriesStore from '@/zustand/useCategoriesStore';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavbarDrawer from './SmallComponent/NavbarDrawer';

const Navbar = () => {
  const router = usePathname()
  const { getAllCategories, categories } = useCategoriesStore();
  const { isLoggedin, signout } = useAuthStore()
  const [user, setUser] = useState<any>();
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    getAllCategories();
    const isAuthExist: any = localStorage.getItem('Auth');
    const Auth: any = JSON.parse(isAuthExist);
    const user: any = Auth?.state?.user;
    const logger = Auth?.state.isLoggedin
    if (logger) {
      setIsLogged(logger)
    }
    if (user) {
      setUser(user);
    }
  }, [isLoggedin]);

  const handleLogout = async () => {
    localStorage.clear();
    await Promise.all([signout()])
    setIsLogged(false)
  };

  return (
    <div>
      <div className="navbar bg-base-400">
        <div className="flex-1">
          <Link href={'/'} className="btn btn-ghost text-xl">
            Blogia
          </Link>
          <div className="ml-4 md:flex items-center space-x-2 hidden">
            <div className='btn bg-transparent border-none'>
              <Link href={'/'}>Home</Link>
            </div>
            <div className="dropdown dropdown-hover mt-0.5">
              <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none">
                Categories
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {categories &&
                  categories?.map((cat: any) => {
                    return (
                      <li key={cat?._id}>
                        <Link href={`/blog/category/${cat?.name}`} className='capitalize'>
                          <BuildingLibraryIcon className="w-5 h-5" />
                          {cat?.name}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
        {isLogged ?
          <div className="flex-none gap-2">
            {user?.role === 'writer' &&
              <div className="mx-2 hidden md:flex btn bg-transparent border-none justify-center items-center ">
                <Link href={'/blog/create-blog'}>Create Blog</Link>
              </div>}

            {router === '/auth/profile' &&
              <div className='flex items-center justify-center'>
                <div className="mx-2 hidden md:flex btn bg-transparent border-none justify-center items-center ">
                  <Link href={`/blog/user/${user?._id}`}>Blogs</Link>
                </div>
                <div className="mx-2 hidden md:flex btn bg-transparent border-none justify-center items-center ">
                  <Link href={'/auth/profile'}>Profile</Link>
                </div>
              </div>


            }
            {/* <div className="form-control hidden md:block">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div> */}

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image
                    alt="Tailwind CSS Navbar component"
                    src={user?.profileImage || 'https://res.cloudinary.com/dyunqrxki/image/upload/v1706250956/lnha0zjnpjwctkmm1p4u.png'}
                    width={80}
                    height={80}
                    className="w-auto h-auto"
                  />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <Link href={'/auth/profile'} className="justify-between">
                    Profile <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/auth/login'} onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
            <NavbarDrawer />
          </div> : <div className="mx-2 hidden md:flex btn bg-transparent border-none justify-center items-center ">
            <Link href={'/auth/login'}>Login</Link>
          </div>
        }
      </div>
    </div>
  );
};

export default Navbar;

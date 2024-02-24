'use client'
import useAuthStore from '@/zustand/useAuthStore';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { ColorRing } from 'react-loader-spinner';

const Page: FC = () => {
  const { updateUserData, getSingleUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUser] = useState<{
    profileImage: string;
  }>();

  const [profileData, setProfileData] = useState<{
    name: string;
    profileImage: string;
    email: string;
    password: string;
    confirmPass: string;
  }>({
    name: '',
    profileImage: '',
    email: '',
    password: '',
    confirmPass: '',
  });

  useEffect(() => {
    Promise.all([getSingleUser()]);
    let localAuth: any = localStorage.getItem('Auth')
    localAuth = JSON.parse(localAuth);
    const userData = localAuth.state.user

    setProfileData({
      name: userData?.name || '',
      profileImage: userData?.profileImage || '',
      email: userData?.email || '',
      password: '',
      confirmPass: '',
    });
    setUser(user);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file: any = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({ ...profileData, profileImage: file });
        setUser({ profileImage: reader.result as string })
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async () => {
    if (profileData.password !== profileData.confirmPass) {
      alert('Password and Confirm Password do not match');
      return;
    }

    // Prevent changing the email
    if (profileData.email !== user.email) {
      alert('Email cannot be changed');
      return;
    }

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);

    // Append password only if it's not empty
    if (profileData.password.trim() !== "") {
      formData.append('password', profileData.password);
    }

    // Append profile image if available
    if (profileData.profileImage) {
      formData.append('file', profileData.profileImage);
    }
    setIsLoading(true)
    await Promise.all([updateUserData(formData)]);
    setIsLoading(false)
    setProfileData((prevState) => ({ ...prevState, password: '', confirmPass: '' }));
  };

  return (
    <div>
      <div className='flex items-center justify-center flex-col text-center '>
        <div className='avatar'>
          <div className='w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
            <img src={users?.profileImage || profileData.profileImage || 'https://res.cloudinary.com/dyunqrxki/image/upload/v1706250956/lnha0zjnpjwctkmm1p4u.png'} alt='User Profile' />
          </div>
        </div>
        <div className='mt-6'>
          <h1 className='capitalize text-3xl font-bold'>{profileData?.name}</h1>
          <p>{profileData?.email}</p>
        </div>
      </div>

      <div className='flex justify-center items-center mt-16'>
        <div className='w-96 rounded-2xl bg-slate-900'>
          <div className='flex flex-col gap-2 p-8'>
            <p className='text-center text-3xl text-gray-300 mb-4'>Edit Information</p>
            <input className='bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800' placeholder='Name' name='name' value={profileData.name} onChange={handleChange} />
            <input className='bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-not-allowed' placeholder='Email' name='email' value={profileData.email} disabled onChange={handleChange} />

            <label htmlFor='password' className='p-2 rounded-md text-center mt-8 text-lg font-extrabold bg-white'>
              Password
            </label>
            <input type='password' className='bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800' value={profileData.password} name='password' placeholder='Password' onChange={handleChange} />
            <input type='password' className='bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800' placeholder='Confirm password' value={profileData.confirmPass} name='confirmPass' onChange={handleChange} />

            <label htmlFor='profileImage' className='p-2 rounded-md text-center mt-8 text-lg font-extrabold bg-white'>
              Profile Image
            </label>
            <input type='file' accept='image/*' id='profileImage' style={{ display: 'none' }} onChange={handleImageChange} />

            <button onClick={handleUpdateUser} className='inline-block cursor-pointer rounded-md bg-gray-700 px-4 py-3.5 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 active:scale-95' disabled={isLoading}>
              {
                isLoading ? <span className='text-center flex justify-center items-center'>
                  <ColorRing
                    visible={true}
                    height="30"
                    width="30"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                  />
                  <span>Saving Info...</span>
                </span> : 'Save Info'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;



'use client'
import UserTable from '@/Components/UserTable'
import useUserStore from '@/zustand/useUserStore'
import { FC, useEffect } from 'react'

const Page: FC = () => {
  const { getAllUsers } = useUserStore()

  useEffect(() => {
    getAllUsers()
  }, []) // useEffect should be called inside the component and provide dependencies if necessary

  return (
    <div className='ml-20 mr-4'>
      <h1 className='md:text-4xl my-8 text-center font-bold '>Users</h1>
      <UserTable />
    </div>
  )
}

export default Page

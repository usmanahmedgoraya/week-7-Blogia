'use client'
import useUserStore from '@/zustand/useUserStore'
import React from 'react'
import Empty from './Empty'

const UserTable = () => {
    const { users, blockUser, unblockUser } = useUserStore()

    const handleStatus = async (id: string, status: string) => {
        if (status === 'Unblock') {
            await blockUser(id)
        }
        else if (status === 'Block') {
            await unblockUser(id)
        }
    }
    return (
        <div className="overflow-x-auto">
            {users && users.length > 0 ?
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {users?.map((user: any, index) => {
                            return (
                                <tr key={user?._id}>
                                    <th className='w-6'>{index + 1}</th>
                                    <td className='w-12'>
                                        <div className="avatar">
                                            <div className="w-12 rounded-full">
                                                <img src={user?.profileImage || "https://res.cloudinary.com/dyunqrxki/image/upload/v1706809133/cenrjqfsfuo98x3c6ji1.jpg"} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className='w-52'>{user?.name}</td>
                                    <td>{user?.email}</td>
                                    <td>{user?.userStatus}</td>
                                    <td className='capitalize'>{user?.role}</td>
                                    <td>
                                        <button className="btn btn-active btn-neutral" onClick={() => handleStatus(user?._id, user?.userStatus)}>
                                            {user?.userStatus === 'Block' ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>:<Empty/>
            }
        </div>
    )
}

export default UserTable
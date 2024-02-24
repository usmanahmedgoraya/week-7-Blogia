'use client'
import { create } from 'zustand'

// const domain: string = "http://localhost:3002"
const domain: string = "https://week-7-8.vercel.app"

interface UserState {
    users: [],
    getAllUsers: () => void;
    blockUser: (id: string) => void;
    unblockUser: (id: string) => void;
}

const UserStore = (set: any): UserState => ({
    users: [],
    getAllUsers: async () => {
        let token: any = localStorage.getItem('Auth')
        token = JSON.parse(token)
        if (token && token?.state?.token) {

            try {
                const res = await fetch(`${domain}/auth/users`, {
                    method: 'GET',
                    headers: {
                        'content-type': "application/json",
                        'Authorization': `bearer ${token?.state?.token}`
                    }
                })

                const usersData = await res.json();
                console.log(usersData);
                set({
                    users: usersData
                })
                return
            } catch (error) {
                console.log(error);

            }
        }
    },
    blockUser: (id: string) => set(async (state: any) => {
        let token: any = localStorage.getItem('Auth')
        token = JSON.parse(token)
        if (token) {

            try {
                const res = await fetch(`${domain}/auth/block/${id}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': "application/json",
                        'Authorization': `bearer ${token.state.token}`
                    }
                })

                if (!res.ok) {
                    throw new Error('Api Request Failed')
                }
                const usersData = await res.json();
                console.log(usersData);
                state.getAllUsers();
            } catch (error) {
                console.log(error);

            }
        }
    }),

    unblockUser: (id: string) => set(async (state: any) => {
        let token: any = localStorage.getItem('Auth')
        token = JSON.parse(token)
        if (token) {

            try {
                const res = await fetch(`${domain}/auth/unblock/${id}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': "application/json",
                        'Authorization': `bearer ${token.state.token}`
                    }
                })

                const usersData = await res.json();
                console.log(usersData);
                state.getAllUsers()
            } catch (error) {
                console.log(error);
            }
        }

    }),

})



const useUserStore = create<UserState>(UserStore)
export default useUserStore
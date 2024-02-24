import { create } from "zustand";

// Set domain of URL to avoid from complexity
// const domain = "http://localhost:3002"
const domain = "https://week-7-blogia.vercel.app"



interface CategoriesState {
    categories: [];
    getAllCategories: () => void;
    categoriesBlogs: [];
    createCategories: (category: {
        name: string
    }) => void;
    getAllCategoryBlogs: (category: string) => void;
    updateCategories: (id: string, category: {
        name: string
    }) => void;
    deleteCategories: (id: string) => void;
}


const CategoriesStore = (set: any): CategoriesState => ({
    categories: [],
    categoriesBlogs: [],
    getAllCategories: async () => {
        try {
            const res = await fetch(`${domain}/category`, {
                method: 'GET',
                headers: {
                    "content-type": "application/json"
                }
            })
            const categoryData = await res.json();
            console.log(categoryData);

            set({
                categories: categoryData
            })
        } catch (error) {
            console.log(error);

        }
    },
    getAllCategoryBlogs: async (category: string) => {
        try {
            const res = await fetch(`${domain}/blog/category?name=${category}`, {
                method: 'GET',
                headers: {
                    "content-type": "application/json"
                }
            })
            const categoryData = await res.json();
            console.log(categoryData);

            set({
                categoriesBlogs: categoryData
            })
        } catch (error) {
            console.log(error);

        }
    },
    createCategories: async (category) => set(async (state: any) => {
        try {
            let token: any = localStorage.getItem('Auth')
            token = JSON.parse(token)
            const res = await fetch(`${domain}/category`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `bearer ${token.state.token}`
                },
                body: JSON.stringify(category)
            })

            const data = await res.json()
            console.log(data);

            state.getAllCategories()
        } catch (error) {
            console.log(error);
        }
    }),
    updateCategories: async (id, category) => set(async (state: any) => {
        try {
            let token: any = localStorage.getItem('Auth')
            token = JSON.parse(token)
            const res = await fetch(`${domain}/category/${id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `bearer ${token.state.token}`
                },
                body: JSON.stringify(category)
            })
            const data = await res.json()
            console.log(data);

            state.getAllCategories()
        } catch (error) {
            console.log(error);
        }
    }),
    deleteCategories: async (id) => set(async (state: any) => {
        try {
            let token: any = localStorage.getItem('Auth')
            token = JSON.parse(token)
            const res = await fetch(`${domain}/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `bearer ${token.state.token}`
                },
            })
            const data = await res.json()
            console.log(data);

            state.getAllCategories()
        } catch (error) {
            console.log(error);
        }
    }),

})

const useCategoriesStore = create<CategoriesState>(CategoriesStore)
export default useCategoriesStore;
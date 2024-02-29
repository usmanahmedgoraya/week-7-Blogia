// Import necessary dependencies from zustand
import { create } from 'zustand';

// Set domain of URL to avoid from complexity
const domain = "http://localhost:3002"
// const domain = "https://week-7-blogia.vercel.app"

interface BlogState {
    blogs: [];
    userBlog: [];
    singleBlog: {
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
    getAllBlog: () => void;
    getSingleBlog: (id: string) => void;
    createBlog: (blogData: {
        title: string,
        description: string,
        categories: string
    }, imageData: any) => void;
    deleteBlog: (id: string) => void;
    updateBlog: (id: string, updateBlogData: {
        title?: string,
        description?: string,
        categories?: string
    }, imageData?: any) => void
    createComment: (id: string, commentData: { content: string }) => void;
    updateComment: (id: string, blogId: string, commentData: { content: string }) => void;
    deleteComment: (id: string, blogId: string) => void;
    userBlogs: () => void;
    giveReaction: (key: string, blogId: string) => void;
    comments: [];
    reactions: {
        happy: number,
        satisfaction: number,
        sad: number,
        love: number,
        surprise: number,
        angry: number,
    }

}
const BlogStore = (set: any): BlogState => ({
    blogs: [],
    userBlog: [],
    singleBlog: {
        _id: '',
        user: {
            _id: '',
            profileImage: '',
            name: ''
        },
        reaction: [],
        comments: [],
        categories: {
            name: ''
        },
        title: '',
        description: '',
        image: '',
        tags: [],
        status: '',
        createdAt: '',
        updatedAt: ''
    },
    comments: [],
    reactions: {
        happy: 0,
        satisfaction: 0,
        sad: 0,
        love: 0,
        surprise: 0,
        angry: 0,
    },
    getAllBlog: async () => {
        try {
            // Make a POST request to the login endpoint
            const res = await fetch(`${domain}/blog`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });
            // Parse the response as JSON
            const blogsData = await res.json();
            console.log(blogsData);

            // Update the state with the received token
            set({
                blogs: blogsData,
            });
        } catch (error) {
            console.log(error)
        }
    },

    getSingleBlog: async (id: string) => {
        let localAuth: any = localStorage.getItem('Auth')
        localAuth = JSON.parse(localAuth)
        try {
            // Make a POST request to the login endpoint
            const res = await fetch(`${domain}/blog/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });
            // Parse the response as JSON
            const blogsData: any = await res.json();
            console.log(blogsData);
            const reactionCounts = blogsData?.reaction?.reduce((counts: any, reaction: any) => {
                counts[reaction?.reactionType] = (counts[reaction?.reactionType] || 0) + 1;
                return counts;
            }, {});
            console.log(reactionCounts);
            if (localAuth) {
                const Reactions: [{}] = blogsData?.reaction
                const userReaction = Reactions?.find((reaction: any) => reaction?.user == localAuth?.state?.user?._id)
                set({
                    singleBlog: blogsData,
                });
                return { reactionCounts, userReaction }
            }
            set({
                singleBlog: blogsData,
            });
            // Update the state with the received token

            return { reactionCounts }
            // return blogsData
        } catch (error) {
            console.log(error)
        }
    },

    // Create Blog
    createBlog: async (blogData, imageData) => {
        console.log(blogData, imageData);
        let localAuth: any = localStorage.getItem('Auth');

        try {
            // Parse the JSON stored in localStorage
            localAuth = JSON.parse(localAuth);
        } catch (error) {
            console.error('Error parsing JSON from localStorage:', error);
            // Handle the error gracefully, for example by setting localAuth to null
            localAuth = null;
        }

        try {
            const formData = new FormData();
            formData.append('title', blogData.title);
            formData.append('description', blogData.description);
            formData.append('categories', blogData.categories);
            formData.append('file', imageData);
            // Assume you have an API endpoint to handle blog creation
            const response = await fetch(`${domain}/blog`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localAuth?.state?.token}`, // Adjust according to your backend requirements
                },
                body: formData,
            });

            if (response.ok) {
                // Handle successful blog creation, e.g., redirect to a success page
                console.log('Blog created successfully');
            } else {
                // Handle error cases
                console.error('Failed to create blog');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    },

    // Delete Blog
    deleteBlog: async (id) => {
        try {
            let localAuth: any = localStorage.getItem('Auth');
            localAuth = JSON.parse(localAuth);

            // Make a POST request to the comment endpoint
            const res = await fetch(`${domain}/blog/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${localAuth?.state?.token}`
                },
            });

            // Parse the response as JSON
            const deletedBlog = await res.json();
            console.log(deletedBlog);

        } catch (error) {
            console.log(error);
        }
    },
    // Update Blog
    updateBlog: async (id, updateBlogData) => {
        try {
            let localAuth: any = localStorage.getItem('Auth');
            localAuth = JSON.parse(localAuth);

            // Make a POST request to the comment endpoint
            const res = await fetch(`${domain}/blog/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${localAuth?.state?.token}`
                },
                body: JSON.stringify(updateBlogData)
            });

            // Parse the response as JSON
            const deletedBlog = await res.json();
            console.log(deletedBlog);

        } catch (error) {
            console.log(error);
        }
    },
    // Crate Comment
    createComment: async (id, commentData) => set(async (state: BlogState) => {
        try {
            let localAuth: any = localStorage.getItem('Auth');
            localAuth = JSON.parse(localAuth);

            // Make a POST request to the comment endpoint
            const res = await fetch(`${domain}/comment/blog/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${localAuth?.state?.token}`
                },
                body: JSON.stringify(commentData)
            });

            // Parse the response as JSON
            const commentsData = await res.json();
            console.log(commentData);

            await state.getSingleBlog(id)

        } catch (error) {
            console.log(error);
        }
    }),
    // Update Comment
    updateComment: async (id, blogId, commentData) => set(async (state: BlogState) => {
        try {
            let localAuth: any = localStorage.getItem('Auth');
            localAuth = JSON.parse(localAuth);


            // Make a POST request to the comment endpoint
            const res = await fetch(`${domain}/comment/${id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${localAuth.state.token}`
                },
                body: JSON.stringify({
                    content: commentData
                })
            });

            // Parse the response as JSON
            const commentsData = await res.json();

            await state.getSingleBlog(blogId)

        } catch (error) {
            console.log(error);
        }
    }),
    // Update Comment
    deleteComment: async (id: string, blogId: string) => set(async (state: BlogState) => {
        try {
            let localAuth: any = localStorage.getItem('Auth');
            localAuth = JSON.parse(localAuth);

            // Make a POST request to the comment endpoint
            const res = await fetch(`${domain}/comment/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${localAuth.state.token}`
                },
            });

            // Parse the response as JSON
            const commentsData = await res.json();
            console.log(blogId, 'Deleted blog Id');

            await state.getSingleBlog(blogId)

        } catch (error) {
            console.log(error);
        }
    }),
    // Update Comment
    userBlogs: async () => {
        try {
            let localAuth: any = localStorage.getItem('Auth');
            localAuth = JSON.parse(localAuth);

            // Make a POST request to the comment endpoint
            const res = await fetch(`${domain}/blog/user-blogs`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${localAuth.state.token}`
                },
            });
            const blogs = await res.json()
            console.log(blogs);
            set({
                userBlog: blogs
            })
        } catch (error) {
            console.log(error);
        }
    },

    // Update Comment
    giveReaction: async (key: string, blogId: string) => set(async (state: BlogState) => {
        try {
            let localAuth: any = localStorage.getItem('Auth');
            localAuth = JSON.parse(localAuth);
            // Make a POST request to the comment endpoint
            if (localAuth?.state?.user?.role === 'user') {
                const res = await fetch(`${domain}/blog/reaction/${blogId}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${localAuth.state.token}`
                    },
                    body: JSON.stringify({
                        type: key
                    })
                });
                const reactions = await res.json();
            } else {
                throw new Error('Only user is Allowed')
            }
            await state.getSingleBlog(blogId)
        } catch (error) {
            console.log(error);
        }
    }),


})


// Create the store named 'useAuthStore' with middleware for devtools and localStorage persistence
const useBlogStore = create<BlogState>(BlogStore);

// Export the useAuthStore for use in other parts of your application
export default useBlogStore;


// Import necessary dependencies from zustand
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Set domain of URL to avoid from complexity
// const domain = "http://localhost:3002"
// const domain = "https://week-7-8.vercel.app"
const domain = "https://localhost:3002"

// Define the AuthState interface to represent the shape of your store's state
interface AuthState {
    isLoggedin: boolean;
    token: string;
    user: {};
    login: (
        loginData: {
            email: string;
            password: string;
        }
    ) => void;
    signUp: (
        signupData: {
            name: string;
            email: string;
            password: string;
            role: string;
            file?: File | null;
        }
    ) => void;
    forgetPassword: (
        forgetPasswordData: {
            email: string;
        }
    ) => void;
    resetPassword: (
        resetPasswordData: {
            password: string,
            otp: string
        }
    ) => void;

    signout: () => void;
    setTokenOnMount: () => void;
}

// Define the AuthStore function to create and manage the state of your store
const AuthStore = (set: any): AuthState => ({
    isLoggedin: false,
    token: '',
    user: {},
    // Async function to handle user login
    login: async (loginData) => {
        try {
            console.log(loginData);

            // Make a POST request to the login endpoint
            const res = await fetch(`${domain}/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":'*'
                },
                body: JSON.stringify(loginData),
            });

            // Check if the response status is not 200 OK
            if (!res.ok) {
                // You can handle the error here, throw an error, or return a specific value
                const errorMessage = await res.text();
                throw new Error(`Login failed: ${errorMessage}`);
            }
            // Parse the response as JSON
            const loginToken = await res.json();
            console.log(loginToken.user.role);

            if (loginToken?.user?.role !== 'admin') {
                throw new Error('Unauthorized')
            }
            console.log(loginToken);

            // Update the state with the received token
            set({
                isLoggedin:true,
                token: loginToken.token,
                user: loginToken.user
            });
        } catch (error) {
            // Log any errors that occur during the login process
            console.error(error);
        }
    },

    // Function to handle user signup
    signUp: (signupData) => set(async (state: string) => {
        try {
            const formData = new FormData();
            formData.append('name', signupData.name);
            formData.append('email', signupData.email);
            formData.append('password', signupData.password);
            formData.append('role', signupData.role);

            if (signupData.file) {
                console.log(signupData.file)
                formData.append('profileImage', signupData.file);
            }
            // Make a POST request to the signup endpoint
            const res = await fetch(`${domain}/auth/signup`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
            });

            // Parse the response as JSON
            const signupToken = await res.json();
            console.log(signupToken)

            // Update the state with the received token
            set({
                isLoggedin:true,
                token: signupToken.token,
                user: signupToken.user
            });
        } catch (error) {
            console.log(error);
        }
    }),

    // Function to handle user Forget Password and send Email
    forgetPassword: (forgetPasswordData) => set(async (state: string) => {
        try {
            console.log(forgetPasswordData);
            // Make a POST request to the forgetPassword endpoint
            const res = await fetch(`${domain}/auth/password`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(forgetPasswordData),
            });

            // Parse the response as JSON
            const forgetPasswordToken = await res.json();
            console.log(forgetPasswordToken);
            await localStorage.setItem("forgetPassword", forgetPasswordToken.token)
        } catch (error) {
            console.log(error);
        }
    }),
    // Function to handle user Reset Password
    resetPassword: (resetPasswordData) => set(async (state: string) => {
        try {
            console.log(resetPasswordData);
            const data = localStorage.getItem('forgetPassword')
            console.log(data);
            // Make a POST request to the forgetPassword endpoint
            const res = await fetch(`${domain}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${data}`
                },
                body: JSON.stringify(resetPasswordData),
            });

            // Parse the response as JSON
            const resetPasswordToken = await res.json();
            console.log(resetPasswordToken);
        } catch (error) {
            console.log(error);
        }
    }),

    setTokenOnMount: () => set(async (state: string) => {
        let token = localStorage.getItem('Auth')
    }),

    // Get User Profile data
    signout: () => {
        set((state:any) => ({
            ...state,
            isLoggedin: false,
        }));
    }
});

// Create the store named 'useAuthStore' with middleware for devtools and localStorage persistence
const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            AuthStore,
            {
                name: "Auth", // Name for localStorage persistence
            }
        ),
    ),
);

// Export the useAuthStore for use in other parts of your application
export default useAuthStore;

'use client'
// Import necessary dependencies and components
import useAuthStore from '@/zustand/useAuthStore';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useState } from 'react';
// Define the functional component 'Page'
const Page: FC = () => {
  const router = useRouter()
  // State to hold signup form data
  const [forgetPasswordData, setForgetPasswordData] = useState({
    email: "",
  });

  // Use the useAuthStore hook to get the state and actions
  const { forgetPassword } = useAuthStore();

  // Handler for input change in the signup form
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    setForgetPasswordData({ ...forgetPasswordData, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = async () => {
    // Wait for the signup function to complete
    await forgetPassword(forgetPasswordData);
    router.push("/auth/reset-password")
  };

  // JSX for the signup page
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Reset Password
        </h1>
        <div className="mt-6">
          
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id='email' name='email'
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-6" onClick={handleSubmit}>
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the 'Page' component as the default export
export default Page;

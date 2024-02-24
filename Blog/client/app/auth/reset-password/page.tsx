import useAuthStore from '@/zustand/useAuthStore';
import { useRouter } from 'next/navigation'; // Changed import statement
import React, { ChangeEvent, FC, useState } from 'react'; // Added missing semicolon
import OTPInput from 'react-otp-input';

const Page: FC = () => { // Changed component name to start with uppercase letter
    const router = useRouter();

    const [otp, setOtp] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const { resetPassword } = useAuthStore();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        if (e.target.name === "password") {
            setPassword(e.target.value);
        } else if (e.target.name === "confirm-password") {
            setConfirmPassword(e.target.value);
        }
    };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            alert('password and confirm password is not same ');
        }
        const resetPasswordData = {
            password: password,
            otp: otp,
        };
        await resetPassword(resetPasswordData);
        router.push('/auth/login');
    };

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='w-full flex items-center flex-col'>
                <label htmlFor="otp">OTP Code</label>
                <div className='my-2'>
                    <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                            border: "2px solid gray",
                            borderRadius: "4px",
                            outlineColor: "#7e22ce",
                            width: '2rem',
                        }}
                    />
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label htmlFor="password">
                    New Password
                </label>
                <input className='border mt-2 border-purple-700 outline-purple-700 rounded-md p-1.5' type="password" name="password" id="password" onChange={handleChange} />
            </div>
            <div className='flex flex-col mb-3'>
                <label htmlFor="confirm-password">
                    Confirm Password
                </label>
                <input className='border mt-2 border-purple-700 outline-purple-700 rounded-md p-1.5' type="password" name="confirm-password" id="confirm-password" onChange={handleChange} />
            </div>
            <button onClick={handleSubmit} className='py-2 px-2 bg-purple-700 text-white rounded-md'>Reset Password</button>
        </div>
    );
}

export default Page;

'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react';
import './Login.css';
import useAuthStore from '@/zustand/useAuthStore';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();

  const { login, isLoggedin } = useAuthStore();
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validate email and password
      if (!loginData.email || !loginData.password) {
        setErrors({
          email: !loginData.email ? 'Email is required' : '',
          password: !loginData.password ? 'Password is required' : ''
        });
        return;
      }

      // Regex for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginData.email)) {
        setErrors({
          ...errors,
          email: 'Invalid email address'
        });
        return;
      }

      // Regex for strong password (minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
      if (!passwordRegex.test(loginData.password)) {
        setErrors({
          ...errors,
          password: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        });
        return;
      }

      await Promise.all([login(loginData)]);

      // Redirect to homepage upon successful login
      if (isLoggedin) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    } catch (error: any) {
      // Handle error here if needed
      console.error(error.message);
      // You can show an error message to the user or handle the error in other ways
    }
  };

  return (
    <div>
      <form className="login wrap" onSubmit={handleSubmit}>
        <div className="h1">Login</div>
        <input
          placeholder="Email"
          id="email"
          name="email"
          type="text"
          onChange={handleChange}
          value={loginData.email}
          className="w-full px-4 py-2 rounded-md mb-3"
        />
        {errors.email && <span className="error text-sm text-red-500 ml-5">{errors.email}</span>}
        <div className='relative'>
          <input
            placeholder="Password"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            onChange={handleChange}
            value={loginData.password}
            className="w-full px-4 py-2 rounded-md mb-3"
          />
          {errors.password && <span className="error text-sm text-red-500 ml-5">{errors.password}</span>}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="btn-toggle-password absolute top-4 right-4 text-sm"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <input value="Login" className="btn w-full" type="submit" />
      </form>
    </div>
  );
};

export default Login;


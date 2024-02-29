'use client'
import React, { ChangeEvent, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// Import JoditEditor dynamically
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
import { FallingLines } from 'react-loader-spinner';
import { RxCrossCircled } from 'react-icons/rx';
import useCategoriesStore from '@/zustand/useCategoriesStore';
import useBlogStore from '@/zustand/useBlogStore';
import './CreateBlog.css';
import UploadImage from '../SmallComponent/UploadImage';
import dynamic from 'next/dynamic';

interface BlogData {
  title: string;
  description: string;
  categories: string;
}

const CreateBlog = () => {
  const router = useRouter();
  const { categories } = useCategoriesStore();
  const { createBlog } = useBlogStore();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [blogData, setBlogData] = useState<BlogData>({
    title: '',
    description: '',
    categories: '',
  });

  useEffect(() => {
    const isAuthExist: any = localStorage.getItem('Auth');
    const Auth: any = JSON.parse(isAuthExist);
    const user: any = Auth?.state?.user;

    if (user?.role !== 'writer') {
      router.push('/');
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setBlogData((prevData) => ({
      ...prevData,
      categories: e.target.value,
    }));
  };

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
  };

  const handleImageDeselect = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const config: any = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing...',
    theme: 'dark'
    // Add other configuration options as needed
  }), []);

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createBlog(blogData, selectedImage);
      setIsLoading(false);
      setBlogData({
        title: '',
        description: '',
        categories: ''
      });
      setSelectedImage(null);
      router.push('/');
    } catch (error) {
      console.error('Error while creating blog:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleFormSubmit}>
        <div className='text-center text-4xl font-bold p-2 mb-3'>Create Blog</div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input required name="title" id="title" type="text" value={blogData.title} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <JoditEditor
            value={blogData.description}
            onChange={(value) => setBlogData((prevData) => ({ ...prevData, description: value }))}
            config={config}
            // @ts-ignore
            name="description"
            id="description"
          />
        </div>
        <select className="select select-bordered w-full max-w-xs bg-[##1D232A] focus:outline focus:outline-[#e81cff] focus:border-[#e81cff] focus:border" name='categories' value={blogData.categories} onChange={handleCategoryChange}>
          <option disabled value="" className='capitalize'>Select Category</option>
          {categories.map((category: any) => (
            <option key={category._id} value={category._id} className='capitalize'>{category.name}</option>
          ))}
        </select>
        <UploadImage fileInputRef={fileInputRef} onImageChange={handleImageChange} />
        {selectedImage && (
          <div className="image-preview relative">
            <img src={URL.createObjectURL(selectedImage)} alt="Selected Image" />
            <button onClick={handleImageDeselect} className="deselect-button absolute top-0 text-xl m-3 hover:scale-125 "><RxCrossCircled /></button>
          </div>
        )}
        <div className='flex justify-center items-center'>
          <button type="submit" className="form-submit-btn">
            {isLoading ? (
              <span className='flex items-center justify-center'>
                <FallingLines color="#4fa94d" width="30" />
                <span>Submitting</span>
              </span>
            ) : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;


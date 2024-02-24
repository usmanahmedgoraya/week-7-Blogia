'use client'
import useCategoriesStore from '@/zustand/useCategoriesStore';
import './CreateBlog.css';
import UploadImage from '../SmallComponent/UploadImage';
import useBlogStore from '@/zustand/useBlogStore';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FallingLines } from 'react-loader-spinner';
import { RxCrossCircled } from 'react-icons/rx';

const CreateBlog = () => {
  const router = useRouter();
  const { categories } = useCategoriesStore();
  const { createBlog } = useBlogStore();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element
  const [selectedImage, setSelectedImage] = useState(null);
  const [blogData, setBlogData] = useState({
    title: '',
    description: '',
    categories: '',
    // Add other fields as needed
  });

  // Check if the user is authorized to create a blog
  useEffect(() => {
    const isAuthExist: any = localStorage.getItem('Auth');
    const Auth: any = JSON.parse(isAuthExist);
    const user: any = Auth?.state?.user;

    if (user?.role !== 'writer') {
      router.push('/');
    }
  }, []);

  // Handle input change for title and description
  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle category selection change
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setBlogData((prevData) => ({
      ...prevData,
      categories: e.target.value,
    }));
  };

  // Handle image selection
  const handleImageChange = (file: any) => {
    setSelectedImage(file);
  };

  // Handle image deselection
  const handleImageDeselect = () => {
    setSelectedImage(null);
    // Reset the file input value to clear the selected file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await Promise.all([createBlog(blogData, selectedImage)]);
      setIsLoading(false);
      // Clear the input fields after successful submission
      setBlogData({
        title: '',
        description: '',
        categories: ''
      });
      setSelectedImage(null);
      router.push('/');
    } catch (error) {
      console.log(error, 'Error while Create Blog');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleFormSubmit}>
        {/* Title */}
        <div className='text-center text-4xl font-bold  p-2 mb-3'>Create Blog</div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input required name="title" id="title" type="text" value={blogData?.title} onChange={handleInputChange} />
        </div>
        {/* Description */}
        <div className="form-group">
          <label htmlFor="textarea">Description</label>
          <textarea required cols={50} rows={10} id="description" name="description" value={blogData?.description} defaultValue="" onChange={handleInputChange}></textarea>
        </div>
        {/* Category selection */}
        <select className="select select-bordered w-full max-w-xs bg-[##1D232A] focus:outline focus:outline-[#e81cff] focus:border-[#e81cff] focus:border" name='categories' value={blogData.categories} onChange={handleCategoryChange}>
          <option disabled value="" className='capitalize'>Select Category</option>
          {categories.map((category: any) => {
            return (
              <option key={category._id} value={category._id} className='capitalize'>{category.name}</option>
            )
          })}
        </select>
        {/* Upload Image */}
        <UploadImage fileInputRef={fileInputRef} onImageChange={handleImageChange} />
        {/* Image Preview */}
        {selectedImage && (
          <div className="image-preview relative">
            <img src={URL.createObjectURL(selectedImage)} alt="Selected Image" />
            {/* Button to deselect image */}
            <button onClick={handleImageDeselect} className="deselect-button absolute top-0 text-xl m-3 hover:scale-125 "><RxCrossCircled /></button>
          </div>
        )}

        {/* Form Submit Button */}
        <div className='flex justify-center items-center'>
          <button type="submit" className="form-submit-btn">
            {isLoading ? <span className='flex items-center justify-center'>
              <FallingLines
                color="#4fa94d"
                width="30"
                visible={true}
              // ariaLabel={"falling-circles-loading"}
              />
              <span>
                Submitting
              </span>
            </span> : 'Submit'
            }
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBlog;

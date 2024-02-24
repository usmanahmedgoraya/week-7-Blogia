'use client'
import React, { ChangeEvent, useState } from 'react'
import './Category.css'
import useCategoriesStore from '@/zustand/useCategoryStore'
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';

const Category = () => {
    const [categoryData, setCategoryData] = useState<any>({
        name: ''
    })
    const { createCategories } = useCategoriesStore()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCategoryData({ ...categoryData, [e.target.name]: e.target.value })
    }

    const handleCreateCategory = () => {
        createCategories(categoryData)
        setCategoryData({
            name:''
        })
    }
    return (
        <div>
            <div className="input-container">
                <input value={categoryData?.name} type="text" placeholder="Add Category" name='name' onChange={handleChange} />
                <button className="button flex items-center justify-center space-x-2" onClick={handleCreateCategory}><ControlPointDuplicateIcon/>
                <span>Add</span></button>
            </div>
        </div>
    )
}

export default Category
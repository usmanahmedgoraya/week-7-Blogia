'use client'
import Category from '@/Components/Category/Category'
import useCategoriesStore from '@/zustand/useCategoryStore'
import React, { useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Empty from '@/Components/Empty';

const Page = () => {
  const { categories, getAllCategories, deleteCategories, updateCategories } = useCategoriesStore()
  const [editingCategory, setEditingCategory] = React.useState<any>(null)
  const [editedName, setEditedName] = React.useState("") // State to track changes in the input field

  useEffect(() => {
    getAllCategories()
  }, [])

  const handleEditClick = (category: any) => {
    setEditingCategory(category)
    setEditedName(category.name) // Initialize the input field with the current category name
  }

  const handleUpdateCategory = (categoryId: string, newName: string) => {
    updateCategories(categoryId, { name: newName })
    setEditingCategory(null)
  }

  const handleSaveClick = () => {
    if (editingCategory) {
      handleUpdateCategory(editingCategory._id, editedName)
    }
  }

  return (
    <div className='sm:ml-20 ml-14'>
      <h1 className='md:text-4xl my-8 text-center '>Categories</h1>
      <Category />
      {categories.length === 0 ? <Empty /> : <div className='grid grid-cols-3 md:grid-cols-4 my-4 gap-2'>
        {categories?.map((category: any) => {
          return (
            <div key={category?._id} className="col-span-3 flex justify-between items-center h-16 px-4 bg-slate-700 rounded-box place-items-center  ">
              {editingCategory === category ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-slate-700 text-white rounded-md p-1"
                  />
                  <button className='rounded-md p-2 hover:text-white transition-colors duration-500 hover:bg-green-700 text-green-700 bg-white' onClick={handleSaveClick}>
                    Save
                  </button>
                </>
              ) : (
                <h1 className='capitalize'>{category.name}</h1>
              )}
              <div className='space-x-2'>
                <button className='text-white rounded-md hover:text-green-700 ' onClick={() => handleEditClick(category)}>
                  <DriveFileRenameOutlineIcon />
                </button>
                <button className=' text-white rounded-md hover:text-red-700' onClick={() => deleteCategories(category._id)}>
                  <DeleteIcon />
                </button>
              </div>
            </div>
          )
        })}
      </div>
      }
    </div>
  )
}

export default Page

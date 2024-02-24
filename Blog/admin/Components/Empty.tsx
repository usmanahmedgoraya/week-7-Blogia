import React from 'react'
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey';

const Empty = () => {
  return (
    <div className='flex justify-center items-center h-screen flex-col ml-16 md:ml-28'>
        <KeyboardCommandKeyIcon className='text-8xl'/>
        <p>No Data Found</p>
    </div>
  )
}

export default Empty
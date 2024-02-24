'use client'
import React from 'react'
import { Vortex } from 'react-loader-spinner'

const loading = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center ml-16'>
      <Vortex
        visible={true}
        height="80"
        width="80"
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
      />
    </div>
  )
}

export default loading
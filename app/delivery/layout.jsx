'use client'
import Navbar from '@/components/delivery/Navbar'
import Sidebar from '@/components/delivery/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default Layout
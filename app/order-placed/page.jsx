'use client'
import { assets } from '@/assets/assets'
 
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const OrderPlaced = () => {

  const  router  =  useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/customer/my-orders')
    }, 5000)
  }, [])

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
    </div>
  )
}

export default OrderPlaced
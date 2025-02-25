import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppStore } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/Zustand/store';
 

const ProductCard = ({ product }) => {
    const router=useRouter()
    const { currency } =  useAppStore()
      const { isAuthenticated } = useUserStore();
    


    return (
        <div
        onClick={() => {
            router.push(isAuthenticated ? `/product/${product._id}` : "/sign-In");
            scrollTo(0, 0);
          }}            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                />
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>
            <div className="flex items-center gap-2">
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <p className="text-base font-medium">{currency}{product.offerPrice}</p>
                <button className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
                    Buy now
                </button>
            </div>
        </div>
    )
}

export default ProductCard
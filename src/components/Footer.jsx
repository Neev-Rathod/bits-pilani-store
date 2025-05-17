import React from 'react'
import { IoAdd } from 'react-icons/io5'
import { BiHome, BiSolidCategory } from 'react-icons/bi'
import { useNavigate } from "react-router-dom"


const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className='flex w-full justify-around h-16 shadow-[2px_2px_30px_2px_#878787] dark:shadow-[2px_2px_30px_2px_#000000] dark:bg-gray-900  items-center z-10'>
            <div className='flex flex-col items-center hover:scale-[1.2] duration-200 ease-in dark:text-white w-12' onClick={() => navigate("/ ")}>
                <BiHome className='h-6! w-6! '></BiHome>
                <p>Home</p>
            </div>
            <IoAdd className='h-12!  w-12! relative top-[-8px] rounded-full shadow-lg bg-gray-100 hover:scale-[1.2] duration-200 ease-in' onClick={() => navigate("/add")}></IoAdd>
            <div className='flex flex-col w-12 items-center hover:scale-[1.2] duration-200 ease-in dark:text-white' onClick={() => navigate("/categories")}>
                <BiSolidCategory className='h-6! w-6! ' />
                <p>Categories</p>
            </div>


        </div>

    )
}

export default Footer
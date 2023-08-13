import React from "react";
import {RxAvatar} from "react-icons/rx"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {

  const handleAvatar = () =>{
    toast("No User Functionality right now!")
  }


  return (
    <div className="w-full py-6 px-4 border-b  shadow-2xl">
      <ToastContainer/>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold">
          Notes<span className="text-yellow-500">Keeper</span>
        </p>
        <div className="mx-4 cursor-pointer hover:scale-110 duration-300">
        <RxAvatar onClick={handleAvatar} size={40} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import React from 'react';
import log from '/src/assets/log.jpg';
import { FaUserCircle, FaSearch,FaApple  } from 'react-icons/fa'; // Using react-icons

const Header = () => {
  return (
    <header className="bg-black text-white shadow-md relative">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 ml-[-70px]">
          <img src={log} alt="SLT Logo" className="h-16 w-75" />
        </div>
        <h1 className="text-3xl font-bold text-center flex-grow">
          Department Head
        </h1>
        {/* Profile and Search icons container */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-6">
          <FaSearch className="text-white-400 text-2xl cursor-pointer" /> {/* Search icon */}
          <FaUserCircle className="text-white text-2xl cursor-pointer" /> {/* Profile icon */}
          <FaApple className="text-white text-2xl cursor-pointer" /> 
        </div>
      </div>
    </header>
  );
};

export default Header;

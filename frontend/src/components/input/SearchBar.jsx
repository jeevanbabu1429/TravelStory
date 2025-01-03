import React from 'react'
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className='flex items-center w-full max-w-md px-4 py-2 bg-slate-100 rounded-md'>
      <input
        type='text'
        placeholder='Search Notes'
        className='flex-grow text-sm bg-transparent outline-none placeholder-slate-500'
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose
          className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3'
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className='text-lg text-slate-400 cursor-pointer hover:text-black'
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar

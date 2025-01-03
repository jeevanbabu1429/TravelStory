import React from 'react'

const EmptyCards = ({ imgSrc, message }) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      <img src={imgSrc} alt="No notes" className='w-36' /> {/* Increased the width */}
      <p className='w-3/4 text-lg font-semibold text-slate-700 text-center leading-8 mt-6'>
        {message}
      </p> {/* Increased text size, width, and leading */}
    </div>
  )
}

export default EmptyCards

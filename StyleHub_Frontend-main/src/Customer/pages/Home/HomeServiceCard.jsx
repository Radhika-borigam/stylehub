import React from 'react'

const HomeServiceCard = ({item}) => {
  return (
    <div className='flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 w-28 md:w-32 h-44 cursor-pointer border border-violet-100/50 group'>
        <div className='relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-violet-100 group-hover:border-primary-color transition-colors duration-300'>
            <img className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' src={item.image} alt={item.name} />
        </div>
        <h1 className='text-center text-sm font-semibold text-slate-800 group-hover:text-primary-color transition-colors duration-200'>{item.name}</h1>
    </div>
  )
}

export default HomeServiceCard
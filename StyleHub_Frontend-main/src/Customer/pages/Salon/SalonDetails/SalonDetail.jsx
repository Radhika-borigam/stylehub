import React from 'react'
import { useSelector } from 'react-redux'

const SalonDetail = () => {
    const {salon}=useSelector(store=>store)
  return (
    <div className="space-y-5 mb-20">
    <section className="grid grid-cols-2  gap-3">
      <div className="col-span-2">
        <img
          className="w-full rounded-md h-[15rem] object-cover"
          src={salon.salon?.images[0]}
          alt=""
        />
      </div>
      <div className="col-span-1">
        <img
          className="w-full  rounded-md h-[15rem] object-cover"
          src={salon.salon?.images[1]}
          alt=""
        />
      </div>
      <div className="col-span-1">
        <img
          className="w-full  rounded-md h-[15rem] object-cover"
          src={salon.salon?.images[2]}
          alt=""
        />
      </div>
    </section>


      <div className="space-y-3">
        <h1 className="font-bold text-3xl">{salon.salon?.name} </h1>
        <p className="text-slate-500">
          {salon.salon?.address}, {salon.salon?.city}
        </p>
        <p className="text-sm">
          <strong>Timing :</strong> {salon.salon?.openTime} To{" "}
          {salon.salon?.closeTime}
        </p>
      </div>

      {/* Premium Benefits & Amenities Section */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          Benefits & Amenities 🌟
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <span className="text-xl">🏆</span>
            <span className="text-xs font-bold text-slate-800">Certified Stylists</span>
          </div>
          <div className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <span className="text-xl">✨</span>
            <span className="text-xs font-bold text-slate-800">Premium Products</span>
          </div>
          <div className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <span className="text-xl">☕</span>
            <span className="text-xs font-bold text-slate-800">Free Drinks</span>
          </div>
          <div className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <span className="text-xl">📶</span>
            <span className="text-xs font-bold text-slate-800">Ultra WiFi</span>
          </div>
          <div className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <span className="text-xl">❄️</span>
            <span className="text-xs font-bold text-slate-800">Air Conditioned</span>
          </div>
          <div className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <span className="text-xl">🧼</span>
            <span className="text-xs font-bold text-slate-800">Fully Sanitized</span>
          </div>
        </div>
      </div>
  
  </div>
  )
}

export default SalonDetail
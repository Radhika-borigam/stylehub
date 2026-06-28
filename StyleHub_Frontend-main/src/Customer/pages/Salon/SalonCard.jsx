import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const SalonCard = ({salon}) => {
    const navigate=useNavigate();
  return (
    <div onClick={()=>navigate(`/salon/${salon.id}`)} className="cursor-pointer group">
      <div className="w-64 md:w-80 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative overflow-hidden h-[13rem] md:h-[15rem]">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={salon.images?.[0] || "https://images.pexels.com/photos/4625615/pexels-photo-4625615.jpeg?auto=compress&cs=tinysrgb&w=600"}
            alt={salon.name}
          />
          <div className="absolute top-3 right-3 text-white text-xs font-semibold px-2.5 py-1 bg-violet-600/90 backdrop-blur-md rounded-full flex items-center justify-center gap-1 shadow">
            {["4.8", "4.7", "4.9", "4.6"][(salon.id || 0) % 4]}
            <StarIcon sx={{ fontSize: "14px" }} />
          </div>
        </div>
        <div className="p-5 space-y-2">
          <h1 className="font-bold text-lg md:text-xl text-slate-800 group-hover:text-primary-color transition-colors duration-200">{salon.name}</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{salon.city}</p>
          <p className="text-sm text-slate-500 line-clamp-2">
            {salon.description || "Professional hair, skin, and beauty services tailored to your personal preferences."}
          </p>
          <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
            <span className="truncate max-w-[150px]">{salon.address}</span>
            <span className="font-semibold text-primary-color group-hover:underline">Book Now &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;

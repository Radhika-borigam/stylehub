import { TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full relative h-[80vh]">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://booksy-public.s3.amazonaws.com/horizontal_.webm"
      ></video>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 space-y-6 px-5 bg-gradient-to-t from-black/60 via-black/40 to-transparent">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
          Be Your Bold Self
        </h1>
        <p className="text-slate-200 text-lg md:text-2xl text-center max-w-2xl font-light">
          Discover and book beauty & wellness salons near you in seconds
        </p>
        <div className="w-full max-w-md md:max-w-xl p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2">
          <input
            readOnly
            onClick={() => navigate("/search")}
            className="cursor-pointer bg-white rounded-xl py-3.5 md:py-4 flex-grow outline-none text-slate-800 px-5 text-sm md:text-base font-medium shadow-inner transition-all hover:bg-slate-50"
            placeholder="Search salons by city..."
          />
        </div>
      </div>
      <div className="z-10 absolute inset-0 bg-indigo-950/20"></div>
    </div>
  );
};

export default Banner;

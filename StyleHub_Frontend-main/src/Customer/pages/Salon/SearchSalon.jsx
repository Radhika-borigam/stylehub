import React, { useEffect, useState } from "react";
import SalonList from "./SalonList";
import { useDispatch, useSelector } from "react-redux";
import { searchSalon, fetchSalons } from "../../../Redux/Salon/action";

const SearchSalon = () => {
  const { salon } = useSelector(store => store);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Ensure all salons are loaded for the fallback list
    dispatch(fetchSalons());
  }, [dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(
      searchSalon({ jwt: localStorage.getItem("jwt"), city: value })
    );
  };

  // If search term is empty, fallback to show all salons
  const displaySalons = searchTerm.trim() === "" ? salon.salons : salon.searchSalons;

  return (
    <div className="lg:px-20 px-5 space-y-8 py-10 bg-[#FAFAFC] min-h-screen">
      <div className="flex flex-col justify-center items-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight text-center">
          Find the Best Beauty & Wellness Near You
        </h2>
        <div className="w-full relative shadow-md rounded-2xl bg-white border border-slate-100 p-1">
          <input
            onChange={handleSearch}
            className="w-full py-4 outline-none text-slate-800 px-5 text-sm md:text-base font-medium rounded-2xl bg-slate-50/50 focus:bg-white transition-all"
            placeholder="Type a city name (e.g. London, Manchester)..."
            value={searchTerm}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            {searchTerm.trim() === "" 
              ? "All Recommended Salons Nearby 📍" 
              : `Showing Salons in "${searchTerm}"`}
          </h3>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {displaySalons?.length || 0} Salons Found
          </span>
        </div>
        
        {displaySalons && displaySalons.length > 0 ? (
          <SalonList salons={displaySalons} />
        ) : (
          <div className="text-center py-20 space-y-4">
            <span className="text-4xl">🔍</span>
            <p className="text-slate-500 font-medium">No salons found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSalon;

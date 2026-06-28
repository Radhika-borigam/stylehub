import React, { useEffect, useState } from "react";
import { services } from "../../../Data/Services";
import HomeServiceCard from "./HomeServiceCard";
import SalonList from "../Salon/SalonList";
import Banner from "./Banner";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalons } from "../../../Redux/Salon/action";

const Home = () => {
  const { salon } = useSelector((store) => store);
  const dispatch = useDispatch();

  const [selectedCity, setSelectedCity] = useState("All Cities");

  useEffect(() => {
    dispatch(fetchSalons());
  }, []);

  const uniqueCities = ["All Cities", ...new Set((salon.salons || []).map((s) => s.city).filter(Boolean))];

  const filteredSalons = selectedCity === "All Cities"
    ? (salon.salons || [])
    : (salon.salons || []).filter((s) => s.city?.toLowerCase() === selectedCity.toLowerCase());

  return (
    <div className="space-y-24 bg-[#FAFAFC] pb-16">
      {/* Hero Banner Section */}
      <section>
        <Banner />
      </section>

      {/* Services Categories Section */}
      <section className="space-y-10 lg:space-y-0 lg:flex items-center gap-16 px-6 md:px-12 lg:px-24">
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-2">
            <span className="text-sm font-semibold tracking-wider text-primary-color uppercase">Explore Services</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              What are you looking for, <span className="text-primary-color">Bestie? 👀</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-md">
              Choose from our wide range of premium beauty, styling, and wellness services.
            </p>
          </div>
          <div className="flex flex-wrap justify-start items-center gap-4">
            {services.map((item) => (
              <HomeServiceCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Visual Showcase Gallery */}
        <div className="w-full lg:w-1/2 grid gap-4 grid-cols-2 grid-rows-12 h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl p-3 bg-white border border-slate-100">
          <div className="row-span-7 overflow-hidden rounded-2xl">
            <img
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              src="https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Salon styling"
            />
          </div>
          <div className="row-span-5 overflow-hidden rounded-2xl">
            <img
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              src="https://images.pexels.com/photos/3331488/pexels-photo-3331488.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Manicure"
            />
          </div>
          <div className="row-span-7 overflow-hidden rounded-2xl">
            <img
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              src="https://images.pexels.com/photos/5069455/pexels-photo-5069455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Facial"
            />
          </div>
          <div className="row-span-5 overflow-hidden rounded-2xl">
            <img
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              src="https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Spa treatment"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-6 md:px-12 lg:px-24">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <span className="text-sm font-semibold tracking-wider text-primary-color uppercase">Our Promise</span>
          <h2 className="text-3xl font-bold text-slate-800">Why Book With StyleHub?</h2>
          <p className="text-slate-500 text-sm md:text-base">
            We partner with the best beauty & wellness specialists to give you an unparalleled self-care experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 text-center">
            <div className="w-12 h-12 bg-violet-50 text-primary-color rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 text-lg">Verified Salons</h3>
            <p className="text-slate-500 text-sm">Every partner is handpicked and audited for quality and cleanliness standards.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 text-center">
            <div className="w-12 h-12 bg-violet-50 text-primary-color rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 text-lg">Instant Confirmation</h3>
            <p className="text-slate-500 text-sm">Say goodbye to phone tags. Book your favorite slot online and get instant booking confirmation.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 text-center">
            <div className="w-12 h-12 bg-violet-50 text-primary-color rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 text-lg">Stylists Near You</h3>
            <p className="text-slate-500 text-sm">Use our advanced proximity filter to discover local beauty gems in your neighborhood.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 text-center">
            <div className="w-12 h-12 bg-violet-50 text-primary-color rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 text-lg">Secure Payments</h3>
            <p className="text-slate-500 text-sm">Pay seamlessly using credit cards, UPI, or wallets. Zero hassle, full refund on cancellation.</p>
          </div>
        </div>
      </section>

      {/* Salons Listing Section */}
      <section className="px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <span className="text-sm font-semibold tracking-wider text-primary-color uppercase">Top Rated partners</span>
            <h2 className="text-3xl font-bold text-slate-800">Book Your Favorite Salon</h2>
          </div>

          {/* Dynamic Location Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider">
              📍 City
            </span>
            {uniqueCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedCity === city
                    ? "bg-violet-600 text-white shadow-md shadow-violet-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <SalonList salons={filteredSalons} />
      </section>

      {/* Promo Banner Section */}
      <section className="px-6 md:px-12 lg:px-24">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-800 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold">First Time Booking with StyleHub?</h2>
            <p className="text-violet-100 text-sm md:text-base">
              Use code <strong className="bg-white/20 px-2.5 py-1 rounded text-white font-mono text-lg">FIRST20</strong> to get 20% off on any beauty treatment today!
            </p>
          </div>
          <button className="bg-white text-violet-700 font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-violet-50 transition-all hover:scale-105 active:scale-95 duration-200">
            Find Salons Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;

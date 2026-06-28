import { Alert, Box, Button, Modal, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import RegistrationForm from "./Register";
import LoginForm from "./Login";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetPasswordRequest from "./ResetPaswordRequest";



const Auth = ({ open, handleClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [selectedRole, setSelectedRole] = useState("CUSTOMER");

  useEffect(() => {
    if (auth.success || auth.error) setOpenSnackBar(true);
  }, [auth.success, auth.error]);

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-violet-50 via-slate-50 to-rose-50 px-4">
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-2xl p-8 rounded-3xl w-full max-w-md transition-all duration-300">
        
        {/* Persona Switcher row */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("CUSTOMER")}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
              selectedRole === "CUSTOMER"
                ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200"
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="text-xl mb-0.5">👤</span>
            <span className="font-bold text-xs">Customer Portal</span>
            <span className="text-[9px] opacity-80 text-center mt-0.5">Book styling & beauty</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("SALON_OWNER")}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
              selectedRole === "SALON_OWNER"
                ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200"
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="text-xl mb-0.5">✂️</span>
            <span className="font-bold text-xs">Partner Portal</span>
            <span className="text-[9px] opacity-80 text-center mt-0.5">Grow your salon business</span>
          </button>
        </div>

        {location.pathname === "/register" ? (
          <RegistrationForm role={selectedRole} />
        ) :  (
          <LoginForm role={selectedRole} />
        ) }
        <div className="flex justify-center mt-5">
          <Snackbar
            sx={{ zIndex: 50 }}
            open={openSnackBar}
            autoHideDuration={3000}
            onClose={handleCloseSnackBar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              severity={auth.error ? "error" : "success"}
              sx={{ width: "100%", borderRadius: '12px' }}
            >
              {auth.success ||
                auth.error?.response?.data?.message ||
                auth.error?.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default Auth;

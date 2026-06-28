import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Typography,
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/Auth/action";


const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);

  const handleSubmit = (values) => {
    console.log("Login form values:", values);
    dispatch(loginUser({ data: values, navigate }));
  };

  const fillDemoCredentials = (setFieldValue) => {
    if (role === "CUSTOMER") {
      setFieldValue("email", "alice.smith_demo@example.com");
      setFieldValue("password", "DemoCustPass1!");
    } else {
      setFieldValue("email", "jane.stylist_demo@example.com");
      setFieldValue("password", "DemoOwnerPass1!");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography className="text-center font-bold text-slate-800" variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
            {error}
          </Alert>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              {/* Quick Fill Box */}
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center mb-4">
                <p className="text-xs text-violet-700 font-bold mb-1">
                  Demo Autofill ⚡
                </p>
                <p className="text-[10px] text-slate-500 mb-3">
                  Click to populate login details for a **{role === "CUSTOMER" ? "Customer" : "Salon Owner"}** demo.
                </p>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials(setFieldValue)}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md active:scale-[0.98] transition-all"
                >
                  Fill Credentials
                </button>
              </div>

              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                name="email"
                id="email"
                autoComplete="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 2, py: "0.8rem", borderRadius: "12px", fontWeight: "bold" }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Button onClick={() => navigate("/register")}>
            Register
          </Button>
        </Typography>
      </div>
    </Container>
  );
};

export default LoginForm;

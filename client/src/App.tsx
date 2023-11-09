import { Routes, Route } from "react-router-dom";
import SellerOnboardLayout from "layout/SellerOnboardLayout";
import AuthenticationLayout from "layout/AuthenticationLayout";
import LandingLayout from "layout/LandingLayout";
import ForgotPasswordPage from "pages/ForgotPasswordPage";
import LandingPage from "pages/LandingPage";
import SignupPage from "pages/SignupPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthenticationLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route path="/" element={<LandingLayout />}>
        <Route path="/landing" element={<LandingPage />} />
      </Route>
      <Route path="/" element={<SellerOnboardLayout />}>
        <Route path="/landing" element={<LandingPage />} />
      </Route>
      <Route path="/login/forgotpassword" element={<ForgotPasswordPage />} />
    </Routes>
  );
}

export default App;

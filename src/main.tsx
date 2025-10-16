import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Login from './components/templates/auth/loginTemplate';
import LoginOtp from './components/templates/auth/otpTemplate';
import Advertiser from './components/templates/auth/advertiserTemplate';
// import ResetPassword from './components/templates/auth/resetPasswordTemplate';
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
      <App/>
      {/* <Login/> */}
      {/* <LoginOtp /> */}
      {/* <Advertiser/> */}
      {/* <ResetPassword/> */}

      </BrowserRouter>
    </StrictMode>
  );
}

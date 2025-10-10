
import { Suspense, useState, useEffect } from "react";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { routesData } from "./components/shared/routes";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Loader from "./components/molecules/Loader";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { SettingsProvider } from "./components/providers/SettingsProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const routes = routesData();
  const [showContent, setShowContent] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const location = useLocation();

  // Initialize loader state at app startup
  useEffect(() => {
    setShowContent(false);
    setLoaderDone(false);
  }, []);

  const isAuthRoute = ["/login", "/forgot-password", "/reset-password"].includes(location.pathname.toLowerCase());

  const content = (
    <>
      {!showContent && !loaderDone && (
        <Loader
          animate={true}
          onComplete={() => {
            setLoaderDone(true);
            setShowContent(true);
          }}
          duration={1500}
        />
      )}

      {showContent && (
        <Suspense fallback={null}>
          <Routes>
            {routes.map((route) => {
              const path = route.path.toLowerCase();
              if (["/login", "/forgot-password", "/reset-password"].includes(path)) {
                return <Route key={path} path={path} element={route.component} />;
              }
              return (
                <Route
                  key={path}
                  path={path}
                  element={<ProtectedRoute>{route.component}</ProtectedRoute>}
                />
              );
            })}
          </Routes>
        </Suspense>
      )}
    </>
  );

  return (
    <ErrorBoundary>
      <SettingsProvider>
        {isAuthRoute ? content : <Layout>{content}</Layout>}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;




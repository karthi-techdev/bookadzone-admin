
import { Suspense, useState } from "react";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { routesData } from "./components/shared/routes";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Loader from "./components/molecules/Loader";
import ProtectedRoute from "./components/shared/ProtectedRoute";


function App() {
  const routes = routesData();
  const [showContent, setShowContent] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const location = useLocation();

  const isLoginRoute = location.pathname === "/Login";

  const content = (
    <>
      {!showContent && !loaderDone && (
        <Loader
          animate={true}
          onComplete={() => {
            setLoaderDone(true);
            setShowContent(true);
          }}
          duration={1500} // Show loader for 0.5s only
        />
      )}

      {showContent && (
        <Suspense fallback={null}>
          <Routes>
            {routes.map((route) => {
              if (route.path === "/Login") {
                return <Route key={route.path} path={route.path} element={route.component} />;
              }
              return (
                <Route
                  key={route.path}
                  path={route.path}
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
      {isLoginRoute ? content : <Layout>{content}</Layout>}
    </ErrorBoundary>
  );
}

export default App;

// import React from 'react';
// import './App.css';
// import BAZJodiEdit from './components/atoms/BAZ-Jodit';

// const App: React.FC = () => {
//     return (
//         <div className="App">
//            <BAZJodiEdit/>
//         </div>
//     );
// };

// export default App;


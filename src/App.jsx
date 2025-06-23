import { Suspense, useState } from "react";
import { routesData } from "./components/shared/routes";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Loader from "./components/molecules/Loader";

function App() {
  const routes = routesData();
  const [showContent, setShowContent] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <Layout>
      {!showContent && !loaderDone && (
        <Loader
          animate={true}
          onComplete={() => {
            setLoaderDone(true);
            setShowContent(true);
          }} 
        />
      )}

      {showContent && (
        <Suspense fallback={null}>
          <Routes>
            {routes.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.component} />
            ))}
          </Routes>
        </Suspense>
      )}
    </Layout>
  );
}

export default App;

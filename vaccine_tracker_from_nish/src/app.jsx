import React, { Suspense, lazy } from "react";
import { LeapFrog } from '@uiball/loaders'
import "./app.scss";
import { GlobalProvider } from "./context/GlobalState";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const VacinationCoverage = lazy(() => import("./page/VaccinationCoverage"));
function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
      <Suspense fallback={
        <div >
          <LeapFrog size={40} speed={2.5}  color="#EF5B5B" />
        </div>
      }>
        <Routes>
      
          <Route
            path="/"
            element={<VacinationCoverage />}
          />
        </Routes>
        </Suspense>
      </BrowserRouter>  

    
    </GlobalProvider>
  );
}

export default App;

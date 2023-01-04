import React from 'react'
import VCPanel from "../components/Panel/VacinationCoveragePanel";
import Navigation from "../components/navigation/Navigation";
import "./page_container.scss";

const VaccinationCoverage = () => {
  return (
    <>
    <Navigation/>
    {/* <div className="header" > */}
    <div className="page-container container" >
      <div class="container d-flex align-items-center">
          <div class="row w-100">
            <div class="col-12 p-0">
            
              <h3 class="title">COVID Vaccine Tracker</h3>
              <a class="btn-back" href="https://www.africadatahub.org/"><i class="fas fa-arrow-left"></i> Back</a>
            </div>
          </div>
        </div>
     
      <VCPanel />
      </div>
    {/* </div> */}
  </>
  )
}

export default VaccinationCoverage
import React, { useEffect } from "react";
import CountUp from "react-countup";
import './progressbar.scss'

const ProgressBar = (props) => {
  const load = () => {
    let elem = document.getElementById(props.class);
    let width = 1;
    let id = setInterval(frame, 10);
    function frame() {
      if(elem){
      if (width >= props.bar) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
      }
    }
    }
  }

  useEffect(() => {
    load();
  },[])
  return (
    <div className="progressbar d-flex">
      <div id={props.class} className={["bar "+props.class]} style={{ width: props.bar+"%" }}></div>
      <div className="first-box-label">{props.label}</div>
      <div className="first-box-value"> <CountUp start={0} end={props.value} duration={2} separator=" " /> {props.suffix}</div>
    </div>
  );
};

export default ProgressBar;

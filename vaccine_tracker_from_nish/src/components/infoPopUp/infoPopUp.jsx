import React, { useState,useRef,useEffect } from 'react'
import Info from '../../svg/info.svg'
import Close from '../../svg/Close.svg'
import './info.scss'





const infoPopUp = (props) => {
  const [open,setOpen] = useState(false)

  const popup = () => {
    setOpen(!open)
  }

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);


  return (
    <div className='info' ref={wrapperRef}>
        <img src={Close} className="d-none" />
        <a onClick={popup}><img style={{position: 'relative', top: '-2.4px'}} src={Info}/></a> 
        {open &&
          <div className='info-popup'>
          <div className='d-flex justify-content-between'><h1>Embedded Code</h1> <a onClick={popup}><img src={Close}/></a></div>
          <hr/>
            <div><p>{props.explainer}</p></div>
        </div>
        }
    </div>
  )
}

export default infoPopUp


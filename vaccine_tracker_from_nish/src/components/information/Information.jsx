import React from 'react'
import './information.scss'

const Information = (props) => {
  return (
    <div className='information'>
       <h1>{props.info[0]}</h1>
       <b className='d-none d-md-block'>{props.info[1]}</b>
       <p className='d-block d-md-none'>{props.info[1]}</p>
       <p>{props.info[2]}</p>
      
    </div>
  )
}
export default Information;

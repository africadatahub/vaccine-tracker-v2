import './navigation.scss';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import {Container,Collapse,NavbarBrand,Nav,NavItem,NavLink,Media} from 'reactstrap';
import $ from 'jquery'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebookF, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
// Remove default html page loader 
function removeLoader(){
    $('.spinner--container').remove();
  }
  

const Default = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [mobile, setMobile] = useState(false);
  const [classes] = useState('');



  useEffect(() => {
    deviceCheck(480);
    removeLoader();
  })

  function deviceCheck(deviceWidth){
    window.screen.width <= deviceWidth ?
    setMobile(true)
    :
    setMobile(false)
  }

  useEffect(() => {
    setTimeout(() => {
        if(window.location.hash){
          const element = document.getElementById(window.location.hash.replace('#', ''));
          const y = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
          }
    }, 100);
  }, [window.location.hash])

  return (
    
    <div className={["navigation " + props.className + ' ' + classes]}> {/* Use bg_ and color classes in helpers.scss eg 'bg_transparent' */}
    <Container fluid={false} >
    <nav className="navbar navbar-expand-lg"> {/* className="navbar navbar-expand-lg header-navigation" - Used default bootstrap markup to avoid using reactstrap default classes */}
      <a href='https://www.africadatahub.org/' id="black-box-logo"> 
        <Media object src="https://assets.website-files.com/6017e7ecb14082cec5d531af/605dc8591d244b03000f013c_adh-logo.svg" alt="Generic placeholder image" />
      </a>
        <Collapse isOpen={isOpen} navbar>
        <NavbarBrand className='mobile-nav' href='/' id="black-box-logo"> 
        <Media object src="https://assets.website-files.com/6017e7ecb14082cec5d531af/605dc8591d244b03000f013c_adh-logo.svg" alt="Generic placeholder image" />
      </NavbarBrand>
          <Nav id='myDiv' navbar>
             {/**Desktop */}
            <NavItem className='d-none d-md-block'>
              <a href="https://www.africadatahub.org/data-resources" className='nav-link bold'>Data Resources</a>
            </NavItem>
            <NavItem  className='d-none d-md-block'>
              <a href='https://www.africadatahub.org/about' target='_blank' className='nav-link bold' >About</a>
            </NavItem>

            {/**Mobile */}
            <hr className='m-0 d-block d-md-none m;'/>
            {/* change a bit here inorder to fix the mobile version that are not the same as the original site */}
            <NavItem  className='d-block d-md-none'> 
              <Link to='/' className='nav-link bold tag' onClick={toggle}   >Data Resources</Link>
            </NavItem>
            <NavItem  className='d-block d-md-none'>
              <Link to='/vaccination_coverage' className='nav-link tag' onClick={toggle}   >About</Link> 
            </NavItem>
            <hr className='d-block d-md-none' />
         
            <NavItem className='d-flex align-items-center socials'>
                
              <Button className ="button-image" variant="white" href='https://twitter.com/Africa_DataHub' target='_blank'><FontAwesomeIcon icon={faTwitter} style={{ fontSize:"18px", position:"relative",right:"5px"}}/></Button>
              <Button className ="button-image" variant="white" href='https://www.facebook.com/AfricaDataHub' target='_blank'><FontAwesomeIcon icon={faFacebookF} style={{ fontSize:"15px",position:"relative",bottom:"2px"}}/></Button>
              <Button className ="button-image" variant="white" href='https://www.linkedin.com/company/africa-data-hub/about/?viewAsMember=true' target='_blank'><FontAwesomeIcon icon={faLinkedinIn} style={{ fontSize:"15px",position:"relative",bottom:"2px"}}/></Button>
              <Button className ="button-image" variant="white" href='https://www.instagram.com/africadatahub/' target='_blank'><FontAwesomeIcon icon={faInstagram} style={{ fontSize:"15px",position:"relative",bottom:"2px"}}/></Button>
            </NavItem>
            
          </Nav>
        </Collapse>
        <button aria-label="Toggle navigation" id="hamburger" type="button" className="navbar-toggler" onClick={toggle}>
          <span className="navbar-toggler-line"></span>
          <span className="navbar-toggler-line"></span>
          <span className="navbar-toggler-line"></span>
        </button>
      </nav>
      </Container>
      </div>
  );
}

export default Default;
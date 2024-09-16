import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";


const Footer = () => {

return(

    <nav class="navbar navbar-dark bg-dark" style={{ marginTop: '20px' }}>
  <div className="container-wrap">
    <a className="navbar-brand" href="https://github.com/Icebreaker26" target="_blank"><FaGithub /></a>
    <a className="navbar-brand" href="https://www.linkedin.com/in/alejandrotorres26/" target="_blank"><FaLinkedin /></a>

    <a className="text-light" style={{textDecoration: 'none' }}>Icebreaker2608 ❤</a>

  </div>

  

</nav>


)}


export {Footer}
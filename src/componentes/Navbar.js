import React from "react";
import { PiWaveSineDuotone } from "react-icons/pi";
import { GrSatellite } from "react-icons/gr";

const Navbar = () =>{

    return(

        <nav class="navbar fixed-top navbar-dark bg-danger">
            <div class="container-md">
                <h1 class="navbar-brand">The Linkin' Tool 
                <GrSatellite />
                <PiWaveSineDuotone />
                <PiWaveSineDuotone />
                <PiWaveSineDuotone />
                <PiWaveSineDuotone />
                <PiWaveSineDuotone />
                <PiWaveSineDuotone />
                <GrSatellite style={{ transform:  'scaleX(-1)' }}/>

                </h1>
                
                
            </div>
        </nav>

    )
}


export {Navbar}
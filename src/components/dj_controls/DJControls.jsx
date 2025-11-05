import { useState } from "react";
import base from '../BaseSettings';
import ReverbSlider from "./ReverbSlider";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function DJControls({ reverb, setReverb, onHandleReverb, onHandleGeneric }) {
    return (
        <>
            <div className="dj-controls bg-foreground" onChange={onHandleGeneric}>
                <br/>
                {/* <div className="mb-4 h6 bg-foreground">DJ Controls</div> */}
                <ReverbSlider reverb={reverb} setReverb={setReverb} onHandleReverb={onHandleReverb} />
            
            </div> {/* on update */}
            
            
        </>
    )
};

export default DJControls;

import CPMInput from "./CPMInput";
import VolumeSlider from "./VolumeSlider";
import SpeedDropdown from "./SpeedDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function AudioControls({ volume, setVolume, cpm, setCPM, speed, setSpeed, onHandleGeneric, onHandleVolume, onHandleCPM, onHandleSpeed }) {
    return (
        <>
            <div className="audio-controls bg-foreground" onChange={onHandleGeneric}>
                {/* <h6 className="mt-5 mb-4 audioControlHeading bg-foreground">Audio Controls</h6> */}
                {/* <p className="settingTitle">Cycles Per Minute</p> */}
                {/* <CPMInput cpm={cpm} setCPM={setCPM} onHandleCPM={onHandleCPM} /> */}
                <VolumeSlider volume={volume} setVolume={setVolume} onHandleVolume={onHandleVolume} />
                <br/>
                {/* <SpeedDropdown speed={speed} setSpeed={setSpeed} onHandleSpeed={onHandleSpeed} /> */}
                <div className="row mb-0">
                    <div className="col bg-foreground">
                        <CPMInput cpm={cpm} setCPM={setCPM} onHandleCPM={onHandleCPM} />
                    </div>
                    <div className="col bg-foreground">
                        <SpeedDropdown speed={speed} setSpeed={setSpeed} onHandleSpeed={onHandleSpeed} />
                    </div>
                </div>
            </div>
        </>
    )
};

export default AudioControls;
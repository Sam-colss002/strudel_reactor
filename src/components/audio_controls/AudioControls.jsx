
import CPMInput from "./CPMInput";
import VolumeSlider from "./VolumeSlider";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function AudioControls({ volume, setVolume, cpm, setCPM, onHandleGeneric, onHandleVolume, onHandleCPM }) {
    return (
        <>
            <div className="audio-controls bg-foreground" onChange={onHandleGeneric}>
                {/* <h6 className="mt-5 mb-4 audioControlHeading bg-foreground">Audio Controls</h6> */}
                <p className="settingTitle">Cycles Per Minute</p>
                <CPMInput cpm={cpm} setCPM={setCPM} onHandleCPM={onHandleCPM} />
                <br/>
                <VolumeSlider volume={volume} setVolume={setVolume} onHandleVolume={onHandleVolume} />
                
            </div>
        </>
    )
};

export default AudioControls;
import './App.css';
import { useEffect, useRef, useState, createContext, useMemo, useContext } from "react";

// import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import StrudelPlayer from './components/StrudelPlayer';

import { createRoot } from 'react-dom/client';
import base from './components//BaseSettings';


let defaultTune = stranger_tune;
//export const StrudelContext = createContext();

export const StrudelContext = createContext(null);

export default function App() {
    // audio_controls
    const [ volume, setVolume ] = useState(base.volume);
    const [ cpm, setCPM ] = useState(base.cpm);
    const [ speed, setSpeed ] = useState(base.speed);
    const [ strudelData, setStrudelData ] = useState([]);
    
    // editor controls
    const [ themeDropdown, setThemeDropdown] = useState(base.themeDropdown); // light is default for maximum effect
    const [ codeFontSize, setCodeFontSize ] = useState(base.codeFontSize);

    // dj_controls
    const [ reverb, setReverb ] = useState(base.reverb);

    const value = useMemo(() => {
        return {
            volume,
            setVolume,
            cpm,
            setCPM,
            speed,
            setSpeed,
            themeDropdown,
            setThemeDropdown,
            codeFontSize,
            setCodeFontSize,
            reverb,
            setReverb,
            strudelData,
            setStrudelData
            //log: (t) => console.log(t)
        }
        // in order for things to be updated properly, these need to be returned
    }, [volume, cpm, reverb, speed, themeDropdown, codeFontSize, strudelData, setStrudelData ]);
        //const [strudelState, setStrudelState] = useState(state);

    return (
        <StrudelContext.Provider value={value}>
            <StrudelPlayer />
        </StrudelContext.Provider >
    );
}
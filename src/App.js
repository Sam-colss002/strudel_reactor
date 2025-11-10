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
    const [ volume, setVolume ] = useState(base.DEFAULT_VOLUME);
    const [ cpm, setCPM ] = useState(base.DEFAULT_CPM);
    
    // editor controls
    const [ themeDropdown, setThemeDropdown] = useState(base.DEFAULT_THEME); // light is default for maximum effect
    const [ codeFontSize, setCodeFontSize ] = useState(base.DEFAULT_FONT_SIZE);

    // dj_controls
    const [ reverb, setReverb ] = useState(base.DEFAULT_REVERB);

    const value = useMemo(() => {
        return {
            volume,
            setVolume,
            cpm,
            setCPM,
            themeDropdown,
            setThemeDropdown,
            codeFontSize,
            setCodeFontSize,
            reverb,
            setReverb
            //log: (t) => console.log(t)
        }
    }, [volume, cpm, reverb]);
        //const [strudelState, setStrudelState] = useState(state);

    return (
        <StrudelContext.Provider value={value}>
            <StrudelPlayer />
        </StrudelContext.Provider >
    );
}
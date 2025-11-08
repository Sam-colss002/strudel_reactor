import './App.css';
import { useState, useRef, useEffect } from "react";

// import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import StrudelPlayer from './components/StrudelPlayer';

let defaultTune = stranger_tune;

function App() {
    return (
        <div>
            <StrudelPlayer 
            />
        </div >
    );


}

export default App;
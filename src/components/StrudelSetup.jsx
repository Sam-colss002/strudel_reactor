import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from '../tunes';
import console_monkey_patch from '../console-monkey-patch';

// so many globals :O
let strudelEditor = null;
let bigVolume = null;
let bigCPM = null;
let bigReverb = null;
let oldProcText = null;
let processedSettings = [null, null, null]; // used to differentiate play vs proc&play


/**  */
export const Proc = () => {
    let procText = document.getElementById("proc").value;
    oldProcText = document.getElementById("proc").value;
    if (!procText || !strudelEditor) {
        strudelEditor.setCode(stranger_tune);
        return;
    } else {
        let volumeToUse = parseFloat(bigVolume);
        let cpmToUse = parseInt(bigCPM);
        let reverbToUse = parseFloat(bigReverb);
        processedSettings = [cpmToUse, volumeToUse, reverbToUse];
        strudelEditor.setCode(procText);
    }
};

export const StrudelSetup = async ( stranger_tune, setSongText) => {
    //const hasRun = useRef(false);
    //document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            //hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
                //init canvas
                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 2;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; // time window of drawn haps
                
                strudelEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => 
                        drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                        const loadModules = evalScope(
                            import('@strudel/core'),
                            import('@strudel/draw'),
                            import('@strudel/mini'),
                            import('@strudel/tonal'),
                            import('@strudel/webaudio'),
                        );
                        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                    },
                });
            
            setSongText(stranger_tune);
            
            Proc(); // welcome back, Proc()   lol
};


// TODO: we're using global values here...
export const setGlobalVolume = (value) => {
    //console.log("setting bigVolume to : " + parseFloat(value));
    bigVolume = value;
}

export const setGlobalCPM = (value) => {
    //console.log("setting bigCPM to : " + parseInt(value));
    bigCPM = parseInt(value);
}

export const setGlobalReverb = (value) => {
    //console.log("setting bigReverb to : " + parseFloat(value));
    bigReverb = parseFloat(value);
}

export const handlePlay = () => {
    console.log("Playing Strudel");
    if (strudelEditor) {
        let procText = document.getElementById("proc").value;
        let volumeToUse = parseFloat(bigVolume);
        let cpmToUse = parseInt(bigCPM);
        let reverbToUse = parseFloat(bigReverb);

        // adds settings to code for use, then removes them to keep them hidden from user
        if (oldProcText) {
            strudelEditor.setCode((oldProcText + "\n" + "setcpm("+processedSettings[0]/4+")"+"\n" + "all(x => x.gain("+processedSettings[1]+").room("+processedSettings[2]+"));"+"\n"));
            strudelEditor.evaluate();
            strudelEditor.setCode(oldProcText);
        } else {
            strudelEditor.evaluate();
        }
    } else {
        console.log("Failed condition checker in handlePlay");
    }
}

export const handleStop = () => {
    console.log("Strudel Stopped");
    if (strudelEditor) {
        strudelEditor.stop();
    } else {
        console.log("Failed condition checker in handleStop");
    }
}

export const handleProc = () => {
    console.log("Processing");
    if (strudelEditor) {
        Proc();
    } else {
        console.log("Failed condition checker in handleProc");
    }
}

export const handleProcPlay = async () => {
    console.log("Processing & Playing");
    await initAudioOnFirstClick();
    if (strudelEditor) {
        Proc();
        handleStop();
        let procText = document.getElementById("proc").value;
        let volumeToUse = parseFloat(bigVolume);
        let cpmToUse = parseInt(bigCPM);
        let reverbToUse = parseFloat(bigReverb);

        strudelEditor.setCode((procText + "\n" + "setcpm("+cpmToUse/4+")"+"\n" + "all(x => x.gain("+volumeToUse+").room("+reverbToUse+"));"+"\n"));
        strudelEditor.evaluate();
        strudelEditor.setCode(procText);
    } else {
        console.log("Failed condition checker in handleProcPlay");
    }
}

export const handleReset = () => {
    console.log("Resetting strudelEditor");
    handleStop();
    strudelEditor.setCode(stranger_tune);
}
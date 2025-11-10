import { useEffect, useRef, useState, useContext } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from '../tunes';
import console_monkey_patch from '../console-monkey-patch';


let strudelEditor = null;
let processedSettings = [null, null, null];

/**  */
export class StrudelSetupClass{
    constructor(stranger_tune, setSongText, volume, cpm, reverb) {
        this.volume = volume;
        this.cpm = cpm;
        this.reverb = reverb;
        this.oldProcText = null;
    }

    testVolume() {
        return this.volume;
    }

    Proc = () => {
    let procText = document.getElementById("proc").value;
    this.oldProcText = document.getElementById("proc").value;
    if (!procText || !strudelEditor) {
        strudelEditor.setCode(stranger_tune);
        return;
    } else {
        let volumeToUse = parseFloat(this.volume);
        let cpmToUse = parseInt(this.cpm);
        let reverbToUse = parseFloat(this.reverb);
        console.log("volume : " + volumeToUse);
        processedSettings = [this.volume, this.cpm, this.reverb];
        strudelEditor.setCode(procText);
    }
    };

    StrudelSetup( stranger_tune, setSongText, volume, cpm, reverb ) {
        processedSettings = [volume, cpm, reverb];
        //this.processedSettings = [volume, cpm, reverb];
        /** on load the player needs to setup the strudel */

        //const absorbedContext = useContext(context);

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
            
        this.Proc(); // welcome back, Proc()   lol
    }

    // TODO: we're using global values here...
    setGlobalVolume = (value) => {
        //console.log("setting bigVolume to : " + parseFloat(value));
        this.volume = value;
    }

    setGlobalCPM = (value) => {
        //console.log("setting bigCPM to : " + parseInt(value));
        this.cpm = parseInt(value);
    }

    setGlobalReverb = (value) => {
        //console.log("setting bigReverb to : " + parseFloat(value));
        this.reverb = parseFloat(value);
    }

    handlePlay = () => {
        console.log("Playing Strudel");
        if (strudelEditor) {
            let procText = document.getElementById("proc").value;
            let volumeToUse = parseFloat(processedSettings[0]);
            let cpmToUse = parseInt(processedSettings[1]);
            let reverbToUse = parseFloat(processedSettings[2]);
            console.log("playing with (Vol|CPM|Rev) : " + "("+processedSettings[0]+"|"+processedSettings[1]+"|"+processedSettings[2]+")");

            // adds settings to code for use, then removes them to keep them hidden from user
            if (this.oldProcText) {
                strudelEditor.setCode((this.oldProcText + "\n" + "setcpm("+processedSettings[0]/4+")"+"\n" + "all(x => x.gain("+processedSettings[1]+").room("+processedSettings[2]+"));"+"\n"));
                strudelEditor.evaluate();
                strudelEditor.setCode(this.oldProcText);
            } else {
                strudelEditor.evaluate();
            }
        } else {
            console.log("Failed condition checker in handlePlay");
        }
    }

    handleStop = () => {
        console.log("Strudel Stopped");
        if (strudelEditor) {
            strudelEditor.stop();
        } else {
            console.log("Failed condition checker in handleStop");
        }
    }

    handleProc = () => {
        console.log("Processing");
        if (strudelEditor) {
            this.Proc();
        } else {
            console.log("Failed condition checker in handleProc");
        }
    }

    handleProcPlay = async () => {
        console.log("Processing & Playing");
        await initAudioOnFirstClick();
        if (strudelEditor) {
            this.Proc();
            this.handleStop();
            let procText = document.getElementById("proc").value;
            let volumeToUse = parseFloat(this.volume);
            let cpmToUse = parseInt(this.cpm);
            let reverbToUse = parseFloat(this.reverb);

            strudelEditor.setCode((procText + "\n" + "setcpm("+cpmToUse/4+")"+"\n" + "all(x => x.gain("+volumeToUse+").room("+reverbToUse+"));"+"\n"));
            strudelEditor.evaluate();
            strudelEditor.setCode(procText);
        } else {
            console.log("Failed condition checker in handleProcPlay");
        }
    }

    handleReset = () => {
        console.log("Resetting strudelEditor");
        this.handleStop();
        strudelEditor.setCode(stranger_tune);
    }

};
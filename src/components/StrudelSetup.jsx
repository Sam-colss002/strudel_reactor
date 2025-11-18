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
import * as d3 from 'd3';
import { StrudelContext } from "../App";

let strudelEditor = null;
let processedSettings = [null, null, null, null];
let isModified = false;


/**  */
export class StrudelSetupClass{
    constructor(stranger_tune, setSongText, volume, cpm, reverb, speed) {
        this.volume = volume;
        this.cpm = cpm;
        this.reverb = reverb;
        this.speed = speed;
        this.oldProcText = null;
    }

    printProcAndNonProc() {
        console.log("class values:\n"+
            "volume:"+this.volume+"\n"+
            "cpm:"+this.cpm+"\n"+
            "reverb:"+this.reverb+"\n"+
            "speed:"+this.speed+"\n"+
            "isModifiedCheck:"+isModified+"\n"+
            "processedSettings:"+processedSettings
        )
    }

    getIsModified() {
        return isModified;
    }

    setIsModified(bool) {
        console.log("uhh... hello?");
        isModified = bool;
        return isModified;
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
            let speedToUse = parseFloat(this.speed);
            processedSettings = [this.volume, this.cpm, this.reverb, this.speed];
            strudelEditor.setCode(procText);
            
        }
        isModified = false;
        this.printProcAndNonProc();
    };

    StrudelSetup( stranger_tune, setSongText, volume, cpm, reverb, speed ) {
        processedSettings = [volume, cpm, reverb, speed];

            console_monkey_patch();
            //hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
                //init canvas
                let svg = document.getElementById('roll');
                // // canvas replaced with svg
                // svg.width = svg.width * 2;
                // svg.height = svg.height * 2;
                const drawContext = svg.getContext('2d');
                const drawTime = [0, 0]; // time window of drawn haps
                var context = svg.getContext('2d');
                strudelEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => {
                        drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 })

                        if (haps.length > 0) {
                            const lastGain = haps[haps.length - 2].value.gain ?? 1;
                            const lastPostGain = haps[haps.length - 2].value.postgain ?? 1;
                            const lastDry = haps[haps.length - 2].value.dry ?? 1;
                            const combGain = lastGain * lastPostGain * lastDry;
                            document.dispatchEvent(new CustomEvent("d3DataHap", { detail: {combined:combGain} }));
                        }
                    },
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
        
        
        //this.Proc(); // welcome back, Proc()   lol
    }

    // TODO: we're using global values here... UPDATE: quarantined with log & return statements to observe changes
    setGlobalVolume = (value) => {
        console.log("setGlobalVolume should not be used!");
        return;
        //console.log("setting bigVolume to : " + parseFloat(value));
        this.volume = value;
    }

    setGlobalCPM = (value) => {
        console.log("setGlobalCPM should not be used!");
        return;
        //console.log("setting bigCPM to : " + parseInt(value));
        this.cpm = parseInt(value);
    }

    setGlobalReverb = (value) => {
        console.log("setGlobalReverb should not be used!");
        return;
        //console.log("setting bigReverb to : " + parseFloat(value));
        this.reverb = parseFloat(value);
    }

    setGlobalSpeed = (value) => {
        console.log("setGlobalSpeed should not be used!");
        return;
        //console.log("setting bigReverb to : " + parseFloat(value));
        this.speed = parseFloat(value);
    }

    handlePlay = () => {
        console.log("Playing Strudel");
        document.dispatchEvent(new CustomEvent("clearD3Data", { detail: "a" }));
        if (strudelEditor && !strudelEditor.repl?.state?.started) {
            let procText = document.getElementById("proc").value;
            let volumeToUse = parseFloat(processedSettings[0]);
            let cpmToUse = parseInt(processedSettings[1]);
            let reverbToUse = parseFloat(processedSettings[2]);
            let speedToUse = parseFloat(processedSettings[3]);

            // adds settings to code for use, then removes them to keep them hidden from user
            if (this.oldProcText) {
                strudelEditor.setCode((
                    procText + "\n" + 
                    "all(x => x.log())" + "\n" + 
                    "setcpm("+cpmToUse/4*(speedToUse ?? 1)+")"+"\n" + 
                    "all(x => x.dry("+volumeToUse+").room("+reverbToUse+"));"+"\n"));
                strudelEditor.evaluate();
                strudelEditor.setCode(this.oldProcText);
                // strudelEditor.setCode((
                // procText + "\n" + 
                // "all(x => x.log())" + "\n" + 
                // "setcpm("+cpmToUse/4+")"+"\n" + 
                // "all(x => x.dry("+volumeToUse+").room("+reverbToUse+"));"+"\n"));
                // strudelEditor.evaluate();
                // strudelEditor.setCode(this.oldProcText);
            } else {
                
                strudelEditor.setCode(
                    procText + "\n" + 
                    "setcpm("+cpmToUse/4*(speedToUse ?? 1)+")"+"\n" + 
                    "all(x => x.dry("+volumeToUse+").room("+reverbToUse+"));"+"\n");
                if (!strudelEditor.repl?.state?.started) {
                    strudelEditor.stop();
                    strudelEditor.evaluate();
                } else {
                    console.log("CANT START - ALREADY PLAYING");
                }
            }
        } else {
            console.log("Failed condition checker in handlePlay");
        }
    }

    // use this: strudelEditor.repl?.state?.started
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
        document.dispatchEvent(new CustomEvent("clearD3Data", { detail: "a" }));
        if (strudelEditor) {
            this.Proc();
            strudelEditor.stop();
            let procText = document.getElementById("proc").value;
            let volumeToUse = parseFloat(this.volume);
            let cpmToUse = parseInt(this.cpm);
            let reverbToUse = parseFloat(this.reverb);
            let speedToUse = parseFloat(this.speed);

            console.log("speedToUse : " + speedToUse);
            // "all(x => x.gain("+volumeToUse+").room("+reverbToUse+"));"+"\n")
            // 0:."+volumeToUse+"
            // "<0 2 3 10:.5>"

            strudelEditor.setCode((
                procText + "\n" + 
                    "all(x => x.log())" + "\n" + 
                    "setcpm("+cpmToUse/4+")"+"\n" + 
                    "all(x => x.dry("+volumeToUse+").room("+reverbToUse+"));"+"\n"));
            strudelEditor.evaluate();
            // strudelEditor.setCode((
            //     procText + "\n" + 
            //     "all(x => x.log())" + "\n" + 
            //     "setcpm("+cpmToUse/4+")"+"\n" + 
            //     "all(x => x.dry("+volumeToUse+").room("+reverbToUse+"));"+"\n")
            // );
            // strudelEditor.evaluate();
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
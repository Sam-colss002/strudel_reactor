import { useEffect, useRef, useState } from "react";
import { stranger_tune } from '../tunes';
import console_monkey_patch from '../console-monkey-patch';

import AudioControls from './audio_controls/AudioControls';
import EditorControls from './editor_controls/EditorControls';
import DJControls from './dj_controls/DJControls';
import MenuButtons from './menu_controls/MenuButtons';
import PlayButtons from './PlayButtons';
import ProcButtons from './ProcButtons';
import PreprocessTextArea from './PreprocessTextArea';
import ErrorTextArea from './ErrorTextArea';
import HelpPanel from './menu_controls/HelpPanel';
//import ControlPanel from './panels/ControlPanel';
import SourcePanel from './menu_controls/SourcePanel';
import ConsolePanel from './menu_controls/ConsolePanel';
import { setGlobalCPM, setGlobalReverb, StrudelSetup } from './StrudelSetup';
import { handlePlay, handleStop, handleProc, handleProcPlay, handleReset, Proc, setGlobalVolume} from './StrudelSetup';
import base from './BaseSettings';
import { stringifyValues } from "@strudel/core";
import ResetControlsButton from "./editor_controls/ResetControlsButton";

import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';

let defaultTune = stranger_tune;

function StrudelPlayer() {
    const hasRun = useRef(false);
    const [ songText, setSongText ] = useState("");
    const [ activeBtn, setActiveBtn ] = useState(base.DEFAULT_MENU);
    const [ errorText, setErrorText ] = useState("");

    // audio_controls
    const [ volume, setVolume ] = useState(base.DEFAULT_VOLUME);
    const [ cpm, setCPM ] = useState(base.DEFAULT_CPM);

    // dj_controls
    const [ reverb, setReverb ] = useState(base.DEFAULT_REVERB);

    // editor controls
    const [ themeDropdown, setThemeDropdown] = useState(base.DEFAULT_THEME); // light is default for maximum effect
    const [ codeFontSize, setCodeFontSize ] = useState(base.DEFAULT_FONT_SIZE);

    // on load the player needs to setup the strudel
    useEffect((e) => {
        if (!hasRun.current) {
            console.log("\nLoading Strudel Player...");
            document.getElementById("consolePanelText").innerText = "";
            console.log("hasRun is false; setting up Strudel");
            hasRun.current = true;
            StrudelSetup(stranger_tune, setSongText);
            setGlobalVolume(volume);
            setGlobalCPM(cpm);
            setGlobalReverb(reverb);
        }
    }, []);


    useEffect((e) => {
        //console.log("Second useEffect in StrudelPlayer called");
        onHandleFontSize(); // double call wont stop padding from not updating, so this has to be here

        // add listener to print logs into console panel
        //document.getElementById("consolePanelText").addEventListener("useState", onHandleConsolePanel(e));
        
    });

    // broken
    function onHandleConsolePanel(e) {
        //document.getElementById("consolePanelText").innerText += "\n"+e+"\n";
    }

    const [ showErrText, setShowErrText ] = useState(false) // for later use

    function onHandleFontSize() {
        let padding = codeFontSize * 2;
        document.getElementById("editor").style.cssText = `a:display: block; background-color: var(--background); font-size: `+codeFontSize+`px; font-family: monospace;`;
        document.getElementById("proc").style.cssText = `resize: none; font-size: `+codeFontSize+`px;`+`padding-left:`+padding+`px;`;
    }

    // resets both LHS panel (editor and processed text)
    function handleResetCode() {
        console.log("Resetting editor")
        setSongText(stranger_tune);
        document.getElementById("proc").value=stranger_tune;
        Proc();
    }

    // will reset controls to default; not the loaded settings.
    function onHandleResetControls() {
        console.log("Resetting controls");
        setCodeFontSize(base.DEFAULT_FONT_SIZE);
        onHandleFontSize();
        setVolume(base.DEFAULT_VOLUME);
        setCPM(base.DEFAULT_CPM);
        setThemeDropdown(base.DEFAULT_THEME);
        setGlobalVolume(base.DEFAULT_VOLUME);
        setGlobalCPM(base.DEFAULT_CPM);
        setReverb(base.DEFAULT_REVERB);
        document.getElementById("checkbox_1").checked = document.getElementById("checkbox_1").defaultChecked;
        document.getElementById("checkbox_2").checked = document.getElementById("checkbox_2").defaultChecked;
    }

    // currently unused, and can be messy if used
    const onHandleGeneric = (e) => {
        //console.log("\nSTOP CALLING onHandleGeneric!!");
        return;
        let idString = e.target.id;
        // debug prints
        if (idString.startsWith("dropdown_")) {
            console.log("onHandleChangeRequest called in StrudelPlayer - " + e.target.id + " : " + document.getElementById(e.target.id).innerHTML);
        } else if (idString.startsWith("checkbox_")) {
            console.log("onHandleChangeRequest called in StrudelPlayer - " + e.target.id + " : " + e.target.checked);
        }  else {
            console.log("onHandleChangeRequest called in StrudelPlayer - " + e.target.id + " : " + e.target.value);
            if (idString.startsWith("volume")) {
                console.log("volume related change ");
            }
        }
    }

    const onHandleReverb = (e) => {
        let newReverb = parseFloat(e.target.value);
        setReverb(newReverb); // DJControls state
        setGlobalReverb(newReverb); // strudel player volume
    }

    const onHandleVolume = (e) => {
        let newVolume = parseFloat(e.target.value);

        setVolume(newVolume); // DJControls state
        setGlobalVolume(newVolume); // strudel player volume
    };

    const onHandleCPM = (e) => {
        let newCPM = parseFloat(e.target.value);
        setCPM(newCPM); // DJControls state
        setGlobalCPM(newCPM); // strudel player volume
    };

    // creates JSON-valid data to save as a JSON file
    function onHandleExportJSON() {
        console.log("Exporting JSON...")
        let exportJSON = {
            "volume": volume,
            "cpm": cpm,
            "fontSize": codeFontSize,
            "theme": themeDropdown,
            "checkbox1": document.getElementById("checkbox_1").checked,
            "checkbox2": document.getElementById("checkbox_2").checked,
            "reverb": reverb
        };

        const localeTime = new Date().toLocaleTimeString();
        let fileName = "Strudel_Settings_"+localeTime;
        const blob = new Blob([JSON.stringify(exportJSON, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
    }

    // takes an uploaded file, verifies it is valid, and outputs as dict to be read into settings
    function onHandleImportJSON(file) {
        console.log("Importing JSON...");

        if (!file) {
            alert("No file selected. Please choose a JSON file.", "error");
            return;
        }

        if (!file.type.endsWith("json")) {
            alert("Unsupported file type. Please select a JSON file.", "error");
            return;
        }

        // read the file
        const reader = new FileReader();
        reader.onload = () => {
            const readableJSON = JSON.parse(reader.result);
            onHandleLoadSettings(readableJSON);
        };
        reader.onerror = () => {
            alert("Error reading the file. Please try again.", "error");
        };
        // this *must* be here for reader.onload to work; it sets reader.result
        reader.readAsText(file);
    }

    function onHandleLoadSettings(settingsJSON) {
        console.log("onHandleLoadSettings called");
        console.log("settingsJSON:\n" + settingsJSON);

        let validKeys = validateSettingKeys(settingsJSON);
        if (!validKeys) {
            return;
        }

        let withinLimits = validateSettingLimits(settingsJSON);
        if (!withinLimits) {
            return;
        }
        
        console.log("Loaded JSON data keys are valid and the corresponding data values are within acceptable limits.");

        // load the settings
        console.log("onHandleResetControls called");
        try {
            //setCodeFontSize(settingsJSON["fontSize"]);
            onHandleFontSize();
            setVolume(settingsJSON["volume"]);
            setCPM(settingsJSON["cpm"]);
            setThemeDropdown(settingsJSON["theme"]);
            setGlobalVolume(settingsJSON["volume"]);
            setGlobalCPM(settingsJSON["cpm"]);
            setReverb(settingsJSON["reverb"]);
            if (base.DEBUG_MODE) {
                document.getElementById("checkbox_1").checked = settingsJSON["checkbox1"];
                document.getElementById("checkbox_2").checked = settingsJSON["checkbox2"];
            }
        } catch (e) {
            console.log("somehow failed the try-catch to load settings...?");
        }
    }

    // compare settings to hard coded ranges and what settings exist to see if we can load it
    function validateSettingKeys(settingsJSON) {
        let errorAlertText = "Imported file contains insufficient data to load settings.";
        console.log("validateSettingKeys called");
        // what settings we need; ignore other keys
        const neededKeysList = [ "volume", "cpm", "fontSize", "theme", "checkbox1", "checkbox2", "reverb" ];
        const missingKeys = [];

        var listOfFileKeys = [];
        for (let key in settingsJSON) {
            listOfFileKeys.push(key);
        }

        console.log("listOfFileKeys : " + listOfFileKeys);
        // ensure we have the correct keys
        for (let i in neededKeysList) {
            if ( !(listOfFileKeys.includes(neededKeysList[i])) ) {
                console.log("missing - : " + neededKeysList[i]);
                missingKeys.push(neededKeysList[i]);
            } else {
                console.log("listOfFileKeys[i] is found inside : " + listOfFileKeys[i]);
            }
        }

        let count = 1;
        if (missingKeys.length == 0){
            console.log("valid; no missing keys");
            return true;
        } else {
            for (let i in missingKeys) {
                console.log("settingsJSON is missing key : " + missingKeys[i]);
                errorAlertText += ("\n"+count+" : File is missing key '"+missingKeys[i]+"'");
                count++;
            }
            alert(errorAlertText);
            return false;
        }
    }

    // compare settings to limits
    function validateSettingLimits(settingsJSON) {
        console.log("validateSettingLimits called");
        let isValid = true; // have to be careful as it is valid by default; *never* set this to true anywhere else

        let errorAlertText = "Imported file contains invalid data.";
        let count = 0;

        // if setting is valid, isValid is true. We set isValid to false on the inverse
        if (!( settingsJSON["volume"] < base.VOLUME_MAX )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : volume ("+settingsJSON["volume"]+") > maximum ("+base.VOLUME_MAX+")"); }
        if (!( settingsJSON["volume"] > base.VOLUME_MIN )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : volume ("+settingsJSON["volume"]+") < minimum ("+base.VOLUME_MIN+")"); }
        if (!( settingsJSON["fontSize"] < base.FONT_SIZE_SLIDER_MAX )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : fontSize ("+settingsJSON["fontSize"]+") > maximum ("+base.FONT_SIZE_SLIDER_MAX+")"); }
        if (!( settingsJSON["fontSize"] > base.FONT_SIZE_SLIDER_MIN )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : fontSize ("+settingsJSON["fontSize"]+") < minimum ("+base.FONT_SIZE_SLIDER_MIN+")"); }
        if (!( ["Debug", "Light", "Dark"].includes(settingsJSON["theme"]) )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : no theme"); }
        if (!( [true, false].includes(settingsJSON["checkbox1"]) )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : no checkbox1 value"); }
        if (!( [true, false].includes(settingsJSON["checkbox2"]) )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : no checkbox2 value"); }
        if (!( settingsJSON["reverb"] < base.REVERB_MAX )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : reverb ("+settingsJSON["reverb"]+") > maximum ("+base.REVERB_MAX+")"); }
        if (!( settingsJSON["volume"] > base.REVERB_MIN )) 
            {isValid = false; count++; errorAlertText += ("\n"+count+" : reverb ("+settingsJSON["reverb"]+") < minimum ("+base.REVERB_MIN+")"); }

        if (!isValid) {
            alert(errorAlertText);
        }

        return isValid;
    }

    return (
        <div className="bg-header" data-theme={themeDropdown}>
            <h2 className="container-fluid bg-header">
                <div className="row bg-header">
                    <b className="col bg-header" style={{ maxWidth:'85%' }}>Strudel Demo</b>
                    <div className="col-auto bg-header">
                        <PlayButtons onPlay={handlePlay} onStop={handleStop} />
                        <ProcButtons onProc={handleProc} onProcPlay={handleProcPlay} onReset={handleReset} />
                    </div>
                </div>
            </h2>
            <main>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8 main" id="leftPanel">
                            {/* <StrudelPlayer 
                                    songText={songText} 
                                    strudelRef={strudelRef} 
                            /> */}
                            <div className="unprocessedTextPanel" id="editorPanel" style={{ maxHeight: '50vh', overflowY: 'auto'}}>
                                {/* e knows where it is because it knows where it isn't.
                                ... not really, i'm assuming e just has a reference to self or smth */}
                                <PreprocessTextArea songText={songText} setSongText={setSongText} />
                            </div>
                            <div className="processedCodePanel" id="codePanel" style={{ 
                                maxHeight: '35vh',
                                overflowY: 'auto',
                                }}>
                                <div className="editor" id="editor"/>
                                <div className="output" id="output" />
                            </div>
                        </div>

                        <div className="col container">
                            {/* the nav menu for right panel -- should control whats in box below on page and be highlighted when active */}
                            <div className="menuNavBar row">
                                <MenuButtons theme={themeDropdown} defaultValue={activeBtn} onClick={(e) => {
                                    setActiveBtn(e)
                                }}/>
                            </div>
                            <div className="rightPanel" id="rightPanel">
                                {/* rather than selectively loading them, menu panel will just show and hide them respectively */}
                                <div className="HelpPanel" style={{ display: (activeBtn === "helpBtn") ? 'block' : 'none' }}>
                                    < HelpPanel />
                                </div>
                                <div className="ControlPanel" id="rightPanel" style={{ display: (activeBtn === "controlBtn") ? 'block' : 'none' }}>
                                    <div className="" role="group" id="menuPanelStuff1" aria-label="Control panel">
                                        <div className="" id="menuPanel">
                                            <div className="row" role="group" id="">
                                                <button href="#" style={{ textAlign:'center', maxWidth:'25%' }} id="exportJSON" className="btn container ioBtnRow" onClick={(e) => {
                                                    onHandleExportJSON();
                                                }}>Export JSON</button>
                                                <input hidden id="fileUploadElement" value={""} onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    onHandleImportJSON(file);
                                                }} accept=".json" type="file" />
                                                <label for="fileUploadElement" className="btn container ioBtnRow" style={{ textAlign:'center', maxWidth:'25%' }} id="importJSON" >Import JSON</label>
                                                <div className="container ioBtnRow dontShow" disabled style={{ textAlign:'center', width:'5%' }} ></div>
                                                <button id="reset" className="btn container ioBtnRow" onClick={handleResetCode} style={{ textAlign:'center', maxWidth:'40%' }}>Restore Default Song</button>
                                            </div>
                                        </div>
                                    </div>

                                    <Accordion defaultActiveKey={['0']} alwaysOpen className="accordion accordion-flush">
                                        <Accordion.Item eventKey="0" className="accordion-flush">
                                            <Accordion.Header className="accordionHeader accordion-flush mt-4 mb-4">Audio Controls</Accordion.Header>
                                            <Accordion.Body className="accordionBody accordion-flush" style={{ display:'full' }}>
                                                <AudioControls 
                                                    volume={volume}
                                                    setVolume={setVolume}
                                                    cpm={cpm}
                                                    setCPM={setCPM}

                                                    onHandleGeneric={onHandleGeneric}
                                                    onHandleVolume={onHandleVolume}
                                                    onHandleCPM={onHandleCPM}
                                                    theme={themeDropdown}
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                                    <Accordion defaultActiveKey={['0']} alwaysOpen className="accordion accordion-flush">
                                        <Accordion.Item eventKey="0" className="accordion-flush">
                                            <Accordion.Header className="accordionHeader accordion-flush mt-4">DJ Controls</Accordion.Header>
                                            <Accordion.Body className="accordionBody accordion-flush" style={{ display:'full' }}>
                                                < DJControls
                                                    reverb={reverb}
                                                    setReverb={setReverb}
                                                    onHandleReverb={onHandleReverb}
                                                    onHandleGeneric={onHandleGeneric}
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    
                                    <Accordion defaultActiveKey={['0']} alwaysOpen className="accordion accordion-flush">
                                        <Accordion.Item eventKey="0" className="accordion-flush">
                                            <Accordion.Header className="accordionHeader accordion-flush mt-4">Editor Controls</Accordion.Header>
                                            <Accordion.Body className="accordionBody accordion-flush" style={{ display:'full' }}>
                                                < EditorControls
                                                    codeFontSize={codeFontSize}
                                                    setCodeFontSize={setCodeFontSize}
                                                    themeDropdown={themeDropdown}
                                                    setThemeDropdown={setThemeDropdown}

                                                    onHandleGeneric={onHandleGeneric}
                                                    onHandleFontSize={onHandleFontSize}
                                                    onHandleResetControls={onHandleResetControls}
                                                    theme={themeDropdown}
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                                    <div className="col mt-4 bg-foreground">
                                        < ResetControlsButton onHandleResetControls={onHandleResetControls} />    
                                    </div>
                                    
                                </div>
                                <div className="ConsolePanel bg-foreground" style={{ display: (activeBtn === "consoleBtn") ? 'block' : 'none' }}>
                                    < ConsolePanel />
                                </div>
                                <div className="SourcePanel bg-foreground" style={{ display: (activeBtn === "sourceBtn") ? 'block' : 'none' }}>
                                    < SourcePanel />
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                {/* this should only appear when errors detected -- relies on a conditionals state to show */}
                < ErrorTextArea errorText={errorText} setErrorText={setErrorText} />
                {/* { showErrText ? < ErrorTextArea defaultValue={showErrText} /> : null } */}
                <canvas hidden id="roll"></canvas>
            </main >
        </div >
    );
}

export default StrudelPlayer;
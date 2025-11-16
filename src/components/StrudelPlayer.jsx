import { useEffect, useRef, useState, useContext, useMemo } from "react";
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
import ConsolePanel from './menu_controls/ConsolePanel';
import AudioGraph from './AudioGraph';
import { StrudelSetupClass } from './StrudelSetup';
import base from './BaseSettings';
import { stringifyValues } from "@strudel/core";
import ResetControlsButton from "./editor_controls/ResetControlsButton";

import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';

import { StrudelContext } from "../App";
import { theme } from "@strudel/codemirror";
let defaultTune = stranger_tune;
let setupMethods;


function StrudelPlayer(context) {

    const hasRun = useRef(false);
    const [ songText, setSongText ] = useState("");
    const [ activeBtn, setActiveBtn ] = useState(base.DEFAULT_MENU);
    const [ errorText, setErrorText ] = useState("");

    // audio_controls
    // const [ volume, setVolume ] = useState(base.DEFAULT_VOLUME);
    // const [ cpm, setCPM ] = useState(base.DEFAULT_CPM);

    // // dj_controls
    // const [ reverb, setReverb ] = useState(base.DEFAULT_REVERB);

    const [ visibleEditor, setVisibleEditor ] = useState(0);

    // editor controls
    // const [ themeDropdown, setThemeDropdown] = useState(base.DEFAULT_THEME); // light is default for maximum effect
    // const [ codeFontSize, setCodeFontSize ] = useState(base.DEFAULT_FONT_SIZE);

    const { volume, setVolume, cpm, setCPM, 
        themeDropdown, setThemeDropdown, codeFontSize, 
        setCodeFontSize, reverb, setReverb, strudelData, setStrudelData } = useContext(StrudelContext);

    let strudelRef = new StrudelSetupClass(stranger_tune, setSongText, volume, cpm, reverb );

    const getSettingValues = ReturnSettingValues();

    function ReturnSettingValues() {
        return {
            volume,
            cpm,
            reverb
        }
    } 

    function handleD3Data(e) {
        let temp = e.detail;
        setStrudelData(String(temp));
    }
    
    /** on load the player needs to setup the strudel */
    useEffect((e) => {
        if (!hasRun.current) {
            
            console.log("\nLoading Strudel Player...");
            document.getElementById("consolePanelText").innerText = "";
            console.log("hasRun is false; setting up Strudel");
            hasRun.current = true;
            strudelRef.StrudelSetup(stranger_tune, setSongText, volume, cpm, reverb );
            document.addEventListener("d3Data", handleD3Data);
            strudelRef.setGlobalVolume(volume);
            strudelRef.setGlobalCPM(cpm);
            strudelRef.setGlobalReverb(reverb);
            
            
            /* instead of these, it assign this.(...) to the params in StrudelSetup
             * and use processedSettings array to prevent updating b4 process button clicked
             */
        }
    }, [hasRun.current]);
    
    /** Called upon *every* update. For only very sparing use  */
    useEffect((e) => {
        console.log("update triggered");
        //console.log("Second useEffect in StrudelPlayer called");
        onHandleFontSize(); // double call wont stop padding from not updating, so this has to be here
        console.log("strudelRef.testVolume : " + strudelRef.testVolume());
        // add listener to print logs into console panel
        //document.getElementById("consolePanelText").addEventListener("useState", onHandleConsolePanel(e));
        
    });

    const [ showErrText, setShowErrText ] = useState(false) // for later use

    

    /** forces the panels to update text according to current settings */
    function onHandleFontSize() {
        console.log("a : " + codeFontSize);
        let padding = codeFontSize * 2;
        document.getElementById("editor").style.cssText = `a:display: block; background-color: var(--background); font-size: `+codeFontSize+`px; font-family: monospace;`;
        document.getElementById("proc").style.cssText = `resize: none; font-size: `+codeFontSize+`px;`+`padding-left:`+padding+`px;`;
    }

    /** resets both LHS panel (editor and processed text) */
    function handleResetCode() {
        console.log("Resetting editor")
        setSongText(stranger_tune);
        document.getElementById("proc").value=stranger_tune;
        strudelRef.Proc();
    }

    /** will reset controls to default; not the loaded settings */
    function onHandleResetControls() {
        console.log("Resetting controls");
        setCodeFontSize(base.DEFAULT_FONT_SIZE);
        onHandleFontSize();
        setVolume(base.DEFAULT_VOLUME);
        setCPM(base.DEFAULT_CPM);
        setReverb(base.DEFAULT_REVERB);
        setThemeDropdown(base.DEFAULT_THEME);
        strudelRef.setGlobalVolume(base.DEFAULT_VOLUME);
        strudelRef.setGlobalCPM(base.DEFAULT_CPM);
        strudelRef.setGlobalReverb(base.DEFAULT_REVERB);
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
        setReverb(newReverb);
        strudelRef.setGlobalReverb(newReverb);
    }

    const onHandleVolume = (e) => {
        //let newVolume = parseFloat(e.target.value);
        //setVolume(newVolume);
        strudelRef.setGlobalVolume(volume);
    };

    const onHandleCPM = (e) => {
        let newCPM = parseFloat(e.target.value);
        setCPM(newCPM);
        strudelRef.setGlobalCPM(newCPM);
    };

    /** creates JSON-valid data to save as a JSON file */
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

    /** takes an uploaded file, verifies it is valid, and outputs as dict to be read into settings */
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

        const reader = new FileReader();
        reader.onload = () => {
            const readableJSON = JSON.parse(reader.result);
            onHandleLoadSettings(readableJSON);
        };
        reader.onerror = () => {
            alert("Error reading the file. Please try again.", "error");
        };
        // this must be *here* for reader.onload to work; it sets reader.result
        reader.readAsText(file);
    }

    /** Called upon successful file import; checks for required keys in settings config file, and that values are within bounds.  */
    function onHandleLoadSettings(settingsJSON) {
        console.log("onHandleLoadSettings called");
        //console.log("settingsJSON:\n" + settingsJSON);
        const neededKeysList = [ "volume", "cpm", "fontSize", "theme", "checkbox1", "checkbox2", "reverb" ];
        // d: data; kept short for simplicity sake
        const data = {
            volume:settingsJSON["volume"], cpm:settingsJSON["cpm"], fontSize:settingsJSON["fontSize"], 
            theme:settingsJSON["theme"], checkbox1:settingsJSON["checkbox1"], checkbox2:settingsJSON["checkbox2"], 
            reverb:settingsJSON["reverb"] };
        if (data.size !== neededKeysList.size) { console.log("Missmatch in neededKeysList:data comparison!"); }

        let validKeys = validateSettingKeys(settingsJSON, neededKeysList);
        if (!validKeys) { return; }

        let withinLimits = validateSettingLimits(settingsJSON, data);
        if (!withinLimits) { return; }
        
        console.log("Loaded JSON data keys are valid and the corresponding data values are within acceptable limits.");

        try {
            //setCodeFontSize(settingsJSON["fontSize"]);
            onHandleFontSize();
            setVolume(settingsJSON["volume"]);
            setCPM(settingsJSON["cpm"]);
            setThemeDropdown(settingsJSON["theme"]);
            strudelRef.setGlobalVolume(settingsJSON["volume"]);
            strudelRef.setGlobalCPM(settingsJSON["cpm"]);
            setReverb(settingsJSON["reverb"]);
            strudelRef.setGlobalReverb(settingsJSON["cpm"]);
            if (base.DEBUG_MODE) {
                document.getElementById("checkbox_1").checked = settingsJSON["checkbox1"];
                document.getElementById("checkbox_2").checked = settingsJSON["checkbox2"];
            }
        } catch (e) {
            console.log("Somehow failed the try-catch to load settings...?");
        }
    }

    /** Validate that each setting key has a value within limits defined in BaseSettings.jsx */
    function validateSettingKeys(settingsJSON, neededKeysList) {
        var alertText = "Imported file contains insufficient data to load settings.";
        console.log("Verifying that file contains required keys...");
        // what settings we need; ignore other keys
        var missingKeys = [];

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

        var count = 1;
        if (missingKeys.length == 0){
            return true;
        } else {
            for (let i in missingKeys) {
                console.log("settingsJSON is missing key : " + missingKeys[i]);
                alertText += ("\n"+count+" : File is missing key '"+missingKeys[i]+"'");
                count++;
            }
            alert(alertText);
            return false;
        }
    }

    /** Verify that values for each key (setting) are within bounds */
    function validateSettingLimits(data) {
        console.log("Verifying key-values are within bounds...");
        let alertText = "Imported file contains invalid data.";
        let i = 0;
        if (!( data.volume < base.VOLUME_MAX ))            {i++;alertText+=("\n"+i+" : volume ("+data.volume+") > max ("+base.VOLUME_MAX+")"); }
        if (!( data.volume > base.VOLUME_MIN ))            {i++;alertText+=("\n"+i+" : volume ("+data.volume+") < min ("+base.VOLUME_MIN+")"); }
        if (!( data.fontSize < base.FONT_SIZE_SLIDER_MAX )){i++;alertText+=("\n"+i+" : fontSize ("+data.fontSize+") > max ("+base.FONT_SIZE_SLIDER_MAX+")"); }
        if (!( data.fontSize > base.FONT_SIZE_SLIDER_MIN )){i++;alertText+=("\n"+i+" : fontSize ("+data.fontSize+") < min ("+base.FONT_SIZE_SLIDER_MIN+")"); }
        if (!( base.THEMES_LIST.includes(data.theme) ))    {i++;alertText+=("\n"+i+" : no theme"); }
        if (!( [true, false].includes(data.checkbox1) ))   {i++;alertText+=("\n"+i+" : no checkbox1 value"); }
        if (!( [true, false].includes(data.checkbox2) ))   {i++;alertText+=("\n"+i+" : no checkbox2 value"); }
        if (!( data.reverb < base.REVERB_MAX ))            {i++;alertText+=("\n"+i+" : reverb ("+data.reverb+") > max ("+base.REVERB_MAX+")"); }
        if (!( data.reverb >= base.REVERB_MIN ))           {i++;alertText+=("\n"+i+" : reverb ("+data.reverb+") < min ("+base.REVERB_MIN+")"); }
        if (i != 0) { alert(alertText); }
        return (i != 0 ? false : true);
    }

    // THIS IS COPY AND PASTED FOR REFERENCE SAKE;
    /* needs to properly register closes
     * needs to properly alert ONCE
     * probably gonna be using custom events/button triggers, this is just for testing
    */
    // const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    // const appendAlert = (message, type) => {
    //     const wrapper = document.createElement('div');
    //     wrapper.innerHTML = [
    //         `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    //         `   <div>${message}</div>`,
    //         '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    //         '</div>'
    //     ].join('');

    //     alertPlaceholder.append(wrapper);
    // }

    // const alertTrigger = document.getElementById('liveAlertBtn');
    // if (alertTrigger) {
    //     alertTrigger.addEventListener('click', () => {
    //         appendAlert('Nice, you triggered this alert message!', 'success');
    //     })
    // }
    // if (alertTrigger) {
    //     alertTrigger.addEventListener('btn-close', () => {
    //         console.log("close!!");
    //         appendAlert('Nice, you triggered this alert message!', 'success');
    //     })
    // }


    return (
        <main data-theme={themeDropdown}>
            {/* header bar; has app title + play buttons */}
            <div className="bg-header-bar">
                <div className="h2 b">Strudel Demo</div>
                <div className="playButtons">
                    <PlayButtons onPlay={strudelRef.handlePlay} onStop={strudelRef.handleStop} />
                    <ProcButtons onProc={strudelRef.handleProc} onProcPlay={strudelRef.handleProcPlay} onReset={strudelRef.handleReset} />
                </div>
            </div>
            {/* all content below header bar */}
            <div className="content-body"> 
                <div className="body-left">
                    
                    <div className="menuNavBar row">
                        <div className="menuBtns btn-group col" role="group" id="editorViewBtn" aria-label="Menu buttons">
                            <button className="btn btn-unselected menuBtn" onClick={(e) => {
                                setVisibleEditor((visibleEditor === 1) ? 0 : 1); }}>{(visibleEditor == 0) ? "Preprocessed Code" : "Processed Code"}
                            </button>
                        </div>
                    </div>

                    <div className="" id="leftTopPanel">
                            <div id="liveAlertPlaceholder"></div>

                            <div className="unprocessedTextPanel" id="codePanel" 
                            style={{ display: (visibleEditor === 0) ? 'block' : 'none'}}>
                                {/* TODO: should i keep both? both allows user to play last processed song whilst still editing it
                                it does also mention preprocessing code in the  specs; I think i'll just leave it as is for now
                                functionality with both is kinda wack, edits in proctext box are ignored
                                */}
                                <PreprocessTextArea songText={songText} setSongText={setSongText} />
                            </div>
                            <div className="processedCodePanel" id="codePanel"
                            style={{ display: (visibleEditor === 1 ) ? 'block' : 'none' }}>
                                <div className="editor" id="editor"/>
                                
                            </div>
                        </div>
                    
                    <div className="menuJustTextBox" id="leftBottomPanel">
                        <canvas hidden id="roll"></canvas>
                        <AudioGraph strudelData={strudelData} />
                    </div>
                </div>

                <div className="body-right">
                    <div className="menuNavBar row">
                        <MenuButtons theme={themeDropdown} defaultValue={activeBtn} onClick={(e) => {
                            setActiveBtn(e)
                        }}/>
                    </div>

                    <div className="">
                            <div className="rightPanel" id="rightPanel">
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
                                                    onHandleResetControls={onHandleResetControls}
                                                    onHandleFontSize={onHandleFontSize}
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
                            </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="container-fluid">
                    <div className="row">
                    </div>
                </div>
                {/* this should only appear when errors detected -- relies on a conditionals state to show */}
                
                
                < ErrorTextArea errorText={errorText} setErrorText={setErrorText} />
                {/* { showErrText ? < ErrorTextArea defaultValue={showErrText} /> : null } */}
                
            </div >
            
        </main >
    );
}

export default StrudelPlayer;
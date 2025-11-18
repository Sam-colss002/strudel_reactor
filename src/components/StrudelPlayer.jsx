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

/* need to stop edits to processed code not working
 *
 */

function StrudelPlayer() {

    const hasRun = useRef(false);
    const [ songText, setSongText ] = useState("");
    const [ activeBtn, setActiveBtn ] = useState(base.default_menu);
    const [ errorText, setErrorText ] = useState("");

    const [ visibleEditor, setVisibleEditor ] = useState(0);

    const { volume, setVolume, cpm, setCPM, speed, setSpeed,
        themeDropdown, setThemeDropdown, codeFontSize, 
        setCodeFontSize, reverb, setReverb, strudelData, setStrudelData, isModified, setIsModified, isPlaying, setIsPlaying } = useContext(StrudelContext);

    let strudelRef = new StrudelSetupClass(stranger_tune, setSongText, volume, cpm, reverb, speed, false );
    
    /** on load the player needs to setup the strudel */
    useEffect((e) => {
        if (!hasRun.current) {
            console.log("\nLoading Strudel Player...");
            
            console.log("hasRun is false; setting up Strudel");
            hasRun.current = true;
            document.addEventListener("logEvent", handleLogEvent);
            document.dispatchEvent(new CustomEvent("logEvent", { detail: "Loading Strudel Player..." }));
            strudelRef.StrudelSetup(stranger_tune, setSongText, volume, cpm, reverb, speed, isModified);
        }
    }, [hasRun.current]);
    
    /** Called upon *every* update. For only very sparing use  */
    useEffect(() => {
        if (base.debug_mode) {
            console.log("update triggered : ");
            strudelRef.printProcAndNonProc();
            console.log("getIsModified : " + strudelRef.getIsModified());
        }
        setIsModified(strudelRef.getIsModified());
        onHandleFontSize(); // double call wont stop padding from not updating, so this has to be here
    });

    /** forces the panels to update text according to current settings */
    function onHandleFontSize() {
        if (base.debug_mode) { console.log("onHandleSpeed called"); }
        let padding = codeFontSize * 2;
        document.getElementById("editor").style.cssText = `a:display: block; background-color: var(--background); font-size: `+codeFontSize+`px; font-family: monospace;`;
        document.getElementById("proc").style.cssText = `resize: none; font-size: `+codeFontSize+`px;`+`padding-left:`+padding+`px;`;
    }

    function handleLogEvent(e) {
        console.log("handleLogEvent called");
        let mainDiv = document.getElementById("consolePanelText");
        let p = document.createElement("p");
        let span = document.createElement("span");
        let br = document.createElement("br");
        let children = mainDiv.childNodes;
        let count = Math.floor(children.length/3);
        p.innerText = e.detail;
        span.innerText = count+1;
        //p.innerText += count+(count > 9 ? (count > 99 ? ".." : "....") : ".......")+e.detail;
        mainDiv.appendChild(br);
        mainDiv.appendChild(span);
        mainDiv.appendChild(p);
        if (count > base.max_logs) {
            mainDiv.removeChild(children[2]);
        }
    }

    /** resets both LHS panel (editor and processed text) */
    function handleResetCode() {
        console.log("Resetting editor")
        document.dispatchEvent(new CustomEvent("logEvent", { detail: "Resetting editor" }));
        setSongText(stranger_tune);
        document.getElementById("proc").value=stranger_tune;
        strudelRef.Proc();
    }

    /** will reset controls to default; not the loaded settings */
    function onHandleResetControls() {
        console.log("Resetting controls");
        document.dispatchEvent(new CustomEvent("logEvent", { detail: "Resetting controls" }));
        mapDataToSettings(base);
    }

    const onHandleSongEdit = () => {
        if (base.debug_mode) { console.log("onHandleSongEdit called"); }
        markAsModified();
    }

    function markAsModified() {
        setIsModified(true);
        strudelRef.setIsModified(true);
    }

    const onHandleSpeed = () => {
        if (base.debug_mode) { console.log("onHandleSpeed called"); }
        markAsModified();
        strudelRef.speed = speed;
    }

    const onHandleReverb = () => {
        if (base.debug_mode) { console.log("onHandleReverb called"); }
        markAsModified();
        strudelRef.reverb = reverb;
    }

    const onHandleVolume = () => {
        if (base.debug_mode) { console.log("onHandleVolume called"); }
        markAsModified();
        strudelRef.volume = volume;
    };

    const onHandleCPM = () => {
        if (base.debug_mode) { console.log("onHandleCPM called"); }
        markAsModified();
        strudelRef.cpm = cpm;
    };

    /** creates JSON-valid data to save as a JSON file */
    function onHandleExportJSON() {
        console.log("Exporting JSON...")
        document.dispatchEvent(new CustomEvent("logEvent", { detail: "Exporting JSON..." }));
        let exportJSON = {
            "volume": volume,
            "cpm": cpm,
            "codeFontSize": codeFontSize,
            "themeDropdown": themeDropdown,
            "checkbox1": document.getElementById("checkbox_1").checked,
            "checkbox2": document.getElementById("checkbox_2").checked,
            "reverb": reverb,
            "speed": speed
        };

        let fileName = "Strudel_Settings_"+(new Date().toLocaleTimeString());
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
            document.dispatchEvent(new CustomEvent("logEvent", { detail: "No file selected. Please choose a JSON file." }));
            return;
        }

        if (!file.type.endsWith("json")) {
            alert("Unsupported file type. Please select a JSON file.", "error");
            document.dispatchEvent(new CustomEvent("logEvent", { detail: "Unsupported file type. Please select a JSON file." }));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const readableJSON = JSON.parse(reader.result);
            onHandleLoadSettings(readableJSON);
        };
        reader.onerror = () => {
            document.dispatchEvent(new CustomEvent("logEvent", { detail: "Error reading the file. Please try again." }));
            alert("Error reading the file. Please try again.", "error");
        };
        // this must be *here* for reader.onload to work; it sets reader.result
        reader.readAsText(file);
    }

    /** Called whenever mass setting changes are required (e.g., on import, reset)  */
    function mapDataToSettings(data) {
        console.log("mapDataToSettings called");
        if (!data) {
            console.log("mapDataToSettings received an invalid data object!");
            return;
        }
        onHandleFontSize();
        setCodeFontSize(data.codeFontSize);
        setVolume(data.volume);
        setCPM(data.cpm);
        setThemeDropdown(data.themeDropdown);
        setSpeed(data.speed);
        setReverb(data.reverb);
        strudelRef.volume = data.volume;
        strudelRef.cpm = data.cpm;
        strudelRef.reverb = data.reverb;
        strudelRef.speed = data.speed;
        if (base.debug_mode) {
            document.getElementById("checkbox_1").checked = data.checkbox1;
            document.getElementById("checkbox_2").checked = data.checkbox2;
        }
        markAsModified();
    }

    /** Called upon successful file import; checks for required keys in settings config file, and that values are within bounds.  */
    function onHandleLoadSettings(settingsJSON) {
        console.log("onHandleLoadSettings called");
        //console.log("settingsJSON:\n" + settingsJSON);
        const neededKeysList = [ "volume", "cpm", "codeFontSize", "themeDropdown", "checkbox1", "checkbox2", "reverb" , "speed" ];
        const data = {
            volume:settingsJSON["volume"], cpm:settingsJSON["cpm"], codeFontSize:settingsJSON["codeFontSize"], 
            themeDropdown:settingsJSON["themeDropdown"], checkbox1:settingsJSON["checkbox1"], checkbox2:settingsJSON["checkbox2"], 
            reverb:settingsJSON["reverb"], speed:settingsJSON["speed"] };
        if (data.size !== neededKeysList.size) { console.log("Missmatch in neededKeysList:data comparison!"); }

        let validKeys = validateSettingKeys(settingsJSON, neededKeysList);
        if (!validKeys) { return; }

        let withinLimits = validateSettingLimits(settingsJSON, data);
        if (!withinLimits) { return; }
        
        console.log("Loaded JSON data keys are valid and the corresponding data values are within acceptable limits.");

        try {
            document.dispatchEvent(new CustomEvent("logEvent", { detail: "Loaded JSON data keys are valid and the corresponding data values are within acceptable limits. Loading data..." }));
            mapDataToSettings(data);
            
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
            document.dispatchEvent(new CustomEvent("logEvent", { detail: alertText }));
            return false;
        }
    }

    /** Verify that values for each key (setting) are within bounds */
    function validateSettingLimits(data) {
        console.log("Verifying key-values are within bounds...");
        let alertText = "Imported file contains invalid data.";
        let i = 0;
        if (!( data.volume < base.volume_max ))                {i++;alertText+=("\n"+i+" : volume ("+data.volume+") > max ("+base.volume_max+")"); }
        if (!( data.volume > base.volume_min ))                {i++;alertText+=("\n"+i+" : volume ("+data.volume+") < min ("+base.volume_min+")"); }
        if (!( data.speed < Math.max(...base.speeds) ))        {i++;alertText+=("\n"+i+" : speed ("+data.speed+") > max ("+Math.max(...base.speeds)+")"); }
        if (!( data.speed > Math.min(...base.speeds) ))        {i++;alertText+=("\n"+i+" : speed ("+data.speed+") < min ("+Math.min(...base.speeds)+")"); }
        if (!( data.codeFontSize < base.font_size_slider_max )){i++;alertText+=("\n"+i+" : codeFontSize ("+data.codeFontSize+") > max ("+base.font_size_slider_max+")"); }
        if (!( data.codeFontSize > base.font_size_slider_min )){i++;alertText+=("\n"+i+" : codeFontSize ("+data.codeFontSize+") < min ("+base.font_size_slider_min+")"); }
        if (!( base.themes_list.includes(data.themeDropdown) )){i++;alertText+=("\n"+i+" : no theme"); }
        if (!( [true, false].includes(data.checkbox1) ))       {i++;alertText+=("\n"+i+" : no checkbox1 value"); }
        if (!( [true, false].includes(data.checkbox2) ))       {i++;alertText+=("\n"+i+" : no checkbox2 value"); }
        if (!( data.reverb < base.reverb_max ))                {i++;alertText+=("\n"+i+" : reverb ("+data.reverb+") > max ("+base.reverb_max+")"); }
        if (!( data.reverb >= base.reverb_min ))               {i++;alertText+=("\n"+i+" : reverb ("+data.reverb+") < min ("+base.reverb_min+")"); }
        if (i != 0) { alert(alertText); }
        return (i != 0 ? false : true);
    }

    // expanded upon as I need to remove badge on click
    function handleModifyBadge() {
        setIsModified(strudelRef.getIsModified());
    }


    return (
        <main data-theme={themeDropdown}>
            {/* header bar; has app title + play buttons */}
            <div className="bg-header-bar">
                <div className="h2 b">Strudel Demo</div>
                <div className="playButtons">
                    <PlayButtons onPlay={strudelRef.handlePlay} onStop={strudelRef.handleStop} />
                    <ProcButtons onProc={strudelRef.handleProc} handleModifyBadge={handleModifyBadge} onProcPlay={strudelRef.handleProcPlay} onReset={strudelRef.handleReset} />
                </div>
            </div>
            {/* all content below header bar */}
            <div className="content-body"> 
                <div className="body-left">
                    
                    <div className="menuNavBar row">
                        <div className="menuBtns btn-group col" role="group" id="editorViewBtnBar" aria-label="Menu buttons">
                            <span className="btn headerLabel" id="editorViewLabel">Viewing</span>
                            <button className="btn btn-unselected menuBtn " id="editorViewBtn" onClick={(e) => {
                                setVisibleEditor((visibleEditor === 1) ? 0 : 1); }}>{(visibleEditor == 0) ? "Preprocessed Code" : "Processed Code"}
                            </button>
                        </div>
                        <div className="headerLabel col">

                        </div>
                    </div>

                    <div className="" id="leftTopPanel">
                            <div id="liveAlertPlaceholder"></div>

                            <div className="unprocessedTextPanel" id="codePanel" 
                            style={{ display: (visibleEditor === 0) ? 'block' : 'none'}}>
                                <PreprocessTextArea songText={songText} setSongText={setSongText} onHandleSongEdit={onHandleSongEdit} />
                            </div>
                            <div className="processedCodePanel" id="codePanel"
                            style={{ display: (visibleEditor === 1 ) ? 'block' : 'none'}}>
                                <div className="editor" id="editor"/>
                                
                            </div>
                        </div>
                    
                    <div className="menuJustTextBox" id="leftBottomPanel">
                        <canvas hidden id="roll"></canvas>
                        <AudioGraph context={StrudelContext} />
                    </div>
                </div>

                <div className="body-right">
                    <div className="menuNavBar row">
                        <MenuButtons theme={themeDropdown} defaultValue={activeBtn} isModified={isModified} onClick={(e) => {
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
                                                <label htmlFor="fileUploadElement" className="btn container ioBtnRow" style={{ textAlign:'center', maxWidth:'25%' }} id="importJSON" >Import JSON</label>
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
                                                    speed={speed}
                                                    setSpeed={setSpeed}
                                                    onHandleVolume={onHandleVolume}
                                                    onHandleCPM={onHandleCPM}
                                                    onHandleSpeed={onHandleSpeed}
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
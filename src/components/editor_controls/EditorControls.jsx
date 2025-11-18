import { useState } from "react";
import ThemeDropdown from "./ThemeDropdown";
import CodeFontSizeSlider from "./CodeFontSizeSlider";
import base from '../BaseSettings';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


export function EditorControls({ codeFontSize, setCodeFontSize, themeDropdown, setThemeDropdown, onHandleFontSize, onHandleGeneric }) {
    return (
        <>
            <div className="dj-controls bg-foreground" onChange={onHandleGeneric} >
                <br/>
                {/* <div className="mb-4 h6 bg-foreground">DJ Controls</div> */}

                <div className="row mb-0">
                    <div className="col bg-foreground">
                        <ThemeDropdown themeDropdown={themeDropdown} setThemeDropdown={setThemeDropdown} />
                    </div>
                    <div className="col bg-foreground">
                        <CodeFontSizeSlider codeFontSize={codeFontSize} setCodeFontSize={setCodeFontSize} onHandleFontSize={onHandleFontSize} />
                    </div>
                </div>

                <div className="row mb-0 bg-foreground">
                        {/* TODO: this does nothing! */}
                    <div className="col bg-foreground" style={{ display: (base.debug_mode === true) ? 'block' : 'none' }} >
                        <input className="form-check-input" type="checkBox" name="aa" defaultChecked={base.checkbox1} id="checkbox_1" onChange={onHandleGeneric} /> {/*onChange={ProcAndPlay} */}
                        <label className="form-check-label bg-foreground" htmlFor="checkbox_1">
                            check1: a {/* p1 ON */}
                        </label>
                    </div>
                    <div className="col bg-foreground" style={{ display: (base.debug_mode === true) ? 'block' : 'none' }}>
                        <input className="form-check-input" type="checkBox" name="bb" defaultChecked={base.checkbox2} id="checkbox_2" onChange={onHandleGeneric} /> {/*onChange={ProcAndPlay} */}
                        <label className="form-check-label bg-foreground" htmlFor="checkbox_2">
                            check2: a {/* p1 HUSH */}
                        </label>
                    </div>
                </div>
            
            </div> {/* on update */}
            
            
        </>
    )
};

export default EditorControls;
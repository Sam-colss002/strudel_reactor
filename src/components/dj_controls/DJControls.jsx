import { useState } from "react";
import ThemDropdown from "./ThemeDropdown";
import base from '../BaseSettings';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import CodeFontSizeSlider from "./CodeFontSizeSlider";

export function DJControls({ codeFontSize, setCodeFontSize, themeDropdown, setThemeDropdown, onHandleGeneric, onHandleTheme, onHandleFontSize, theme }) {
    return (
        <>
            <div className="dj-controls bg-foreground" onChange={onHandleGeneric} data-theme={theme}>
                <br/>
                {/* <div className="mb-4 h6 bg-foreground">DJ Controls</div> */}

                <div className="row mb-2">
                    <div className="col bg-foreground">
                        <ThemDropdown themeDropdown={themeDropdown} setThemeDropdown={setThemeDropdown} onHandleGeneric={onHandleGeneric} onHandleTheme={onHandleTheme}/>
                    </div>
                    <div className="col bg-foreground">
                        <CodeFontSizeSlider codeFontSize={codeFontSize} setCodeFontSize={setCodeFontSize} onHandleGeneric={onHandleGeneric} onHandleFontSize={onHandleFontSize} />
                    </div>
                </div>

                
                <div className="row mb-2 bg-foreground">
                        {/* TODO: this does nothing! */}
                    <div className="col bg-foreground">
                        <input className="form-check-input" type="checkBox" name="aa" defaultChecked={base.CHECKBOX_1} id="checkbox_1" onChange={onHandleGeneric} /> {/*onChange={ProcAndPlay} */}
                        <label className="form-check-label bg-foreground" htmlFor="checkbox_1">
                            check1: a {/* p1 ON */}
                        </label>
                    </div>
                    <div className="col bg-foreground">
                        <input className="form-check-input" type="checkBox" name="bb" defaultChecked={base.CHECKBOX_2} id="checkbox_2" onChange={onHandleGeneric} /> {/*onChange={ProcAndPlay} */}
                        <label className="form-check-label bg-foreground" htmlFor="checkbox_2">
                            check2: a {/* p1 HUSH */}
                        </label>
                    </div>
                </div>
                
                <br/>
                <br/>
                <br/>
            
            </div> {/* on update */}
            
            
        </>
    )
};

export default DJControls;
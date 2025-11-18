
function HelpPanel({  }) {
    let link = "https://github.com/Sam-colss002/strudel_reactor";
    
    return (
        <>
            <div className="" role="group" id="rightPanel" aria-label="Help panel">
                <div className="mt-5 menuJustTextBox">
                    <h5>Strudel Demo</h5>

                    <h6>Features</h6>
                    <ul>
                    <li>Menu panel <i>accordions</i>, <br/></li>
                    <li><i>dropdowns</i> for various settings, <br/></li>
                    <li><i>sliders</i> for volume and reverb, <br/></li>
                    <li><i>nav bars</i> for menu navigation, <br/></li>
                    <li>a <i>graph</i> for displaying the playing song's gain, <br/></li>
                    <li>quality of life features such as light/dark mode and font size, <br/></li>
                    <li><i>volume</i> control, <br/></li>
                    <li><i>reverb, cpm, speed</i> controls, <br/></li>
                    <li><i>badges</i> to keep user aware of changes made,<br/></li>
                    <li>and the ability to <i>load and import JSON</i> settings.</li>
                    </ul>
                    
                    <h6>Quirks & Usage Guidelines</h6>
                    <b>Editor View</b>
                    <p>Switch between editor view (between processed & unprocessed) with the button to the right of "Viewing", 
                        below the header in the top right. To <i>edit the song</i>, please use the unprocessed code box. 
                        This allows you to run the previously-processed code whilst making a new song.</p>

                    <b>The Graph</b>
                    <p>The graph measures <i>combined gain</i>; that is, a combination of `gain`, `postgain` and 
                        the variable affected by <i>volume</i> and applied afterwards to allow for both gain 
                        and postgain to be used by the user, `dry`. The graph will increase its maximum Y value to accomdate rising data.</p>

                    <h5>Controls</h5>
                    <h6>Audio Controls</h6>
                    <b>Volume</b>
                    <p>Affects the final volume of each instrument; applied after both "gain" and "postgain".</p>

                    <b>CPM</b>
                    <p>Controls the cycles per minute. As per standard, it is divided by four.</p>

                    <b>Speed</b>
                    <p>Multiplier on the play speed of the song.</p>

                    <h6>Audio Controls</h6>
                    <b>Reverb</b>
                    <p>Applies a reverb affect to the song. Be careful, as this can be very loud.</p>

                    <h6>Editor Controls</h6>
                    <b>Theme</b>
                    <p>Switch between UI themes for usability.</p>

                    <b>FontSize</b>
                    <p>Controls the editor (both processed and unprocessed)'s text size.</p>

                    <h5>Other</h5><br/>
                    <b>Restore Default Settings</b>
                    <p>Restores settings to *base* settings.</p>

                    <b>Restore Defauilt Song</b>
                    <p>Restores the editor(s) to initial load state -- i.e., the example starting song.</p>

                    <h6>Github</h6>
                    <p>The Github Repository for this project, including an extended description 
                        of the application and its various features can be found <a href={link}>here</a>.
                    </p>
                    <br/>
                </div>
            </div>
        </>
    )
}

export default HelpPanel;
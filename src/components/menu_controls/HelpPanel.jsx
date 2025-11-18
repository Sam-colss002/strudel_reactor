
function HelpPanel({  }) {
    let link = "https://github.com/Sam-colss002/strudel_reactor";
    
    return (
        <>
            <div className="" role="group" id="rightPanel" aria-label="Help panel">
                <div className="mt-5 menuJustTextBox">
                    <h5>Strudel Demo</h5>

                    <h6>Features</h6>
                    <p>Menu panel *accordions*, *dropdowns* for various settings, *sliders* for volume and reverb, *nav bars* for menu navigation, 
                        a *graph* for displaying the playing song's gain, quality of life features such as light/dark mode and font size, *volume* control, 
                        *reverb, cpm, speed* controls, *badges* to keep user aware of changes made, and the ability to *load and import JSON* settings.</p>
                    
                    <h6>Quirks & Usage Guidelines</h6>
                    <b>Editor View</b>
                    <p>Switch between editor view (between processed & unprocessed) with the button to the right of "Viewing", 
                        below the header in the top right. To *edit the song*, please use the unprocessed code box. 
                        This allows you to run the previously-processed code whilst making a new song.</p>

                    <b>The Graph</b>
                    <p>The graph measures *combined gain*; that is, a combination of `gain`, `postgain` and 
                        the variable affected by *volume* and applied afterwards to allow for both gain 
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

                    <h5>Other</h5>
                    <b>Restore Default Settings</b>
                    <p>Restores settings to *base* settings.</p>

                    <b>Restore Defauilt Song</b>
                    <p>Restores the editor(s) to initial load state -- i.e., the example starting song.</p>

                    <h6>Github</h6>
                    <p>The Github Repository for this project, including an extended description 
                        of the application and its various features can be found <a href={link}>here</a>.
                    </p>
                </div>
            </div>
        </>
    )
}

export default HelpPanel;
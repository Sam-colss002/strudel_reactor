
function HelpPanel({  }) {
    let link = "https://github.com/Sam-colss002/strudel_reactor";
    
    return (
        <>
            <div className="" role="group" id="rightPanel" aria-label="Help panel">
                <div className="mt-5 menuJustTextBox">
                    <h5>Strudel Demo</h5>
                    <p>a</p>
                    <p>b</p>
                    <p>c</p>

                    <b>Steps</b>
                    <ol>
                        <li>step</li>
                        <li>step</li>
                        <li>step</li>
                    </ol>
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
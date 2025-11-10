
function ProcButtons( { onProc, onProcPlay } ) {
    return (
        <>
            <div className="btn-group " role="group" aria-label="Process buttons">
                
                <button id="process" className="btn btn-group headerButtons" onClick={onProc}>Process</button>
                <button id="process_play" className="btn btn-group headerButtons" onClick={onProcPlay}>Proc & Play</button>
            </div>
        </>
    )
}

export default ProcButtons;
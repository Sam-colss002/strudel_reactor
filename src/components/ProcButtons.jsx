
function ProcButtons( { onProc, onProcPlay, handleModifyBadge } ) {
    return (
        <>
            <div className="btn-group " role="group" aria-label="Process buttons">
                
                <button id="process" className="btn btn-group headerButtons" onClick={(e) => {
                    onProc();
                    handleModifyBadge();
                }}>Process</button>
                <button id="process_play" className="btn btn-group headerButtons" onClick={(e) => {
                    onProcPlay();
                    handleModifyBadge();
                }}>Proc & Play</button>
            </div>
        </>
    )
}

export default ProcButtons;
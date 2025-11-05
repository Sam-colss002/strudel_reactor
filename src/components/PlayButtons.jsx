

function PlayButtons({ onPlay, onStop}) {
    
    return (
        <>
            <div className="btn-group" role="group" aria-label="Basic buttons">
                <button id="play" className="btn btn-group headerButtons" onClick={onPlay}>Play</button>
                <button id="stop" className="btn btn-group headerButtons" onClick={onStop}>Stop</button>
            </div>
        </>
    )
}

export default PlayButtons;
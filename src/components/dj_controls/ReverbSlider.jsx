import base from '../BaseSettings';

let reverbDisplay = "0.0";

function ReverbSlider({ reverb, setReverb, onHandleReverb }) {
    return (
        <div className="input-group">
            <span className="input-group-text menu_label_subject" id="reverb_label">Reverb</span>
            <input type="range" className="col-lg menu_label_value slider" min={base.REVERB_MIN} max={base.REVERB_MAX} 
            value={reverb} defaultValue={base.DEFAULT_REVERB} id="reverb_range" step={base.REVERB_SLIDER_STEP} onChange={(e) => {
                setReverb(e.target.value);
                reverbDisplay = e.target.value;
                if (e.target.value.length == 1) {
                    reverbDisplay = `${e.target.value}.${0}`;
                };
                onHandleReverb(e);
            }}/>
            <span className="input-group-text menu_label_subject_minor" id="reverb_label">{reverbDisplay}</span>
        </div>
    )
}

export default ReverbSlider;
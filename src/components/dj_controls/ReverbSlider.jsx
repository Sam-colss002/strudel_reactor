import base from '../BaseSettings';

function ReverbSlider({ reverb, setReverb, onHandleReverb }) {
    return (
        <div className="input-group">
            <span className="input-group-text menu_label_subject" id="reverb_label">Reverb</span>
            <input type="range" className="col-lg menu_label_value slider" min={base.REVERB_MIN} max={base.REVERB_MAX} 
            value={reverb} defaultValue={base.DEFAULT_REVERB} id="reverb_range" step={base.REVERB_SLIDER_STEP} onChange={(e) => {
                setReverb(e.target.value);
                onHandleReverb(e);
            }}/>
            <span className="input-group-text menu_label_subject_minor" id="reverb_label">{reverb}</span>
        </div>
    )
}

export default ReverbSlider;
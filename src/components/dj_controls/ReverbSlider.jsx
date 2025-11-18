import base from '../BaseSettings';

function ReverbSlider({ reverb, setReverb, onHandleReverb }) {
    return (
        <div className="input-group">
            <span className="input-group-text menu_label_subject" id="reverb_label">Reverb</span>
            <input type="range" className="col-lg menu_label_value_full slider" min={base.reverb_min} max={base.reverb_max} 
            value={reverb} id="reverb_range" step={base.reverb_slider_step} onChange={(e) => {
                setReverb(e.target.value);
                onHandleReverb();
            }}/>
            <span className="input-group-text menu_label_subject_minor" id="reverb_label">{((reverb.toLocaleString().length > 1) ?  `${reverb}` : `${reverb}.${0}` )}</span>
        </div>
    )
}

export default ReverbSlider;
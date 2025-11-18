import base from '../BaseSettings';

function VolumeSlider({ volume, setVolume, onHandleVolume }) {
    return (
        <div className="input-group">
            <span className="input-group-text menu_label_subject" id="volume_label">Volume</span>
            <input type="range" className="col-lg menu_label_value_full slider" min={base.volume_min} max={base.volume_max} 
            value={volume} id="volume_range" step={base.volume_slider_step} onChange={(e) => {
                setVolume(e.target.value);
                onHandleVolume();
            }}/>
            <span className="input-group-text menu_label_subject_minor" id="volume_label">{(volume*100).toFixed(0)}%</span>
        </div>
    )
}

export default VolumeSlider;
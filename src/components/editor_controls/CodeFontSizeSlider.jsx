import base from '../BaseSettings';

function CodeFontSizeSlider({ codeFontSize, setCodeFontSize, onHandleFontSize }) {
    return (
        <div className="input-group mb-1">
            <span className="input-group-text menu_label_subject" id="font_label">Font</span>
            <input type="range" className="col-lg menu_label_value_half slider" 
            min={base.font_size_slider_min} max={base.font_size_slider_max} value={codeFontSize} 
            step={base.font_size_slider_step}
            id="font_size_range" onDragEnd={onHandleFontSize} onChange={(e) => {
                setCodeFontSize(e.target.value);
                onHandleFontSize();
            }}/>
            <span className="input-group-text menu_label_subject_minor" id="font_label">{codeFontSize}px</span>
        </div>
    )
}

export default CodeFontSizeSlider;
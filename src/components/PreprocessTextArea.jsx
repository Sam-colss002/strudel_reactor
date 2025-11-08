
function PreprocessTextArea({ songText, setSongText }) {
    return (
        <>
        
            <code>
                <textarea className="form-control editor" rows="15" value={songText} onChange={(e) => {
                //console.log("textarea detected a change");
                setSongText(e.target.value);
            }} id="proc">
            </textarea>
            </code>
        </>
    )
}

export default PreprocessTextArea;
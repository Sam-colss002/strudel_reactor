import base from '../BaseSettings';

function ThemeDropdown ({ themeDropdown, setThemeDropdown}) {
    const themesList = [ "Debug", "Light", "Dark" ];

    return (
        <>
            <div className="btn-group input-group flex-auto">
                    <span className="input-group-text menu_label_subject" aria-expanded="false">Theme</span>
                    <button className="form-control menu_label_value" style={{ textAlign: "left" }} id="theme_dropdown" data-bs-toggle="dropdown">{themeDropdown}</button>
                    <ul className="dropdown-menu" onClick={(e) => {
                        if (e.target.id !== ""){
                            themeDropdown = e.target.name;
                            setThemeDropdown( themeDropdown );
                        }
                    }}>
                        {/* <li><h6 class="dropdown-header">Dropdown explanation here</h6></li> */}
                        {(base.DEBUG_MODE) ?  
                        <li><button className="dropdown-item" id="theme1" name={themesList[0]}>{themesList[0]}</button></li>
                        : ""}
                        <li><button className="dropdown-item" id="theme2" name={themesList[1]}>{themesList[1]}</button></li>
                        <li><button className="dropdown-item" id="theme3" name={themesList[2]}>{themesList[2]}</button></li>
                    </ul>
            </div>
        </>
    )
}

export default ThemeDropdown;
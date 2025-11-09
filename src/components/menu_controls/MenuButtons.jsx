import base from '../BaseSettings';

let lastBtnId = base.DEFAULT_MENU;
let targetBtnId = null;

function MenuButtons({ activeBtn, onClick}) {
    let badge;//=<span className="badge text-bg-danger">4</span>;

    function isDefault(btnName) {
        return (btnName === base.DEFAULT_MENU) ? "selected" : "unselected";
    }
    
    function handleMenuButton(e) {
        targetBtnId = e["target"].id;
        lastBtnId = (lastBtnId == null) ? e["target"].id : lastBtnId;
        document.getElementById(lastBtnId).className = "btn btn-unselected menuBtn";
        document.getElementById(targetBtnId).className = "btn btn-selected menuBtn";
        onClick(e["target"].id)
        lastBtnId = e["target"].id;
    }

    return (
        <>
            <div className="btn-group" role="group" id="menuBtns" aria-label="Menu buttons">
                <button className={`btn btn-${isDefault("helpBtn")} menuBtn`} id="helpBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>About</button>

                <button className={`btn btn-${isDefault("controlBtn")} menuBtn`} id="controlBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Controls</button>

                <button className={`btn btn-${isDefault("consoleBtn")} menuBtn`} id="consoleBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Console{badge}</button>
                    
                { (base.DEBUG_MODE) ?
                <button className={`btn btn-${isDefault("placeholderBtn")} menuBtn`} id="unusedBtn2" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Placeholder</button>
                : null }

                { (base.DEBUG_MODE) ?
                <button disabled hidden className={`btn btn-${isDefault("placeholderBtn")} menuBtn`} id="unusedBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Placeholder</button>
                : null }
            </div>
        </>
    )
}

export default MenuButtons;
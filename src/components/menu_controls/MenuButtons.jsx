import base from '../BaseSettings';

let lastBtnId = base.DEFAULT_MENU;
let targetBtnId = null;

function MenuButtons({ activeBtn, onClick }) {
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
                { (base.DEBUG_MODE) ?
                <button className={`btn btn-${(base.DEFAULT_MENU === "helpBtn") ? "selected" : "unselected" } menuBtn`} id="helpBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Help</button>
                : null }
                <button className={`btn btn-${(base.DEFAULT_MENU === "controlBtn") ? "selected" : "unselected" } menuBtn`} id="controlBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Controls</button>
                <button className={`btn btn-${(base.DEFAULT_MENU === "sourceBtn") ? "selected" : "unselected" } menuBtn`} id="sourceBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Source</button>
                { (base.DEBUG_MODE) ?
                <button className={`btn btn-${(base.DEFAULT_MENU === "consoleBtn") ? "selected" : "unselected" } menuBtn`} id="consoleBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Console</button>
                : null }
                { (base.DEBUG_MODE) ?
                <button className={`btn btn-${(base.DEFAULT_MENU === "unusedBtn") ? "selected" : "unselected" } menuBtn`} id="unusedBtn2" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Placeholder</button>
                : null }
                { (base.DEBUG_MODE) ?
                <button disabled hidden className={`btn btn-${(base.DEFAULT_MENU === "unusedBtn") ? "selected" : "unselected" } menuBtn`} id="unusedBtn" onClick={(e) => {
                    handleMenuButton(e);
                    }}>Placeholder</button>
                : null }
            </div>
        </>
    )
}

export default MenuButtons;
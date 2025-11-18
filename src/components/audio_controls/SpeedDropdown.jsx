import base from '../BaseSettings';
import { useEffect} from 'react';

function SpeedDropdown ({ speed, setSpeed, onHandleSpeed }) {
    const speeds = base.speeds;

    return (
        <>
            <div className="btn-group input-group flex-auto">
                    <span className="input-group-text menu_label_subject" aria-expanded="false">Speed</span>
                    <button className="form-control menu_label_value" style={{ textAlign: "left" }} id="theme_dropdown" data-bs-toggle="dropdown">{speed}</button>
                    <ul className="dropdown-menu" onClick={(e) => {
                        if (e.target.id !== ""){
                            let temp = Number(e.target.name);
                            // prevents dragging from providing "NaN"
                            if (temp) {
                                setSpeed(Number(e.target.name));
                                onHandleSpeed();
                            }
                        }
                    }}>
                        {/* <li><h6 class="dropdown-header">Dropdown explanation here</h6></li> */}
                        <li id="speedOptionsList">
                            <button className="dropdown-item speed" id={0} name={speeds[0]}>{speeds[0]}</button>
                            <button className="dropdown-item speed" id={1} name={speeds[1]}>{speeds[1]}</button>
                            <button className="dropdown-item speed" id={2} name={speeds[2]}>{speeds[2]}</button>
                            <button className="dropdown-item speed" id={3} name={speeds[3]}>{speeds[3]}</button>
                            <button className="dropdown-item speed" id={4} name={speeds[4]}>{speeds[4]}</button>
                            <button className="dropdown-item speed" id={5} name={speeds[5]}>{speeds[5]}</button>
                            <button className="dropdown-item speed" id={6} name={speeds[6]}>{speeds[6]}</button>
                            <button className="dropdown-item speed" id={7} name={speeds[7]}>{speeds[7]}</button>
                        </li>
                    </ul>
            </div>
        </>
    )
}

export default SpeedDropdown;
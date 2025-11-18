import base from '../BaseSettings';
import { useEffect} from 'react';

function SpeedDropdown ({ speed, setSpeed}) {
    const speeds = base.SPEEDS;

    // const appendOptions = () => {
    //     try {
    //         for (var i = 0; i < speeds.length; i++) {
    //             //const btn =( <button className="dropdown-item" id={i} name={speeds[0]}>{speeds[0]}</button>);
    //             const element = document.getElementById("speedOptionsList");
                
    //             const btn = document.createElement("button");
    //             btn.className="dropdown-item";
    //             btn.value=speeds[i];
    //             btn.innerHtml=speeds[i];
    //             btn.name=speeds[i];
    //             console.log("element : " + btn.className);
    //             element.appendChild(btn);
    //         }
    //     } catch (e) {

    //     }
    // }
    // appendOptions();

    return (
        <>
            <div className="btn-group input-group flex-auto">
                    <span className="input-group-text menu_label_subject" aria-expanded="false">Speed</span>
                    <button className="form-control menu_label_value" style={{ textAlign: "left" }} id="theme_dropdown" data-bs-toggle="dropdown">{speed}</button>
                    <ul className="dropdown-menu" onClick={(e) => {
                        if (e.target.id !== ""){
                            //speed = e.target.name;
                            setSpeed(e.target.name);
                        }
                    }}>
                        {/* <li><h6 class="dropdown-header">Dropdown explanation here</h6></li> */}
                        <li id="speedOptionsList">
                            <button className="dropdown-item" id={0} name={speeds[0]}>{speeds[0]}</button>
                            <button className="dropdown-item" id={1} name={speeds[1]}>{speeds[1]}</button>
                            <button className="dropdown-item" id={2} name={speeds[2]}>{speeds[2]}</button>
                            <button className="dropdown-item" id={3} name={speeds[3]}>{speeds[3]}</button>
                            <button className="dropdown-item" id={4} name={speeds[4]}>{speeds[4]}</button>
                            <button className="dropdown-item" id={5} name={speeds[5]}>{speeds[5]}</button>
                            <button className="dropdown-item" id={6} name={speeds[6]}>{speeds[6]}</button>
                            <button className="dropdown-item" id={7} name={speeds[7]}>{speeds[7]}</button>
                            <button className="dropdown-item" id={8} name={speeds[8]}>{speeds[8]}</button>
                        </li>
                    </ul>
            </div>
        </>
    )
}

export default SpeedDropdown;
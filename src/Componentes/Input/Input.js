import React from "react";
import './Input.css';


function Input({ id_prop, label_prop, placeholder_prop, value_prop, onChange_prop }) {
    return (
        <div className="container-input">
            <label htmlFor={id_prop}>{label_prop}</label>
            <input required type="text" id={id_prop} placeholder={placeholder_prop} value={value_prop} onChange={onChange_prop} />
        </div>
    );
}

export default Input;
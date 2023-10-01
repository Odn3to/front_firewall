import React from "react";

const AlertBalloon = ({status}) => {
    
    return (
        <div className={`alert-balloon ${status.class}`}>
            {status.text}
        </div>
    );
  };

  export default AlertBalloon;
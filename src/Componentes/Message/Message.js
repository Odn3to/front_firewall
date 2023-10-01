import React from "react";
import './Message.css';

function Message({message, isSuccess}) {

  return (
    <div className={`message ${isSuccess ? 'success' : 'error'}`}>
        {message}
    </div>
  );
}

export default Message;
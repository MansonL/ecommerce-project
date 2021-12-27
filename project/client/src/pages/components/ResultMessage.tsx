interface ResultMessageProps {
    logSignResult: boolean;
    msgResult: string;
    deleteResultMsg: () => void;
}

export function ResultMessage (props: ResultMessageProps) {
    return (
        <div className="login-msg" style={{border: `2px solid ${props.logSignResult ? "#83944C" : "#ff5d8f"}` }}>
      <header className="login-msg-header" style={{backgroundColor: `${props.logSignResult ? "#99AC5D" : "#ff87ab"} `}}>
        <span className="login-header-msg">{`${props.logSignResult ? "Succesfully logged in!" : "Failed to log in!"}`}</span>
        <img className="login-header-icon" src="../../grey-cross.png" onClick={props.deleteResultMsg}></img>
        </header>
    <div className="login-msg-description" style={{backgroundColor: `${props.logSignResult ? "#E9EDC9" : "#fadde1"}`}}>
      {props.msgResult}
    </div>
    </div>
    )
}
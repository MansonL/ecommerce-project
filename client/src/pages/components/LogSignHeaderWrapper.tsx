import { LogSignHeader } from "./LogSignHeader";
import { ResultMessage } from "./ResultMessage";

interface LogSignHeaderWrapperProps {
    showResult: boolean;
    logSignResult: boolean;
    deleteResultMsg: () => void;
    msgResult: string;
    type: string;
}
export function LogSignHeaderWrapper (props: LogSignHeaderWrapperProps) {
    return (
        <>
        <LogSignHeader type={props.type}/>
        {props.showResult && 
        <ResultMessage logSignResult={props.logSignResult} msgResult={props.msgResult} deleteResultMsg={props.deleteResultMsg}/>
        }
        </>
    )
}
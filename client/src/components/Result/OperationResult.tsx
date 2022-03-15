import "./result.css";

interface IOperationResult {
  resultMessage: string;
  result: string;
}

export function OperationResult(props: IOperationResult) {
  return (
    <div
      className={`operation-result ${
        props.result === "success"
          ? "success"
          : props.result === "warning"
          ? "warning"
          : "error"
      }`}
    >
      <img
        className="operation-result-icon"
        src={
          props.result === 'success'
            ? "/icons/success.png"
            : 
            props.result === 'error' ? "/icons/error.png" :
            "/icons/warning.png"
        }
        alt="operation icon"
      />
      <span>{props.resultMessage}</span>
    </div>
  );
}

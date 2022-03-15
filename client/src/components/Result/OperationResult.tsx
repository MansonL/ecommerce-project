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
          ? "succes"
          : props.result === "warning"
          ? "warning"
          : "error"
      }`}
    >
      <img
        className="operation-result-icon"
        src={
          props.result
            ? "https://img.icons8.com/cotton/512/checkmark.png"
            : "https://cdn4.iconfinder.com/data/icons/ecommerce-webdesign-and-business-colorful-pastel-c/283/ec_36-512.png"
        }
        alt=""
      />
      <span>{props.resultMessage}</span>
    </div>
  );
}

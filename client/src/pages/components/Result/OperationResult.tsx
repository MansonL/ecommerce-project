import './result.css';


interface IOperationResult {
  resultMessage: string,
  success: boolean;
}


export function OperationResult (props: IOperationResult){
    return (
        <div className={`operation-result ${props.success ? 'success' : 'failure'}`}>
    <img className="operation-result-icon" src={props.success ? "https://img.icons8.com/cotton/512/checkmark.png" : "https://cdn4.iconfinder.com/data/icons/ecommerce-webdesign-and-business-colorful-pastel-c/283/ec_36-512.png"} alt=""/>
    <span>{props.resultMessage}</span>
  </div>
    )
}

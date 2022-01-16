import './modal.css'

interface IModalProps {
    msg: string;
    cancelClick: () => void;
    confirmClick: () => void
}

export function Modal (props: IModalProps) {
    return (
        <div className="modal">
    <div className="modal-header">
        <span style={{fontSize:"1.2rem", margin:"0.7rem 0.5rem 0.7rem 0.5rem"}}>Warning!</span>
      <img className="close-modal" src="https://icons.iconarchive.com/icons/iconsmind/outline/512/Close-Window-icon.png" alt=""/>
    </div>
    <div className="modal-body">
      <span>{props.msg}</span>
    </div>
    <div className="modal-footer">
      <button className="modal-btn" onClick={props.cancelClick}>Cancel</button><button className="modal-btn" onClick={props.confirmClick}>Confirm</button>
    </div>
  </div>
    )
}
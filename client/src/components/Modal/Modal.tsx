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
        <span className='modal-header-title'>Warning!</span>
      <img className="close-modal" src="https://icons.iconarchive.com/icons/iconsmind/outline/512/Close-Window-icon.png" onClick={props.cancelClick} alt=""/>
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
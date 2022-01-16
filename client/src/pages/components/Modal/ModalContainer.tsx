import './modal.css'

interface IModalContainerProps {
    children: JSX.Element
}

export function ModalContainer({children}: IModalContainerProps) {
    return (
        <div className="modal-container">
            {children}
</div>

    )

}
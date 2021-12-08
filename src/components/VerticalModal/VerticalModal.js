import { Modal, Button } from 'react-bootstrap';

export const VerticalModal = (props) => {
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {props.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {props.text}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      );
}

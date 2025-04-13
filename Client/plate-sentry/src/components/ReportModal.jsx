import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ReportModal = ({report, show, setShow}) => {
    const handleClose = () => setShow(false);

    return (
        <>
            <Modal show={show} onHide={handleClose} className="modal-md">
                <Modal.Header closeButton>
                    <Modal.Title><h5 className="mb-0">Report {report.id}</h5></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Civilian name: <span style={{textTransform:"initial"}}>{report.name || "Anonymous"}</span></p>
                    <p>Civilian email: <span style={{textTransform:"initial"}}>{report.name || "Anonymous"}</span></p>
                    <p>Description: <span style={{textTransform:"initial"}}>{report.description}</span></p>
                    <img style={{borderRadius:"3%"}} src={`data:image/jpeg;base64,${report.photo}`} className="w-100" alt="Detected plate" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

export default ReportModal;
import React, { useState, useEffect, useRef } from "react";
import Spinner from "../components/Spinner";
import Status from "../components/Status";
import TcpClientReport from "../TcpClientReport";
import { formatDateTime } from "../utility/date";
import ReportModal from "../components/ReportModal";

const ReportsPage = () => {

    document.title = "Plate Sentry - View Reports";

    const [isLoading, setIsLoading] = useState(true);
    const [isConnectedToServer, setIsConnectedToServer] = useState(false);
    const [isArchiveSuccessful, setIsArchiveSuccessful] = useState(true);
    const [rpts, setRpts] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [rpt, setRpt] = useState({});

    const tcpClientRef = useRef(null);
    useEffect(() => {
        const client = new TcpClientReport();
        client.connect('officer').then(() => {
            setIsConnectedToServer(true);
            client.setOnMessageCallback((reports) => {
                if (Array.isArray(reports)) {
                    setRpts(reports);
                } else if (reports && typeof reports === 'object' && reports.id) {
                    setRpts(prev => [reports, ...prev]);
                } else {
                    console.warn("Unrecognized message format", reports);
                }
    
                setIsLoading(false);
            });
        });
        tcpClientRef.current = client;

        return () => {
            client?.socket?.close(); // optional cleanup on unmount
            setIsConnectedToServer(false);
        };
    }, []);

    return (
        <>
            {<ReportModal report={rpt} show={showReportModal} setShow={setShowReportModal} />}
            {isLoading ? <Spinner /> : (
                <>
                    {isArchiveSuccessful ? <div></div> : <div></div>}
                    <h4 className="text-center mb-4"><span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>View Reports <Status isConnected={isConnectedToServer} /></span></h4>
                    <div>
                        <table className="table reports-table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Photo preview</th>
                                    <th scope="col">License plate</th>
                                    <th scope="col">Time reported</th>
                                </tr>
                            </thead>
                            <tbody>
                            {rpts.map((report) => (
                                <tr key={report.id} onClick={() => (setShowReportModal(true), setRpt(report))}>
                                    <td>{report.id}</td>
                                    <td><img src={`data:image/jpeg;base64,${report.cropped_photo}`} className="w-50" alt="Cropped plate" /></td>
                                    <td>{report.plate_number}</td>
                                    <td>{formatDateTime(report.datetime)}</td>
                                </tr>
                            ))} 
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    )
}

export default ReportsPage;
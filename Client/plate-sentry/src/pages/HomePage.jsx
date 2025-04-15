import React, { useState, useEffect, useRef } from "react";
import Error from "../components/Error";
import TcpClientReport from "../TcpClientReport.js";
import toBase64 from "../utility/images.js";
import Spinner from "../components/Spinner.jsx";
import Success from "../components/Success.jsx";
import { formatDateTime } from "../utility/date.js";
import Status from "../components/Status.jsx";

const HomePage = () => {

    // Change title
    document.title = "Plate Sentry - Report Car";

    // Define states so that re-render occurs for variable updates
    const [showError, setShowError] = useState(false);
    const [errorDescription, setErrorDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isReportSuccessful, setIsReportSuccessful] = useState(false);
    const [croppedReportedPhoto, setCroppedReportedPhoto] = useState(null);
    const [licensePlateNumber, setLicensePlateNumber] = useState(null);
    const [dateTimeReported, setDateTimeReported] = useState(null);
    const [isConnectedToServer, setIsConnectedToServer] = useState(false);

    // Create TCP connection with client
    const tcpClientRef = useRef(null);
    useEffect(() => {
        const client = new TcpClientReport();
        // Connect with 'reporter' HTTP cookie
        client.connect('reporter').then(() => {
            setIsConnectedToServer(true);
        });
        tcpClientRef.current = client;

        return () => {
            client?.socket?.close(); // optional cleanup on unmount
            setIsConnectedToServer(false);
        };
    }, []);

    // For front-end validation
    const isNullOrWhitespace = (input) => {
        return !input || !input.trim();
    }

    // Front-end validation
    const isReportPlateValid = (report) => {
        if (isNullOrWhitespace(report.photoValue)) {
            return { isValid: false, reason: "Photo is required" };
        }

        if (isNullOrWhitespace(report.description)) {
            return { isValid: false, reason: "Description is required" };
        }

        return { isValid: true };
    }

    // On report plate form submission
    const reportPlate = async (event) => {
        event.preventDefault();

        // Build JSON
        const report = {
            photoValue: document.getElementById("photoField").value,
            photo: document.getElementById("photoField").files[0],
            description: document.getElementById("descriptionField").value,
            name: document.getElementById("nameField").value,
            email: document.getElementById("emailField").value
        }

        // Check model state validity
        const modelState = isReportPlateValid(report)
        if (modelState.isValid) {

            setIsLoading(true);
            const base64_str = await toBase64(report.photo);
            tcpClientRef.current.sendMessageWhenReady(JSON.stringify({
                type: 'image',
                data: base64_str,
                description: report.description,
                name: report.name,
                email: report.email
            }));

            // Send report to server
            tcpClientRef.current.setOnMessageCallback((msg) => {
                if (msg.status === 'success') {
                    setCroppedReportedPhoto(msg.cropped_photo);
                    setShowError(false);
                    setErrorDescription('');
                    setIsReportSuccessful(true);
                    setLicensePlateNumber(msg.plate_number);
                    setDateTimeReported(msg.datetime);
                } else if (msg.status === 'no_plate_detected') {
                    setErrorDescription('No plate has been detected in this photo');
                    setShowError(true);
                } else {
                    setErrorDescription('An error has occured');
                    setShowError(true);
                }

                setIsLoading(false);
            });
        } else {
            setErrorDescription(modelState.reason);
            setShowError(true);
        }
    }

    return (
        <>
            {isLoading ? <Spinner /> : (
                isReportSuccessful ? (
                <div>
                    <h4 className="text-center mb-4"><span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>Report Car <Status isConnected={isConnectedToServer} /></span></h4>
                    <Success description={"Car successfully reported. A legal authority will assess the report and determine the best course of action."} />
                    <div className="container">
                        <div className="row">
                            <div className="col-4">
                                <img src={`data:image/jpeg;base64,${croppedReportedPhoto}`} className="w-100" alt="Cropped plate" />
                            </div>
                            <div className="col-8">
                                <p className="mb-0">License plate: <span className="badge rounded-pill bg-dark">{licensePlateNumber}</span><span style={{marginLeft:'5px'}} className="badge rounded-pill bg-light text-dark">{formatDateTime(dateTimeReported)}</span></p>
                                <small>This license plate number is a prediction and cannot be guaranteed with complete accuracy. Administrators will review the uploaded photo.</small>
                            </div>
                        </div>
                    </div>
                    <a className="btn btn-outline-dark float-end mt-3" href="/" role="button">Report More</a>
                </div>) : (
                <form onSubmit={reportPlate}>
                    <fieldset>
                        <h4 className="text-center mb-4"><span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>Report Car <Status isConnected={isConnectedToServer} /></span></h4>
                        {showError ? <Error description={errorDescription} /> : null}
                        <div className="mb-4">
                            <label htmlFor="photoField" className="form-label"><span>Upload photo of car <span style={{color:'orangered'}}>*</span></span></label>
                            <input className="form-control form-control-md" id="photoField" type="file" accept="image/jpeg,image/png"></input>
                            <small>Upload a photo of the car with its license plate visible.</small>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="descriptionField" className="form-label"><span>Description <span style={{color:'orangered'}}>*</span></span></label>
                            <textarea className="form-control" id="descriptionField" rows="4" placeholder="Type here..." maxLength={300}></textarea>
                            <small>Describe the wrongdoing of the car's driver.</small>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="emailField" className="form-label"><span>Your name <small>(optional)</small></span></label>
                            <input type="text" className="form-control" id="nameField" placeholder="John Doe"></input>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="emailField" className="form-label"><span>Your email address <small>(optional)</small></span></label>
                            <input type="text" className="form-control" id="emailField" placeholder="johndoe@email.com"></input>
                        </div>
                        <button type="submit" className="btn btn-primary mt-2 float-end">Submit</button>
                    </fieldset>
                </form>))}
        </>
    )
}

export default HomePage;
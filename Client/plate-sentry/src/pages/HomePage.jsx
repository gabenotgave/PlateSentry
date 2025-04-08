import React, { useState } from "react";
import Error from "../components/Error";
import TcpClientReport from "../TcpClientReport.js";

const HomePage = () => {

    document.title = "PlateSentry - Report Car";
    document.querySelector('link[rel="icon"]').setAttribute("icon", "../assets/favicon.icon");

    const [showError, setShowError] = useState(false);
    const [errorDescription, setErrorDescription] = useState("");

    const isNullOrWhitespace = (input) => {
        return !input || !input.trim();
    }

    const isReportPlateValid = (report) => {
        if (isNullOrWhitespace(report.photo)) {
            return { isValid: false, reason: "Photo is required" };
        }

        if (isNullOrWhitespace(report.description)) {
            return { isValid: false, reason: "Description is required" };
        }

        return { isValid: true };
    }

    const TcpClientReport = new TcpClientReport();

    const reportPlate = (event) => {
        event.preventDefault();
        const report = {
            photo: document.getElementById("photoField").value,
            description: document.getElementById("descriptionField").value
        }

        const modelState = isReportPlateValid(report)

        if (modelState.isValid) {
            console.log("test");
        } else {
            setErrorDescription(modelState.reason);
            setShowError(true);
        }
    }

    return (
        <>
            <form onSubmit={reportPlate}>
                <fieldset>
                    <h4 className="text-center mb-4">Report Car</h4>
                    {showError ? <Error description={errorDescription} /> : null}
                    <div className="mb-4">
                        <label htmlFor="photoField" className="form-label"><span>Upload photo of car</span></label>
                        <input className="form-control form-control-md" id="photoField" type="file" accept="image/jpeg"></input>
                        <small>Upload a photo of the car with its license plate visible.</small>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="descriptionField" className="form-label"><span>Description</span></label>
                        <textarea className="form-control" id="descriptionField" rows="4" placeholder="Type here..." maxLength={300}></textarea>
                        <small>Describe the wrongdoing of the car's driver.</small>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2 float-end">Submit</button>
                </fieldset>
            </form>
        </>
    )
}

export default HomePage;
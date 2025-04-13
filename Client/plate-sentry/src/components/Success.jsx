const Success = ({title, description}) => {
    return (
        <div className="mb-4"> {/*Keep this as a div (don't change to <>)... React has an issue with Bootstrap modules*/}
            <div className="alert alert-dismissible fade show alert-success error">
                {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
                {title ? <span className="alert-heading">{title}</span> : ""}
                <p className="mb-0">{description}</p>
            </div>
        </div>
    )
}

export default Success;
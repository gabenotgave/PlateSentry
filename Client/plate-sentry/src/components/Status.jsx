import BounceLoader from "../components/BounceLoader";

const Status = ({ isConnected }) => {
    return (
        <span
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px',
            marginLeft: '5px',
        }}
        className={`badge rounded-pill ${isConnected ? 'bg-success' : 'bg-danger'}`}>
        <BounceLoader />
        {isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
        </span>
    );
};

  export default Status;
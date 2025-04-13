import Loader from 'react-spinners/RingLoader';
//https://www.davidhu.io/react-spinners/

const override = {
  display: 'block',
  margin: '100px auto',
};

const Spinner = () => {
  return (
    <Loader
      color='black'
      loading={true}
      cssOverride={override}
      size={150}
    />
  );
};

export default Spinner;
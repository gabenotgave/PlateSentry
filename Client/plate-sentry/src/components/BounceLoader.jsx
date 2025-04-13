import Loader from 'react-spinners/BounceLoader';
//https://www.davidhu.io/react-spinners/

const override = {
    display: 'inline-block',
};

const Spinner = () => {
  return (
    <Loader
      color='white'
      loading={true}
      cssOverride={override}
      size={8}
    />
  );
};

export default Spinner;
interface LoaderProps {
  caption: string
}

const Loader: React.FC<LoaderProps> = ({ caption }) => {
  return (<div className="loader">
    <img src='/spinner.svg' alt='loading' width={64} height={64}/>
    <p>{caption}</p>
  </div>);
}

export default Loader;

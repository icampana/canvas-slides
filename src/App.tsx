import './App.css'
import Slider from './components/Slider'

function App() {
  // We can setup a list of images that could be either local or remote.
  const images = [
    '/slides/bm-5.png',
    '/slides/bm-1.jpg',
    '/slides/bm-2.jpg',
    '/slides/bm-3.jpg',
    '/slides/bm-4.jpg',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  ];

  const onChange = (value: number) => {
    console.log(value);
  }

  return (
    <>
      <h3 className="title">Slider Component</h3>
      <div className="container">
        <Slider images={images} onChange={onChange} width={640} height={400} />
      </div>
      <div className='slides-caption'> Drag to change image </div>
    </>
  )
}

export default App

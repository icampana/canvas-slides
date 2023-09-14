import './App.css'
import Slider from './components/Slider'

function App() {
  const images = [
    '/slides/bm-5.png',
    '/slides/bm-1.jpg',
    '/slides/bm-2.jpg',
    '/slides/bm-3.jpg',
    '/slides/bm-4.jpg',
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

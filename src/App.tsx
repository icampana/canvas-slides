import './App.css'
import Slider from './components/Slider'

function App() {
  const images = [
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
      <h1 className="title">Slider Component</h1>
      <div className="container">
        <Slider images={images} onChange={onChange} width={600} height={400} />
      </div>
    </>
  )
}

export default App

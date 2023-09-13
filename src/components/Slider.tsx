import React from 'react';
import { useEventListener } from 'usehooks-ts'
import { ResizedImage, loader as imageLoader, resizeImage } from '../utils/image'

type SliderProps = {
  images: string[];
  onChange?: (value: number) => void;
  width: number;
  height: number;
}

const Slider: React.FC<SliderProps> = ({ images, width, height }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = React.useState(false);
  const [displacement, setDisplacement] = React.useState(0);
  const [imageList, setImageList] = React.useState<ResizedImage[]>([]);

  const handleDragging = (event: MouseEvent) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;

    let moveXAmount = (event.pageX / window.innerWidth)*width;
    moveXAmount = moveXAmount - (width/2);
    setDisplacement(moveXAmount);
    // console.debug(moveXAmount);
  }

  useEventListener("mousemove", handleDragging);

  const toggleDragging = (draggingState = false) => {
    setDragging(draggingState);
  }

  React.useEffect(() => {
    Promise.all(images.map(url => imageLoader(url)))
    .then(images => {
      setImageList(images.map(image => resizeImage(image, width, height)));
    })
  }, [images, height, width]);

  React.useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context && imageList.length > 0) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      imageList.forEach((image, index) => {
        // Locates the image within the canvas using its index
        const basePosX = (index * width);

        // Finds a middle point for the image.
        const initialX = Math.round((width - image.width) / 2);

        context.drawImage(image.image, initialX + basePosX + displacement, 0, image.width, image.height);
        context.save();
      })
    }
  }, [imageList, width, height, displacement]);

  return (<canvas ref={canvasRef} width={width} height={height} className={dragging ? 'dragging' : ''} onMouseDown={() => toggleDragging(true)} onMouseUp={() => toggleDragging(false)} />);
}

export default Slider;

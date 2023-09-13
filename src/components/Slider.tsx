import React from 'react';

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

  const handleDragging = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;

    let moveXAmount = (event.pageX / window.innerWidth)*width;
    moveXAmount = moveXAmount - (width/2);
    setDisplacement(moveXAmount);
    console.debug(moveXAmount);
  }

  const toggleDragging = (draggingState = false) => {
    setDragging(draggingState);
  }

  React.useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      images.forEach((url, index) => {
        const image = new Image();
        image.src = url;
        image.addEventListener("load", () => {
          const ratio = image.naturalWidth/image.naturalHeight;
          const newHeight = Math.min(height, width / ratio);
          const newWidth =  Math.round( Math.min(width, height * ratio) );

          // Locates the image within the canvas using its index
          const basePosX = (index * width);

          // Finds a middle point for the image.
          const initialX = Math.round((width - newWidth) / 2);

          context.drawImage(image, initialX + basePosX + displacement, 0, newWidth, newHeight);
          context.save();
        });
      })
    }
  }, [images, width, height, displacement]);

  return (<canvas ref={canvasRef} width={width} height={height} onMouseDown={() => toggleDragging(true)} onMouseUp={() => toggleDragging(false)} onMouseMove={handleDragging} />);
}

export default Slider;

import React from 'react';
import { useEventListener } from 'usehooks-ts'
import { ResizedImage, loader as imageLoader, resizeImage } from '../utils/image'

type SliderProps = {
  images: string[];
  onChange?: (value: number) => void;
  width: number;
  height: number;
}

type SlideImage = {
  initialPosition: number
} & ResizedImage;

const Slider: React.FC<SliderProps> = ({ images, width, height }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = React.useState(false);
  const [lastPosition, setLastPosition] = React.useState(0);
  const [displacement, setDisplacement] = React.useState(0);
  const [imageList, setImageList] = React.useState<SlideImage[]>([]);

  /**
   * Calculates the distance to move horizontally based on the mouse position and sets the displacement.
   * @param event
   * @returns
   */
  const handleDragging = (event: MouseEvent) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;

    const moveXAmount = Math.round((event.pageX / window.innerWidth) * width - (width / 2));
    setDisplacement(lastPosition + moveXAmount);
  }

  useEventListener("mousemove", handleDragging);
  useEventListener("mousedown", () => setDragging(true));
  useEventListener("mouseup", () => {
    setDragging(false);
    setLastPosition(displacement);
  });

  React.useEffect(() => {
    Promise.all(images.map(url => imageLoader(url)))
      .then(images => {
        setImageList(images.map((image, index) => {
          // Calculates the new dimensions based on the slider size.
          const resizedImage = resizeImage(image, width, height);
          // Finds the right position to center it within the reserved space for that image.
          const initialX = Math.round((width - resizedImage.width) / 2);
          return ({
            ...resizedImage,
            initialPosition: (index * width) + initialX
          })
        }));
      })
  }, [images, height, width]);

  React.useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context && imageList.length > 0) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      imageList.forEach(image => {
        // Redraws images using the current displacement (which "remembers" the last position).
        context.drawImage(image.image, image.initialPosition + displacement, 0, image.width, image.height);
        context.save();
      })
    }
  }, [imageList, width, height, displacement]);

  return (<canvas ref={canvasRef} width={width} height={height} className={dragging ? 'dragging' : 'notDragging'} />);
}

export default Slider;

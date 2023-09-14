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
  // Slide x position
  sx: number
  // Image X position
  ix: number
} & ResizedImage;

const Slider: React.FC<SliderProps> = ({ images, width, height }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = React.useState(false);
  const [lastPosition, setLastPosition] = React.useState(0);
  const [displacement, setDisplacement] = React.useState(0);
  const [prevX, setPrevX] = React.useState(0);
  const [moveXAmount, setMoveXAmount] = React.useState(0);
  const [imageList, setImageList] = React.useState<SlideImage[]>([]);

  /**
   * Calculates the distance to move horizontally based on the mouse position and sets the displacement.
   * @param event
   * @returns
   */
  const handleDragging = (event: MouseEvent) => {
    if (!dragging) return;

    if (prevX > 0){
      // Calculates the delta based on the previous mouse position.
      const newMoveX = moveXAmount + (event.pageX - prevX);
      setMoveXAmount(ma => (ma + event.pageX - prevX));

      const firstImage = imageList[0];
      const lastImage = imageList[imageList.length - 1];

      // If the mouse tries to move beyond the initial slide, don't move it
      if ((newMoveX + lastPosition) >= (firstImage?.sx)) return;

      // If the mouse tries to move beyond the last slide, don't move it
      if ((newMoveX + lastPosition) <= (lastImage?.sx * -1)) return;

      setDisplacement(lastPosition + newMoveX);
    }
    setPrevX(event.pageX);
  }

  /**
   * Once the dragging starts/stops, resets the mouse tracking.
   */
  const resetMovement = () => {
    setPrevX(0);
    setMoveXAmount(0);
  }

  useEventListener("mousemove", handleDragging);

  useEventListener("mousedown", () => {
    setDragging(true);
    resetMovement();
  });

  useEventListener("mouseup", () => {
    setDragging(false);
    setLastPosition(displacement);
    resetMovement();
  });

  React.useEffect(() => {
    Promise.all(images.map(url => imageLoader(url)))
      .then(images => {
        const updatedImages = images.map((image, index) => {
          // Calculates the new dimensions based on the slider size.
          const resizedImage = resizeImage(image, width, height);
          // Finds the right position to center it within the reserved space for that image.
          const initialX = Math.round((width - resizedImage.width) / 2);
          return ({
            ...resizedImage,
            sx: (index * width),
            ix: initialX
          })
        });
        setImageList(updatedImages);
      })
  }, [images, height, width]);

  React.useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context && imageList.length > 0) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      imageList.forEach(image => {
        // Redraws images using the current displacement (which "remembers" the last position).
        context.drawImage(image.image, image.sx + image.ix + displacement, 0, image.width, image.height);
        context.save();
      })
    }
  }, [imageList, width, height, displacement]);

  return (<canvas ref={canvasRef} width={width} height={height} className={`slides-container ${dragging ? 'dragging' : 'notDragging'}`} />);
}

export default Slider;

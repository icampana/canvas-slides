import React, { useCallback, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts'
import { ResizedImage, loader as imageLoader, resizeImage } from '../utils/image'
import Loader from './Loader';

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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPosition, setLastPosition] = useState(0);
  const [displacement, setDisplacement] = useState(0);
  const [prevX, setPrevX] = useState(0);
  const [moveXAmount, setMoveXAmount] = useState(0);
  const [imageList, setImageList] = useState<SlideImage[]>([]);

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
      setMoveXAmount(newMoveX);

      const firstImage = imageList[0];
      const lastImage = imageList[imageList.length - 1];

      // If the mouse tries to move beyond the initial slide, don't move it
      if ((newMoveX + lastPosition) >= (firstImage?.sx)) return;

      // If the mouse tries to move beyond the last slide, don't move it
      if ((newMoveX + lastPosition) <= (lastImage?.sx * -1)) return;

      // Moves the slider to the new position, including the last position.
      setDisplacement(lastPosition + newMoveX);
    }
    setPrevX(event.pageX);
  }

  const processImages = useCallback((image: HTMLImageElement, index: number) => {
    // Calculates the new dimensions based on the slider size.
    const resizedImage = resizeImage(image, width, height);
    // Finds the right position to center it within the reserved space for that image.
    const initialX = Math.round((width - resizedImage.width) / 2);
    return ({
      ...resizedImage,
      sx: (index * width),
      ix: initialX
    })
  }, [width, height]);

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
    setIsLoading(true);
    // Try to load all images in parallel.
    Promise.all(images.map(url => imageLoader(url)))
      .then(images => {
        // Get extra information to resize the images and store them in the state
        // with the extra information, so that we can calculate the displacement.
        const updatedImages = images.map(processImages);
        setImageList(updatedImages);
        setIsLoading(false);
      })
  }, [images, processImages]);

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

  if (isLoading) return <Loader caption='Loading images...' />

  return (<canvas ref={canvasRef} width={width} height={height} className={`slides-container ${dragging ? 'dragging' : 'notDragging'}`} />);
}

export default Slider;

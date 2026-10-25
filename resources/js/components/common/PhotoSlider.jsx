import { useRef, useState } from "react";
import classes from "./PhotoSlider.module.css";

/**
 * Une photo à la fois : glisser (tactile, pavé) ou cliquer sur les points.
 */
const PhotoSlider = ({ photos, caption }) => {
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const onScroll = (event) => {
    const track = event.currentTarget;
    setCurrent(Math.round(track.scrollLeft / track.clientWidth));
  };

  const goTo = (index) => {
    const track = trackRef.current;
    setCurrent(index);
    track?.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={classes.slider}>
      <div ref={trackRef} className={classes.track} onScroll={onScroll}>
        {photos.map((photo) => (
          <img key={photo} src={photo} alt="" loading="lazy" />
        ))}
      </div>
      {caption && (
        <span className={`${classes.caption} handwritten`}>{caption}</span>
      )}
      <div className={classes.dots}>
        {photos.map((photo, index) => (
          <button
            key={photo}
            type="button"
            className={classes.dot}
            data-active={index === current || undefined}
            onClick={() => goTo(index)}
            aria-label={`Photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoSlider;

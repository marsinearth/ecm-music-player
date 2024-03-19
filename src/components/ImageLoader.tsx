import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type PropsWithChildren,
} from "react";
import "styles/ImageLoader.css";
import Spinner, { WirelessDisabled } from "./LoadingSpinner";

type ImageLoaderProps = PropsWithChildren<
  ImgHTMLAttributes<HTMLImageElement> & {
    disconnected?: boolean;
  }
>;

const ImageLoader = forwardRef<HTMLDivElement, ImageLoaderProps>(
  ({ style, disconnected, children, className, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);

    const handleOnLoad = () => {
      // to make it a tempo later than useEffect
      setTimeout(() => {
        setLoaded(true);
      });
    };

    const imageStyle: CSSProperties = useMemo(
      () => ({
        ...style,
        contentVisibility: "auto",
        visibility: loaded ? "visible" : "hidden",
        height: loaded ? "100%" : 0,
      }),
      [style, loaded]
    );

    useEffect(() => {
      // when source is changed, reset loaded to false
      setLoaded(false);
    }, [props.src]);

    // needs for obtain preserved place for responsive picture
    const { maxWidth, maxHeight } = style || {};

    return (
      <div
        className={`imgContainer${!className ? "" : ` ${className}`}`}
        style={{ maxWidth, maxHeight }}
        ref={ref}
      >
        <img
          {...props}
          onLoad={handleOnLoad}
          style={imageStyle}
          draggable={false}
          loading="lazy"
        />

        {disconnected ? <WirelessDisabled /> : !loaded && <Spinner />}
        {loaded && children}
      </div>
    );
  }
);

export default ImageLoader;

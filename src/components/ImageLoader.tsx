import {
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

export default function ImageLoader({
  style,
  disconnected,
  children,
  className,
  ...props
}: ImageLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  console.log({ src: props.src });

  const handleOnLoad = () => {
    setLoaded(true);
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
    >
      <img {...props} loading="lazy" onLoad={handleOnLoad} style={imageStyle} />
      {disconnected ? <WirelessDisabled /> : !loaded && <Spinner />}
      {loaded && children}
    </div>
  );
}

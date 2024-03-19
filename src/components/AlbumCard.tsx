import {
  memo,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import LazyLoad from "react-lazyload";
import "styles/AlbumCard.css";
import type { Album } from "typings/album";
import ImageLoader from "./ImageLoader";

type AlbumCardProps = Album & {
  index: number;
  disconnected: boolean;
  selected: boolean;
  playing: boolean;
  setAlbum: (index: number) => void;
  setScrollTop: Dispatch<SetStateAction<number>>;
};

function AlbumCard({
  album_title,
  track_title,
  album_artist,
  album_image,
  index,
  selected,
  playing,
  disconnected,
  setAlbum,
  setScrollTop,
}: AlbumCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const onCloseModal = () => {
    setAlbum(index);
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "auto";
    }
  };

  useEffect(() => {
    if (selected && cardRef.current) {
      const { parentElement } = cardRef.current;
      setScrollTop(parentElement?.offsetTop || 0);
    }
  }, [setScrollTop, selected]);

  return (
    <LazyLoad
      once // once loaded, LazyLoad doesn't consider the component.
      overflow // needed inside of positioned element
      debounce={600} // for load images from lower part of the page by quick scroll
      offset={300} // for preload top/bottom images out of the viewport, esp. for upper part when scrolling up after quick/huge downscroll
      scrollContainer="section#albumsContainer"
    >
      <ImageLoader
        className="albumCardContainer"
        src={album_image}
        alt={album_title}
        disconnected={disconnected}
        data-tooltip-content={`${album_artist}: ${track_title}`}
        style={{ maxWidth: 400, maxHeight: 400, border: "1px outset #dddddd" }}
        onClick={onCloseModal}
        ref={cardRef}
      >
        <div
          className="albumCardPlayingNowOverlay"
          style={{ display: selected ? "flex" : "none" }}
        >
          {playing ? "Now Playing" : "Selected"}
        </div>
      </ImageLoader>
    </LazyLoad>
  );
}

export default memo(AlbumCard);

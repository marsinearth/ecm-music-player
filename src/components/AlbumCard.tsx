import { memo } from "react";
import "styles/AlbumCard.css";
import type { Album } from "typings/album";
import ImageLoader from "./ImageLoader";

type AlbumCardProps = Album & {
  index: number;
  disconnected: boolean;
  selected: boolean;
  playing: boolean;
  setAlbum: (index: number) => void;
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
}: AlbumCardProps) {
  const onCloseModal = () => {
    setAlbum(index);
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "auto";
    }
  };

  return (
    <ImageLoader
      className="albumCardContainer"
      src={album_image}
      alt={album_title}
      disconnected={disconnected}
      data-tooltip-content={`${album_artist}: ${track_title}`}
      style={{ maxWidth: 400, maxHeight: 400, border: "1px outset #dddddd" }}
      onClick={onCloseModal}
    >
      <div
        className="albumCardPlayingNowOverlay"
        style={{ display: selected ? "flex" : "none" }}
      >
        {playing ? "Now Playing" : "Selected"}
      </div>
    </ImageLoader>
  );
}

export default memo(AlbumCard);

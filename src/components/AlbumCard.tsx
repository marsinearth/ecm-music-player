import { memo } from "react";
import LazyLoad from "react-lazyload";
import "styles/AlbumCard.css";
import type { Album } from "typings/album";
import Spinner from "./LoadingSpinner";

type AlbumCardProps = Album & {
  index: number;
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
  setAlbum,
}: AlbumCardProps) {
  return (
    <LazyLoad height="100%" placeholder={<Spinner />} once debounce={100}>
      <div
        data-tooltip-content={`${album_artist}: ${track_title}`}
        className="albumCardContainer"
        onClick={() => {
          setAlbum(index);
        }}
      >
        <img src={album_image} alt={album_title} />
        <div
          className="albumCardPlayingNowOverlay"
          style={{ display: selected ? "flex" : "none" }}
        >
          {playing ? "Now Playing" : "Selected"}
        </div>
      </div>
    </LazyLoad>
  );
}

export default memo(AlbumCard);

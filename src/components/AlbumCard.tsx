import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "styles/AlbumCard.css";
import type { Album } from "typings/album";
import Spinner from "./LoadingSpinner";

type AlbumCardProps = Album & {
  index: number;
  selected: boolean;
  setAlbum: (index: number) => void;
};

function AlbumCard({
  album_title,
  track_title,
  album_artist,
  album_image,
  index,
  selected,
  setAlbum,
}: AlbumCardProps) {
  return (
    <div
      data-tooltip-content={`${album_artist}: ${track_title}`}
      className="albumCardContainer"
      onClick={() => {
        setAlbum(index);
      }}
    >
      <LazyLoadImage
        src={album_image}
        alt={album_title}
        placeholder={<Spinner />}
      />
      <div
        className="albumCardPlayingNowOverlay"
        style={{ display: selected ? "flex" : "none" }}
      >
        Now Playing
      </div>
    </div>
  );
}

export default memo(AlbumCard);

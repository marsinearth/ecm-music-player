import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "styles/AudioCard.css";
import type { Album } from "typings/album";
import Spinner from "./LoadingSpinner";

type AlbumCardProps = Album & {
  index: number;
  setAlbum: (index: number) => void;
};

function AlbumCard({
  album_title,
  track_title,
  album_artist,
  album_image,
  index,
  setAlbum,
}: AlbumCardProps) {
  return (
    <div
      data-tooltip-content={`${album_artist}: ${track_title}`}
      className="audioCardContainer"
      onClick={() => {
        setAlbum(index);
      }}
    >
      <LazyLoadImage
        src={album_image}
        width={135}
        height={135}
        alt={album_title}
        placeholder={<Spinner />}
      />
    </div>
  );
}

export default memo(AlbumCard);

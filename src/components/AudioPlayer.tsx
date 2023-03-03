import { forwardRef } from "react";
import ReactH5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "styles/AudioPlayer.css";
import type { Album } from "typings/album";
import Spinner from "./LoadingSpinner";

const AudioPlayer = forwardRef<ReactH5AudioPlayer, Album>(
  ({ album_title, album_artist, track_title, album_image, url }, ref) => {
    return (
      <div className="audioPlayerContainer">
        <div className="playerInfoContainer">
          <div className="title">{track_title}</div>
          <div className="album">{album_title}</div>
          <div className="artist">{album_artist}</div>
        </div>
        <div className="playerControlContainer">
          <LazyLoadImage
            src={album_image}
            width={88}
            height={88}
            alt={album_title}
            placeholder={<Spinner />}
          />
          <ReactH5AudioPlayer src={url} ref={ref} />
        </div>
      </div>
    );
  }
);

export default AudioPlayer;

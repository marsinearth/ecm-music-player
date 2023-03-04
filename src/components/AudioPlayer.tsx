import { forwardRef } from "react";
import ReactH5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "styles/AudioPlayer.css";
import type { Album } from "typings/album";
import Spinner from "./LoadingSpinner";

const AlbumCover = ({ album_title, album_artist, track_title, album_image }: Omit<Album, 'url'>) => (
  <div className="playerInfoContainer">
    <LazyLoadImage
      src={album_image}
      alt={album_title}
      width={400}
      height={400}
      placeholder={<Spinner />}
    />
    <div className="title">{track_title}</div>
  </div  >
)

const AudioPlayer = forwardRef<ReactH5AudioPlayer, Album>(
  ({ url, ...albumProps }, ref) => {
    return (
      <div className="audioPlayerContainer">                
        <ReactH5AudioPlayer src={url} ref={ref} header={<AlbumCover {...albumProps}/>} />
      </div>
    );
  }
);

export default AudioPlayer;

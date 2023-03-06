import { Dispatch, forwardRef, SetStateAction, useCallback } from "react";
import ReactH5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "styles/AudioPlayer.css";
import type { Album } from "typings/album";
import Spinner from "./LoadingSpinner";

type AudioPlayerProps = {
  album: Album;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  handlePrevTrack: () => void;
  handleNextTrack: () => void;
};

type AlbumCoverProps = Omit<Album, "url"> & {
  onOpenModal: () => void;
};

const AlbumCover = ({
  album_title,
  track_title,
  album_image,
  onOpenModal,
}: AlbumCoverProps) => (
  <div className="playerInfoContainer">
    <LazyLoadImage
      src={album_image}
      alt={album_title}
      placeholder={<Spinner />}
      onClick={onOpenModal}
    />
    <div className="title">{track_title}</div>
  </div>
);

const AudioPlayer = forwardRef<ReactH5AudioPlayer, AudioPlayerProps>(
  ({ album, setModalOpen, handlePrevTrack, handleNextTrack }, ref) => {
    if (!album) {
      return <Spinner style={{ height: 400 }} />;
    }

    const onOpenModal = useCallback(() => {
      setModalOpen(true);
    }, []);

    const { url, ...albumProps } = album;
    return (
      <ReactH5AudioPlayer
        src={url}
        ref={ref}
        header={<AlbumCover {...albumProps} onOpenModal={onOpenModal} />}
        onClickNext={handleNextTrack}
        onClickPrevious={handlePrevTrack}
        onEnded={handleNextTrack}
        showSkipControls
        showJumpControls={false}
      />
    );
  }
);

export default AudioPlayer;

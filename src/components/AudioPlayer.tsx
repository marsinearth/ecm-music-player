import {
  Dispatch,
  forwardRef,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import { default as ReactH5AudioPlayer, RHAP_UI } from "react-h5-audio-player";
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

type LibraryButtonProps = {
  visible: boolean;
  onOpenModal: () => void;
};

type AlbumCoverProps = Partial<Omit<Album, "url">> &
  Pick<LibraryButtonProps, "onOpenModal">;

const LoopOneBadge = () => <div className="playerLoopOneBadge">1</div>;

const LibraryButton = ({ visible, onOpenModal }: LibraryButtonProps) => {
  if (!visible) {
    return null;
  }
  return <div className="libraryButton" onClick={onOpenModal} />;
};

const AlbumSpinner = () => (
  <Spinner
    style={{
      width: "100vw",
      maxWidth: 430,
      height: "100vw",
      maxHeight: 430,
    }}
  />
);

const AlbumCover = ({
  track_title,
  album_image,
  album_title,
  onOpenModal,
}: AlbumCoverProps) => {
  return (
    <div className="playerInfoContainer">
      <div className="albumCover">
        {!album_image ? (
          <AlbumSpinner />
        ) : (
          <>
            <LazyLoadImage
              src={album_image}
              alt={album_title}
              placeholder={<AlbumSpinner />}
              onClick={onOpenModal}
            />
            <div className="library" />
          </>
        )}
      </div>
      <div className="title">{track_title}</div>
    </div>
  );
};
const AudioPlayer = forwardRef<ReactH5AudioPlayer, AudioPlayerProps>(
  ({ album, setModalOpen, handlePrevTrack, handleNextTrack }, ref) => {
    const { url, ...albumProps } = album ?? {};

    const onOpenModal = useCallback(() => {
      setModalOpen(true);
    }, []);

    useEffect(() => {
      if (
        album &&
        (ref as RefObject<ReactH5AudioPlayer>)?.current?.audio?.current &&
        "mediaSession" in navigator
      ) {
        const { track_title, album_title, album_artist, album_image } = album;
        const audio = (ref as RefObject<ReactH5AudioPlayer>)?.current?.audio
          ?.current;
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track_title,
          artist: album_artist,
          album: album_title,
          artwork: [
            {
              src: album_image,
              sizes: "1000x1000",
              type: "image/webp",
            },
          ],
        });

        navigator.mediaSession.setActionHandler("play", () => {
          audio?.play();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          audio?.pause();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          handlePrevTrack();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          handleNextTrack();
        });
      }
    }, [album, handlePrevTrack, handleNextTrack]);

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
        layout="stacked-reverse"
        defaultCurrentTime="Loading..."
        defaultDuration="Loading..."
        customAdditionalControls={[
          RHAP_UI.LOOP,
          <LoopOneBadge key="loopOne" />,
          <LibraryButton
            key="libraryButton"
            visible={!!album}
            onOpenModal={onOpenModal}
          />,
        ]}
      />
    );
  }
);

export default AudioPlayer;

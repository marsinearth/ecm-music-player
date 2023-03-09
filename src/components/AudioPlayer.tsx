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
import LazyLoad from "react-lazyload";
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

const CopyRightText = () => (
  <div className="copyright">
    all rights reserved to
    <a
      href="https://ecmrecords.com/"
      title="ECM Records"
      rel="noopener noreferrer nofollow"
      target="_blank"
    >
      ECM Records
    </a>
  </div>
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
          <Spinner />
        ) : (
          <>
            <LazyLoad height="100%" placeholder={<Spinner />} once>
              <img src={album_image} alt={album_title} onClick={onOpenModal} />
            </LazyLoad>
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
      if (album && "mediaSession" in navigator) {
        const { track_title, album_title, album_artist, album_image } = album;

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
      }
    }, [album]);

    useEffect(() => {
      if (
        (ref as RefObject<ReactH5AudioPlayer>)?.current?.audio?.current &&
        "mediaSession" in navigator
      ) {
        const audio = (ref as RefObject<ReactH5AudioPlayer>)?.current?.audio
          ?.current;
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
    }, [handlePrevTrack, handleNextTrack]);

    return (
      <ReactH5AudioPlayer
        src={url}
        ref={ref}
        header={<AlbumCover {...albumProps} onOpenModal={onOpenModal} />}
        footer={<CopyRightText />}
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

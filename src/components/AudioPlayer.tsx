import {
  forwardRef,
  useCallback,
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { default as ReactH5AudioPlayer, RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "styles/AudioPlayer.css";
import type { Album } from "typings/album";
import ImageLoader from "./ImageLoader";

type AudioPlayerProps = {
  album: Album;
  disconnected: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  handlePrevTrack: () => void;
  handleNextTrack: () => void;
};

type LibraryButtonProps = {
  visible: boolean;
  onOpenModal: () => void;
};

type AlbumCoverProps = Partial<Omit<Album, "url">> &
  Pick<AudioPlayerProps, "disconnected"> &
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
  disconnected,
  onOpenModal,
}: AlbumCoverProps) => {
  return (
    <div className="playerInfoContainer">
      <ImageLoader
        src={album_image}
        alt={album_title}
        disconnected={disconnected}
        onClick={onOpenModal}
        style={{ maxWidth: 430, maxHeight: 430 }}
      >
        <div className="library" />
      </ImageLoader>
      <div className="title">{track_title}</div>
    </div>
  );
};
const AudioPlayer = forwardRef<ReactH5AudioPlayer, AudioPlayerProps>(
  (
    { album, disconnected, setModalOpen, handlePrevTrack, handleNextTrack },
    ref
  ) => {
    const { url, ...albumProps } = album ?? {};

    const onOpenModal = useCallback(() => {
      setModalOpen(true);
      const body = document.querySelector("body");
      if (body) {
        body.style.overflow = "hidden";
      }
    }, []);

    const onLoadedData = (e: Event) => {
      (e?.currentTarget as HTMLAudioElement)?.parentElement?.focus();
    };

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
        header={
          <AlbumCover
            {...albumProps}
            disconnected={disconnected}
            onOpenModal={onOpenModal}
          />
        }
        footer={<CopyRightText />}
        onClickNext={handleNextTrack}
        onClickPrevious={handlePrevTrack}
        onEnded={handleNextTrack}
        showSkipControls
        showJumpControls={false}
        layout="stacked-reverse"
        defaultCurrentTime="Loading..."
        defaultDuration="Loading..."
        onLoadedData={onLoadedData}
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

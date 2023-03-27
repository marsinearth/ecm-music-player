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
import AlbumCover from "./AlbumCover";

type AudioPlayerProps = {
  list: Album[];
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  disconnected: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

type LibraryButtonProps = {
  visible: boolean;
  onOpenModal: () => void;
};

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

const AudioPlayer = forwardRef<ReactH5AudioPlayer, AudioPlayerProps>(
  (
    { list, disconnected, setModalOpen, selectedIndex, setSelectedIndex },
    ref
  ) => {
    const selectedAlbum = list[selectedIndex];

    const { url, ...albumProps } = selectedAlbum ?? {};

    const onOpenModal = useCallback(() => {
      setModalOpen(true);
      const body = document.querySelector("body");
      if (body) {
        body.style.overflow = "hidden";
      }
    }, []);

    const handlePrevTrack = () => {
      const audio = (ref as RefObject<ReactH5AudioPlayer>)?.current?.audio
        ?.current;

      if (audio) {
        // if playback time is more than 5 sec, reset the playback rather than set prev track
        if (audio.currentTime > 5) {
          audio.currentTime = 0;
        } else {
          setSelectedIndex((currSelectedIndex) =>
            currSelectedIndex > 0 ? currSelectedIndex - 1 : list.length - 1
          );
        }
      }
    };

    const handleNextTrack = () => {
      setSelectedIndex((currSelectedIndex) =>
        currSelectedIndex < list.length - 1 ? currSelectedIndex + 1 : 0
      );
    };

    const onLoadedData = (e: Event) => {
      (e?.currentTarget as HTMLAudioElement)?.parentElement?.focus();
    };

    useEffect(() => {
      if (selectedAlbum && "mediaSession" in navigator) {
        const {
          track_title: title,
          album_title: album,
          album_artist: artist,
          album_image: src,
        } = selectedAlbum;

        navigator.mediaSession.metadata = new MediaMetadata({
          title,
          artist,
          album,
          artwork: [
            {
              src,
              sizes: "1000x1000",
              type: "image/webp",
            },
          ],
        });
      }
    }, [selectedAlbum]);

    useEffect(() => {
      const audio = (ref as RefObject<ReactH5AudioPlayer>)?.current?.audio
        ?.current;

      if (audio && "mediaSession" in navigator) {
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
        preload="metadata"
        ref={ref}
        header={
          <AlbumCover
            {...albumProps}
            disconnected={disconnected}
            onOpenModal={onOpenModal}
            handlePrevTrack={handlePrevTrack}
            handleNextTrack={handleNextTrack}
          />
        }
        footer={<CopyRightText />}
        onClickNext={handleNextTrack}
        onClickPrevious={handlePrevTrack}
        onEnded={handleNextTrack}
        showSkipControls
        showJumpControls={false}
        layout="stacked-reverse"
        onLoadedData={onLoadedData}
        customAdditionalControls={[
          RHAP_UI.LOOP,
          <LoopOneBadge key="loopOne" />,
          <LibraryButton
            key="libraryButton"
            visible={!!selectedAlbum}
            onOpenModal={onOpenModal}
          />,
        ]}
      />
    );
  }
);

export default AudioPlayer;

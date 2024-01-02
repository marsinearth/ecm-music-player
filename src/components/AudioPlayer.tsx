import {
  forwardRef,
  useCallback,
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { default as ReactH5AudioPlayer, RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "styles/AudioPlayer.css";
import type { Album } from "typings/album";
import AlbumCover from "./AlbumCover";

type AudioPlayerProps = {
  list: Album[];
  samplesIndexMap: Map<Album["album_title"], number>;
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  disconnected: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

type LibraryButtonProps = {
  visible: boolean;
  onOpenModal: () => void;
};

type CopyButtonProps = Pick<Album, "track_title">;

const LoopOneBadge = () => <div className="playerLoopOneBadge">1</div>;

const LibraryButton = ({ visible, onOpenModal }: LibraryButtonProps) => {
  if (!visible) {
    return null;
  }
  return <div className="libraryButton" onClick={onOpenModal} />;
};

const CopyButton = ({ track_title }: CopyButtonProps) => (
  <CopyToClipboard
    text={window.location.href}
    onCopy={() =>
      toast(`${track_title} is copied!`, {
        id: "clipboard",
        icon: "🔗",
        style: {
          borderRadius: "10px",
          backgroundColor: "#7b7b7b",
          color: "#fff",
        },
        position: "bottom-center",
        duration: 2000,
      })
    }
  >
    <div className="copyLinkButton" />
  </CopyToClipboard>
);

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
    {
      list,
      samplesIndexMap,
      disconnected,
      setModalOpen,
      selectedIndex,
      setSelectedIndex,
    },
    ref
  ) => {
    const defaultAlbumId = list[0]?.id;
    const navigate = useNavigate();
    const { albumId } = useParams<{ albumId: string }>();
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
          const toIndex =
            selectedIndex > 0 ? selectedIndex - 1 : list.length - 1;
          const foundAlbumId = list[toIndex]?.id;
          if (foundAlbumId) {
            navigate(`/${foundAlbumId}`);
          }
        }
      }
    };

    const handleNextTrack = () => {
      const toIndex = selectedIndex < list.length - 1 ? selectedIndex + 1 : 0;
      const foundAlbumId = list[toIndex]?.id;
      if (foundAlbumId) {
        navigate(`/${foundAlbumId}`);
      }
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
              sizes: "300x300",
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

    useEffect(() => {
      if (samplesIndexMap.size) {
        if (!albumId) {
          navigate(`/${defaultAlbumId}`);
        } else {
          const foundIndex = samplesIndexMap.get(albumId);
          setSelectedIndex((prevSelectedIndex) => {
            if (prevSelectedIndex !== foundIndex) {
              return Number(foundIndex);
            }
            return prevSelectedIndex;
          });
        }
      }
    }, [navigate, defaultAlbumId, albumId, samplesIndexMap]);

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
          <CopyButton key="copyLink" track_title={albumProps.track_title} />,
        ]}
      />
    );
  }
);

export default AudioPlayer;

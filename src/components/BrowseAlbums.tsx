import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import H5AudioPlayer from "react-h5-audio-player";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "styles/BrowseAlbums.css";
import type { Album } from "typings/album";
import AlbumCard from "./AlbumCard";

type AlbumsModalProps = {
  modalOpen: boolean;
  disconnected: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  samplesList: Album[];
  selectedIndex: number;
};

type CloseButtonProps = {
  onCloseModal: () => void;
};

const CloseButton = ({ onCloseModal }: CloseButtonProps) => {
  return <div className="closeBtn" onClick={onCloseModal} />;
};

const BrowseAlbums = forwardRef<H5AudioPlayer, AlbumsModalProps>(
  (
    { modalOpen, disconnected, setModalOpen, samplesList, selectedIndex },
    playerRef
  ) => {
    const scrollContainerRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();
    const [scrollTop, setScrollTop] = useState(0);
    const onCloseModal = useCallback(() => {
      setModalOpen(false);
    }, []);

    const setAlbum = useCallback(
      (index: number) => {
        const { id } = samplesList[index];
        navigate(`/${id}`);
        onCloseModal();
      },
      [navigate, onCloseModal, samplesList]
    );

    const wrapperStyle: CSSProperties = {
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      opacity: modalOpen ? 1 : 0,
      pointerEvents: modalOpen ? "auto" : "none",
      transition: "opacity 500ms ease-in-out",
    };

    const containerStyle: CSSProperties = {
      display: "flex",
      flex: 1,
      width: "100%",
      height: "100%",
      inset: "10px",
      padding: "0",
      backgroundColor: "transparent",
    };

    const playing = !(playerRef as RefObject<H5AudioPlayer>)?.current?.audio
      ?.current?.paused;

    if (modalOpen && scrollContainerRef.current) {
      const { scrollTop: currScrollTop } = scrollContainerRef.current;
      if (scrollTop !== currScrollTop) {
        scrollContainerRef.current.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }

    return (
      <div id="wrapper" style={wrapperStyle}>
        <div id="container" style={containerStyle}>
          <CloseButton onCloseModal={onCloseModal} />
          <section id="albumsContainer" ref={scrollContainerRef}>
            {samplesList.map((album, i) => (
              <AlbumCard
                key={album.id}
                {...album}
                index={i}
                selected={i === selectedIndex}
                playing={playing}
                disconnected={disconnected}
                setAlbum={setAlbum}
                setScrollTop={setScrollTop}
              />
            ))}
          </section>
          <Tooltip anchorSelect=".albumCardContainer" noArrow float />
        </div>
      </div>
    );
  }
);

export default BrowseAlbums;

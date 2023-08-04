import {
  forwardRef,
  useCallback,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import H5AudioPlayer from "react-h5-audio-player";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "styles/AlbumModal.css";
import type { Album } from "typings/album";
import AlbumCard from "./AlbumCard";

Modal.setAppElement("#root");

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

const modalStyle: Modal.Styles = {
  overlay: { backgroundColor: "rgba(0,0,0,0.75)" },
  content: {
    inset: "10px",
    padding: "0",
    backgroundColor: "transparent",
  },
};

const CloseButton = ({ onCloseModal }: CloseButtonProps) => {
  return <div className="closeBtn" onClick={onCloseModal} />;
};

const AlbumsModal = forwardRef<H5AudioPlayer, AlbumsModalProps>(
  (
    { modalOpen, disconnected, setModalOpen, samplesList, selectedIndex },
    playerRef
  ) => {
    const navigate = useNavigate();
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

    const playing = !(playerRef as RefObject<H5AudioPlayer>)?.current?.audio
      ?.current?.paused;

    return (
      <Modal isOpen={modalOpen} closeTimeoutMS={200} style={modalStyle}>
        <CloseButton onCloseModal={onCloseModal} />
        <section>
          {samplesList.map((album, i) => (
            <AlbumCard
              key={album.id}
              {...album}
              index={i}
              selected={i === selectedIndex}
              playing={playing}
              disconnected={disconnected}
              setAlbum={setAlbum}
            />
          ))}
        </section>
        <Tooltip anchorSelect=".albumCardContainer" noArrow float />
      </Modal>
    );
  }
);

export default AlbumsModal;

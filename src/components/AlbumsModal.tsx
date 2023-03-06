import { Dispatch, SetStateAction, useCallback } from "react";
import Modal from "react-modal";
import { Tooltip } from "react-tooltip";
import "styles/AlbumModal.css";
import { Album } from "typings/album";
import AlbumCard from "./AlbumCard";

Modal.setAppElement("#root");

type AlbumsModalProps = {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  samplesList: Album[];
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

type CloseButtonProps = {
  onCloseModal: () => void;
};

const modalStyle: Modal.Styles = {
  overlay: { backgroundColor: "rgba(0,0,0,0.75)" },
  content: {
    inset: "10px",
    padding: "0",
  },
};

const CloseButton = ({ onCloseModal }: CloseButtonProps) => {
  return <div className="closeBtn" onClick={onCloseModal} />;
};

export default function AlbumsModal({
  modalOpen,
  setModalOpen,
  samplesList,
  selectedIndex,
  setSelectedIndex,
}: AlbumsModalProps) {
  const onCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const setAlbum = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      onCloseModal();
    },
    [onCloseModal]
  );

  return (
    <Modal isOpen={modalOpen} closeTimeoutMS={200} style={modalStyle}>
      <section>
        {samplesList.map((album, i) => (
          <AlbumCard
            key={album.id}
            {...album}
            index={i}
            selected={i === selectedIndex}
            setAlbum={setAlbum}
          />
        ))}
        <CloseButton onCloseModal={onCloseModal} />
      </section>
      <Tooltip anchorSelect=".albumCardContainer" noArrow float />
    </Modal>
  );
}

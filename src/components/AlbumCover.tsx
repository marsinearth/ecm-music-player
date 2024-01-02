import { useRef, type MouseEvent, type TouchEvent } from "react";
import type { Album } from "typings/album";
import ImageLoader from "./ImageLoader";

type InteractionX = {
  touchClientXStart: number;
  touchClientXDelta: number;
  mouseClientXStart: number;
  mouseClientXDelta: number;
};

type AlbumCoverProps = Partial<Omit<Album, "url">> & {
  disconnected: boolean;
  onOpenModal: () => void;
  handlePrevTrack: () => void;
  handleNextTrack: () => void;
  isPlayerAlbum?: boolean;
};

export default function AlbumCover({
  track_title,
  album_image,
  album_title,
  disconnected,
  onOpenModal,
  handlePrevTrack,
  handleNextTrack,
}: AlbumCoverProps) {
  const interactionRef = useRef<InteractionX>({
    touchClientXStart: 0,
    touchClientXDelta: 0,
    mouseClientXStart: 0,
    mouseClientXDelta: 0,
  });

  const resetTouchClientX = () => {
    interactionRef.current.touchClientXStart = 0;
    interactionRef.current.touchClientXDelta = 0;
  };

  const resetMouseClientX = () => {
    interactionRef.current.mouseClientXStart = 0;
    interactionRef.current.mouseClientXDelta = 0;
  };

  const onTouchStart = ({ changedTouches }: TouchEvent<HTMLDivElement>) => {
    const touch = changedTouches?.item(0);
    interactionRef.current.touchClientXStart = touch?.clientX;
  };

  const onTouchEnd = ({ changedTouches }: TouchEvent<HTMLDivElement>) => {
    const touch = changedTouches?.item(0);
    interactionRef.current.touchClientXDelta = touch?.clientX;

    const { touchClientXStart, touchClientXDelta } = interactionRef.current;
    if (touchClientXStart - touchClientXDelta > 40) {
      handleNextTrack();
      resetTouchClientX();
    } else if (touchClientXStart - touchClientXDelta < -40) {
      handlePrevTrack();
      resetTouchClientX();
    } else {
      onOpenModal();
    }
  };

  const onMouseDown = ({ clientX }: MouseEvent<HTMLDivElement>) => {
    interactionRef.current.mouseClientXStart = clientX;
  };

  const onMouseUp = ({ clientX }: MouseEvent<HTMLDivElement>) => {
    interactionRef.current.mouseClientXDelta = clientX;

    const { mouseClientXStart, mouseClientXDelta } = interactionRef.current;
    if (mouseClientXStart - mouseClientXDelta > 50) {
      handleNextTrack();
      resetMouseClientX();
    } else if (mouseClientXStart - mouseClientXDelta < -50) {
      handlePrevTrack();
      resetMouseClientX();
    } else {
      onOpenModal();
    }
  };

  return (
    <div
      className="playerInfoContainer"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <ImageLoader
        src={album_image}
        alt={album_title}
        disconnected={disconnected}
        style={{ maxWidth: 430, maxHeight: 430 }}
      >
        <div className="library" />
      </ImageLoader>
      <div className="title">{track_title}</div>
    </div>
  );
}

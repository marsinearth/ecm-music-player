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

  const onTouchStart = ({ changedTouches }: TouchEvent<HTMLDivElement>) => {
    const touch = changedTouches?.item(0);
    interactionRef.current.touchClientXStart = touch?.clientX;
  };

  const onTouchEnd = ({ changedTouches }: TouchEvent<HTMLDivElement>) => {
    const touch = changedTouches?.item(0);
    interactionRef.current.touchClientXDelta = touch?.clientX;

    const { touchClientXStart, touchClientXDelta } = interactionRef.current;
    if (touchClientXStart - touchClientXDelta > 20) {
      handleNextTrack();
    } else if (touchClientXStart - touchClientXDelta < -20) {
      handlePrevTrack();
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
    } else if (mouseClientXStart - mouseClientXDelta < -50) {
      handlePrevTrack();
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

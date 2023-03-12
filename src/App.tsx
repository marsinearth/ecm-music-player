import AlbumsModal from "components/AlbumsModal";
import AudioPlayer from "components/AudioPlayer";
import { useCallback, useEffect, useRef, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";

import "react-tooltip/dist/react-tooltip.css";
import "styles/App.css";
import type { Album } from "typings/album";

async function fetchAPI() {
  const res = await fetch(process.env.REACT_APP_BACKEND_SERVER ?? "");
  return res.json();
}

function App() {
  const playerRef = useRef<H5AudioPlayer | null>(null);
  const [backendAvail, setBackendAvail] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [samplesList, setSamplesList] = useState<Album[]>([]);

  const handlePrevTrack = useCallback(() => {
    setSelectedIndex((currSelectedIndex) =>
      currSelectedIndex > 0 ? currSelectedIndex - 1 : samplesList.length - 1
    );
  }, [samplesList]);

  const handleNextTrack = useCallback(() => {
    setSelectedIndex((currSelectedIndex) =>
      currSelectedIndex < samplesList.length - 1 ? currSelectedIndex + 1 : 0
    );
  }, [samplesList]);

  useEffect(() => {
    fetchAPI()
      .then((res) => {
        setSamplesList((prev) => {
          if (!prev.length) {
            return res;
          }
          return prev;
        });
      })
      .catch((err) => {
        setBackendAvail(false);
        console.warn({ err });
      });
  }, []);

  return (
    <div className="App">
      <header>
        <div className="audioPlayerContainer">
          <AudioPlayer
            ref={playerRef}
            album={samplesList[selectedIndex]}
            backendAvail={backendAvail}
            setModalOpen={setModalOpen}
            handlePrevTrack={handlePrevTrack}
            handleNextTrack={handleNextTrack}
          />
        </div>
      </header>
      <AlbumsModal
        ref={playerRef}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        samplesList={samplesList}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </div>
  );
}

export default App;

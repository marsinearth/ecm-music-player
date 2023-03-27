import AlbumsModal from "components/AlbumsModal";
import AudioPlayer from "components/AudioPlayer";
import { useEffect, useRef, useState } from "react";
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
  const [disconnected, setDisconnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [samplesList, setSamplesList] = useState<Album[]>([]);

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
        setDisconnected(true);
        console.warn({ err });
      });
  }, []);

  return (
    <div className="App">
      <header>
        <div className="audioPlayerContainer">
          <AudioPlayer
            ref={playerRef}
            list={samplesList}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            disconnected={disconnected}
            setModalOpen={setModalOpen}
          />
        </div>
      </header>
      <AlbumsModal
        ref={playerRef}
        modalOpen={modalOpen}
        disconnected={disconnected}
        setModalOpen={setModalOpen}
        samplesList={samplesList}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </div>
  );
}

export default App;

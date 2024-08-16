import AudioPlayer from "components/AudioPlayer";
import BrowseAlbums from "components/BrowseAlbums";
import { useEffect, useRef, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import { Toaster } from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";
import "styles/App.css";
import type { Album } from "typings/album";

async function fetchAPI() {
  const res = await fetch(process.env.REACT_APP_BACKEND_SERVER ?? "", {
    signal: AbortSignal.timeout(15000),
  });
  return res.json();
}

function App() {
  const playerRef = useRef<H5AudioPlayer | null>(null);
  const [disconnected, setDisconnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [samplesList, setSamplesList] = useState<Album[]>([]);
  const [samplesIndexMap, setSamplesIndexMap] = useState<
    Map<Album["album_title"], number>
  >(new Map());

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

  // map all samplesList by its album name for fast url-find
  useEffect(() => {
    const filledIndexMap = samplesList.reduce(
      (resMap, { id }, index) => resMap.set(id, index),
      new Map()
    );
    setSamplesIndexMap(filledIndexMap);
  }, [samplesList]);

  // console.log({ samplesList });

  return (
    <div className="App">
      <header>
        <div className="audioPlayerContainer">
          <AudioPlayer
            ref={playerRef}
            list={samplesList}
            samplesIndexMap={samplesIndexMap}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            disconnected={disconnected}
            setModalOpen={setModalOpen}
          />
        </div>
      </header>
      <BrowseAlbums
        ref={playerRef}
        modalOpen={modalOpen}
        disconnected={disconnected}
        setModalOpen={setModalOpen}
        samplesList={samplesList}
        selectedIndex={selectedIndex}
      />
      <Toaster />
    </div>
  );
}

export default App;

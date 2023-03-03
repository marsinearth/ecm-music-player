import AlbumCard from "components/AlbumCard";
import AudioPlayer from "components/AudioPlayer";
import { useCallback, useEffect, useRef, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import type { Album } from "typings/album";
import "./styles/App.css";

async function fetchAPI() {
  const res = await fetch(process.env.REACT_APP_BACKEND_SERVER ?? "");
  return res.json();
}

function App() {
  const player = useRef<H5AudioPlayer | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [samplesList, setSamplesList] = useState<Album[]>([]);

  const setAlbum = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

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
        console.warn({ err });
      });
  }, []);

  // useEffect(() => {
  //   if (player.current) {
  //     player.current?.audio?.current?.pause();
  //   }
  // }, [selectedIndex]);

  return (
    <div className="App">
      <header>
        <p>ECM Samples Player!</p>
        <AudioPlayer {...samplesList[selectedIndex]} ref={player} />
      </header>
      <section>
        {samplesList.map((album, i) => (
          <AlbumCard key={album.id} {...album} index={i} setAlbum={setAlbum} />
        ))}
      </section>
      <Tooltip anchorSelect=".audioCardContainer" />
    </div>
  );
}

export default App;

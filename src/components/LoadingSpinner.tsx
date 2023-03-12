import type { CSSProperties } from "react";
import "styles/LoadingSpinner.css";

type StylerProps = {
  style?: CSSProperties;
};

export default function Spinner({ style }: StylerProps) {
  return (
    <div className="loadingContainer" style={style}>
      <div className="spinner">
        <div className="r1"></div>
        <div className="r2"></div>
        <div className="r3"></div>
        <div className="r4"></div>
        <div className="r5"></div>
      </div>
    </div>
  );
}

export function WirelessDisabled({ style }: StylerProps) {
  return (
    <div className="loadingContainer" style={style}>
      <div className="wireless-disabled" />
    </div>
  );
}

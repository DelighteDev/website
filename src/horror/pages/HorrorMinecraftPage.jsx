import WavyHeading from "../../components/WavyHeading";
import { useCopy } from "../../hooks/useCopy";
import { HINT_DOWNLOAD_URL, horrorMinecraft } from "../data/minecraft";

export default function HorrorMinecraftPage() {
  const { copied, copy } = useCopy();

  const copyAndDownload = () => {
    copy(horrorMinecraft.serverIp);
    const link = document.createElement("a");
    link.href = HINT_DOWNLOAD_URL;
    link.download = "";
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="minecraft-page page-section horror-minecraft">
      <div className="minecraft-pattern" aria-hidden="true"><span /><span /><span /><span /></div>
      <WavyHeading as="h1" className="page-heading">Minecraft Server</WavyHeading>
      <section className="server-ip-section" aria-label="Server IP">
        <p className="server-ip">{horrorMinecraft.serverIp}</p>
        <button type="button" className="copy-button horror-copy-ip" onClick={copyAndDownload} aria-live="polite">
          {copied ? "Copied" : "Copy IP"}
        </button>
      </section>
      <div className="server-details">
        <p><strong>Edition:</strong> {horrorMinecraft.edition}</p>
        <p>{horrorMinecraft.versionNote}</p>
      </div>
      <a href={horrorMinecraft.mapUrl} className="text-button map-button" target="_blank" rel="noreferrer">
        Live map (Dynmap)
      </a>
      <div className="server-description">
        {horrorMinecraft.description.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <section className="join-section" aria-labelledby="horror-join-heading">
        <WavyHeading as="h2"><span id="horror-join-heading">How to join</span></WavyHeading>
        <ol>{horrorMinecraft.joinSteps.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>
    </div>
  );
}

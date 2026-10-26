import CopyButton from "../components/CopyButton";
import WavyHeading from "../components/WavyHeading";
import { minecraft } from "../data/minecraft";

export default function MinecraftPage() {
  return (
    <div className="minecraft-page page-section">
      <div className="minecraft-pattern" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <WavyHeading as="h1" className="page-heading">
        Minecraft Server
      </WavyHeading>

      <section className="server-ip-section" aria-label="Server IP">
        <p className="server-ip">{minecraft.serverIp}</p>
        <CopyButton text={minecraft.serverIp} label="Copy IP" />
      </section>

      <div className="server-details">
        <p><strong>Edition:</strong> {minecraft.edition}</p>
        <p>{minecraft.versionNote}</p>
      </div>

      <a
        href={minecraft.mapUrl}
        className="text-button map-button"
        target="_blank"
        rel="noreferrer"
      >
        Live map (Dynmap)
      </a>

      <div className="server-description">
        {minecraft.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <section className="join-section" aria-labelledby="join-heading">
        <WavyHeading as="h2">
          <span id="join-heading">How to join</span>
        </WavyHeading>
        <ol>
          {minecraft.joinSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

import { useState } from "react";
import CopyButton from "../components/CopyButton";
import WavyHeading from "../components/WavyHeading";
import {
  aboutParagraphs,
  discordUsername,
  emailAddress,
  emailLine,
  introduction,
  socialLinks,
  socialNote,
  spotify,
} from "../data/home";

export default function HomePage() {
  const [thoughtOpen, setThoughtOpen] = useState(false);

  return (
    <section id="about" className="about-section page-section" aria-label="About">
      <div className="introduction">
        <div className="introduction-heading">
          <h2 className="introduction-name">{introduction.name}</h2>
          <p className="introduction-age">Age {introduction.age}</p>
        </div>
        <p className="introduction-degree">{introduction.degree}</p>
      </div>

      <div className="about-copy">
        {aboutParagraphs.map((paragraph, index) =>
          paragraph.thought ? (
            <div className="thought-spoiler" key={index}>
              <button
                type="button"
                className="thought-toggle"
                aria-expanded={thoughtOpen}
                aria-controls="thought-spoiler-content"
                onClick={() => setThoughtOpen((open) => !open)}
              >
                Click to Reveal: Thoughts on one such buzzword
              </button>
              <div
                id="thought-spoiler-content"
                className="thought-content"
                hidden={!thoughtOpen}
              >
                <p>{paragraph.text}</p>
              </div>
            </div>
          ) : (
            <p key={index}>{paragraph.text}</p>
          ),
        )}
      </div>

      <section className="socials-section" aria-labelledby="socials-heading">
        <WavyHeading as="h2" className="section-heading">
          <span id="socials-heading">Socials</span>
        </WavyHeading>
        <ul className="social-list">
          <li>
            <a href={socialLinks[0].url} target="_blank" rel="noreferrer">
              {socialLinks[0].name}
            </a>
          </li>
          <li className="discord-line">
            <span>Discord</span>
            <span className="discord-username">{discordUsername}</span>
            <CopyButton text={discordUsername} />
          </li>
          {socialLinks.slice(1).map((social) => (
            <li key={social.name}>
              <a href={social.url} target="_blank" rel="noreferrer">
                {social.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="social-note">{socialNote}</p>

        <div className="email-block">
          <a href={`mailto:${emailAddress}`} className="email-link">
            {emailAddress}
          </a>
          <p>{emailLine}</p>
          <CopyButton text={emailAddress} label="Copy email" />
        </div>
      </section>

      <section className="spotify-section" aria-labelledby="spotify-heading">
        <WavyHeading as="h2" className="section-heading">
          <span id="spotify-heading">Spotify</span>
        </WavyHeading>
        <div className="spotify-player">
          <iframe
            title="Spotify playlist"
            src={spotify.playlistEmbed}
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            allowFullScreen
          />
        </div>
        <a
          href={spotify.profile}
          className="text-button spotify-follow"
          target="_blank"
          rel="noreferrer"
        >
          Follow me on Spotify
        </a>
      </section>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import CopyButton from "../../components/CopyButton";
import WavyHeading from "../../components/WavyHeading";
import {
  aboutParagraphs,
  discordUsername,
  emailAddress,
  emailLine,
  introduction,
  socialLinks,
  socialNote,
  spotify,
} from "../../data/home";
import DelayedCursor from "../components/DelayedCursor";
import MutatingParagraph from "../components/MutatingParagraph";
import { horrorReveal } from "../data/home";

function isThirdVisit() {
  try {
    return Number(localStorage.getItem("delightedev-horror-about-visits") || 0) >= 2;
  } catch {
    return false;
  }
}

export default function HorrorAboutPage() {
  const [thoughtOpen, setThoughtOpen] = useState(false);
  const [mirrored] = useState(isThirdVisit);
  const [forever, setForever] = useState(false);
  const introductionRef = useRef(null);
  const passedIntroduction = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setForever(true), 15000);
    const watchScroll = () => {
      const bounds = introductionRef.current?.getBoundingClientRect();
      if (!bounds) return;
      if (bounds.bottom < 0) passedIntroduction.current = true;
      if (passedIntroduction.current && bounds.top >= 0 && bounds.bottom < window.innerHeight) {
        setForever(true);
      }
    };
    window.addEventListener("scroll", watchScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", watchScroll);
    };
  }, []);

  return (
    <section id="about" className={`about-section page-section horror-about ${mirrored ? "third-visit" : ""}`} aria-label="About">
      <DelayedCursor />
      <div className="introduction horror-introduction" ref={introductionRef}>
        <div className="introduction-heading">
          <h2 className="introduction-name">{introduction.name}</h2>
          <p className="introduction-age">Age {introduction.age}{forever ? " Forever" : ""}</p>
        </div>
        <p className="introduction-degree">{introduction.degree}</p>
      </div>

      <div className="about-copy horror-about-copy">
        <MutatingParagraph text={aboutParagraphs[0].text} />
        <p className="selection-ghost">stop reading his words</p>

        <div className="thought-spoiler horror-thought-spoiler">
          <button
            type="button"
            className="thought-toggle"
            aria-expanded={thoughtOpen}
            aria-controls="horror-thought-content"
            onClick={() => setThoughtOpen((open) => !open)}
          >
            Click to reveal: Thoughts on one such buzzword
          </button>
          <div id="horror-thought-content" className="thought-content" hidden={!thoughtOpen}>
            {horrorReveal.map((paragraph, index) => (
              <p className={`reveal-${paragraph.tone}`} key={index}>
                {paragraph.text}
              </p>
            ))}
          </div>
        </div>

        <MutatingParagraph text={aboutParagraphs[2].text} />
        <p className="selection-ghost">that is not me</p>
        <MutatingParagraph text={aboutParagraphs[3].text} />
        <p className="selection-ghost">he is wearing your name</p>
      </div>

      <section className="socials-section" aria-labelledby="horror-socials-heading">
        <WavyHeading as="h2" className="section-heading">
          <span id="horror-socials-heading">Socials</span>
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
          <a href={`mailto:${emailAddress}`} className="email-link">{emailAddress}</a>
          <p>{emailLine}</p>
          <CopyButton text={emailAddress} label="Copy email" />
        </div>
      </section>

      <section className="spotify-section" aria-labelledby="horror-spotify-heading">
        <WavyHeading as="h2" className="section-heading">
          <span id="horror-spotify-heading">Spotify</span>
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
        <a href={spotify.profile} className="text-button spotify-follow" target="_blank" rel="noreferrer">
          Follow me on Spotify
        </a>
      </section>
    </section>
  );
}

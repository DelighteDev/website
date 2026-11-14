import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { horrorRoutes } from "../routes";

const hiddenTitles = ["Don't leave me here", "Are you still there?", "Who are you?"];

export default function HorrorPageEffects() {
  const location = useLocation();

  useEffect(() => {
    document.title = "The Delight Experience?";
    if (location.hash === "#about") {
      const timer = window.setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return undefined;
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    const handleVisibility = () => {
      if (document.hidden) {
        document.title = hiddenTitles[Math.floor(Math.random() * hiddenTitles.length)];
      } else {
        document.title = "The Delight Experience?";
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      robots.remove();
      document.title = "The Delight Experience";
    };
  }, []);

  return null;
}

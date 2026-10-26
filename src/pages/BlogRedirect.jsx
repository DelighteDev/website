import { useEffect } from "react";
import { BLOG_URL } from "../data/site";

export default function BlogRedirect() {
  useEffect(() => {
    window.location.replace(BLOG_URL);
  }, []);

  return null;
}

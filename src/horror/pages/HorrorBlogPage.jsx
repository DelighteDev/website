import { useEffect, useRef, useState } from "react";
import WavyHeading from "../../components/WavyHeading";
import { credentialsMatch, decryptBlogPayload } from "../data/blogLock";

const ghostWord = "itsnotme";

export default function HorrorBlogPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unlockedText, setUnlockedText] = useState("");
  const [busy, setBusy] = useState(false);
  const hijack = useRef({ started: false, done: false, count: 0, field: "username", timers: [] });

  useEffect(() => () => {
    hijack.current.timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const setField = (field, value) => {
    if (field === "password") setPassword(value);
    else setUsername(value);
  };

  const handleTyping = (event) => {
    const state = hijack.current;
    if (state.done || event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();

    if (!state.started) {
      state.started = true;
      state.field = event.target.name;
    }
    if (state.field !== event.target.name || state.count >= ghostWord.length) return;

    state.count += 1;
    setField(state.field, ghostWord.slice(0, state.count));
    if (state.count !== ghostWord.length) return;

    for (let index = 0; index <= ghostWord.length; index += 1) {
      const timer = window.setTimeout(() => {
        setField(state.field, ghostWord.slice(0, ghostWord.length - index));
      }, 480 + index * 65);
      state.timers.push(timer);
    }
    const finish = window.setTimeout(() => {
      setField(state.field, "");
      state.done = true;
    }, 480 + (ghostWord.length + 1) * 65);
    state.timers.push(finish);
  };

  const guardChange = (field, value) => {
    if (hijack.current.started && !hijack.current.done) return;
    setField(field, value);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy || (hijack.current.started && !hijack.current.done)) return;
    setBusy(true);
    setError("");
    try {
      if (await credentialsMatch(username, password)) {
        const text = await decryptBlogPayload(password);
        setUnlockedText(text);
        setUsername("");
        setPassword("");
      } else {
        setError("no. who are you? why are you here?");
      }
    } catch {
      setError("no. who are you? why are you here?");
    } finally {
      setBusy(false);
    }
  };

  if (unlockedText) {
    return (
      <article className="horror-blog-entry page-section">
        <WavyHeading as="h1" className="page-heading">Blog</WavyHeading>
        <p>{unlockedText}</p>
      </article>
    );
  }

  return (
    <div className="horror-blog-lock page-section">
      <WavyHeading as="h1" className="page-heading">Blog</WavyHeading>
      <p className="blog-lock-note">You should not be here.</p>
      <form onSubmit={submit} className="blog-lock-form">
        <label htmlFor="horror-username">Username</label>
        <input
          id="horror-username"
          name="username"
          type="text"
          value={username}
          onKeyDown={handleTyping}
          onChange={(event) => guardChange("username", event.target.value)}
          autoComplete="off"
          spellCheck="false"
          required
        />
        <label htmlFor="horror-password">Password</label>
        <input
          id="horror-password"
          name="password"
          type="password"
          value={password}
          onKeyDown={handleTyping}
          onChange={(event) => guardChange("password", event.target.value)}
          autoComplete="off"
          required
        />
        <button type="submit" className="text-button" disabled={busy}>
          {busy ? "Wait" : "Enter"}
        </button>
        <p className="blog-lock-error" role="alert">{error}</p>
      </form>
    </div>
  );
}

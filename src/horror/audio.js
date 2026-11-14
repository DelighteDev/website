function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

export function createHorrorAudio(context) {
  const master = context.createGain();
  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(0.72, context.currentTime + 1.8);
  master.connect(context.destination);

  const seconds = 5;
  const roomBuffer = context.createBuffer(2, context.sampleRate * seconds, context.sampleRate);
  for (let channel = 0; channel < roomBuffer.numberOfChannels; channel += 1) {
    const samples = roomBuffer.getChannelData(channel);
    let brown = 0;
    for (let index = 0; index < samples.length; index += 1) {
      const white = Math.random() * 2 - 1;
      brown = (brown + 0.018 * white) / 1.018;
      samples[index] = brown * 3.1 + white * 0.018;
    }
  }

  const source = context.createBufferSource();
  source.buffer = roomBuffer;
  source.loop = true;
  const highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 42;
  const lowpass = context.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1250;
  const roomGain = context.createGain();
  roomGain.gain.value = 0.065;
  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(roomGain);
  roomGain.connect(master);
  source.start();

  const hum = context.createOscillator();
  hum.type = "sine";
  hum.frequency.value = 47;
  const humGain = context.createGain();
  humGain.gain.value = 0.007;
  hum.connect(humGain);
  humGain.connect(master);
  hum.start();

  const activeKnocks = new Set();
  let timer = null;
  let disposed = false;

  const knock = (when, pan) => {
    const duration = 0.48;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    const pitch = randomBetween(82, 112);
    for (let index = 0; index < samples.length; index += 1) {
      const time = index / context.sampleRate;
      const body = Math.sin(2 * Math.PI * pitch * time) * 0.55;
      const wood = Math.sin(2 * Math.PI * pitch * 1.83 * time) * 0.24;
      const impact = (Math.random() * 2 - 1) * Math.exp(-time * 42) * 0.5;
      samples[index] = (body + wood) * Math.exp(-time * 15) + impact;
    }

    const knockSource = context.createBufferSource();
    knockSource.buffer = buffer;
    knockSource.playbackRate.value = randomBetween(0.88, 1.08);
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = randomBetween(520, 760);
    filter.Q.value = 0.8;
    const knockGain = context.createGain();
    knockGain.gain.setValueAtTime(randomBetween(0.16, 0.23), when);
    const panner = context.createStereoPanner();
    panner.pan.value = pan;

    knockSource.connect(filter);
    filter.connect(knockGain);
    knockGain.connect(panner);
    panner.connect(master);
    activeKnocks.add(knockSource);
    knockSource.onended = () => activeKnocks.delete(knockSource);
    knockSource.start(when);
    knockSource.stop(when + duration);
  };

  const schedule = () => {
    if (disposed) return;
    timer = window.setTimeout(() => {
      if (disposed || context.state === "closed") return;
      const count = 2 + Math.floor(Math.random() * 3);
      const pan = (Math.random() < 0.5 ? -1 : 1) * randomBetween(0.78, 0.94);
      const start = context.currentTime + 0.08;
      let offset = 0;
      for (let index = 0; index < count; index += 1) {
        knock(start + offset, pan);
        offset += randomBetween(0.19, 0.34);
      }
      schedule();
    }, randomBetween(12000, 25000));
  };
  schedule();

  return {
    source,
    gain: master,
    dispose() {
      disposed = true;
      window.clearTimeout(timer);
      try {
        hum.stop();
      } catch {
        // The oscillator may already be stopped.
      }
      activeKnocks.forEach((knockSource) => {
        try {
          knockSource.stop();
        } catch {
          // A short knock may already have ended.
        }
      });
      activeKnocks.clear();
    },
  };
}

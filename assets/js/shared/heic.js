// HEIC/HEIF decoding for browsers that can't open iPhone photos themselves (everything but
// Safari). The decoder (about 1.5 MB) is only downloaded the first time a HEIC file is opened.
let worker;
let nextId = 0;
const pending = new Map();

function getWorker() {
  if (!worker) {
    worker = new Worker('/assets/js/shared/heic-worker.js');
    worker.onmessage = ({ data }) => {
      const job = pending.get(data.id);
      if (!job) return;
      pending.delete(data.id);
      if (data.error) job.reject(new Error(data.error));
      else job.resolve(data);
    };
    worker.onerror = () => {
      for (const job of pending.values()) job.reject(new Error('The HEIC decoder couldn’t be loaded'));
      pending.clear();
      worker = null;
    };
  }
  return worker;
}

// True for HEIC/HEIF files, judged by the "ftyp" brand rather than the name.
export async function isHeic(file) {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const box = String.fromCharCode(...head.subarray(4, 12));
  return /^ftyp(heic|heix|hevc|hevx|heim|heis|mif1|msf1)/.test(box) || /\.(heic|heif)$/i.test(file.name);
}

/** Decode a HEIC file to an ImageBitmap. */
export async function decodeHeic(file) {
  const buffer = await file.arrayBuffer();
  const id = ++nextId;
  const { width, height, pixels } = await new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, buffer }, [buffer]);
  });
  return createImageBitmap(new ImageData(new Uint8ClampedArray(pixels), width, height));
}

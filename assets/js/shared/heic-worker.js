// Decodes HEIC/HEIF photos with libheif (WebAssembly) off the main thread.
// Receives { id, buffer } and answers { id, width, height, pixels } (RGBA) or { id, error }.
importScripts('/assets/vendor/libheif/libheif.js');

let lib;
async function load() {
  if (!lib) {
    const res = await fetch('/assets/vendor/libheif/libheif.wasm');
    if (!res.ok) throw new Error('The HEIC decoder couldn’t be loaded');
    lib = self.libheif({ wasmBinary: await res.arrayBuffer() });
  }
  return lib;
}

self.onmessage = async ({ data: { id, buffer } }) => {
  let images = [];
  try {
    const heif = await load();
    images = new heif.HeifDecoder().decode(new Uint8Array(buffer));
    if (!images.length) throw new Error('No image found in this HEIC file');
    // The first image is the primary one; libheif applies its rotation and mirroring for us.
    const image = images[0];
    const width = image.get_width();
    const height = image.get_height();
    const out = { data: new Uint8ClampedArray(width * height * 4), width, height };
    await new Promise((resolve, reject) => image.display(out, (d) => (d ? resolve() : reject(new Error('This HEIC file couldn’t be decoded')))));
    self.postMessage({ id, width, height, pixels: out.data.buffer }, [out.data.buffer]);
  } catch (e) {
    self.postMessage({ id, error: e?.message || String(e) });
  } finally {
    for (const im of images) im.free?.();
  }
};

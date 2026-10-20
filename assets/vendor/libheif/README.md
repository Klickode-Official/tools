# libheif (HEIC/HEIF decoder)

`libheif.js` and `libheif.wasm` are the unmodified WebAssembly build of
[libheif](https://github.com/strukturag/libheif) from the
[libheif-js](https://github.com/catdad-experiments/libheif-js) package, version 1.23.5
(`libheif-wasm/` folder).

libheif is licensed under the GNU Lesser General Public License v3 (see `LICENSE-libheif.txt`
and `LICENSE-libheif-js.txt`). It is loaded as a separate file by
`assets/js/shared/heic-worker.js` only when someone opens a HEIC photo, and can be replaced with
any other compatible build of libheif. The build copies these files as they are: they are not
minified or stamped with the Klickode notice.

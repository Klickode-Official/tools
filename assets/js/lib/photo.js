// ID and passport photo maths: sizes in millimetres, pixels at a print resolution, and how many
// copies fit on a photo-paper sheet.

export const PHOTO_SIZES = {
  '35x45': { w: 35, h: 45, label: '35 × 45 mm', guide: true },
  '2x2in': { w: 50.8, h: 50.8, label: '2 × 2 inch (51 × 51 mm)', guide: true },
  '25x30': { w: 25, h: 30, label: '2.5 × 3 cm' },
  '30x40': { w: 30, h: 40, label: '3 × 4 cm' },
  '40x60': { w: 40, h: 60, label: '4 × 6 cm' },
};

export const mmToPx = (mm, dpi = 300) => Math.round((mm / 25.4) * dpi);

/**
 * Where copies of a photo go on a sheet, all in pixels. Copies sit in a centred grid with a gap
 * between them, inside a margin. Tries the photo both ways round on the sheet and keeps whichever
 * fits more (photos are never rotated, the sheet is).
 */
export function sheetLayout(sheetW, sheetH, photoW, photoH, { margin = 30, gap = 24 } = {}) {
  const fit = (w, h) => {
    const cols = Math.max(0, Math.floor((w - 2 * margin + gap) / (photoW + gap)));
    const rows = Math.max(0, Math.floor((h - 2 * margin + gap) / (photoH + gap)));
    return { cols, rows, w, h };
  };
  const a = fit(sheetW, sheetH);
  const b = fit(sheetH, sheetW);
  const best = b.cols * b.rows > a.cols * a.rows ? b : a;
  const gridW = best.cols * photoW + Math.max(0, best.cols - 1) * gap;
  const gridH = best.rows * photoH + Math.max(0, best.rows - 1) * gap;
  const x0 = Math.round((best.w - gridW) / 2);
  const y0 = Math.round((best.h - gridH) / 2);
  const spots = [];
  for (let r = 0; r < best.rows; r++) for (let c = 0; c < best.cols; c++) spots.push({ x: x0 + c * (photoW + gap), y: y0 + r * (photoH + gap) });
  return { width: best.w, height: best.h, spots };
}

/**
 * Keeps a crop inside the picture. cx/cy is the crop's centre and cw its width, in source
 * pixels; aspect is height / width. The width shrinks if the picture is too small for it.
 */
export function clampCrop({ cx, cy, cw }, imgW, imgH, aspect) {
  const maxW = Math.min(imgW, imgH / aspect);
  const w = Math.min(Math.max(cw, 8), maxW);
  const h = w * aspect;
  return {
    cw: w,
    cx: Math.min(Math.max(cx, w / 2), imgW - w / 2),
    cy: Math.min(Math.max(cy, h / 2), imgH - h / 2),
  };
}

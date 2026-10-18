// Thai for the messages in assets/js/shared/image-tools.js (converter, compressor, resizer, EXIF
// remover). Keys are the English text; {name} marks a value the code fills in. Line numbers are
// image-tools.js as of commit 9e06240.
export default {
  // l.46: appended to unsupported format options
  ' (not supported by this browser)': ' (เบราว์เซอร์นี้ไม่รองรับ)',
  // l.69
  'This HEIC photo couldn’t be decoded. Try exporting it as JPG from the Photos app.': 'เปิดรูป HEIC นี้ไม่ได้ ลองส่งออกเป็น JPG จากแอปรูปภาพก่อน',
  'This file couldn’t be decoded as an image.': 'เปิดไฟล์นี้เป็นรูปภาพไม่ได้',
  // l.109
  'The browser could not encode this image (it may be too large).': 'เบราว์เซอร์บันทึกรูปนี้ไม่ได้ (รูปอาจใหญ่เกินไป)',
  // l.126
  'Removed losslessly; pixels untouched': 'ลบออกแล้วโดยไม่เสียคุณภาพ ภาพเหมือนเดิมทุกพิกเซล',
  // l.133: `Image is ${n} megapixels; the limit is ${max} MP.`
  'Image is {n} megapixels; the limit is {max} MP.': 'รูปนี้มีขนาด {n} ล้านพิกเซล ซึ่งเกินขีดจำกัด {max} ล้านพิกเซล',
  // l.144
  'Re-encoded to apply rotation; metadata removed': 'บันทึกรูปใหม่เพื่อหมุนให้ถูกด้าน และลบข้อมูลแฝงแล้ว',
  // l.150: `Quality ${q} to fit ${size}` / `Couldn’t reach ${size}; try a smaller size`
  'Quality {q} to fit {size}': 'ใช้คุณภาพ {q} ให้ไม่เกิน {size}',
  'Couldn’t reach {size}; try a smaller size': 'ย่อให้เหลือ {size} ไม่ได้ ลองลดขนาดรูปลงด้วย',
  // l.153: `${label} is lossless, so a target size can’t apply; choose JPG or WebP`
  '{format} is lossless, so a target size can’t apply; choose JPG or WebP': '{format} เป็นไฟล์แบบไม่ลดคุณภาพ จึงกำหนดขนาดไฟล์เป้าหมายไม่ได้ ลองเลือก JPG หรือ WebP',
  // l.158
  'Already well compressed; original kept': 'ไฟล์เดิมเล็กอยู่แล้ว จึงใช้ไฟล์ต้นฉบับ',
  // l.180: badge `${removed|contains}: ${list}`
  'removed: {list}': 'ลบแล้ว: {list}',
  'contains: {list}': 'มีข้อมูล: {list}',
  // describeMetadata() items (assets/js/lib/metadata.js l.123-129), shown inside the badge
  'GPS location': 'ตำแหน่ง GPS',
  'camera make/model': 'ยี่ห้อ/รุ่นกล้อง',
  'date taken': 'วันที่ถ่าย',
  'EXIF data': 'ข้อมูล EXIF',
  XMP: 'XMP',
  'colour profile': 'โปรไฟล์สี',
  'text comments': 'ข้อความแฝง',
  // l.182
  'no metadata found': 'ไม่พบข้อมูลแฝง',
  // l.184
  'Processing…': 'กำลังประมวลผล…',
  // l.194: per-file button
  Download: 'ดาวน์โหลด',
  // l.209: `Processing ${i} of ${n}…`
  'Processing {i} of {n}…': 'กำลังประมวลผล {i} จาก {n}…',
  // l.210: `${n} file(s) ready · ${before} → ${after} (${pct}%) · ${errors} failed`
  '1 file ready': 'พร้อมแล้ว 1 ไฟล์',
  '{n} files ready': 'พร้อมแล้ว {n} ไฟล์',
  '{n} failed': 'ไม่สำเร็จ {n} ไฟล์',
  // l.236
  'No image files found in that selection.': 'ไม่พบไฟล์รูปภาพในสิ่งที่เลือก',
};

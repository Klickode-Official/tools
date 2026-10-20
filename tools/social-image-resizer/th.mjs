// Social Media Image Resizer in Thai. The body keeps every id and class from tool.mjs; only the
// words change. `strings` translates the messages ./script.js shows while it runs.
import { PRESETS } from '../../assets/js/lib/social.js';

const DEFAULT_ON = ['ig-post', 'ig-portrait', 'story', 'fb-post'];
const ratio = (w, h) => `aspect-ratio:${w}/${h};${w >= h ? 'width:22px' : 'height:22px'}`;

// Size names as Thai users know them. The script shows these too, through t().
const NAMES = {
  'Instagram post': 'โพสต์ Instagram',
  'Instagram portrait': 'Instagram แนวตั้ง',
  'Story / Reel / TikTok': 'สตอรี่ / Reels / TikTok',
  'Facebook post / link': 'โพสต์ / ลิงก์ Facebook',
  'X (Twitter) post': 'โพสต์ X (Twitter)',
  'LinkedIn post': 'โพสต์ LinkedIn',
  'YouTube thumbnail': 'ภาพปก YouTube',
  'Pinterest pin': 'พิน Pinterest',
  'Shopee / Lazada product': 'รูปสินค้า Shopee / Lazada',
  'Etsy listing': 'รูปสินค้า Etsy',
  'LINE OA rich message': 'Rich Message LINE OA',
};
const th = (p) => NAMES[p.name] ?? p.name;

export default {
  name: 'ปรับขนาดรูปลงโซเชียล',
  title: 'ปรับขนาดรูปลง Instagram, TikTok, Facebook, Shopee ฟรี',
  description: 'ทำรูปเดียวให้ได้ทุกขนาดสำหรับ Instagram, TikTok, Facebook, X, YouTube, Shopee และ Lazada เลือกจุดที่อยากให้อยู่ในเฟรม แล้วดาวน์โหลดทั้งหมดในครั้งเดียว',
  short: 'รูปเดียว ได้ทุกขนาดโซเชียล ครอปตรงที่คุณต้องการ',
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>วางรูปที่นี่ วาง (Ctrl+V) หรือคลิกเพื่อเลือกไฟล์</strong>
  <span>JPG, PNG, WebP, AVIF, HEIC, GIF · ทำทีละหลายรูปได้ · ไฟล์อยู่บนเครื่องของคุณ</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="sr-presets" role="group" aria-labelledby="sr-presets-label">
  <div class="sr-presets-head"><span class="label" id="sr-presets-label">ขนาด</span><span><button class="btn small" type="button" id="all">ทั้งหมด</button> <button class="btn small" type="button" id="none">ไม่เลือก</button></span></div>
  <div class="sr-grid">
${PRESETS.map((p) => `    <label class="sr-chip"><input type="checkbox" id="p-${p.id}" value="${p.id}"${DEFAULT_ON.includes(p.id) ? ' checked' : ''}><i style="${ratio(p.w, p.h)}"></i><span><b>${th(p)}</b><small>${p.w} × ${p.h}</small></span></label>`).join('\n')}
  </div>
</div>
<div class="toolbar">
  <label class="check">โหมด <select id="mode"><option value="crop">ครอปให้เต็มกรอบ</option><option value="fit">ใส่ทั้งรูป</option></select></label>
  <label class="check" id="fill-wrap">พื้นหลัง <select id="fill"><option value="blur">รูปเดิมแบบเบลอ</option><option value="colour">สีพื้น</option><option value="transparent">โปร่งใส</option></select> <input type="color" id="colour" value="#ffffff" aria-label="สีพื้นหลัง"></label>
  <label class="check">นามสกุล <select id="format"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
  <label class="check" id="quality-wrap">คุณภาพ <input type="range" id="quality" min="40" max="100" value="88"> <output id="quality-val">88</output></label>
</div>
<div class="toolbar"><button class="btn primary" id="download-all" disabled>ดาวน์โหลดทั้งหมด (ZIP)</button><button class="btn" id="clear" disabled>ล้าง</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div id="sources"></div>`,
  content: `<h2>วิธีใช้</h2>
<ol><li>ใส่รูปหนึ่งรูป หรือหลายรูปก็ได้</li><li>ติ๊กขนาดที่ต้องการ เริ่มจากโพสต์ Instagram แนวตั้ง และสตอรี่ก็ครบสำหรับหลายคนแล้ว</li><li>ในโหมด <strong>ครอปให้เต็มกรอบ</strong> คลิกหรือลากบนรูปเพื่อบอกว่าส่วนไหนสำคัญ เช่น ใบหน้าหรือสินค้า ทุกขนาดจะเก็บจุดนั้นไว้ในเฟรม</li><li>ดาวน์โหลดทีละรูป หรือดาวน์โหลดทั้งหมดเป็น ZIP</li></ol>
<h2>ครอป หรือใส่ทั้งรูป?</h2>
<p><strong>ครอปให้เต็มกรอบ</strong> ทำให้รูปเต็มเฟรมแล้วตัดขอบออก ดูสวยที่สุด แต่ถ้าตัดสตอรี่แนวตั้งจากรูปแนวนอน ด้านข้างจะหายไปเยอะ จึงควรตั้งจุดโฟกัส</p>
<p><strong>ใส่ทั้งรูป</strong> เก็บรูปไว้ครบแล้วเติมช่องว่างรอบๆ ใช้รูปเดิมแบบเบลอเป็นพื้นหลังจะดูดีกว่าแถบสีเรียบๆ มาก และเป็นวิธีเดียวกับที่แอปส่วนใหญ่ทำเอง ถ้าอยากให้เข้ากับสีแบรนด์ เลือกเป็นสีพื้นแทนได้</p>
<h2>ขนาดต่างๆ</h2>
<p>นี่คือขนาดที่แต่ละแพลตฟอร์มแนะนำในปัจจุบัน ทุกแพลตฟอร์มรับขนาดอื่นได้ แต่ถ้าอัปโหลดขนาดที่พอดี แอปจะไม่ครอปหรือบีบรูปของคุณ</p>
<ul>${PRESETS.map((p) => `<li><strong>${th(p)}</strong>: ${p.w} × ${p.h} px</li>`).join('')}</ul>`,
  faq: [
    { q: 'รูปของฉันถูกอัปโหลดไหม?', a: 'ไม่ การปรับขนาดทำในเบราว์เซอร์ของคุณ และไม่มีอะไรออกจากเครื่อง' },
    { q: 'ทำไมขึ้นว่าบางขนาดจะถูกขยาย?', a: 'รูปของคุณเล็กกว่าขนาดนั้น จึงต้องขยายขึ้นเล็กน้อย ซึ่งอาจทำให้ภาพดูไม่คม ถ้ามีรูปต้นฉบับที่ใหญ่กว่า ให้ใช้รูปนั้นแทน' },
    { q: 'ควรเลือกนามสกุลไหน?', a: 'JPG สำหรับรูปถ่าย ไฟล์เล็กและทุกแอปรับ PNG สำหรับกราฟิกที่มีตัวหนังสือหรือขอบคม ส่วน WebP เล็กกว่าอีก แต่บางแอปยังไม่รับ' },
    { q: 'ทำหลายรูปพร้อมกันได้ไหม?', a: 'ได้ แต่ละรูปมีจุดโฟกัสของตัวเอง และปุ่ม “ดาวน์โหลดทั้งหมด” จะรวมทุกขนาดของทุกรูปไว้ใน ZIP เดียว' },
  ],
  strings: {
    ...NAMES,
    'This browser can’t open HEIC. Try Safari, or export the photo as JPG first.': 'เบราว์เซอร์นี้เปิดไฟล์ HEIC ไม่ได้ ลองใช้ Safari หรือส่งออกรูปเป็น JPG ก่อน',
    'This file couldn’t be opened as an image.': 'เปิดไฟล์นี้เป็นรูปภาพไม่ได้',
    'The browser couldn’t save this image.': 'เบราว์เซอร์บันทึกรูปนี้ไม่ได้',
    Remove: 'นำออก',
    'Focus point. Click, drag or use the arrow keys.': 'จุดโฟกัส คลิก ลาก หรือใช้ปุ่มลูกศร',
    'Click or drag to set what stays in frame': 'คลิกหรือลากเพื่อเลือกส่วนที่ต้องอยู่ในเฟรม',
    'The whole photo is kept in “Fit inside”': 'โหมด “ใส่ทั้งรูป” จะเก็บรูปไว้ครบทั้งรูป',
    '{name} preview': 'ตัวอย่าง {name}',
    'Enlarged {n}×, may look soft': 'ขยาย {n} เท่า อาจดูไม่คม',
    'Download {name}': 'ดาวน์โหลด {name}',
    Save: 'บันทึก',
    'Download all {n} (ZIP)': 'ดาวน์โหลดทั้ง {n} รูป (ZIP)',
    'Download all (ZIP)': 'ดาวน์โหลดทั้งหมด (ZIP)',
    'Tick at least one size.': 'เลือกอย่างน้อยหนึ่งขนาด',
    '1 image ready': 'พร้อมแล้ว 1 รูป',
    '{n} images ready': 'พร้อมแล้ว {n} รูป',
    '1 file couldn’t be opened': 'เปิดไม่ได้ 1 ไฟล์',
    '{n} files couldn’t be opened': 'เปิดไม่ได้ {n} ไฟล์',
    'That’s the limit of {n} photos at once.': 'ใส่ได้ครั้งละไม่เกิน {n} รูป',
    'Those don’t look like images.': 'ไฟล์เหล่านี้ไม่ใช่รูปภาพ',
    'Opening…': 'กำลังเปิด…',
    'This photo is {n} megapixels; the limit is {max}.': 'รูปนี้มีขนาด {n} ล้านพิกเซล ซึ่งเกินขีดจำกัด {max} ล้านพิกเซล',
  },
};

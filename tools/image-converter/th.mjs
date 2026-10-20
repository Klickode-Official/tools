// image-converter in Thai. The body keeps every id and class from tool.mjs; only the words change.
// Messages from the shared image code are translated in scripts/i18n-image-tools.mjs.
export default {
  name: "แปลงไฟล์รูป",
  title: "แปลงไฟล์รูป JPG PNG WebP AVIF ออนไลน์ฟรี ไม่ต้องอัปโหลด",
  description: "แปลงไฟล์รูประหว่าง JPG, PNG, WebP และ AVIF ได้ในเบราว์เซอร์ ใส่ได้หลายรูปพร้อมกันแล้วดาวน์โหลดเป็น ZIP รูปของคุณไม่ถูกอัปโหลดไปไหน",
  short: "สลับไฟล์รูประหว่าง JPG, PNG, WebP และ AVIF",
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>วางรูปที่นี่ วาง (Ctrl+V) หรือคลิกเพื่อเลือกไฟล์</strong>
  <span>JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, SVG · ทำทีละหลายไฟล์ได้ · ไฟล์อยู่บนเครื่องของคุณ</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  <label class="check">นามสกุล <select id="format"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp" selected>WebP</option><option value="image/avif">AVIF</option></select></label>
  <label class="check">คุณภาพ <input type="range" id="quality" min="1" max="100" value="90"> <output id="quality-val">90</output></label>
  
  <label class="check">ปรับขนาด <select id="resize-mode">
      <option value="none" selected>ขนาดเดิม</option><option value="fit">ให้อยู่ในกรอบ</option><option value="width">ความกว้าง</option><option value="height">ความสูง</option><option value="percent">เปอร์เซ็นต์</option>
    </select></label>
    <label class="check">กว้าง <input type="number" id="width" min="1" value="1920" style="width:6em"> px</label>
    <label class="check">สูง <input type="number" id="height" min="1" value="1080" style="width:6em"> px</label>
    <label class="check"><input type="number" id="percent" min="1" max="100" value="50" style="width:5em"> %</label>
  <label class="check">พื้นหลัง JPG <input type="color" id="bg" value="#ffffff"></label>
</div>
<div class="toolbar"><button class="btn primary" id="download-all" disabled>ดาวน์โหลดทั้งหมด (ZIP)</button><button class="btn" id="clear" disabled>ล้าง</button></div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="results"></ul>`,
  content: `<h2>วิธีแปลงไฟล์รูป</h2>
<ol><li>ลากรูปมาวางในกรอบด้านบน จะวาง (Ctrl+V) หรือคลิกเลือกไฟล์ก็ได้</li><li>เลือกนามสกุลและคุณภาพ รูปจะถูกแปลงทันที และถ้าเปลี่ยนการตั้งค่า ทุกรูปจะอัปเดตตาม</li><li>ดาวน์โหลดทีละรูป หรือดาวน์โหลดทั้งหมดเป็นไฟล์ ZIP</li></ol>
<h2>ควรเลือกนามสกุลไหนดี?</h2>
<p><strong>WebP</strong> เหมาะที่สุดสำหรับเว็บไซต์ มักเล็กกว่า JPG ราวหนึ่งในสี่ถึงหนึ่งในสามที่คุณภาพเท่ากัน รองรับพื้นหลังโปร่งใส และเบราว์เซอร์ทุกตัวในปัจจุบันเปิดได้</p>
<p><strong>AVIF</strong> เล็กลงไปอีก แต่สร้างช้ากว่า และบางเบราว์เซอร์ยังสร้างไฟล์แบบนี้ไม่ได้ ถ้าของคุณทำไม่ได้ ตัวเลือกนี้จะเป็นสีจาง</p>
<p><strong>JPG</strong> เปิดได้ทุกที่ จึงเป็นตัวเลือกที่ปลอดภัยเวลาส่งรูปให้คนอื่น แต่ไม่รองรับพื้นหลังโปร่งใส ส่วนที่โปร่งใสจะถูกเติมด้วยสีพื้นหลังที่คุณเลือก</p>
<p><strong>PNG</strong> เก็บทุกพิกเซลไว้ตามเดิม เหมาะกับภาพหน้าจอ โลโก้ และภาพที่มีขอบคมหรือพื้นโปร่งใส แต่ถ้าเป็นรูปถ่าย ไฟล์จะใหญ่มาก</p>`,
  faq: [
    { q: "รูปของฉันถูกอัปโหลดไหม?", a: "ไม่ รูปของคุณถูกแปลงภายในแท็บเบราว์เซอร์นี้และไม่เคยถูกส่งไปที่เซิร์ฟเวอร์ ด้วยเหตุนี้จึงไม่มีการจำกัดจำนวนไฟล์ ไม่ต้องรอคิว และไม่มีลายน้ำ พอหน้าเว็บโหลดเสร็จแล้ว ต่อให้ปิด Wi-Fi ก็ยังใช้ได้" },
    { q: "แปลงรูป HEIC จาก iPhone ได้ไหม?", a: "ได้ทุกเบราว์เซอร์ Safari เปิดได้เอง ส่วน Chrome, Edge และ Firefox หน้านี้จะโหลดตัวถอดรหัส HEIC ครั้งแรกที่คุณใส่ไฟล์ (ประมาณ 1.5 MB และเก็บไว้ในเบราว์เซอร์) รูปก็ยังไม่ถูกอัปโหลดเหมือนเดิม และมีหน้าเฉพาะสำหรับ <a href=\"/th/tools/heic-to-jpg/\">แปลง HEIC เป็น JPG</a> ด้วย" },
    { q: "ข้อมูลตำแหน่งและกล้องในรูปยังอยู่ไหม?", a: "ไม่อยู่ การแปลงไฟล์จะทิ้งข้อมูลเหล่านั้นไป รวมถึงตำแหน่ง GPS ถ้าอยากดูก่อนว่าในรูปมีข้อมูลอะไรบ้าง ใช้ <a href=\"/th/tools/exif-remover/\">เครื่องมือลบ EXIF</a>" },
  ],
};

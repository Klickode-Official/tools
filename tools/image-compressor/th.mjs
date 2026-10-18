// image-compressor in Thai. The body keeps every id and class from tool.mjs; only the words change.
// Messages from the shared image code are translated in scripts/i18n-image-tools.mjs.
export default {
  name: "ย่อขนาดรูปภาพ",
  title: "ย่อขนาดรูปภาพ ลดขนาดไฟล์ให้ไม่เกินกี่ KB ก็ได้ ฟรี",
  description: "เจอฟอร์มที่เขียนว่า “ไม่เกิน 200 KB”? พิมพ์ขนาดที่ต้องการ แล้วเราจะหาคุณภาพที่ดีที่สุดที่ยังไม่เกินให้ รองรับ JPG, PNG และ WebP ทำงานบนเครื่องของคุณ",
  short: "ลดขนาดไฟล์รูปให้ผ่านขีดจำกัดการอัปโหลด",
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>วางรูปที่นี่ วาง (Ctrl+V) หรือคลิกเพื่อเลือกไฟล์</strong>
  <span>JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, SVG · ทำทีละหลายไฟล์ได้ · ไฟล์อยู่บนเครื่องของคุณ</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  <label class="check">นามสกุล <select id="format"><option value="keep">เหมือนไฟล์เดิม</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option><option value="image/avif">AVIF</option></select></label>
  <label class="check">คุณภาพ <input type="range" id="quality" min="1" max="100" value="75"> <output id="quality-val">75</output></label>
  <label class="check">ขนาดไฟล์เป้าหมาย <input type="number" id="target-kb" min="0" step="10" placeholder="ไม่บังคับ" style="width:7em"> KB</label>
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
  content: `<h2>ทำให้ไฟล์ไม่เกินขนาดที่กำหนด</h2>
<p>เว็บสมัครงาน ฟอร์มขอวีซ่า ระบบราชการ และอีเมลบางเจ้าไม่รับรูปที่ใหญ่เกินกำหนด ใส่ตัวเลขนั้นใน <strong>ขนาดไฟล์เป้าหมาย</strong> แล้วเครื่องมือจะลองหลายระดับคุณภาพจนเจอระดับสูงสุดที่ยังไม่เกิน ถ้าลดคุณภาพจนต่ำสุดแล้วยังใหญ่อยู่ ให้ใช้ตัวเลือกปรับขนาดเพื่อลดขนาดภาพลงด้วย</p>
<h2>เคล็ดลับเล็กๆ</h2>
<ul><li>เปลี่ยนรูปถ่ายเป็น WebP มักลดขนาดได้มากกว่าการลดคุณภาพ JPG</li><li>PNG ไม่มีการตั้งค่าคุณภาพ เพราะไม่ทิ้งรายละเอียดเลย ถ้าเป็นรูปถ่ายที่เซฟเป็น PNG ให้เลือก JPG หรือ WebP แทน</li><li>ถ้าไฟล์ที่บีบแล้วใหญ่กว่าต้นฉบับ คุณจะได้ไฟล์ต้นฉบับคืน เพราะมันเล็กที่สุดเท่าที่จะเป็นได้อยู่แล้ว</li></ul>`,
  faq: [
    { q: "รูปของฉันถูกอัปโหลดไหม?", a: "ไม่ ทุกอย่างทำงานในแท็บเบราว์เซอร์นี้ รูปจึงไม่เคยออกจากเครื่องของคุณ และไม่จำกัดว่าจะย่อพร้อมกันกี่รูป" },
    { q: "ถ้าไม่กำหนดขนาดไฟล์ ควรใช้คุณภาพเท่าไหร่?", a: "สำหรับรูปถ่าย เริ่มที่ประมาณ 75 กำลังดี คนส่วนใหญ่แยกไม่ออกจากต้นฉบับ แต่ไฟล์เล็กลงหลายเท่า" },
  ],
};

// image-resizer in Thai. The body keeps every id and class from tool.mjs; only the words change.
// Messages from the shared image code are translated in scripts/i18n-image-tools.mjs.
export default {
  name: "ปรับขนาดรูปภาพ",
  title: "ปรับขนาดรูปภาพออนไลน์ ตามพิกเซลหรือเปอร์เซ็นต์ ฟรี",
  description: "ย่อรูปตามความกว้าง ความสูง หรือเปอร์เซ็นต์ หรือให้พอดีกรอบอย่าง 1920×1080 ปรับทีละหลายรูปพร้อมกันแล้วดาวน์โหลดเป็น ZIP ได้",
  short: "ย่อรูปตามจำนวนพิกเซลหรือเปอร์เซ็นต์",
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>วางรูปที่นี่ วาง (Ctrl+V) หรือคลิกเพื่อเลือกไฟล์</strong>
  <span>JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, SVG · ทำทีละหลายไฟล์ได้ · ไฟล์อยู่บนเครื่องของคุณ</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  <label class="check">นามสกุล <select id="format"><option value="keep">เหมือนไฟล์เดิม</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option><option value="image/avif">AVIF</option></select></label>
  <label class="check">คุณภาพ <input type="range" id="quality" min="1" max="100" value="90"> <output id="quality-val">90</output></label>
  
  <label class="check">ปรับขนาด <select id="resize-mode">
      <option value="none">ขนาดเดิม</option><option value="fit" selected>ให้อยู่ในกรอบ</option><option value="width">ความกว้าง</option><option value="height">ความสูง</option><option value="percent">เปอร์เซ็นต์</option>
    </select></label>
    <label class="check">กว้าง <input type="number" id="width" min="1" value="1920" style="width:6em"> px</label>
    <label class="check">สูง <input type="number" id="height" min="1" value="1080" style="width:6em"> px</label>
    <label class="check"><input type="number" id="percent" min="1" max="100" value="50" style="width:5em"> %</label>
  <label class="check">พื้นหลัง JPG <input type="color" id="bg" value="#ffffff"></label>
</div>
<div class="toolbar"><button class="btn primary" id="download-all" disabled>ดาวน์โหลดทั้งหมด (ZIP)</button><button class="btn" id="clear" disabled>ล้าง</button></div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="results"></ul>`,
  content: `<h2>วิธีปรับขนาดแบบต่างๆ</h2>
<p><strong>ให้อยู่ในกรอบ</strong> ย่อรูปจนพอดีกับความกว้างและความสูงที่ตั้งไว้ โดยไม่ยืดหรือบีบรูป เหมาะกับเงื่อนไขแบบ “ไม่เกิน 1920×1080”</p>
<p><strong>ความกว้าง</strong> หรือ <strong>ความสูง</strong> กำหนดด้านเดียว แล้วอีกด้านจะคำนวณให้เอง</p>
<p><strong>เปอร์เซ็นต์</strong> ย่อทั้งรูป เช่น 50% จะได้กว้างครึ่งหนึ่งและสูงครึ่งหนึ่ง</p>
<p>รูปจะไม่ถูกขยายให้ใหญ่กว่าเดิม เพราะการขยายรูปเล็กทำให้ภาพเบลอ ซึ่งแทบไม่มีใครต้องการ ส่วนการย่อมากๆ จะทำเป็นขั้นๆ เพื่อให้รายละเอียดเล็กๆ อย่างตัวหนังสือหรือเส้นผมไม่แตกเป็นหยัก</p>`,
  faq: [
    { q: "รูปของฉันถูกอัปโหลดไหม?", a: "ไม่ รูปถูกปรับขนาดในเบราว์เซอร์และอยู่บนเครื่องของคุณ" },
    { q: "ปรับขนาดแล้วนามสกุลไฟล์จะเปลี่ยนไหม?", a: "ไม่เปลี่ยน ถ้าคุณไม่ได้เลือก ปล่อยนามสกุลไว้ที่ “เหมือนไฟล์เดิม” หรือเลือกนามสกุลอื่นถ้าอยากแปลงไฟล์ไปพร้อมกัน" },
  ],
};

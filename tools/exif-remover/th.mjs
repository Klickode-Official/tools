// exif-remover in Thai. The body keeps every id and class from tool.mjs; only the words change.
// Messages from the shared image code are translated in scripts/i18n-image-tools.mjs.
export default {
  name: "ลบ EXIF และตำแหน่ง GPS",
  title: "ลบข้อมูล EXIF และตำแหน่ง GPS ออกจากรูปถ่าย ฟรี",
  description: "รูปจากมือถืออาจเก็บตำแหน่งที่ถ่ายไว้อย่างแม่นยำ ดูว่าในรูปของคุณมีข้อมูลอะไรซ่อนอยู่ แล้วลบออกได้โดยภาพไม่เสียคุณภาพ",
  short: "ลบตำแหน่ง GPS และข้อมูลกล้องออกจากรูป",
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>วางรูปที่นี่ วาง (Ctrl+V) หรือคลิกเพื่อเลือกไฟล์</strong>
  <span>JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, SVG · ทำทีละหลายไฟล์ได้ · ไฟล์อยู่บนเครื่องของคุณ</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  
  
  
  
  
</div>
<div class="toolbar"><button class="btn primary" id="download-all" disabled>ดาวน์โหลดทั้งหมด (ZIP)</button><button class="btn" id="clear" disabled>ล้าง</button></div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="results"></ul>`,
  content: `<h2>ในรูปถ่ายของคุณมีอะไรซ่อนอยู่</h2>
<p>มือถือส่วนใหญ่บันทึกข้อมูลเพิ่มไว้ในทุกรูป หลายครั้งมีพิกัด GPS ของจุดที่คุณยืนถ่าย วันเวลา และรุ่นมือถือ ถ้าส่งไฟล์ต้นฉบับให้ใคร เขาก็ได้ข้อมูลพวกนั้นไปด้วย โซเชียลใหญ่ๆ มักลบให้ แต่อีเมล การส่งไฟล์ทาง LINE หรือ WhatsApp แบบเอกสาร เว็บบอร์ด และประกาศขายของมักไม่ลบ</p>
<h2>เครื่องมือนี้ลบข้อมูลอย่างไร</h2>
<p>สำหรับไฟล์ <strong>JPG, PNG และ WebP</strong> เครื่องมือจะตัดข้อมูลแฝงออก แล้วคัดลอกตัวภาพไปทุกไบต์ จึง<strong>ไม่เสียคุณภาพเลย</strong> โปรไฟล์สียังคงอยู่ สีจึงไม่เพี้ยน</p>
<p>บางรูปใช้แท็ก “หมุนรูป” เพื่อให้แสดงถูกด้าน รูปแบบนี้จะถูกบันทึกใหม่แทน ไม่อย่างนั้นจะออกมาตะแคง ไฟล์นามสกุลอื่นก็จะถูกบันทึกใหม่เช่นกัน ซึ่งทำให้ข้อมูลแฝงหายไปด้วย</p>`,
  faq: [
    { q: "รูปของฉันถูกอัปโหลดไหม?", a: "ไม่ และสำหรับเครื่องมือแบบนี้ เรื่องนี้สำคัญมาก ไฟล์ถูกอ่านและลบข้อมูลภายในแท็บนี้ คุณเปิดหน้าเว็บ แล้วปิดอินเทอร์เน็ตก็ยังใช้ได้" },
    { q: "จะรู้ได้ยังไงว่าลบสำเร็จแล้ว?", a: "ลากไฟล์ที่ลบข้อมูลแล้วกลับมาวางในหน้านี้อีกครั้ง ควรขึ้นว่าไม่พบข้อมูลแฝง" },
  ],
};

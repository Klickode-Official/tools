// PDF to JPG in Thai. Messages from the shared PDF code are translated in scripts/i18n-pdf-tools.mjs.
export default {
  name: 'แปลง PDF เป็น JPG',
  title: 'แปลง PDF เป็น JPG บันทึกหน้า PDF เป็นรูป ฟรี',
  description: 'แปลงทุกหน้าของ PDF เป็นรูป JPG หรือ PNG ตามความละเอียดที่ต้องการ ดาวน์โหลดทีละหน้าหรือทั้งหมดเป็น ZIP ไฟล์ PDF ไม่ถูกอัปโหลด',
  short: 'บันทึกแต่ละหน้า PDF เป็น JPG หรือ PNG',
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>ลากไฟล์ PDF มาวางที่นี่ หรือคลิกเพื่อเลือก</strong>
  <span>ครั้งละหนึ่งไฟล์ · ไฟล์อยู่ในเครื่องของคุณเท่านั้น</span>
  <input type="file" id="files" accept="application/pdf,.pdf">
</label>
<div class="toolbar">
  <label class="check">รูปแบบ <select id="format"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
  <label class="check">ความละเอียด <select id="dpi"><option value="72">หน้าจอ (72 DPI)</option><option value="150" selected>มาตรฐาน (150 DPI)</option><option value="300">สำหรับพิมพ์ (300 DPI)</option></select></label>
  <button class="btn primary" id="download-all" disabled>ดาวน์โหลดทั้งหมด (ZIP)</button><button class="btn" id="clear" disabled>ล้าง</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="list" aria-label="ไฟล์ PDF และหน้าต่าง ๆ"></ul>`,
  content: `<h2>วิธีแปลง PDF เป็น JPG</h2>
<ol><li>ลากไฟล์ PDF มาวาง ทุกหน้าจะแปลงเป็นรูปทันที</li><li>เลือก JPG หรือ PNG และความละเอียด ถ้าเปลี่ยนจะแปลงใหม่ให้</li><li>ดาวน์โหลดเฉพาะหน้าที่ต้องการ หรือทั้งหมดเป็น ZIP</li></ol>
<h2>ควรเลือกความละเอียดเท่าไร?</h2>
<ul><li><strong>หน้าจอ (72 DPI)</strong> สำหรับดูเร็ว ๆ หรือส่งในแชต ไฟล์เล็ก</li><li><strong>มาตรฐาน (150 DPI)</strong> สำหรับโพสต์ออนไลน์หรือใส่ในสไลด์ ตัวหนังสือยังอ่านได้</li><li><strong>สำหรับพิมพ์ (300 DPI)</strong> เมื่อจะพิมพ์หรือซูมดูรายละเอียด ไฟล์ใหญ่</li></ul>
<p>เลือก PNG สำหรับหน้าที่เป็นตัวหนังสือหรือแผนภาพ ขอบจะคมชัด ส่วน JPG ไฟล์เล็กกว่าสำหรับหน้าที่มีรูปถ่ายเยอะ</p>`,
  faq: [
    { q: 'เปิด PDF ที่มีรหัสผ่านได้ไหม?', a: 'ได้ ระบบจะถามรหัสผ่าน ซึ่งใช้เปิดไฟล์ในเบราว์เซอร์ของคุณเท่านั้น' },
    { q: 'ทำไมฟอนต์บางตัวดูต่างไปเล็กน้อย?', a: 'ถ้า PDF ไม่ได้ฝังฟอนต์มาด้วย จะใช้ฟอนต์มาตรฐานที่ใกล้เคียงแทน เหมือนโปรแกรมอ่าน PDF ส่วนใหญ่' },
    { q: 'ไฟล์ PDF ถูกอัปโหลดไหม?', a: 'ไม่ หน้าต่าง ๆ ถูกวาดในเบราว์เซอร์ของคุณ ไฟล์ไม่ออกจากเครื่อง' },
  ],
};

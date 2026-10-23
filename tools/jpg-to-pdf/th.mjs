// JPG to PDF in Thai. Messages from the shared PDF code are translated in scripts/i18n-pdf-tools.mjs.
export default {
  name: 'แปลงรูปเป็น PDF',
  title: 'แปลง JPG เป็น PDF รวมรูปเป็น PDF ไฟล์เดียว ฟรี',
  description: 'แปลงรูปถ่าย สแกน และภาพหน้าจอ (JPG, PNG, HEIC) เป็น PDF ไฟล์เดียว ขนาด A4, Letter หรือเท่ารูป จัดลำดับได้ แล้วดาวน์โหลด ไม่มีการอัปโหลด',
  short: 'รวมรูปเป็น PDF ไฟล์เดียว เรียงหน้าได้',
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>ลากรูปมาวางที่นี่ วาง (Ctrl+V) หรือคลิกเพื่อเลือก</strong>
  <span>JPG, PNG, WebP, HEIC · กี่รูปก็ได้ · ไฟล์อยู่ในเครื่องของคุณเท่านั้น</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif">
</label>
<div class="toolbar">
  <label class="check">ขนาดหน้า <select id="page-size"><option value="a4">A4</option><option value="letter">Letter</option><option value="fit">เท่ากับรูป</option></select></label>
  <label class="check">ขอบกระดาษ <select id="margin"><option value="0">ไม่มี</option><option value="10" selected>เล็ก (10 มม.)</option><option value="20">ใหญ่ (20 มม.)</option></select></label>
  <button class="btn primary" id="run" disabled>สร้าง PDF</button><button class="btn" id="clear" disabled>ล้าง</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="list" aria-label="รูปภาพ เรียงตามลำดับหน้า"></ul>`,
  content: `<h2>วิธีแปลงรูปเป็น PDF</h2>
<ol><li>ลากรูปมาวาง หรือวางภาพหน้าจอ รูป HEIC จาก iPhone ก็ใช้ได้</li><li>จัดลำดับหน้าด้วยปุ่ม ↑ และ ↓ แล้วเลือกขนาดหน้า</li><li>กด <strong>สร้าง PDF</strong> จะได้ PDF ไฟล์เดียว รูปละหนึ่งหน้า</li></ol>
<h2>เหมาะกับ</h2>
<ul><li>รูปถ่ายใบเสร็จ แบบฟอร์ม หรือบัตรประชาชน ที่มีคนขอให้ส่ง “เป็น PDF”</li><li>รวมภาพหน้าจอหลายภาพเป็นเอกสารเดียว</li><li>ส่งโน้ตลายมือหลายหน้าเป็นไฟล์เดียว</li></ul>
<p>รูปจะตั้งตรงตามที่มือถือแสดง และถ้ารูปกว้างกว่าสูง จะวางบนหน้าแนวนอนให้อัตโนมัติ</p>`,
  faq: [
    { q: 'รูปจะเสียคุณภาพไหม?', a: 'แทบไม่เสีย รูปถูกเก็บไว้สูงสุด 3,600 พิกเซลด้านยาว พิมพ์บน A4 ได้คมชัด และบันทึกเป็น JPG คุณภาพสูง ส่วน PNG ไม่สูญเสียคุณภาพ' },
    { q: 'ทำให้ PDF เล็กลงได้ไหม?', a: 'ได้ สร้าง PDF ที่นี่ แล้วนำไปใช้<a href="/th/tools/compress-pdf/">เครื่องมือย่อขนาด PDF</a> หรือย่อรูปก่อนด้วย<a href="/th/tools/image-compressor/">เครื่องมือย่อขนาดรูป</a>' },
    { q: 'รูปถูกอัปโหลดไหม?', a: 'ไม่ PDF ถูกสร้างในเบราว์เซอร์ของคุณ ไม่มีอะไรออกจากเครื่อง' },
  ],
};

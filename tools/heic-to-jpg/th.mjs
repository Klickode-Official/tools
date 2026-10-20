// HEIC to JPG in Thai. Same body as tool.mjs (ids, classes and attributes unchanged).
export default {
  name: 'แปลง HEIC เป็น JPG',
  title: 'แปลงไฟล์ HEIC เป็น JPG ออนไลน์ฟรี ไม่ต้องอัปโหลด',
  description: 'แปลงรูป HEIC จาก iPhone เป็น JPG ได้ในเบราว์เซอร์ ทำทีละหลายรูปแล้วดาวน์โหลดเป็น ZIP รูปของคุณไม่ถูกอัปโหลดไปไหน',
  short: 'เปลี่ยนรูปจาก iPhone เป็น JPG ที่เปิดได้ทุกที่',
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>ลากรูป HEIC มาวางที่นี่ หรือคลิกเพื่อเลือก</strong>
  <span>ไฟล์ HEIC และ HEIF จาก iPhone และ iPad · กี่รูปก็ได้ · รูปอยู่บนเครื่องของคุณ</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  <label class="check">นามสกุล <select id="format"><option value="image/jpeg" selected>JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option><option value="image/avif">AVIF</option></select></label>
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
  content: `<h2>วิธีแปลง HEIC เป็น JPG</h2>
<ol><li>ลากรูป HEIC มาวางในกล่องด้านบน หรือคลิกเพื่อเลือก ใส่ทีละหลายรูปได้</li><li>เลือก JPG ไว้ให้แล้ว คุณภาพ 90 ใช้ได้ดีเกือบทุกงาน ลดลงถ้าอยากได้ไฟล์เล็กกว่านี้</li><li>ดาวน์โหลดทีละรูป หรือทั้งหมดเป็นไฟล์ ZIP</li></ol>
<h2>ทำไม iPhone ถึงบันทึกรูปเป็น HEIC?</h2>
<p>ตั้งแต่ iOS 11 เป็นต้นมา iPhone บันทึกรูปเป็น HEIC เพราะไฟล์เล็กกว่า JPG ประมาณครึ่งหนึ่งที่คุณภาพเท่ากัน แต่ปัญหาคือหลายเว็บไซต์ โปรแกรมบน Windows และมือถือรุ่นเก่ายังเปิดไฟล์นี้ไม่ได้ การแปลงเป็น JPG แก้ปัญหานี้ได้ แลกกับไฟล์ที่ใหญ่ขึ้น</p>
<p>ถ้าอยากให้ iPhone บันทึกเป็น JPG ตั้งแต่ตอนนี้ ไปที่ <strong>การตั้งค่า → กล้อง → รูปแบบ</strong> แล้วเลือก <strong>เข้ากันได้มากที่สุด</strong></p>
<h2>รูปของคุณอยู่บนเครื่องของคุณเท่านั้น</h2>
<p>เว็บแปลง HEIC ส่วนใหญ่จะอัปโหลดรูปของคุณขึ้นเซิร์ฟเวอร์ แต่ที่นี่ไม่ ครั้งแรกที่คุณใส่ไฟล์ HEIC เบราว์เซอร์จะโหลดตัวถอดรหัสขนาดเล็ก (ประมาณ 1.5 MB) แล้วแปลงรูปเองทั้งหมด จึงใช้กับรูปส่วนตัวได้สบายใจ และเมื่อโหลดแล้วก็ใช้ได้แม้ไม่มีเน็ต</p>`,
  faq: [
    { q: 'แปลง HEIC เป็น JPG ที่นี่ฟรีไหม?', a: 'ฟรี ไม่ต้องสมัคร ไม่มีลายน้ำ และไม่จำกัดจำนวนรูป' },
    { q: 'ใช้บน Windows และ Android ได้ไหม?', a: 'ได้ ใช้ได้ทั้ง Chrome, Edge, Firefox และ Safari บน Windows, Mac, Android และ iPhone' },
    { q: 'คุณภาพจะลดลงไหม?', a: 'แทบไม่ลด ที่คุณภาพ 90 ซึ่งตั้งไว้ให้แล้ว แต่ไฟล์ JPG จะใหญ่กว่า HEIC ประมาณสองเท่าที่คุณภาพเท่ากัน' },
    { q: 'รูปจะหมุนถูกด้านไหม?', a: 'ถูก ทิศทางที่กล้องบันทึกไว้จะถูกนำมาใช้ รูปแนวตั้งจึงยังตั้งตรงเหมือนเดิม' },
    { q: 'ข้อมูลตำแหน่งและข้อมูลกล้องล่ะ?', a: 'ไม่ถูกคัดลอกไปใน JPG รูปที่แปลงแล้วจึงไม่มีตำแหน่ง GPS ของคุณ ถ้าอยากลบข้อมูลจากรูปอื่นด้วย ใช้ <a href="/th/tools/exif-remover/">เครื่องมือลบข้อมูล EXIF</a>' },
    { q: 'แปลง HEIC เป็น PNG แทนได้ไหม?', a: 'ได้ เลือก PNG ในเมนูนามสกุล แต่ไฟล์ PNG ใหญ่กว่ามาก สำหรับรูปถ่าย JPG มักเป็นตัวเลือกที่ดีกว่า' },
  ],
};

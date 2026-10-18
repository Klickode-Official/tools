// Brand Colour Palette in Thai. The body keeps every id and class from tool.mjs; only the words
// change. `strings` translates the messages ./script.js shows while it runs.
export default {
  name: 'ดึงชุดสีจากโลโก้',
  title: 'ดึงชุดสีแบรนด์จากโลโก้หรือรูปภาพ หารหัสสี HEX ฟรี',
  description: 'ใส่โลโก้หรือรูปภาพ แล้วรับสีหลักเป็น HEX, RGB และ HSL พร้อมตรวจความคมชัดของตัวอักษร และโค้ด CSS, Tailwind, JSON พร้อมวาง รูปไม่ถูกอัปโหลด',
  short: 'ดึงสีหลักออกมาจากโลโก้หรือรูปถ่าย',
  body: `<label class="dropzone" id="dropzone" for="file">
  <strong>วางโลโก้หรือรูปภาพที่นี่ วาง (Ctrl+V) หรือคลิกเพื่อเลือกไฟล์</strong>
  <span>PNG, JPG, WebP, SVG, GIF · พื้นหลังโปร่งใสก็ได้ · ไฟล์อยู่บนเครื่องของคุณ</span>
  <input type="file" id="file" accept="image/*">
</label>
<div class="toolbar">
  <label class="check">จำนวนสี <select id="count"><option>4</option><option>5</option><option selected>6</option><option>7</option><option>8</option></select></label>
  <label class="check"><input type="checkbox" id="skip-bg" checked> ไม่นับสีพื้นหลัง</label>
  <button class="btn primary" id="png" disabled>ดาวน์โหลดชุดสีเป็น PNG</button>
  <button class="btn" id="sample">ลองกับตัวอย่าง</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="bp-layout" id="result" hidden>
  <div class="panel bp-image">
    <div class="panel-head"><span class="label">รูปภาพ</span><span class="bp-dim" id="dims"></span></div>
    <div class="bp-image-box"><img id="preview" alt="รูปที่คุณใส่"></div>
    <div class="bp-bar" id="bar" aria-hidden="true"></div>
  </div>
  <div class="panel bp-swatches">
    <div class="panel-head"><span class="label">ชุดสี</span><span class="bp-dim">คลิกค่าสีเพื่อคัดลอก</span></div>
    <ul class="bp-list" id="swatches"></ul>
  </div>
</div>
<div class="panel bp-export" id="export-panel" hidden>
  <div class="panel-head"><span class="bp-tabs" role="tablist" aria-label="รูปแบบโค้ด"><button class="bp-tab" role="tab" aria-selected="true" data-fmt="css">ตัวแปร CSS</button><button class="bp-tab" role="tab" aria-selected="false" data-fmt="tailwind">Tailwind</button><button class="bp-tab" role="tab" aria-selected="false" data-fmt="json">JSON</button></span><span><button class="btn small" id="dl-code" data-dl>ดาวน์โหลด</button> <button class="btn small" data-copy="#code">คัดลอก</button></span></div>
  <textarea id="code" spellcheck="false" readonly aria-label="โค้ดชุดสี"></textarea>
</div>`,
  content: `<h2>วิธีใช้</h2>
<ol><li>ใส่โลโก้ของคุณ ไฟล์ PNG หรือ SVG ดีที่สุด แต่ภาพหน้าจอก็ใช้ได้</li><li>สีหลักจะแสดงทางขวา เรียงจากสีที่มีพื้นที่มากที่สุด แต่ละสีมีหน้าที่ของตัวเอง คือ สีหลัก สีรอง สีเน้น พื้นหลัง และตัวอักษร</li><li>คลิกค่า HEX, RGB หรือ HSL เพื่อคัดลอก หรือเอาไปทั้งชุดเป็น CSS, Tailwind หรือ JSON</li></ol>
<h2>“ไม่นับสีพื้นหลัง” ทำอะไร</h2>
<p>โลโก้ส่วนใหญ่วางอยู่บนพื้นสี่เหลี่ยมสีขาวหรือสีอื่น ถ้านับด้วย พื้นนั้นจะกลายเป็นสี “หลัก” ซึ่งไม่ค่อยมีประโยชน์ เมื่อเปิดตัวเลือกนี้ สีรอบขอบรูปจะไม่ถูกนับ ปิดได้ถ้าขอบนั้นเป็นส่วนหนึ่งของแบรนด์จริงๆ เช่น โลโก้ที่เป็นป้ายสีทึบ</p>
<h2>อ่านตัวเลขความคมชัด</h2>
<p>แต่ละสีจะบอกว่าตัวหนังสือสีขาวและสีดำบนสีนั้นอ่านง่ายแค่ไหน ตัวหนังสือขนาดปกติต้องได้อย่างน้อย <strong>4.5:1</strong> จึงผ่านมาตรฐาน WCAG AA ซึ่งเป็นระดับที่เว็บส่วนใหญ่ใช้ หัวข้อขนาดใหญ่ใช้ 3:1 ก็พอ ตัว <strong>Aa</strong> บนแต่ละสีจะใช้สีขาวหรือดำ แล้วแต่ว่าสีไหนอ่านง่ายกว่า</p>
<h2>ทำไมสีถึงต่างจากคู่มือแบรนด์นิดหน่อย</h2>
<p>รูปภาพถูกบีบอัดและขอบถูกทำให้เนียน พิกเซลจึงเพี้ยนจากสีจริงเล็กน้อย เครื่องมือจะเฉลี่ยกลุ่มพิกเซลที่ใกล้เคียงกัน ซึ่งได้ผลใกล้มาก แต่ถ้าคุณมีรหัส HEX ทางการอยู่แล้ว ให้ใช้รหัสนั้น</p>`,
  faq: [
    { q: 'โลโก้ของฉันถูกอัปโหลดไหม?', a: 'ไม่ สีถูกคำนวณในเบราว์เซอร์ของคุณ และรูปไม่เคยออกจากเครื่อง' },
    { q: 'ใช้รูปเดิมจะได้สีเดิมทุกครั้งไหม?', a: 'ใช่ รูปเดิมจะได้ชุดสีเดิมเสมอ กลับมาทำใหม่ทีหลังก็ได้ผลเหมือนเดิม' },
    { q: 'เลือกสีหลัก สีรอง และสีเน้นอย่างไร?', a: 'สีหลักคือสีสดที่มีพื้นที่มากที่สุด สีรองคือสีถัดมา สีเน้นคือสีที่สดที่สุดในบรรดาสีที่มีพื้นที่น้อย ส่วนขาว ดำ และเทา จะกลายเป็นพื้นหลัง ตัวอักษร และสีกลาง' },
    { q: 'ใช้กับรูปถ่ายได้ไหม?', a: 'ได้ ใช้ได้กับทุกรูป เหมาะกับการคิดชุดสีจากรูปสินค้าหรือมู้ดบอร์ด' },
  ],
  strings: {
    'Reading colours…': 'กำลังอ่านสี…',
    'That file couldn’t be opened as an image. Try a PNG, JPG or SVG.': 'เปิดไฟล์นี้เป็นรูปภาพไม่ได้ ลองใช้ PNG, JPG หรือ SVG',
    'No solid colours found. Is the image fully transparent?': 'ไม่พบสีทึบเลย รูปนี้โปร่งใสทั้งรูปหรือเปล่า?',
    'skipped the {hex} background': 'ไม่นับพื้นหลังสี {hex}',
    'Found 1 colour': 'พบ 1 สี',
    'Found {n} colours': 'พบ {n} สี',
    Large: 'ตัวใหญ่',
    Fail: 'ไม่ผ่าน',
    'White text: {r}': 'ตัวอักษรสีขาว: {r}',
    'Black text: {r}': 'ตัวอักษรสีดำ: {r}',
    primary: 'สีหลัก',
    secondary: 'สีรอง',
    accent: 'สีเน้น',
    background: 'พื้นหลัง',
    text: 'ตัวอักษร',
    extra: 'สีเสริม',
    neutral: 'สีกลาง',
  },
};

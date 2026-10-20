// json-formatter in Thai. The body keeps every id and class from tool.mjs; only the words change.
import { JSON_ERRORS_TH } from './json-errors-th.mjs';

export default {
  name: "จัดรูปแบบและตรวจสอบ JSON",
  title: "จัดรูปแบบ JSON ออนไลน์ ตรวจหาจุดผิดได้ตรงบรรทัด",
  description: "วาง JSON ที่อ่านยากแล้วได้ JSON ที่จัดเรียงสวยงาม ถ้ามีจุดผิดจะบอกบรรทัดและคอลัมน์ที่ผิดให้เลย ข้อมูลของคุณอยู่ในเบราว์เซอร์เท่านั้น",
  short: "จัด JSON ให้อ่านง่าย และหาจุดที่พัง",
  body: `<div class="toolbar">
  <button class="btn primary" id="format">จัดรูปแบบ</button>
  <button class="btn" id="minify">ย่อเป็นบรรทัดเดียว</button>
  <label class="check">ย่อหน้า <select id="indent"><option value="2">2 ช่องว่าง</option><option value="4">4 ช่องว่าง</option><option value="tab">แท็บ</option></select></label>
  <label class="check"><input type="checkbox" id="sort"> เรียงคีย์</label>
  <button class="btn" id="sample">ตัวอย่าง</button>
  <button class="btn" id="download">ดาวน์โหลด</button>
  <button class="btn" id="share">ลิงก์แชร์</button>
</div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">JSON ต้นฉบับ</label><button class="btn small" id="clear">ล้าง</button></div>
    <textarea id="input" spellcheck="false" placeholder="วาง JSON ที่นี่…"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><label class="label" for="output">ผลลัพธ์</label><button class="btn small" data-copy="#output">คัดลอก</button></div>
    <textarea id="output" spellcheck="false" readonly data-send-to="json-to-csv,json-schema-generator"></textarea>
  </div>
</div>`,
  content: `<h2>วิธีใช้</h2>
<ol><li>วาง JSON ลงในช่องซ้าย</li><li>กด <strong>จัดรูปแบบ</strong> เพื่อให้อ่านง่าย หรือกด <strong>ย่อเป็นบรรทัดเดียว</strong> เพื่อบีบให้สั้นที่สุด</li><li>ถ้ามีอะไรผิด เครื่องมือจะบอกบรรทัดและคอลัมน์ แล้วเลื่อนเคอร์เซอร์ไปที่จุดนั้นให้</li></ol>
<h2>จุดผิดที่เจอบ่อย</h2>
<p>JSON ที่พังส่วนใหญ่มาจากความผิดพลาดไม่กี่แบบ:</p>
<ul><li><strong>ลูกน้ำเกินตัวสุดท้าย</strong> เช่น <code>[1, 2,]</code> JavaScript ยอมให้มี แต่ JSON ไม่ยอม</li><li><strong>ใช้เครื่องหมายคำพูดเดี่ยว</strong> คีย์และข้อความต้องใช้เครื่องหมายคำพูดคู่</li><li><strong>คีย์ไม่มีเครื่องหมายคำพูด</strong> <code>{a: 1}</code> ต้องเขียนเป็น <code>{"a": 1}</code></li><li><strong>เลขศูนย์นำหน้า</strong> <code>01</code> ไม่ใช่ตัวเลขที่ถูกต้อง</li><li><strong>คอมเมนต์</strong> JSON ธรรมดาไม่มีคอมเมนต์ ต้องลบบรรทัด <code>//</code> ออก</li></ul>`,
  faq: [
    { q: "JSON ของฉันถูกส่งไปที่ไหนไหม?", a: "ไม่ การจัดรูปแบบทำในเบราว์เซอร์ของคุณ วางผลลัพธ์จาก API หรือไฟล์ config ที่มีคีย์ลับอยู่ก็ได้" },
    { q: "ลิงก์แชร์เป็นส่วนตัวไหม?", a: "JSON จะอยู่ในส่วนของลิงก์หลังเครื่องหมาย <code>#</code> ซึ่งเบราว์เซอร์ไม่ส่งไปที่เซิร์ฟเวอร์ แต่ใครที่ได้ลิงก์ไปก็เปิดดูได้ จึงควรแชร์อย่างระวังเหมือนแชร์ข้อมูลนั้นเอง" },
    { q: "“เรียงคีย์” ทำอะไร?", a: "เรียงคีย์ตามตัวอักษรในทุกระดับ สะดวกเวลาอยากเทียบเอกสารสองชิ้นด้วยตา" },
  ],
  strings: {
    ...JSON_ERRORS_TH,
    "Valid JSON": "JSON ถูกต้อง",
    "Valid JSON · {bytes} bytes": "JSON ถูกต้อง · {bytes} ไบต์",
    " · kept 1 long number exactly as written": " · เก็บตัวเลขยาว 1 ตัวไว้ตรงตามต้นฉบับ",
    " · kept {n} long numbers exactly as written": " · เก็บตัวเลขยาว {n} ตัวไว้ตรงตามต้นฉบับ",
  },
};

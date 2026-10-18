// csv-to-json in Thai. The body keeps every id and class from tool.mjs; only the words change.
import { JSON_ERRORS_TH } from '../json-formatter/json-errors-th.mjs';

export default {
  name: "แปลง CSV เป็น JSON",
  title: "แปลง CSV เป็น JSON ออนไลน์ฟรี ทำงานในเบราว์เซอร์",
  description: "วาง CSV หรือเปิดไฟล์ แล้วได้ JSON array กลับมา ตรวจจับตัวเลขและ true/false ให้อัตโนมัติ และไม่พังเพราะลูกน้ำในเครื่องหมายคำพูด",
  short: "เปลี่ยนแถวในสเปรดชีตเป็น JSON",
  body: `<div class="toolbar">
  <button class="btn primary" id="convert">แปลง</button>
  <label class="check">ตัวคั่น <select id="delimiter"><option value=",">จุลภาค (,)</option><option value=";">อัฒภาค (;)</option><option value="	">แท็บ</option><option value="|">ขีดตั้ง (|)</option></select></label>
  <label class="check"><input type="checkbox" id="header" checked> แถวแรกเป็นหัวตาราง</label>
  <label class="check"><input type="checkbox" id="types" checked> ตรวจจับตัวเลขและค่า true/false</label>
  <button class="btn" id="file">เปิดไฟล์</button><input type="file" id="file-input" accept=".csv,.tsv,.txt,text/csv" hidden>
  <button class="btn" id="sample">ตัวอย่าง</button>
  <button class="btn" id="download">ดาวน์โหลด</button>
</div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">CSV</label><button class="btn small" id="clear">ล้าง</button></div>
    <textarea id="input" spellcheck="false" placeholder="name,age
Ada,36"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><label class="label" for="output">JSON</label><button class="btn small" data-copy="#output">คัดลอก</button></div>
    <textarea id="output" spellcheck="false" readonly data-send-to="json-formatter,json-schema-generator"></textarea>
  </div>
</div>`,
  content: `<h2>จัดการข้อมูลของคุณอย่างไร</h2>
<ul><li>ฟิลด์ในเครื่องหมายคำพูดมีลูกน้ำ การขึ้นบรรทัดใหม่ และเครื่องหมายคำพูด (เขียนเป็น <code>""</code>) อยู่ข้างในได้ ตามแบบที่ Excel และ Google Sheets ส่งออกมา</li><li>เมื่อเปิดการตรวจจับชนิดข้อมูล <code>42</code> จะกลายเป็นตัวเลข และ <code>true</code>, <code>false</code>, <code>null</code> จะกลายเป็นค่า JSON จริง ตัวเลขยาวมากๆ เช่นเลขคำสั่งซื้อจะเก็บเป็นข้อความเพื่อไม่ให้ถูกปัดเศษ</li><li>ถ้าไฟล์ไม่มีแถวหัวตาราง ให้เอาเครื่องหมายถูกที่ “แถวแรกเป็นหัวตาราง” ออก คุณจะได้ลิสต์ของลิสต์แทนออบเจ็กต์</li></ul>`,
  faq: [
    { q: "ใช้ไฟล์ Excel ได้ไหม?", a: "ให้บันทึกเป็น CSV ก่อน (ไฟล์ → บันทึกเป็น → CSV) แล้วเปิดไฟล์นั้นที่นี่" },
    { q: "ไฟล์ของฉันถูกอัปโหลดไหม?", a: "ไม่ เบราว์เซอร์อ่านไฟล์โดยตรง ไม่มีอะไรออกจากเครื่องของคุณ" },
  ],
  strings: {
    ...JSON_ERRORS_TH,
    "Converted 1 row": "แปลงแล้ว 1 แถว",
    "Converted {n} rows": "แปลงแล้ว {n} แถว",
    "Unterminated quoted field": "ฟิลด์ในเครื่องหมายคำพูดไม่มีตัวปิด",
  },
};

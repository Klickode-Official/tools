// json-to-csv in Thai. The body keeps every id and class from tool.mjs; only the words change.
import { JSON_ERRORS_TH } from '../json-formatter/json-errors-th.mjs';

export default {
  name: "แปลง JSON เป็น CSV",
  title: "แปลง JSON เป็น CSV สำหรับ Excel และ Google Sheets",
  description: "เปลี่ยน JSON array เป็นไฟล์ CSV ที่เปิดใน Excel หรือ Google Sheets ได้ ออบเจ็กต์ซ้อนกันจะแยกเป็นคอลัมน์ของตัวเอง เช่น address.city",
  short: "เปลี่ยน JSON เป็นสเปรดชีต",
  body: `<div class="toolbar">
  <button class="btn primary" id="convert">แปลง</button>
  <label class="check">ตัวคั่น <select id="delimiter"><option value=",">จุลภาค (,)</option><option value=";">อัฒภาค (;)</option><option value="	">แท็บ</option><option value="|">ขีดตั้ง (|)</option></select></label>
  <label class="check"><input type="checkbox" id="flatten" checked> แยกออบเจ็กต์ซ้อนเป็นคอลัมน์</label>
  <button class="btn" id="file">เปิดไฟล์</button><input type="file" id="file-input" accept=".json,application/json" hidden>
  <button class="btn" id="sample">ตัวอย่าง</button>
  <button class="btn" id="download">ดาวน์โหลด</button>
</div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">JSON</label><button class="btn small" id="clear">ล้าง</button></div>
    <textarea id="input" spellcheck="false" placeholder="[{"name":"Ada","age":36}]"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><label class="label" for="output">CSV</label><button class="btn small" data-copy="#output">คัดลอก</button></div>
    <textarea id="output" spellcheck="false" readonly data-send-to="csv-to-json"></textarea>
  </div>
</div>`,
  content: `<h2>จัดการข้อมูลของคุณอย่างไร</h2>
<ul><li>ใส่ลิสต์ของออบเจ็กต์ ทุกคีย์ที่เจอจะกลายเป็นคอลัมน์ ตามลำดับที่เจอครั้งแรก</li><li>ออบเจ็กต์ที่ซ้อนกันจะถูกแยกเป็นคอลัมน์ชื่อแบบมีจุด เช่น <code>{"address":{"city":"Chiang Mai"}}</code> จะกลายเป็นคอลัมน์ <code>address.city</code></li><li>ลิสต์ที่อยู่ในแต่ละรายการจะเก็บเป็นข้อความ JSON ในช่องเดียว ข้อมูลจึงไม่หาย</li></ul>`,
  faq: [
    { q: "Excel แสดงทุกอย่างรวมอยู่ในคอลัมน์เดียว ทำยังไงดี?", a: "Excel ของคุณอาจใช้อัฒภาค (;) เป็นตัวคั่น ซึ่งพบบ่อยในการตั้งค่าแบบยุโรป ให้เลือกตัวคั่นเป็น “อัฒภาค (;)” แล้วดาวน์โหลดใหม่" },
  ],
  strings: {
    ...JSON_ERRORS_TH,
    "Converted 1 row": "แปลงแล้ว 1 แถว",
    "Converted {n} rows": "แปลงแล้ว {n} แถว",
    "Unterminated quoted field": "ฟิลด์ในเครื่องหมายคำพูดไม่มีตัวปิด",
  },
};

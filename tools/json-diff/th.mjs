// json-diff in Thai. The body keeps every id and class from tool.mjs; only the words change.
import { JSON_ERRORS_TH } from '../json-formatter/json-errors-th.mjs';

export default {
  name: "เปรียบเทียบ JSON",
  title: "เปรียบเทียบไฟล์ JSON สองไฟล์ ดูว่าอะไรเปลี่ยน (JSON Diff)",
  description: "วาง JSON สองชุดแล้วดูทุกค่าที่ถูกเพิ่ม ลบ หรือแก้ไข พร้อม path บอกตำแหน่ง ไม่สนลำดับคีย์และการเว้นวรรค",
  short: "ดูว่า JSON สองไฟล์ต่างกันตรงไหน",
  body: `<div class="toolbar"><button class="btn primary" id="compare">เปรียบเทียบ</button><button class="btn" id="sample">ตัวอย่าง</button><button class="btn" id="clear">ล้าง</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="left">ต้นฉบับ</label></div><textarea id="left" spellcheck="false" placeholder="JSON ต้นฉบับ…"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="right">ฉบับแก้ไข</label></div><textarea id="right" spellcheck="false" placeholder="JSON ที่แก้ไขแล้ว…"></textarea></div>
</div>
<h2>ความแตกต่าง</h2>
<ul class="list-plain" id="result"></ul>`,
  content: `<h2>ทำงานอย่างไร</h2>
<p>เครื่องมือนี้เปรียบเทียบข้อมูล ไม่ใช่ข้อความ การเว้นวรรค การขึ้นบรรทัดใหม่ และลำดับของคีย์จึงไม่นับเป็นการเปลี่ยนแปลง ทุกจุดที่ต่างกันจะมี path เช่น <code>$.users[2].email</code> ให้หาเจอได้แม้ใน API response ขนาดใหญ่</p>`,
  faq: [
    { q: "รายการ (array) เปรียบเทียบกันอย่างไร?", a: "ถ้าทุกรายการในลิสต์มีฟิลด์ไอดีที่ไม่ซ้ำกัน (id, _id, uuid, key, sku, slug หรือ code) ระบบจะจับคู่รายการด้วยไอดีนั้น การเพิ่มหรือสลับลำดับรายการจึงรายงานเฉพาะสิ่งที่เปลี่ยนจริง ถ้าไม่มี จะเทียบตามลำดับ" },
    { q: "ไฟล์ใหญ่ได้แค่ไหน?", a: "ขึ้นอยู่กับหน่วยความจำของเครื่องคุณ ไม่ใช่ของเรา ไฟล์ขนาดไม่กี่เมกะไบต์เทียบเสร็จในไม่ถึงวินาที" },
  ],
  strings: {
    ...JSON_ERRORS_TH,
    "Original: {message}": "ต้นฉบับ: {message}",
    "Changed: {message}": "ฉบับแก้ไข: {message}",
    "The documents are equivalent.": "ข้อมูลทั้งสองชุดเหมือนกัน",
    "1 difference: {parts}": "ต่างกัน 1 จุด: {parts}",
    "{n} differences: {parts}": "ต่างกัน {n} จุด: {parts}",
    "{n} changed": "แก้ไข {n}",
    "{n} added": "เพิ่ม {n}",
    "{n} removed": "ลบ {n}",
    "changed": "แก้ไข",
    "added": "เพิ่ม",
    "removed": "ลบ",
  },
};

// json-schema-generator in Thai. The body keeps every id and class from tool.mjs; only the words change.
import { JSON_ERRORS_TH } from '../json-formatter/json-errors-th.mjs';

export default {
  name: "สร้าง JSON Schema",
  title: "สร้าง JSON Schema จากตัวอย่าง JSON อัตโนมัติ",
  description: "วางตัวอย่าง API response แล้วได้ JSON Schema (draft 2020-12) ไปใช้ต่อ พร้อมชนิดข้อมูล ฟิลด์บังคับ และ format อย่างอีเมลและวันที่",
  short: "สร้าง JSON Schema จากตัวอย่างข้อมูล",
  body: `<div class="toolbar">
  <button class="btn primary" id="generate">สร้าง Schema</button>
  <label class="check"><input type="checkbox" id="required" checked> ตั้งเป็นฟิลด์บังคับ</label>
  <label class="check"><input type="checkbox" id="strict"> ไม่อนุญาตฟิลด์อื่นเพิ่ม</label>
  <label class="check"><input type="checkbox" id="formats" checked> ตรวจจับ format</label>
  <button class="btn" id="sample">ตัวอย่าง</button>
  <button class="btn" id="download">ดาวน์โหลด</button>
</div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">ตัวอย่าง JSON</label><button class="btn small" id="clear">ล้าง</button></div>
    <textarea id="input" spellcheck="false" placeholder="{"id": 1, "email": "a@b.co"}"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><label class="label" for="output">JSON Schema</label><button class="btn small" data-copy="#output">คัดลอก</button></div>
    <textarea id="output" spellcheck="false" readonly data-send-to="json-formatter"></textarea>
  </div>
</div>`,
  content: `<h2>สิ่งที่เครื่องมือหาให้</h2>
<ul><li>ชนิดของทุกค่า รวมถึงตัวเลขว่าเป็นจำนวนเต็มหรือไม่</li><li>ถ้าเป็นลิสต์ของออบเจ็กต์ จะดูทุกรายการ ฟิลด์จะถูกตั้งเป็น required ก็ต่อเมื่อทุกรายการมีฟิลด์นั้น</li><li>ข้อความที่ดูเหมือนวันที่ อีเมล ลิงก์ หรือ UUID จะได้ <code>format</code> ที่ตรงกัน</li></ul>
<p>ให้มองผลลัพธ์เป็นร่างแรก อ่านทวนแล้วเพิ่มเงื่อนไขอย่าง <code>minLength</code>, <code>enum</code> หรือ <code>pattern</code> ในจุดที่คุณรู้มากกว่าที่ตัวอย่างเดียวจะบอกได้</p>`,
  faq: [],
  strings: {
    ...JSON_ERRORS_TH,
    "Schema generated": "สร้าง Schema แล้ว",
  },
};

// URL Encoder / Decoder in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'เข้ารหัส / ถอดรหัส URL',
  title: 'แปลง URL ภาษาไทย: ถอดรหัส %E0%B8 และเข้ารหัส URL',
  description: 'แปลงลิงก์ที่เต็มไปด้วย %E0%B8... ให้กลับเป็นภาษาไทยอ่านออก หรือเข้ารหัสข้อความไปใส่ในลิงก์ พร้อมแยกพารามิเตอร์ให้ดู ทำงานในเบราว์เซอร์',
  short: 'ถอดลิงก์ %E0%B8 เป็นภาษาไทย และเข้ารหัส URL',
  body: `<div class="toolbar"><button class="btn primary" id="encode">เข้ารหัส</button><button class="btn" id="decode">ถอดรหัส</button><label class="check"><input type="checkbox" id="full"> ทั้ง URL (คง <code>:/?&amp;=</code> ไว้)</label><button class="btn" id="swap">สลับ</button></div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">ข้อมูลเข้า</label><button class="btn small" id="clear">ล้าง</button></div>
    <textarea id="input" spellcheck="false" placeholder=""></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><label class="label" for="output">ผลลัพธ์</label><button class="btn small" data-copy="#output">คัดลอก</button></div>
    <textarea id="output" spellcheck="false" readonly></textarea>
  </div>
</div>
<h2>พารามิเตอร์ในลิงก์</h2><table class="kv" id="params"></table>`,
  content: `<h2>ทำไมลิงก์ภาษาไทยถึงกลายเป็น %E0%B8...</h2>
<p>URL ใช้ได้แค่ตัวอักษรอังกฤษบางตัว ภาษาไทยจึงถูกแปลงเป็นรหัส UTF-8 แบบมีเครื่องหมาย % เช่น คำว่า “ไทย” จะกลายเป็น <code>%E0%B9%84%E0%B8%97%E0%B8%A2</code> เวลาคัดลอกลิงก์จากเบราว์เซอร์ไปวางในแชตหรือเอกสาร จึงเห็นเป็นตัวอักษรยาวๆ อ่านไม่ออก กด “ถอดรหัส” เพื่อให้กลับเป็นภาษาไทย</p>
<h2>ต้องใช้โหมดไหน?</h2>
<p>ปิด “ทั้ง URL” ไว้ เมื่อเข้ารหัสค่าเดียวเพื่อใส่หลัง <code>?q=</code> ทุกอย่างที่อาจทำให้ลิงก์เสียจะถูกเข้ารหัส รวมถึง <code>&amp;</code> และ <code>=</code></p>
<p>เปิดไว้ เมื่อมีลิงก์ทั้งเส้นและต้องการแก้แค่ช่องว่างกับตัวอักษรแปลกๆ โดยไม่แตะ <code>://</code>, <code>?</code> และ <code>&amp;</code></p>
<p>ตอนถอดรหัส เครื่องหมาย <code>+</code> จะถูกอ่านเป็นช่องว่าง แบบเดียวกับที่ฟอร์มบนเว็บส่งมา</p>`,
  faq: [
    { q: 'ถอดรหัสแล้วขึ้น error ว่า percent-encoding ผิดรูปแบบ?', a: 'แปลว่ามีเครื่องหมาย % ที่ไม่ได้ตามด้วยเลขฐานสิบหกสองหลัก มักเกิดจากลิงก์ที่ถูกตัดกลางคันตอนคัดลอก ลองคัดลอกลิงก์มาใหม่ทั้งเส้น' },
    { q: 'ทำไมช่องว่างบางทีเป็น %20 บางทีเป็น +?', a: 'ใน URL ช่องว่างคือ %20 ส่วนฟอร์มบนเว็บส่งช่องว่างใน query string เป็น + เครื่องมือนี้อ่านทั้งสองแบบเป็นช่องว่างตอนถอดรหัส และใช้ %20 ตอนเข้ารหัส เพราะใช้ได้ทุกที่' },
    { q: 'ลิงก์ถูกส่งไปที่ไหนไหม?', a: 'ไม่ เครื่องมือนี้ทำงานในเบราว์เซอร์ทั้งหมด ลิงก์ไม่ออกจากเครื่องของคุณ และใช้แบบออฟไลน์ได้หลังเปิดหน้าแล้ว' },
  ],
  strings: {
    'Malformed percent-encoding (e.g. a stray % not followed by two hex digits)': 'percent-encoding ผิดรูปแบบ (เช่น มี % ที่ไม่ได้ตามด้วยเลขฐานสิบหกสองหลัก)',
    Encoded: 'เข้ารหัสแล้ว',
    Decoded: 'ถอดรหัสแล้ว',
  },
};

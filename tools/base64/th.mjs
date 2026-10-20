// Base64 Encoder / Decoder in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'เข้ารหัส / ถอดรหัส Base64',
  title: 'แปลง Base64 ออนไลน์: เข้ารหัสและถอดรหัส รองรับภาษาไทย',
  description: 'เข้ารหัสข้อความเป็น Base64 หรือถอดรหัสกลับเป็นข้อความ รองรับภาษาไทยและอีโมจิแบบ UTF-8 และแบบ URL-safe ข้อมูลไม่ออกจากเบราว์เซอร์',
  short: 'เข้ารหัสหรือถอดรหัส Base64 ภาษาไทยก็ได้',
  body: `<div class="toolbar"><button class="btn primary" id="encode">เข้ารหัส</button><button class="btn" id="decode">ถอดรหัส</button><label class="check"><input type="checkbox" id="urlsafe"> แบบ URL-safe (Base64URL)</label><button class="btn" id="swap">สลับ</button></div>
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
</div>`,
  content: `<h2>Base64 ใช้ทำอะไร</h2>
<p>Base64 แปลงข้อมูลอะไรก็ได้ให้เป็นตัวอักษรและตัวเลขธรรมดา เพื่อส่งผ่านที่ที่รับได้แค่ข้อความ เช่น JSON อีเมล หรือ URL ข้อมูลจะใหญ่ขึ้นประมาณหนึ่งในสาม และมันไม่ใช่การเข้ารหัสลับ ใครก็ถอดกลับได้ จึงไม่ควรใช้ซ่อนข้อมูลสำคัญ</p>
<p>แบบ URL-safe จะเปลี่ยน <code>+</code> และ <code>/</code> เป็น <code>-</code> และ <code>_</code> และตัด <code>=</code> ท้ายสุดออก เป็นแบบที่ JWT ใช้</p>
<h2>ภาษาไทยกับ Base64</h2>
<p>ภาษาไทยหนึ่งตัวอักษรใช้ 3 ไบต์ใน UTF-8 ข้อความไทยที่เข้ารหัสจึงยาวกว่าภาษาอังกฤษพอสมควร เครื่องมือนี้เข้ารหัสแบบ UTF-8 เสมอ ถอดกลับแล้วได้ภาษาไทยครบถ้วน ไม่กลายเป็นตัวอักษรแปลกๆ</p>`,
  faq: [
    {
      q: 'ทำไมขึ้นว่า “ไม่ใช่ข้อความ UTF-8 ที่ถูกต้อง”?',
      a: 'สิ่งที่คุณวางถอดออกมาเป็นข้อมูลไบนารี เช่น รูปภาพหรือไฟล์ zip ไม่ใช่ข้อความ เครื่องมือนี้แสดงได้เฉพาะข้อความ',
    },
  ],
  strings: {
    'Decoded bytes are not valid UTF-8 text': 'ข้อมูลที่ถอดออกมาไม่ใช่ข้อความ UTF-8 ที่ถูกต้อง',
    'Input contains characters that are not valid Base64': 'มีตัวอักษรที่ไม่ใช่ Base64 อยู่ในข้อมูล',
    'Base64 input has an invalid length': 'ความยาวของข้อมูล Base64 ไม่ถูกต้อง',
    Encoded: 'เข้ารหัสแล้ว',
    Decoded: 'ถอดรหัสแล้ว',
  },
};

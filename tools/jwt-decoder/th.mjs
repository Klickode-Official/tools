// JWT Decoder in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'ถอดรหัส JWT',
  title: 'ถอดรหัส JWT ออนไลน์: ดู Payload และเช็กวันหมดอายุ',
  description: 'วาง JWT แล้วดู header, payload และเวลา iat, nbf, exp เป็นวันที่อ่านออก พร้อมบอกว่าหมดอายุหรือยัง token ไม่ถูกส่งไปไหนและไม่ถูกจำไว้',
  short: 'ดูข้อมูลใน token และเช็กว่าหมดอายุหรือยัง',
  body: `<div class="panel"><div class="panel-head"><label for="input">Token ที่เข้ารหัส</label><button class="btn small" id="clear">ล้าง</button></div><textarea id="input" class="short" spellcheck="false" placeholder="eyJhbGciOi…"></textarea></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><span class="label">Header</span><button class="btn small" data-copy="#header">คัดลอก</button></div><pre class="output" id="header" style="min-height:120px" tabindex="0"></pre></div>
  <div class="panel"><div class="panel-head"><span class="label">Payload</span><button class="btn small" data-copy="#payload">คัดลอก</button></div><pre class="output" id="payload" style="min-height:120px" tabindex="0"></pre></div>
</div>
<h2>เวลาใน token</h2><table class="kv" id="times"></table>`,
  content: `<h2>อ่าน token ได้ ไม่ได้แปลว่าเชื่อถือได้</h2>
<p>เครื่องมือนี้แสดงว่าใน token มีอะไร แต่ไม่ได้ตรวจลายเซ็น และตรวจไม่ได้ด้วย เพราะต้องใช้กุญแจลับของผู้ออก token ใครก็สร้าง token ที่เขียนอะไรก็ได้ เซิร์ฟเวอร์ของคุณจึงต้องตรวจลายเซ็นทุกครั้งก่อนเชื่อข้อมูลข้างใน</p>
<h2>เวลาใน JWT อ่านอย่างไร</h2>
<p><code>iat</code> คือเวลาที่ออก token, <code>nbf</code> คือเวลาที่เริ่มใช้ได้ และ <code>exp</code> คือเวลาหมดอายุ ทั้งหมดเก็บเป็น Unix timestamp หน่วยวินาที เครื่องมือแปลงให้เป็นวันที่แบบ UTC ถ้าต้องการเวลาไทยหรือปี พ.ศ. ใช้ <a href="/th/tools/timestamp-converter/">ตัวแปลง Unix Timestamp</a></p>`,
  faq: [
    {
      q: 'วาง token จริงปลอดภัยไหม?',
      a: 'token ถูกถอดรหัสบนหน้านี้และไม่ถูกส่งไปไหน และต่างจากเครื่องมืออื่นของเรา หน้านี้จะไม่จำสิ่งที่คุณพิมพ์ แต่ token ที่ยังไม่หมดอายุใช้งานได้เหมือนรหัสผ่าน จึงควรระวังว่าจะวางไว้ที่อื่นที่ไหนบ้าง',
    },
  ],
  strings: {
    'Decoded · {status} · signature not verified': 'ถอดรหัสแล้ว · {status} · ยังไม่ได้ตรวจลายเซ็น',
    Expired: 'หมดอายุแล้ว',
    'Not expired': 'ยังไม่หมดอายุ',
    'Not yet valid': 'ยังไม่ถึงเวลาใช้งาน',
    'No expiry claim': 'ไม่มีวันหมดอายุ',
    'Issued at': 'ออกเมื่อ',
    'Not before': 'ใช้ได้ตั้งแต่',
    Expires: 'หมดอายุ',
    'No iat, nbf or exp claims.': 'ไม่มี iat, nbf หรือ exp ใน token นี้',
    'A JWT has 3 dot-separated parts; this has {n}': 'JWT ต้องมี 3 ส่วนคั่นด้วยจุด แต่อันนี้มี {n} ส่วน',
    'The {part} is not valid Base64URL-encoded JSON': 'ส่วน {part} ไม่ใช่ JSON ที่เข้ารหัสแบบ Base64URL',
    header: 'header',
    payload: 'payload',
  },
};

// Case Converter & Word Counter in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'แปลงรูปแบบตัวอักษรและนับคำ',
  title: 'นับคำภาษาไทย นับตัวอักษร และแปลง camelCase, snake_case',
  description: 'นับคำภาษาไทยและอังกฤษได้ถูกต้อง นับตัวอักษร ประโยค และเวลาอ่าน พร้อมแปลงข้อความเป็น camelCase, snake_case, kebab-case และอื่นๆ ทันทีที่พิมพ์',
  short: 'นับคำภาษาไทย และแปลง camelCase, snake_case',
  body: `<div class="panel"><div class="panel-head"><label for="input">ข้อความ</label><button class="btn small" id="clear">ล้าง</button></div><textarea id="input" class="short" spellcheck="false" placeholder="พิมพ์หรือวางข้อความ…"></textarea></div>
<div class="status ok" id="stats" aria-live="polite"></div>
<table class="kv" id="cases"></table>`,
  content: `<h2>นับคำภาษาไทยได้จริง</h2>
<p>ภาษาไทยเขียนติดกันโดยไม่เว้นวรรคระหว่างคำ ตัวนับคำทั่วไปจึงนับทั้งประโยคเป็นคำเดียว เครื่องมือนี้ตัดคำด้วยพจนานุกรมที่มากับเบราว์เซอร์ จึงนับคำภาษาไทยได้ใกล้เคียงกับที่คนอ่านนับจริง เหมาะกับการเขียนบทความ แคปชัน หรืองานที่กำหนดจำนวนคำ</p>
<h2>รูปแบบไหนใช้ที่ไหน</h2>
<ul><li><strong>camelCase</strong> สำหรับชื่อตัวแปรใน JavaScript และ Java</li><li><strong>PascalCase</strong> สำหรับชื่อคลาสและคอมโพเนนต์ React</li><li><strong>snake_case</strong> สำหรับ Python, Ruby และชื่อคอลัมน์ในฐานข้อมูล</li><li><strong>CONSTANT_CASE</strong> สำหรับค่าคงที่และตัวแปรสภาพแวดล้อม</li><li><strong>kebab-case</strong> สำหรับ URL, คลาส CSS และแฟล็กในคอมมานด์ไลน์</li></ul>
<p>ตัวย่อถูกจัดการอย่างที่ควรเป็น เช่น <code>parseHTTPResponse</code> จะกลายเป็น <code>parse_http_response</code> ไม่ใช่ <code>parse_h_t_t_p_response</code></p>`,
  faq: [
    { q: 'นับคำภาษาไทยแม่นแค่ไหน?', a: 'ใช้ตัวตัดคำของเบราว์เซอร์ (Intl.Segmenter) ซึ่งแม่นสำหรับคำทั่วไป ชื่อเฉพาะหรือคำสแลงบางคำอาจถูกแยกต่างจากที่คุณคิดเล็กน้อย' },
    { q: 'ข้อความถูกเก็บไว้ที่ไหนไหม?', a: 'ข้อความถูกจำไว้ในเบราว์เซอร์ของคุณเท่านั้น เพื่อไม่ให้หายเมื่อรีเฟรช กดปุ่ม “ล้าง” เพื่อลบ' },
  ],
  strings: {
    '{n} word': '{n} คำ',
    '{n} words': '{n} คำ',
    '{n} characters ({m} without spaces)': '{n} ตัวอักษร (ไม่รวมช่องว่าง {m})',
    '{n} sentence': '{n} ประโยค',
    '{n} sentences': '{n} ประโยค',
    '{n} line': '{n} บรรทัด',
    '{n} lines': '{n} บรรทัด',
    '~{n} min read': 'อ่านประมาณ {n} นาที',
    Copy: 'คัดลอก',
  },
};

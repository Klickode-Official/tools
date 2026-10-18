// Regex Tester in Thai. The body keeps every id and class from tool.mjs; only the words change.
export default {
  name: 'ทดสอบ Regex',
  title: 'ทดสอบ Regex ออนไลน์ (JavaScript) เห็นผลทันที',
  description: 'พิมพ์ regex แล้วดูทันทีว่าจับอะไรได้บ้าง พร้อม capture group และตัวอย่างการแทนที่ ใช้ engine JavaScript ตัวเดียวกับในโค้ดของคุณ',
  short: 'ลอง regex แล้วดูว่าจับอะไรได้บ้าง',
  body: `<div class="regex-field">
  <span class="slash" aria-hidden="true">/</span>
  <input type="text" id="pattern" class="mono" spellcheck="false" placeholder="ใส่ pattern ตรงนี้" aria-label="Regular expression">
  <span class="slash" aria-hidden="true">/</span>
  <input type="text" id="flags" class="mono flags" spellcheck="false" value="g" aria-label="แฟล็ก">
</div>
<p class="hint">แฟล็ก: <code>g</code> หาทั้งหมด · <code>i</code> ไม่สนตัวพิมพ์เล็กใหญ่ · <code>m</code> หลายบรรทัด · <code>s</code> dotAll · <code>u</code> unicode · <code>y</code> sticky</p>
<div class="toolbar">
  <button class="btn" id="sample">ตัวอย่าง</button>
  <button class="btn" id="share">ลิงก์แชร์</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="input">ข้อความทดสอบ</label><button class="btn small" id="clear">ล้าง</button></div><textarea id="input" spellcheck="false"></textarea></div>
  <div class="panel"><div class="panel-head"><span class="label">ไฮไลต์สิ่งที่จับได้</span></div><pre class="output" id="highlight" tabindex="0"></pre></div>
</div>
<h2>รายละเอียดที่จับได้</h2>
<div id="details"></div>
<h2>แทนที่</h2>
<div class="toolbar"><input type="text" id="replacement" class="mono" style="flex:1" spellcheck="false" placeholder="ข้อความแทนที่ เช่น $1 หรือ $<name>" aria-label="ข้อความแทนที่"></div>
<div class="panel"><div class="panel-head"><span class="label">ผลลัพธ์</span><button class="btn small" data-copy="#replaced">คัดลอก</button></div><pre class="output" id="replaced" style="min-height:120px" tabindex="0"></pre></div>`,
  content: `<h2>สรุปไวยากรณ์ที่ใช้บ่อย</h2>
<ul><li><code>\\d</code> ตัวเลข, <code>\\w</code> ตัวอักษรอังกฤษ ตัวเลข หรือขีดล่าง, <code>\\s</code> ช่องว่างหรือแท็บ, <code>.</code> อักขระอะไรก็ได้ยกเว้นขึ้นบรรทัดใหม่</li><li><code>*</code> ศูนย์ครั้งขึ้นไป, <code>+</code> หนึ่งครั้งขึ้นไป, <code>?</code> มีหรือไม่มีก็ได้, <code>{2,5}</code> สองถึงห้าครั้ง</li><li><code>^</code> และ <code>$</code> คือต้นและท้ายข้อความ (หรือต้นและท้ายแต่ละบรรทัด ถ้าใส่แฟล็ก <code>m</code>)</li><li><code>(…)</code> จับเป็นกลุ่ม, <code>(?:…)</code> จัดกลุ่มโดยไม่จับ, <code>(?&lt;name&gt;…)</code> ตั้งชื่อให้กลุ่ม</li><li><code>(?=…)</code> มองไปข้างหน้า, <code>(?&lt;=…)</code> มองย้อนหลัง</li></ul>
<h2>regex กับภาษาไทย</h2>
<p>ตัวอักษรไทยไม่นับเป็น <code>\\w</code> ถ้าจะจับคำภาษาไทย ใช้ช่วงอักขระ <code>[ก-๙]+</code> หรือใส่แฟล็ก <code>u</code> แล้วใช้ <code>\\p{Script=Thai}+</code> แทน</p>`,
  faq: [
    {
      q: 'regex ที่ใช้ตรงนี้เป็นแบบไหน?',
      a: 'เป็นของ JavaScript ที่มากับเบราว์เซอร์ของคุณเลย ผลที่เห็นตรงนี้จึงตรงกับที่ <code>match</code> และ <code>replace</code> จะทำในโค้ดจริง ส่วนใหญ่ใช้กับ Python, PHP และ Java ได้เหมือนกัน แต่มีบางฟีเจอร์ที่ไม่เหมือนกัน',
    },
    {
      q: 'ทำไมจับได้แค่อันเดียว?',
      a: 'ใส่แฟล็ก <code>g</code> เพิ่ม ถ้าไม่มี regex จะหยุดหลังเจออันแรก',
    },
    {
      q: 'หน้าเว็บบอกว่า “ยอมแพ้” เพราะอะไร?',
      a: 'บาง pattern โดยเฉพาะที่มีการซ้ำซ้อนกัน เช่น <code>(a+)+</code> อาจใช้เวลานานแทบไม่มีที่สิ้นสุดกับข้อความบางแบบ แทนที่จะปล่อยให้เบราว์เซอร์ค้าง ตัวทดสอบจะหยุดหลัง 1.5 วินาที ลองเขียนส่วนที่ซ้ำให้เจาะจงขึ้น',
    },
  ],
  strings: {
    'Unknown flag. Valid flags are d g i m s u v y.': 'ไม่รู้จักแฟล็กนี้ แฟล็กที่ใช้ได้คือ d g i m s u v y',
    'Gave up after {s}s. The pattern is probably backtracking catastrophically (e.g. nested quantifiers like (a+)+).': 'ยอมแพ้หลัง {s} วินาที pattern นี้น่าจะย้อนกลับไปลองใหม่ไม่รู้จบ (เช่น การซ้ำซ้อนกันแบบ (a+)+)',
    '{n} match · {ms} ms': 'จับได้ {n} รายการ · {ms} ms',
    '{n} matches · {ms} ms': 'จับได้ {n} รายการ · {ms} ms',
    'Match {n}': 'รายการที่ {n}',
    'Group {n}': 'กลุ่มที่ {n}',
    'not matched': 'ไม่ได้จับ',
    'index {from}–{to}': 'ตำแหน่ง {from}–{to}',
    'Showing the first 200 matches.': 'แสดง 200 รายการแรก',
  },
};

// robots-txt-tester in Thai. The body keeps every id and class from tool.mjs; only the words change.
export default {
  name: "ทดสอบ robots.txt",
  title: "ทดสอบ robots.txt เช็กว่า URL ถูกบล็อกหรือไม่",
  description: "วาง robots.txt และรายการ URL เพื่อดูว่า Googlebot, Bingbot, GPTBot หรือ crawler อื่นๆ เข้าหน้าไหนได้บ้าง",
  short: "เช็กว่า crawler เข้าถึง URL ได้หรือไม่",
  body: `<div class="toolbar"><label class="check">User agent <input type="text" id="ua" value="Googlebot" list="agents" style="width:12em"></label>
<datalist id="agents"><option value="Googlebot"><option value="Bingbot"><option value="GPTBot"><option value="ClaudeBot"><option value="CCBot"><option value="Applebot"><option value="*"></datalist>
<button class="btn" id="sample">ตัวอย่าง</button><button class="btn" id="clear">ล้าง</button></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="input">robots.txt</label></div><textarea id="input" spellcheck="false" placeholder="User-agent: *&#10;Disallow: /admin/"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="urls">URL หรือ path ที่จะทดสอบ (บรรทัดละหนึ่งรายการ)</label></div><textarea id="urls" spellcheck="false" placeholder="/&#10;/admin/login&#10;https://example.com/blog/post"></textarea></div>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="list-plain" id="results"></ul>
<h2>สรุปไฟล์</h2><div id="summary"></div>`,
  content: `<h2>crawler อ่านไฟล์นี้อย่างไร</h2>
<p>crawler จะมองหากลุ่มที่ระบุชื่อตัวเองเจาะจงที่สุด แล้วทำตามกลุ่มนั้นกลุ่มเดียว จะใช้กลุ่ม <code>*</code> ก็ต่อเมื่อไม่มีกลุ่มไหนระบุชื่อมันเลย จุดนี้ทำให้หลายคนพลาด เพราะพอเพิ่มส่วนของ Googlebot แล้ว Google จะไม่สนกฎใน <code>*</code> เลย</p>
<p>ภายในกลุ่ม กฎที่ตรงและยาวที่สุดจะชนะ ถ้า Allow กับ Disallow ยาวเท่ากัน Allow ชนะ <code>*</code> ตรงกับอะไรก็ได้ และ <code>$</code> หมายถึง “จบตรงนี้” บรรทัด <code>Disallow:</code> ที่ว่างเปล่าแปลว่าอนุญาตทั้งหมด</p>
<p>อีกเรื่องหนึ่ง: robots.txt หยุดการ crawl ไม่ได้หยุดการจัดทำดัชนี ถ้าไม่อยากให้หน้าขึ้นใน Google ให้ใส่แท็ก <code>noindex</code> แล้วปล่อยให้ crawl ได้ Google จะได้เห็นแท็กนั้น</p>`,
  faq: [],
  strings: {
    "Groups": "จำนวนกลุ่ม",
    "Applies to \"{ua}\"": "ใช้กับ \"{ua}\"",
    "(line {line})": "(บรรทัด {line})",
    "None, so everything is allowed": "ไม่มี จึงอนุญาตทั้งหมด",
    "Line {line}": "บรรทัด {line}",
    "{allowed} allowed · {blocked} blocked": "อนุญาต {allowed} · ถูกบล็อก {blocked}",
    "allowed": "อนุญาต",
    "blocked": "ถูกบล็อก",
    "Unrecognised line: {line}": "อ่านบรรทัดนี้ไม่ออก: {line}",
    "{directive} before any User-agent line is ignored": "{directive} ที่อยู่ก่อนบรรทัด User-agent จะถูกข้าม",
    "Unknown directive {name}": "ไม่รู้จักคำสั่ง {name}",
    "Matched {type}: {path} (line {line})": "ตรงกับ {type}: {path} (บรรทัด {line})",
    "/robots.txt is always allowed": "/robots.txt อนุญาตเสมอ",
    "No group applies to this user agent": "ไม่มีกลุ่มไหนใช้กับ user agent นี้",
    "No rule matches this path": "ไม่มีกฎที่ตรงกับ path นี้",
  },
};

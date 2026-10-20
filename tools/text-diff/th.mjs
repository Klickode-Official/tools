// Text Diff in Thai. The body keeps every id and class from tool.mjs; only the words change.
export default {
  name: 'เปรียบเทียบข้อความ',
  title: 'เปรียบเทียบข้อความ 2 ชุด ดูว่าแก้ตรงไหน (Text Diff)',
  description: 'เปรียบเทียบข้อความหรือโค้ดสองเวอร์ชัน ดูทันทีว่าบรรทัดไหนถูกเพิ่มหรือลบ และคำไหนถูกแก้ เหมาะสำหรับเช็กงานก่อนส่ง ข้อมูลไม่ออกจากเบราว์เซอร์',
  short: 'หาบรรทัดที่เปลี่ยนไประหว่างข้อความสองชุด',
  body: `<div class="toolbar"><button class="btn primary" id="compare">เปรียบเทียบ</button><label class="check"><input type="checkbox" id="trim"> ไม่สนช่องว่างหน้าและท้ายบรรทัด</label><button class="btn" id="sample">ตัวอย่าง</button><button class="btn" id="clear">ล้าง</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="left">ต้นฉบับ</label></div><textarea id="left" spellcheck="false"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="right">ฉบับแก้ไข</label></div><textarea id="right" spellcheck="false"></textarea></div>
</div>
<h2>ผลลัพธ์</h2>
<pre class="output" id="result" style="white-space:normal" tabindex="0"></pre>`,
  content: `<h2>ทำงานอย่างไร</h2>
<p>เครื่องมือจะเรียงข้อความสองเวอร์ชันให้ตรงกัน บรรทัดที่มีแค่ในต้นฉบับจะมีเครื่องหมายลบ บรรทัดที่มีแค่ในฉบับใหม่จะมีเครื่องหมายบวก ถ้าบรรทัดถูกแก้ไขแทนที่จะเปลี่ยนทั้งบรรทัด คำที่เปลี่ยนจะถูกไฮไลต์ไว้ในบรรทัดนั้น ส่วนที่เหมือนเดิมจะแสดงแบบธรรมดาให้เห็นจุดเปลี่ยนชัดๆ ถ้าเป็น JSON ใช้ <a href="/th/tools/json-diff/">JSON Diff</a> จะดีกว่า เพราะไม่สนเรื่องการจัดรูปแบบ</p>
<h2>ใช้กับภาษาไทยได้ไหม?</h2>
<p>ได้ เครื่องมือเปรียบเทียบทีละบรรทัด และไฮไลต์ส่วนที่เปลี่ยนในบรรทัดนั้น ใช้ได้ดีกับสัญญา บทความ หรือข้อความประกาศที่ต้องเช็กว่าใครแก้อะไรไปบ้าง</p>`,
  faq: [
    { q: 'ข้อความที่ใส่ถูกส่งไปที่ไหนไหม?', a: 'ไม่ การเปรียบเทียบทำในเบราว์เซอร์ของคุณทั้งหมด ข้อความไม่ถูกอัปโหลดไปที่ไหน' },
    { q: 'ถ้าย่อหน้าหรือช่องว่างต่างกัน จะนับว่าเปลี่ยนไหม?', a: 'ปกตินับ ถ้าไม่อยากให้นับ ติ๊ก “ไม่สนช่องว่างหน้าและท้ายบรรทัด” ก่อนเปรียบเทียบ' },
  ],
  strings: {
    '{added} line added, {removed} removed': 'เพิ่ม {added} บรรทัด ลบ {removed} บรรทัด',
    '{added} lines added, {removed} removed': 'เพิ่ม {added} บรรทัด ลบ {removed} บรรทัด',
    'The texts are identical.': 'ข้อความทั้งสองเหมือนกันทุกตัวอักษร',
  },
};

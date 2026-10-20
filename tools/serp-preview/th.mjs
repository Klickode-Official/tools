// serp-preview in Thai. The body keeps every id and class from tool.mjs; only the words change.
export default {
  name: "ดูตัวอย่างผลค้นหา Google",
  title: "ดูตัวอย่างผลค้นหา Google เช็กความยาว Title และ Description",
  description: "ดูว่าชื่อหน้าและ meta description จะแสดงบน Google อย่างไรทั้งบนคอมและมือถือ และจะถูกตัดตรงไหน",
  short: "ดูหน้าเว็บของคุณแบบที่ Google แสดง",
  body: `<div class="grid-2">
  <div class="panel">
    <label for="title" class="label">ชื่อหน้า (Title)</label>
    <input type="text" id="title" placeholder="ชื่อหน้าของคุณ" style="width:100%">
    <div class="meter" id="title-meter"></div><p class="hint"></p>
    <label for="desc" class="label" style="margin-top:12px">Meta description</label>
    <textarea id="desc" class="short" placeholder="อธิบายหน้านี้สักหนึ่งหรือสองประโยค"></textarea>
    <div class="meter" id="desc-meter"></div><p class="hint"></p>
    <label for="url" class="label" style="margin-top:12px">URL</label>
    <input type="text" id="url" placeholder="https://example.com/tools/image-converter/" style="width:100%">
    <div class="toolbar"><label class="check">อุปกรณ์ <select id="device"><option value="desktop">คอมพิวเตอร์</option><option value="mobile">มือถือ</option></select></label></div>
  </div>
  <div class="panel"><span class="label">ตัวอย่าง</span><div id="preview" class="serp"></div></div>
</div>`,
  content: `<h2>วัดเป็นพิกเซล ไม่ใช่จำนวนตัวอักษร</h2>
<p>Google ไม่ได้ตัดชื่อหน้าที่ 60 ตัวอักษร แต่ตัดที่ความกว้างประมาณ 580 พิกเซลบนคอมพิวเตอร์ และ “WWWW” กินที่มากกว่า “iiii” มาก แถบวัดจะคำนวณข้อความด้วยฟอนต์แบบที่ Google ใช้ คุณจึงเห็นได้ว่าพอดีจริงไหม ส่วนคำอธิบายได้พื้นที่ประมาณ 920 พิกเซลบนคอม และน้อยกว่านั้นบนมือถือ</p>
<p>บางครั้ง Google ก็เขียนชื่อหน้าและคำอธิบายใหม่เมื่อคิดว่ามีข้อความอื่นในหน้าที่ตรงกับคำค้นมากกว่า ข้อความที่ชัดเจน ตรงไปตรงมา และยาวพอดีช่วยลดโอกาสที่จะถูกเขียนใหม่</p>
<h2>วิธีดูตัวอย่างผลค้นหา Google</h2>
<ol><li>พิมพ์ Title, Meta description และ URL ของหน้า</li><li>สลับดูแบบคอมพิวเตอร์และมือถือ</li><li>ดูแถบใต้แต่ละช่องว่าใช้พื้นที่ไปเท่าไรแล้ว ถ้าเกิน Google จะตัดข้อความเป็น “…”</li></ol>`,
  faq: [
    { q: 'Title ควรยาวเท่าไร?', a: 'ให้พอดีประมาณ 580 พิกเซลบนคอมพิวเตอร์ ภาษาอังกฤษราว 50–60 ตัวอักษร ส่วนภาษาไทยความกว้างแต่ละตัวต่างกันมาก จึงควรวัดด้วยเครื่องมือนี้แทนการนับตัวอักษร' },
    { q: 'Meta description ควรยาวเท่าไร?', a: 'ประมาณ 920 พิกเซลบนคอมพิวเตอร์ และสั้นกว่านั้นบนมือถือ เขียนใจความสำคัญไว้ช่วงต้น ถ้าถูกตัดก็ยังอ่านรู้เรื่อง' },
    { q: 'ทำไม Google แสดง Title ไม่ตรงกับที่ตั้งไว้?', a: 'Google เขียน Title และคำอธิบายใหม่เมื่อคิดว่าข้อความอื่นในหน้าตรงกับคำค้นมากกว่า หรือเมื่อของเดิมยาวเกิน กว้างเกินไป หรือยัดคีย์เวิร์ด Title ที่ชัดเจน พอดีความยาว และตรงกับ &lt;h1&gt; ช่วยให้ Google ใช้ของคุณ' },
    { q: 'ข้อมูลถูกส่งไปที่ไหนไหม?', a: 'ไม่ เครื่องมือนี้ทำงานในเบราว์เซอร์ทั้งหมด ข้อมูลไม่ออกจากเครื่องของคุณ และใช้แบบออฟไลน์ได้หลังเปิดหน้าแล้ว' },
  ],
  strings: {
    "{chars} characters · {px} / {max}px": "{chars} ตัวอักษร · {px} / {max}px",
    " · title will be truncated": " · ชื่อหน้าจะถูกตัด",
    " · description will be truncated": " · คำอธิบายจะถูกตัด",
    "Your page title": "ชื่อหน้าของคุณ",
    "Your meta description. If it is missing, Google picks a snippet from the page content instead.": "meta description ของคุณ ถ้าไม่มี Google จะเลือกข้อความบางส่วนจากในหน้ามาแสดงแทน",
  },
};

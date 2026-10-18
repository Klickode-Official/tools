// UUID Generator in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'สร้าง UUID',
  title: 'สร้าง UUID ออนไลน์ v4 และ v7 ได้ครั้งละ 1,000 ตัว',
  description: 'สร้าง UUID v4 แบบสุ่ม หรือ v7 แบบเรียงตามเวลา ได้ครั้งละสูงสุด 1,000 ตัว เลือกตัวพิมพ์ใหญ่หรือไม่มีขีดได้ พร้อมตรวจว่า UUID ถูกต้องไหม',
  short: 'UUID v4 หรือ v7 ใหม่ๆ ได้ครั้งละ 1,000 ตัว',
  body: `<div class="toolbar">
  <label class="check">เวอร์ชัน <select id="version"><option value="4">v4 (สุ่ม)</option><option value="7">v7 (เรียงตามเวลา)</option></select></label>
  <label class="check">จำนวน <input type="number" id="count" value="5" min="1" max="1000" style="width:6em"></label>
  <label class="check"><input type="checkbox" id="upper"> ตัวพิมพ์ใหญ่</label>
  <label class="check"><input type="checkbox" id="nodash"> ไม่มีขีด</label>
  <button class="btn primary" id="generate">สร้าง</button>
  <button class="btn" data-copy="#output">คัดลอกทั้งหมด</button>
</div>
<textarea id="output" spellcheck="false" readonly aria-label="UUID ที่สร้าง" style="min-height:200px"></textarea>
<h2>ตรวจสอบ UUID</h2>
<div class="toolbar"><input type="text" id="check" class="mono" style="flex:1" spellcheck="false" placeholder="วาง UUID ตรงนี้" aria-label="UUID ที่ต้องการตรวจ"></div>
<div class="status" id="status" aria-live="polite"></div>`,
  content: `<h2>v4 หรือ v7 ดี?</h2>
<p><strong>v4</strong> สุ่มทั้งหมด ถ้าไม่แน่ใจ ใช้ตัวนี้ปลอดภัยที่สุด</p>
<p><strong>v7</strong> ขึ้นต้นด้วยเวลาที่สร้าง ไอดีใหม่จึงเรียงต่อท้ายไอดีเก่าเสมอ ฐานข้อมูลชอบแบบนี้ เพราะแถวใหม่ไปต่อท้าย index แทนที่จะกระจายไปทั่ว ทั้งสองแบบสร้างด้วยตัวสุ่มที่ปลอดภัยของเบราว์เซอร์</p>`,
  faq: [
    { q: 'UUID ที่สร้างซ้ำกันได้ไหม?', a: 'ในทางปฏิบัติไม่ซ้ำ v4 มีส่วนสุ่ม 122 บิต โอกาสซ้ำต่ำจนไม่ต้องกังวล แม้จะสร้างเป็นพันล้านตัว' },
    { q: 'ตัวที่สร้างถูกส่งไปที่ไหนไหม?', a: 'ไม่ UUID ถูกสร้างในเบราว์เซอร์ของคุณ ไม่มีใครเห็นนอกจากคุณ' },
  ],
  strings: {
    'Not a valid UUID (expected 8-4-4-4-12 hex digits)': 'ไม่ใช่ UUID ที่ถูกต้อง (ต้องเป็นเลขฐานสิบหกแบบ 8-4-4-4-12)',
    'Valid nil UUID': 'เป็น nil UUID ที่ถูกต้อง',
    'Valid UUID · version {v} · {variant} variant': 'UUID ถูกต้อง · เวอร์ชัน {v} · รูปแบบ {variant}',
    ' · created {time}': ' · สร้างเมื่อ {time}',
    other: 'อื่นๆ',
  },
};

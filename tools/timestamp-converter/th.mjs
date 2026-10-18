// Unix Timestamp Converter in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'แปลง Unix Timestamp',
  title: 'แปลง Unix Timestamp เป็นวันที่ พ.ศ. และเวลาไทย',
  description: 'แปลงตัวเลข Unix timestamp เป็นวันที่ภาษาไทยแบบ พ.ศ. เวลากรุงเทพ และเขตเวลาอื่น หรือแปลงวันที่กลับเป็น timestamp รองรับวินาทีและมิลลิวินาที',
  short: 'ตัวเลข epoch เป็นวันที่ พ.ศ. และกลับกัน',
  body: `<div class="toolbar"><input type="text" id="input" class="mono" style="flex:1;min-width:12em" spellcheck="false" placeholder="1700000000 หรือ 2024-05-01T12:00:00Z" aria-label="Timestamp หรือวันที่"><button class="btn primary" id="now">ตอนนี้</button></div>
<div class="toolbar"><label class="check">แสดงเวลาที่ <select id="tz" aria-label="เขตเวลา"></select></label></div>
<div class="status" id="status" aria-live="polite"></div>
<table class="kv" id="result"></table>
<p class="check" id="clock"></p>`,
  content: `<h2>วินาทีหรือมิลลิวินาที?</h2>
<p>ไม่ต้องบอก เครื่องมือดูจากความยาวของตัวเลข 10 หลักคือวินาที (Unix, PHP, <code>time.time()</code> ของ Python) 13 หลักคือมิลลิวินาที (<code>Date.now()</code> ของ JavaScript, Java) ส่วน 16 หรือ 19 หลักคือไมโครและนาโนวินาที</p>
<p>พิมพ์วันที่ธรรมดาได้ด้วย เช่น <code>2025-03-01 14:30</code> เพื่อดู timestamp ของวันนั้น ถ้าไม่ระบุเขตเวลา จะถือเป็นเวลาในเครื่องของคุณ ใส่ <code>Z</code> หรือ <code>+07:00</code> ต่อท้ายเพื่อระบุให้ชัด</p>
<h2>ปี พ.ศ. และเวลาไทย</h2>
<p>แถวแรกแสดงวันที่แบบปฏิทินไทย (พ.ศ.) ตามเวลากรุงเทพ ซึ่งก็คือปี ค.ศ. บวก 543 เลือกเขตเวลาอื่นเพิ่มได้ เพื่อดูว่าเวลาเดียวกันนี้เป็นกี่โมงที่ประเทศอื่น สะดวกเวลานัดคุยกับลูกค้าต่างประเทศ</p>`,
  faq: [
    { q: 'Unix timestamp คืออะไร?', a: 'คือจำนวนวินาทีนับตั้งแต่ 1 มกราคม 1970 เวลา 00:00 UTC เป็นวิธีเก็บเวลาที่ระบบคอมพิวเตอร์และฐานข้อมูลส่วนใหญ่ใช้ เพราะไม่ขึ้นกับเขตเวลา' },
    { q: 'ทำไมเวลาในฐานข้อมูลช้ากว่าเวลาไทย 7 ชั่วโมง?', a: 'ระบบมักเก็บเวลาเป็น UTC ส่วนเวลาไทยคือ UTC+7 ดูแถว พ.ศ. หรือเลือกเขตเวลา Asia/Bangkok เพื่อเห็นเวลาไทย' },
  ],
  strings: {
    Common: 'ใช้บ่อย',
    'All time zones': 'เขตเวลาทั้งหมด',
    'Unix seconds': 'Unix (วินาที)',
    'Unix milliseconds': 'Unix (มิลลิวินาที)',
    'Your local time': 'เวลาในเครื่องของคุณ',
    'Time zone': 'เขตเวลา',
    'Thai date (พ.ศ.)': 'วันที่ไทย (พ.ศ.)',
    Relative: 'ห่างจากตอนนี้',
    'Interpreted as {unit}': 'อ่านเป็น{unit}',
    seconds: 'วินาที',
    milliseconds: 'มิลลิวินาที',
    microseconds: 'ไมโครวินาที',
    nanoseconds: 'นาโนวินาที',
    'date string': 'วันที่',
    Copy: 'คัดลอก',
    'Enter a timestamp or date': 'ใส่ timestamp หรือวันที่',
    'Timestamp is out of range': 'timestamp นี้อยู่นอกช่วงที่รองรับ',
    'Could not parse that date': 'อ่านวันที่นี้ไม่ออก',
    'Current Unix time: {n}': 'Unix time ตอนนี้: {n}',
  },
};

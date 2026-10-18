// keyword-density in Thai. The body keeps every id and class from tool.mjs; only the words change.
export default {
  name: "ตรวจความหนาแน่นคีย์เวิร์ด",
  title: "ตรวจความหนาแน่นคีย์เวิร์ด นับคำซ้ำ รองรับภาษาไทย",
  description: "วางบทความแล้วดูว่าคำและวลีไหนใช้บ่อยที่สุดและบ่อยแค่ไหน นับคำภาษาไทยได้ถูกต้อง ช่วยจับวลีที่เผลอใช้ซ้ำสิบรอบ",
  short: "นับคำและวลีที่คุณใช้ซ้ำบ่อยที่สุด",
  body: `<div class="panel"><div class="panel-head"><label for="input">ข้อความ</label><span><label class="check"><input type="checkbox" id="stopwords" checked> ไม่นับคำทั่วไป (stop words)</label> <button class="btn small" id="clear">ล้าง</button></span></div>
<textarea id="input" class="short" placeholder="วางบทความหรือข้อความในหน้าเว็บ…"></textarea></div>
<div class="status ok" id="stats" aria-live="polite"></div>
<div id="result"></div>`,
  content: `<h2>มีความหนาแน่นคีย์เวิร์ดที่ “ดีที่สุด” ไหม?</h2>
<p>ไม่มี และการพยายามไล่ตัวเลขมักทำให้งานเขียนแย่ลง เครื่องมือค้นหาเข้าใจคำพ้องความหมายและหัวข้อได้แล้ว การยัดวลีเดิมซ้ำๆ อาจส่งผลเสียด้วยซ้ำ ให้ใช้เครื่องมือนี้กลับด้าน คือเช็กว่าหัวข้อหลักของคุณชัดเจนจริง และไม่มีอะไรซ้ำจนอ่านแล้วสะดุด ถ้าวลีไหนเกิน 3 ถึง 4 เปอร์เซ็นต์ของข้อความ ลองอ่านส่วนนั้นออกเสียงดู</p>
<p>ภาษาไทยไม่เว้นวรรคระหว่างคำ เครื่องมือนี้จึงตัดคำด้วยตัวตัดคำของเบราว์เซอร์ และไม่นับคำเชื่อมที่ใช้บ่อยอย่าง “และ” “ที่” “ของ” เมื่อเลือกไม่นับคำทั่วไป</p>`,
  faq: [],
  strings: {
    "Phrase": "วลี",
    "Count": "จำนวน",
    "Density": "ความหนาแน่น",
    "None repeated yet.": "ยังไม่มีคำที่ซ้ำ",
    "1 word": "1 คำ",
    "{n} words": "{n} คำ",
    "1 sentence": "1 ประโยค",
    "{n} sentences": "{n} ประโยค",
    "~{n} min read": "อ่านประมาณ {n} นาที",
    "Single words": "คำเดี่ยว",
    "Two-word phrases": "วลี 2 คำ",
    "Three-word phrases": "วลี 3 คำ",
  },
};

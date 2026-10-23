// Thai ID Number Checker in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'ตรวจเลขบัตรประชาชน',
  title: 'ตรวจสอบเลขบัตรประชาชน 13 หลัก ถูกต้องไหม ฟรี',
  description: 'เช็กว่าเลขบัตรประชาชน 13 หลักถูกต้องตามหลักตรวจสอบหรือไม่ ทีละเลขหรือทั้งรายการจาก Excel ได้ ไม่มีการอัปโหลดข้อมูล',
  short: 'เลขบัตรประชาชน 13 หลักนี้ถูกต้องไหม',
  body: `<div class="panel">
  <div class="panel-head"><label for="input">เลขบัตรประชาชน บรรทัดละหนึ่งเลข</label><button class="btn small" id="clear">ล้าง</button></div>
  <textarea id="input" class="mono" spellcheck="false" inputmode="numeric" autocomplete="off" placeholder="1-1037-00012-34-6" style="min-height:140px"></textarea>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="id-results" id="results"></ul>`,
  content: `<h2>วิธีตรวจเลขบัตรประชาชน</h2>
<ol><li>พิมพ์หรือวางเลข จะมีขีดหรือช่องว่างก็ได้</li><li>ถ้ามีหลายเลข วางทั้งคอลัมน์จาก Excel หรือ Google Sheets ได้เลย บรรทัดละหนึ่งเลข</li><li>แต่ละเลขจะบอกว่าถูกต้องหรือไม่ ถ้าหลักสุดท้ายผิด จะบอกด้วยว่าควรเป็นเลขอะไร ซึ่งมักแปลว่าพิมพ์ผิด</li></ol>
<h2>หลักตรวจสอบทำงานอย่างไร</h2>
<p>หลักที่ 13 คำนวณจาก 12 หลักแรก โดยคูณแต่ละหลักด้วย 13, 12, 11 ไล่ลงไปจนถึง 2 แล้วรวมกัน หารด้วย 11 เอาเศษไปลบออกจาก 11 หลักหน่วยของผลลัพธ์คือเลขตรวจสอบ ถ้าพิมพ์ผิดหนึ่งหลัก หรือสลับเลขสองตัวติดกัน แทบทุกครั้งจะไม่ผ่าน</p>
<p>เลขที่ผ่านการตรวจแปลว่ารูปแบบถูกต้องเท่านั้น ไม่ได้ยืนยันว่ามีเจ้าของจริง หรือเป็นของคนที่ให้เลขนี้มา</p>`,
  faq: [
    { q: 'เครื่องมือนี้ค้นหาเลขในระบบไหนไหม?', a: 'ไม่ คำนวณจากตัวเลขในเบราว์เซอร์ของคุณเท่านั้น ไม่มีการส่งไปที่ระบบราชการหรือที่เรา ซึ่งสำคัญตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)' },
    { q: 'เลขหลักแรกหมายถึงอะไร?', a: 'บอกประเภทการลงทะเบียน 1 และ 2 คือคนไทยที่เกิดตั้งแต่ปี 2527 เป็นต้นมา 3 ถึง 5 คือผู้ที่มีชื่อในทะเบียนบ้านก่อนหน้านั้นหรือเพิ่มชื่อภายหลัง 6 และ 7 คือคนต่างด้าวและบุตร และ 8 คือผู้ได้สัญชาติไทยหรือมีถิ่นที่อยู่ถาวร' },
    { q: 'ใช้กับเลขประจำตัวผู้เสียภาษีของบริษัทได้ไหม?', a: 'ได้ เลขผู้เสียภาษีนิติบุคคลก็มี 13 หลักและใช้หลักตรวจสอบแบบเดียวกัน ถ้าพิมพ์ผิดก็จะเห็นเหมือนกัน' },
  ],
  strings: {
    'Valid': 'ถูกต้อง',
    'Not valid': 'ไม่ถูกต้อง',
    'Needs 13 digits (this has {n})': 'ต้องมี 13 หลัก (เลขนี้มี {n} หลัก)',
    'Only digits, dashes and spaces': 'ใช้ได้แค่ตัวเลข ขีด และช่องว่าง',
    'Last digit should be {d}, so there’s probably a typo': 'หลักสุดท้ายควรเป็น {d} น่าจะพิมพ์ผิด',
    '{ok} of {n} valid': 'ถูกต้อง {ok} จาก {n} เลข',
    'Person without Thai nationality, registered under a special scheme': 'ผู้ไม่มีสัญชาติไทยที่ลงทะเบียนเป็นกรณีพิเศษ',
    'Thai national born in 1984 or later, registered on time': 'คนไทยที่เกิดตั้งแต่ปี 2527 และแจ้งเกิดภายในกำหนด',
    'Thai national born in 1984 or later, registered late': 'คนไทยที่เกิดตั้งแต่ปี 2527 แต่แจ้งเกิดเกินกำหนด',
    'Thai national or foreign resident in a house register before 1984': 'คนไทยหรือคนต่างด้าวที่มีชื่อในทะเบียนบ้านก่อนปี 2527',
    'Thai national or foreign resident who moved in before 1984 without an ID number yet': 'คนไทยหรือคนต่างด้าวที่ย้ายเข้าก่อนปี 2527 แต่ยังไม่มีเลขประจำตัว',
    'Thai national added to the register later (for example after a missed census)': 'คนไทยที่ได้เพิ่มชื่อเข้าทะเบียนบ้านภายหลัง',
    'Foreign national living in Thailand temporarily, or who entered without a permit': 'คนต่างด้าวที่อยู่ชั่วคราว หรือเข้าเมืองโดยไม่ได้รับอนุญาต',
    'Child of a type 6 resident, born in Thailand': 'บุตรของบุคคลประเภท 6 ที่เกิดในไทย',
    'Foreign national with permanent residence, or naturalised as Thai, from 1984 on': 'คนต่างด้าวที่มีถิ่นที่อยู่ถาวร หรือได้สัญชาติไทย ตั้งแต่ปี 2527',
  },
};

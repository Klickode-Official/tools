// VAT Calculator in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'คำนวณ VAT 7% และภาษีหัก ณ ที่จ่าย',
  title: 'คำนวณ VAT 7% ถอด VAT และภาษีหัก ณ ที่จ่าย ฟรี',
  description: 'บวกหรือถอด VAT 7% จากราคา แล้วหักภาษี ณ ที่จ่าย 1%, 3% หรือ 5% ดูยอดที่ต้องออกใบแจ้งหนี้และยอดที่จะได้รับจริง พร้อมจำนวนเงินเป็นตัวหนังสือ',
  short: 'บวกหรือถอด VAT 7% และหัก ณ ที่จ่าย',
  body: `<div class="toolbar">
  <label class="check">จำนวนเงิน <input type="text" id="amount" inputmode="decimal" autocomplete="off" placeholder="10,000" style="width:10em"></label>
  <label class="check">ยอดนี้เป็นราคา <select id="mode"><option value="add">ก่อน VAT</option><option value="remove">รวม VAT แล้ว</option></select></label>
  <label class="check">VAT <input type="number" id="rate" value="7" min="0" max="100" step="0.5" style="width:4.5em"> %</label>
  <label class="check">หัก ณ ที่จ่าย <select id="wht"><option value="0">ไม่หัก</option><option value="1">1% (ค่าขนส่ง)</option><option value="2">2% (ค่าโฆษณา)</option><option value="3">3% (ค่าบริการ ค่าจ้าง)</option><option value="5">5% (ค่าเช่า รางวัล)</option></select></label>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="panel">
  <div class="panel-head"><span class="label">รายละเอียด</span><button class="btn small" data-copy="#summary">คัดลอก</button></div>
  <table class="kv vat-table" id="table"></table>
  <pre class="vat-summary" id="summary" hidden></pre>
</div>`,
  content: `<h2>วิธีคำนวณ VAT</h2>
<ol><li>พิมพ์จำนวนเงิน แล้วเลือกว่ารวม VAT แล้วหรือยัง</li><li>ถ้าลูกค้าเป็นบริษัทที่หักภาษี ณ ที่จ่าย เลือกอัตราตามประเภทงาน</li><li>ดูราคาก่อน VAT, VAT, ยอดรวมในใบแจ้งหนี้ และยอดที่จะได้รับหลังหัก ณ ที่จ่าย</li></ol>
<h2>สูตรที่ใช้</h2>
<ul><li><strong>บวก VAT:</strong> VAT = ราคา × 7% ยอดรวม = ราคา + VAT เช่น 10,000 เป็น 10,700</li><li><strong>ถอด VAT:</strong> ราคาก่อน VAT = ยอดรวม ÷ 1.07 เช่น 10,700 เป็น 10,000 กับ VAT 700</li><li><strong>ภาษีหัก ณ ที่จ่าย</strong> คิดจากราคา<em>ก่อน</em> VAT เสมอ เช่น ค่าบริการ 10,000 หัก 3% ลูกค้าจ่ายคุณ 10,700 − 300 = 10,400 และให้หนังสือรับรองการหักภาษี (50 ทวิ) สำหรับ 300 บาท</li></ul>
<p>ทุกตัวเลขปัดเป็นสตางค์แบบปัดครึ่งขึ้น</p>`,
  faq: [
    { q: 'ใครต้องคิด VAT บ้าง?', a: 'ธุรกิจที่จดทะเบียนภาษีมูลค่าเพิ่ม ซึ่งต้องจดเมื่อรายได้เกิน 1.8 ล้านบาทต่อปี ถ้ายังไม่ได้จด ไม่ต้องบวก VAT ในใบแจ้งหนี้' },
    { q: 'หัก ณ ที่จ่ายคิดก่อนหรือหลัง VAT?', a: 'คิดจากยอดก่อน VAT เสมอ ตัว VAT จึงไม่ถูกหักภาษีซ้ำ' },
    { q: 'ต้องหักกี่เปอร์เซ็นต์?', a: 'อัตราที่ใช้บ่อยคือ 1% ค่าขนส่ง 2% ค่าโฆษณา 3% ค่าบริการและค่าวิชาชีพ และ 5% ค่าเช่า ควรเช็กกับนักบัญชีหรือกรมสรรพากรสำหรับกรณีของคุณ เพราะบางช่วงหรือบางผู้จ่ายอัตราอาจต่างออกไป' },
    { q: 'ข้อมูลถูกส่งไปไหนไหม?', a: 'ไม่ คำนวณในเบราว์เซอร์ทั้งหมด' },
  ],
  strings: {
    'That isn’t a number. Use digits, with a dot for satang.': 'ไม่ใช่ตัวเลข ใช้ตัวเลขและจุดทศนิยมสำหรับสตางค์',
    'Price before VAT': 'ราคาก่อน VAT',
    'VAT {rate}%': 'VAT {rate}%',
    'Total including VAT': 'ยอดรวม VAT',
    'Withholding tax {rate}%': 'หัก ณ ที่จ่าย {rate}%',
    'You receive': 'ยอดที่ได้รับจริง',
    'In words': 'ตัวหนังสือ',
  },
};

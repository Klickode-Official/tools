// Thai Baht Text in Thai. The body keeps every id and class from tool.mjs.
export default {
  name: 'แปลงตัวเลขเป็นคำอ่านภาษาไทย',
  title: 'แปลงตัวเลขเป็นตัวหนังสือ บาทถ้วน (BAHTTEXT) ฟรี',
  description: 'พิมพ์จำนวนเงินแล้วได้คำอ่านภาษาไทย เช่น “หนึ่งพันบาทถ้วน” พร้อมคำอ่านภาษาอังกฤษ สำหรับใบแจ้งหนี้ ใบเสร็จ และเช็ค ทำงานแบบ BAHTTEXT ใน Excel',
  short: 'เขียนจำนวนเงินเป็นตัวหนังสือ ไทยและอังกฤษ',
  body: `<div class="toolbar">
  <label class="check">จำนวนเงิน <input type="text" id="amount" inputmode="decimal" autocomplete="off" placeholder="1,234.50" style="width:12em"></label>
  <span class="baht-figure" id="figure" aria-live="polite"></span>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><span class="label">ภาษาไทย</span><button class="btn small" data-copy="#thai">คัดลอก</button></div>
    <p class="baht-out" id="thai" lang="th"></p>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="label">ภาษาอังกฤษ</span><button class="btn small" data-copy="#english">คัดลอก</button></div>
    <p class="baht-out" id="english" lang="en"></p>
  </div>
</div>`,
  content: `<h2>วิธีแปลงจำนวนเงินเป็นตัวหนังสือ</h2>
<ol><li>พิมพ์จำนวนเงิน จะมีจุลภาคหรือไม่ก็ได้ ทศนิยมจะนับเป็นสตางค์</li><li>คัดลอกคำอ่านภาษาไทยไปใส่ในใบแจ้งหนี้ ใบเสร็จ หรือเช็ค</li><li>ถ้าต้องการภาษาอังกฤษ ก็มีให้ข้าง ๆ ลงท้ายด้วย “Baht Only”</li></ol>
<h2>หลักการเขียนที่ใช้</h2>
<ul><li>จำนวนเต็มลงท้ายด้วย <strong>ถ้วน</strong> เช่น 100 คือ หนึ่งร้อยบาทถ้วน</li><li>สตางค์เขียนต่อจากคำว่าบาท เช่น 50.25 คือ ห้าสิบบาทยี่สิบห้าสตางค์</li><li>10 คือ สิบ (ไม่ใช่หนึ่งสิบ) 20 คือ ยี่สิบ และเลข 1 ท้าย 11, 21 หรือ 101 อ่านว่า เอ็ด</li><li>ตัวเลขใหญ่ ๆ ใช้ล้านซ้อนกัน เช่น ล้านล้าน</li></ul>
<p>สตางค์ปัดเศษเป็นทศนิยมสองตำแหน่งแบบปัดครึ่งขึ้น เหมือนโปรแกรมบัญชีทั่วไป</p>`,
  faq: [
    { q: 'ได้ผลเหมือน BAHTTEXT ใน Excel ไหม?', a: 'สำหรับจำนวนเงินทั่วไป ได้คำอ่านเหมือนกัน ใช้คู่กับใบแจ้งหนี้ที่ทำใน Excel ได้เลย' },
    { q: 'เมื่อไรเลข 1 อ่านว่า “เอ็ด”?', a: 'เมื่ออยู่ท้ายตัวเลขที่มีหลักสิบหรือหลักร้อยนำหน้า เช่น 11 สิบเอ็ด, 21 ยี่สิบเอ็ด และ 101 หนึ่งร้อยเอ็ด ถ้าอยู่เดี่ยว ๆ อ่านว่า หนึ่ง' },
    { q: 'เขียนจำนวนเงินในเช็คอย่างไร?', a: 'เขียนคำอ่านภาษาไทยบนบรรทัด ลงท้ายด้วย “ถ้วน” ถ้าเป็นจำนวนเต็ม แล้วขีดเส้นปิดที่ว่างที่เหลือ เพื่อไม่ให้ใครเติมข้อความได้' },
    { q: 'จำนวนเงินที่พิมพ์ถูกส่งไปไหนไหม?', a: 'ไม่ คำนวณในเบราว์เซอร์ของคุณ ไม่มีข้อมูลออกจากเครื่อง' },
  ],
  strings: {
    'That isn’t a number. Use digits, with a dot for satang.': 'ไม่ใช่ตัวเลข ใช้ตัวเลขและจุดทศนิยมสำหรับสตางค์',
    'That amount is too large to write out.': 'จำนวนเงินมากเกินกว่าจะเขียนเป็นคำได้',
  },
};

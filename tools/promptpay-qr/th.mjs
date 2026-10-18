// PromptPay QR Generator in Thai. The body keeps every id and class from tool.mjs; only the words
// change. `strings` translates the messages ./script.js shows while it runs (see t() in ui.js).
export default {
  name: 'สร้าง QR พร้อมเพย์',
  title: 'สร้าง QR Code พร้อมเพย์ฟรี ระบุยอดเงินได้ พิมพ์ป้ายรับเงินได้',
  description: 'สร้าง QR พร้อมเพย์จากเบอร์มือถือหรือเลขบัตรประชาชน จะกำหนดยอดเงินหรือให้ลูกค้าใส่เองก็ได้ พร้อมป้ายรับเงินสำหรับพิมพ์ ข้อมูลไม่ออกจากเบราว์เซอร์',
  short: 'QR พร้อมเพย์และป้ายรับเงินสำหรับร้านของคุณ',
  body: `<div class="ppq">
  <div class="ppq-form">
    <label class="fld wide"><span>หมายเลขพร้อมเพย์ <em>เบอร์มือถือ เลขบัตรประชาชน 13 หลัก เลขผู้เสียภาษี หรือ e-Wallet</em></span><input type="text" id="target" placeholder="081 234 5678" inputmode="numeric" autocomplete="off" spellcheck="false"></label>
    <p class="ppq-detect" id="detect"></p>
    <label class="fld"><span>จำนวนเงิน (บาท) <em>เว้นว่างไว้ให้ลูกค้าใส่เอง</em></span><input type="text" id="amount" placeholder="350.00" inputmode="decimal" autocomplete="off"></label>
    <label class="fld"><span>ชื่อร้านบนป้าย <em>ไม่บังคับ</em></span><input type="text" id="shop" maxlength="40" placeholder="ร้านอัญมณีบางกอก"></label>
    <label class="fld"><span>ชื่อบัญชีให้ลูกค้าตรวจสอบ <em>ไม่บังคับ</em></span><input type="text" id="account" maxlength="40" placeholder="สมชาย ใจดี"></label>
    <label class="fld"><span>สีของป้าย</span><span class="ppq-colours" id="colours" role="radiogroup" aria-label="สีของป้าย"></span><input type="hidden" id="accent" value="#0f3b62"></label>
    <label class="fld chk"><input type="checkbox" id="mask" checked> <span>ซ่อนตัวเลขตรงกลางบนป้าย</span></label>
    <div class="ppq-note">
      <strong>ก่อนพิมพ์:</strong> ลองสแกนด้วยแอปธนาคารของคุณเอง แล้วตรวจชื่อบัญชีและยอดเงินที่แสดง เราไม่เห็นและตรวจสอบไม่ได้ว่าหมายเลขนี้เป็นบัญชีของใคร
    </div>
  </div>
  <aside class="ppq-side">
    <div class="ppq-preview"><canvas id="card" width="1200" height="1460" aria-label="ตัวอย่างป้ายรับเงินพร้อมเพย์"></canvas></div>
    <div class="status" id="status" aria-live="polite"></div>
    <div class="ppq-actions">
      <button class="btn primary" id="png">ดาวน์โหลดป้ายรับเงิน</button>
      <button class="btn" id="qr-png">เฉพาะ QR</button>
      <button class="btn" id="copy">คัดลอกข้อความ QR</button>
    </div>
  </aside>
</div>`,
  content: `<h2>วิธีสร้าง QR พร้อมเพย์</h2>
<ol><li>ใส่เบอร์มือถือหรือเลขบัตรที่ผูกพร้อมเพย์ไว้</li><li>ถ้าลูกค้าทุกคนจ่ายเท่ากัน ใส่ยอดเงินไว้เลย ถ้าไม่ใช่ เว้นว่างไว้ให้ลูกค้าพิมพ์ยอดในแอปเอง</li><li>ดาวน์โหลดป้ายรับเงินไปพิมพ์ตั้งไว้หน้าร้าน หรือเลือกเฉพาะ QR ไปใส่ในงานออกแบบของคุณเอง</li><li>สแกนด้วยแอปธนาคารของคุณก่อน แล้วตรวจชื่อที่แสดง</li></ol>
<h2>กำหนดยอดเงิน หรือให้ลูกค้าใส่เอง?</h2>
<p>ถ้ากำหนดยอดไว้ แอปของลูกค้าจะกรอกยอดให้อัตโนมัติ ลูกค้าแค่กดยืนยัน เหมาะกับสินค้าราคาเดียว เงินมัดจำ หรือใบแจ้งหนี้ ถ้าไม่กำหนดยอด QR เดียวใช้ได้กับทุกการซื้อ ลูกค้าสแกนแล้วพิมพ์ยอดเอง แบบที่ร้านในตลาดและร้านกาแฟส่วนใหญ่ใช้กัน</p>
<h2>แชร์ QR พร้อมเพย์ปลอดภัยไหม?</h2>
<p>QR พร้อมเพย์ใช้ได้แค่รับเงินเท่านั้น ข้างในมีหมายเลขพร้อมเพย์ สกุลเงิน และยอดเงินถ้าคุณกำหนดไว้ ทุกคนที่สแกนจะเห็นชื่อบัญชีของคุณในแอปธนาคารก่อนกดจ่าย ซึ่งก็เป็นวิธีที่ลูกค้าใช้ตรวจว่าจ่ายถูกคน</p>
<p>หมายเลขของคุณอยู่แค่ในแท็บเบราว์เซอร์นี้ระหว่างสร้าง QR ไม่มีการส่งไปให้เราหรือธนาคารใดๆ</p>`,
  faq: [
    { q: 'แอปธนาคารไหนสแกนได้บ้าง?', a: 'ทุกแอปธนาคารไทยที่รองรับพร้อมเพย์และ Thai QR Payment ซึ่งก็คือธนาคารหลักทั้งหมด (K PLUS, SCB EASY, Krungthai NEXT, Bangkok Bank, Krungsri และอื่นๆ) QR ที่สร้างเป็นรูปแบบมาตรฐาน EMVCo แบบเดียวกับที่ธนาคารใช้' },
    { q: 'ใช้เลขบัตรประชาชนแทนเบอร์โทรได้ไหม?', a: 'ได้ ถ้าพร้อมเพย์ของคุณผูกกับเลขบัตรประชาชน ส่วนบริษัทใช้เลขประจำตัวผู้เสียภาษี 13 หลักได้ เราตรวจหลักสุดท้ายของเลข 13 หลักให้ด้วย เพื่อช่วยจับเลขที่พิมพ์ผิด' },
    { q: 'นี่เป็นเครื่องมือทางการของพร้อมเพย์หรือเปล่า?', a: 'ไม่ใช่ Klickode Tools ไม่ได้เกี่ยวข้องกับพร้อมเพย์ ธนาคารแห่งประเทศไทย หรือธนาคารใดๆ เครื่องมือนี้แค่สร้างข้อความ QR ตามมาตรฐานในเบราว์เซอร์ของคุณ จึงควรทดสอบด้วยแอปธนาคารของคุณเองทุกครั้งก่อนใช้งาน' },
    { q: 'QR หมดอายุไหม?', a: 'ไม่หมดอายุ ใช้ได้ตราบที่หมายเลขนั้นยังลงทะเบียนพร้อมเพย์อยู่' },
    { q: 'มีค่าธรรมเนียมหรือหักเปอร์เซ็นต์ไหม?', a: 'ไม่มี เงินโอนจากธนาคารของลูกค้าเข้าธนาคารของคุณโดยตรง เราไม่เห็นการชำระเงินเลย' },
  ],
  strings: {
    Navy: 'กรมท่า',
    Teal: 'เขียวน้ำทะเล',
    Green: 'เขียว',
    Red: 'แดง',
    Purple: 'ม่วง',
    Black: 'ดำ',
    'Type the amount as a number, like 350 or 99.50': 'ใส่จำนวนเงินเป็นตัวเลข เช่น 350 หรือ 99.50',
    'Scan to pay': 'สแกนเพื่อจ่าย',
    'Your QR code appears here': 'QR ของคุณจะแสดงตรงนี้',
    'Type the amount in your banking app': 'ใส่จำนวนเงินในแอปธนาคารของคุณ',
    'That doesn’t look like a PromptPay number. Use a 10-digit mobile number, a 13-digit ID or tax number, or a 15-digit e-wallet ID.': 'หมายเลขนี้ดูไม่เหมือนหมายเลขพร้อมเพย์ ใช้เบอร์มือถือ 10 หลัก เลขบัตรประชาชนหรือเลขผู้เสียภาษี 13 หลัก หรือ e-Wallet 15 หลัก',
    'Mobile number {n}': 'เบอร์มือถือ {n}',
    'Citizen ID or tax number': 'เลขบัตรประชาชนหรือเลขผู้เสียภาษี',
    'e-Wallet ID': 'e-Wallet',
    'The last digit of that ID doesn’t check out. Look for a typo, then test the code with your banking app.': 'หลักสุดท้ายของเลขนี้ไม่ถูกต้อง ลองตรวจดูว่าพิมพ์ผิดหรือเปล่า แล้วทดสอบด้วยแอปธนาคาร',
    'Customers will see this amount filled in.': 'ลูกค้าจะเห็นยอดเงินนี้กรอกไว้ให้แล้ว',
    'Customers type the amount themselves.': 'ลูกค้าใส่ยอดเงินเอง',
    'Type a PromptPay number first': 'ใส่หมายเลขพร้อมเพย์ก่อน',
  },
};

// "Compress image to N KB" landing pages: the Image Compressor with a target size already set,
// JPG chosen, and copy about what that size is usually for. Each tools/compress-image-to-<n>kb
// folder calls sizePage(n) from its tool.mjs and th.mjs.
import en from './tool.mjs';
import th from './th.mjs';

const BASE = { en, th };

const COPY = {
  20: {
    en: {
      uses: ['Signatures for online applications and exam forms', 'Tiny thumbnails and icons', 'Photo fields with a very strict limit'],
      tips: '<p>20 KB is small. A full phone photo can only get there by shrinking to around 300 to 500 pixels wide, so the compressor does that for you when it has to. For a signature, sign in dark ink on white paper, crop tight around it, and you’ll end up well under the limit with a sharp result.</p>',
      faq: [
        ['My signature came out blurry. What can I do?', 'Crop away the empty paper first, so the pixels go to the signature itself. A photo taken in good light with dark ink compresses much better than a grey, shadowy one.'],
        ['How big will the picture be?', 'Usually 300 to 500 pixels on the long side for a photo, which is fine for a form but too small to print.'],
      ],
    },
    th: {
      uses: ['ลายเซ็นสำหรับสมัครงานหรือสมัครสอบออนไลน์', 'รูปย่อและไอคอนขนาดเล็ก', 'ช่องอัปโหลดรูปที่จำกัดขนาดเข้มมาก'],
      tips: '<p>20 KB ถือว่าเล็กมาก รูปจากมือถือต้องย่อเหลือกว้างประมาณ 300 ถึง 500 พิกเซลถึงจะได้ขนาดนี้ เครื่องมือจะย่อให้อัตโนมัติเมื่อจำเป็น ถ้าเป็นลายเซ็น ให้เซ็นด้วยหมึกเข้มบนกระดาษขาว แล้วครอปให้ชิดลายเซ็น จะได้ไฟล์เล็กกว่าที่กำหนดและยังคมชัด</p>',
      faq: [
        ['ลายเซ็นออกมาเบลอ ทำอย่างไรดี?', 'ครอปส่วนกระดาษว่างออกก่อน ให้พิกเซลไปอยู่ที่ลายเซ็น และถ่ายในที่สว่างด้วยหมึกเข้ม จะบีบอัดได้ดีกว่ารูปที่มืดหรือมีเงา'],
        ['รูปจะเหลือขนาดเท่าไร?', 'ปกติประมาณ 300 ถึง 500 พิกเซลด้านยาว พอสำหรับแบบฟอร์ม แต่เล็กเกินไปสำหรับพิมพ์'],
      ],
    },
  },
  50: {
    en: {
      uses: ['Passport-style photos for job and exam portals', 'Profile pictures on government and school sites', 'Photos for online ID and membership forms'],
      tips: '<p>At 50 KB a face photo still looks good at around 600 pixels wide. If your photo is bigger, the compressor scales it down for you. Crop to just your head and shoulders first: the face gets more of the pixels and stays sharp.</p>',
      faq: [
        ['The form also asks for exact pixel dimensions. What now?', 'Crop and resize it to those dimensions with the <a href="/tools/image-resizer/">Image Resizer</a> first, then compress the result here.'],
        ['Will a 50 KB photo look bad?', 'Not for a face at form size. Compression shows up as blur in fine detail like hair, which you won’t notice at the size forms display photos.'],
      ],
    },
    th: {
      uses: ['รูปถ่ายหน้าตรงสำหรับเว็บสมัครงานและสมัครสอบ', 'รูปโปรไฟล์บนเว็บหน่วยงานราชการและโรงเรียน', 'รูปสำหรับแบบฟอร์มสมาชิกหรือยืนยันตัวตนออนไลน์'],
      tips: '<p>ที่ 50 KB รูปหน้าตรงยังดูดีที่ความกว้างประมาณ 600 พิกเซล ถ้ารูปใหญ่กว่านั้น เครื่องมือจะย่อให้เอง ครอปให้เหลือแค่ศีรษะและไหล่ก่อน หน้าจะได้พิกเซลมากขึ้นและคมชัดกว่า</p>',
      faq: [
        ['แบบฟอร์มกำหนดขนาดพิกเซลด้วย ทำอย่างไร?', 'ครอปและปรับขนาดให้ตรงด้วย<a href="/th/tools/image-resizer/">เครื่องมือปรับขนาดรูป</a>ก่อน แล้วค่อยนำมาบีบอัดที่นี่'],
        ['รูป 50 KB จะดูแย่ไหม?', 'ไม่สำหรับรูปหน้าตรงขนาดที่ใช้ในแบบฟอร์ม การบีบอัดจะทำให้รายละเอียดเล็ก ๆ อย่างเส้นผมเบลอเล็กน้อย ซึ่งแทบมองไม่เห็นในขนาดที่แบบฟอร์มแสดง'],
      ],
    },
  },
  100: {
    en: {
      uses: ['Profile pictures and avatars', 'Product photos for marketplaces and online shops', 'Images for email newsletters and forums'],
      tips: '<p>100 KB is a comfortable size for a photo around 1,000 pixels wide, sharp on a phone screen and quick to load. Most phone photos only need their quality lowered to get there; very large ones are scaled down a little too.</p>',
      faq: [
        ['JPG or WebP?', 'JPG works on every form and website. If the site accepts WebP, it gives you a noticeably sharper image at the same 100 KB.'],
        ['Can I do a whole batch?', 'Yes. Drop in as many photos as you like and download them all as a ZIP. Each one is compressed to fit on its own.'],
      ],
    },
    th: {
      uses: ['รูปโปรไฟล์และอวาตาร์', 'รูปสินค้าสำหรับ Shopee, Lazada และร้านค้าออนไลน์', 'รูปสำหรับอีเมลจดหมายข่าวและเว็บบอร์ด'],
      tips: '<p>100 KB เป็นขนาดที่พอดีสำหรับรูปกว้างประมาณ 1,000 พิกเซล คมชัดบนจอมือถือและโหลดเร็ว รูปจากมือถือส่วนใหญ่แค่ลดคุณภาพลงก็ได้ขนาดนี้ ถ้ารูปใหญ่มากจะถูกย่อลงเล็กน้อยด้วย</p>',
      faq: [
        ['ใช้ JPG หรือ WebP ดี?', 'JPG ใช้ได้กับทุกแบบฟอร์มและทุกเว็บ ถ้าเว็บรองรับ WebP จะได้รูปคมกว่าที่ขนาด 100 KB เท่ากัน'],
        ['ทำทีละหลายรูปได้ไหม?', 'ได้ ลากรูปมาวางกี่รูปก็ได้ แล้วดาวน์โหลดทั้งหมดเป็น ZIP แต่ละรูปจะถูกบีบอัดให้ไม่เกินขนาดที่กำหนด'],
      ],
    },
  },
  200: {
    en: {
      uses: ['Scans of ID cards, certificates and documents for applications', 'Visa and embassy photo uploads', 'Attachments for job applications'],
      tips: '<p>200 KB leaves room for detail, so text in a scanned document stays readable at around 1,600 pixels wide. For a document, a scan or a photo taken straight on, in daylight, compresses far better than one at an angle with shadows.</p>',
      faq: [
        ['My scan is a PDF. Can I use it here?', 'This tool works with images. Take a photo or screenshot of the page, or save the PDF page as JPG, then compress it here.'],
        ['Is it safe to compress my ID card here?', 'Yes. The image never leaves your device: it’s processed in this browser tab and nothing is uploaded, which is what you want for an ID card or passport.'],
      ],
    },
    th: {
      uses: ['สแกนบัตรประชาชน ใบประกาศ และเอกสารสำหรับสมัครงานหรือยื่นเรื่อง', 'อัปโหลดรูปสำหรับขอวีซ่าและสถานทูต', 'ไฟล์แนบใบสมัครงาน'],
      tips: '<p>200 KB มีพื้นที่พอให้รายละเอียดอยู่ครบ ตัวหนังสือในเอกสารที่สแกนยังอ่านได้ที่ความกว้างประมาณ 1,600 พิกเซล ถ้าเป็นเอกสาร การสแกนหรือถ่ายตรง ๆ ในที่สว่าง จะบีบอัดได้ดีกว่าการถ่ายเอียงหรือมีเงามาก</p>',
      faq: [
        ['ไฟล์สแกนเป็น PDF ใช้ที่นี่ได้ไหม?', 'เครื่องมือนี้ใช้กับไฟล์รูป ให้ถ่ายรูปหรือแคปหน้าจอหน้านั้น หรือบันทึกหน้า PDF เป็น JPG ก่อน แล้วค่อยนำมาบีบอัด'],
        ['บีบอัดรูปบัตรประชาชนที่นี่ปลอดภัยไหม?', 'ปลอดภัย รูปไม่ออกจากเครื่องของคุณ ประมวลผลในแท็บเบราว์เซอร์นี้ และไม่มีการอัปโหลด เหมาะกับเอกสารสำคัญอย่างบัตรประชาชนหรือพาสปอร์ต'],
      ],
    },
  },
};

const TEXT = {
  en: (kb) => ({
    name: `Compress Image to ${kb} KB`,
    title: `Compress Image to ${kb} KB Online, Free (JPG, PNG, HEIC)`,
    description: `Need a photo under ${kb} KB? Drop it in and get a JPG that fits, resized for you if it has to be. Batch, no upload, works with iPhone photos too.`,
    short: `Get any photo under ${kb} KB.`,
    howTitle: `How to compress an image to ${kb} KB`,
    how: ['Drop your photo in, or click to choose it. iPhone HEIC photos work too.', `${kb} KB and JPG are already set. Leave them as they are.`, 'Download the result. If you added several photos, download them all as a ZIP.'],
    usedFor: `What ${kb} KB photos are used for`,
    fitsTitle: `Will it really be under ${kb} KB?`,
    fits: `<p>Yes. Some forms count 1 KB as 1,000 bytes and others as 1,024, so the compressor aims for ${kb * 1000} bytes, which passes both. Your computer may show the file as about ${Math.floor((kb * 1000) / 1024)} KB.</p>`,
    privacyQ: 'Is my photo uploaded?',
    privacyA: 'No. It’s compressed in your browser, so the photo never leaves your device.',
  }),
  th: (kb) => ({
    name: `ย่อรูปให้ไม่เกิน ${kb} KB`,
    title: `ย่อขนาดรูปให้ไม่เกิน ${kb} KB ออนไลน์ฟรี (JPG, PNG, HEIC)`,
    description: `ต้องการรูปไม่เกิน ${kb} KB? ลากรูปมาวาง ได้ไฟล์ JPG ที่ไม่เกินขนาดทันที ย่อขนาดภาพให้เองถ้าจำเป็น ทำได้หลายรูป ไม่ต้องอัปโหลด รองรับรูปจาก iPhone`,
    short: `ทำให้รูปไม่เกิน ${kb} KB`,
    howTitle: `วิธีย่อรูปให้ไม่เกิน ${kb} KB`,
    how: ['ลากรูปมาวาง หรือคลิกเพื่อเลือกไฟล์ รูป HEIC จาก iPhone ก็ใช้ได้', `ตั้งค่า ${kb} KB และ JPG ไว้ให้แล้ว ไม่ต้องเปลี่ยน`, 'ดาวน์โหลดผลลัพธ์ ถ้ามีหลายรูป ดาวน์โหลดทั้งหมดเป็น ZIP ได้'],
    usedFor: `รูปขนาด ${kb} KB ใช้ทำอะไรบ้าง`,
    fitsTitle: `ไม่เกิน ${kb} KB จริงไหม?`,
    fits: `<p>จริง บางแบบฟอร์มนับ 1 KB เป็น 1,000 ไบต์ บางที่นับ 1,024 ไบต์ เครื่องมือจึงตั้งเป้าที่ ${(kb * 1000).toLocaleString('en-US')} ไบต์ ซึ่งผ่านทั้งสองแบบ คอมพิวเตอร์ของคุณอาจแสดงขนาดไฟล์ประมาณ ${Math.floor((kb * 1000) / 1024)} KB</p>`,
    privacyQ: 'รูปถูกอัปโหลดไปไหนไหม?',
    privacyA: 'ไม่ บีบอัดในเบราว์เซอร์ของคุณ รูปไม่ออกจากเครื่อง',
  }),
};

export const SIZES = Object.keys(COPY).map(Number);

export function sizePage(kb, lang = 'en') {
  const base = BASE[lang];
  const c = COPY[kb][lang];
  const x = TEXT[lang](kb);
  const body = base.body
    .replace('id="target-kb"', `id="target-kb" value="${kb}"`)
    .replace('<option value="image/jpeg">', '<option value="image/jpeg" selected>');
  const page = {
    name: x.name,
    title: x.title,
    description: x.description,
    short: x.short,
    body,
    content: `<h2>${x.howTitle}</h2>
<ol>${x.how.map((s) => `<li>${s}</li>`).join('')}</ol>
<h2>${x.usedFor}</h2>
<ul>${c.uses.map((s) => `<li>${s}</li>`).join('')}</ul>
${c.tips}
<h2>${x.fitsTitle}</h2>
${x.fits}`,
    faq: [...c.faq.map(([q, a]) => ({ q, a })), { q: x.privacyQ, a: x.privacyA }],
    ...(base.strings && { strings: base.strings }),
  };
  if (lang !== 'en') return page;
  return { ...page, slug: `compress-image-to-${kb}kb`, category: en.category, order: en.order, variantOf: 'image-compressor', variantLabel: `${kb} KB`, data: en.data, keywords: [`${kb}kb`, `${kb} kb`, 'compress', 'reduce size'] };
}

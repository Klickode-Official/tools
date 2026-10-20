// Thai for the JSON syntax errors that ./json-error.js translates. Spread into the `strings` of
// every Thai page that parses JSON.
export const JSON_ERRORS_TH = {
  '{message} at line {line}, column {column}': '{message} ที่บรรทัด {line} คอลัมน์ {column}',
  'Unexpected {what}, expected {expected}': 'เจอ {what} แต่ควรเป็น {expected}',
  'Unexpected {what} after the end of the JSON value': 'เจอ {what} หลังจบข้อมูล JSON แล้ว',
  'Invalid escape sequence {seq}': 'ลำดับ escape {seq} ไม่ถูกต้อง',
  'end of input': 'จุดสิ้นสุดข้อมูล',
  'a value': 'ค่าข้อมูล',
  'a double-quoted property name': 'ชื่อคีย์ในเครื่องหมายคำพูดคู่',
  "':'": "':'",
  "',' or '}'": "',' หรือ '}'",
  "',' or ']'": "',' หรือ ']'",
  'Strings must use double quotes': 'ข้อความต้องอยู่ในเครื่องหมายคำพูดคู่ (")',
  'Trailing comma is not allowed': 'ห้ามมีลูกน้ำตัวสุดท้ายเกินมา',
  'Invalid unicode escape': 'รหัส unicode escape ไม่ถูกต้อง',
  'Unescaped control character in string': 'มีอักขระควบคุมในข้อความที่ไม่ได้ escape',
  'Unterminated string': 'ข้อความไม่มีเครื่องหมายคำพูดปิด',
  'Invalid number': 'ตัวเลขไม่ถูกต้อง',
  'Input is empty': 'ยังไม่มีข้อมูล',
};

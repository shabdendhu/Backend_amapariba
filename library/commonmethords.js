function get_formdata(req) {
  return new Promise((resolve, reject) => {
    const formidable = require("formidable");
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      resolve({ fields, files });
    });
  });
}
const get_current_datetime = (is_return_object = false) => {
  let D = new Date();
  let n = D.getTime();
  n = n + D.getTimezoneOffset() * 60000;
  n = n + 330 * 60000;
  let date = new Date(n);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let d = date.getDate().toString().padStart(2, "0");
  let hour = date.getHours().toString().padStart(2, "0");
  let minute = date.getMinutes().toString().padStart(2, "0");
  let second = date.getSeconds().toString().padStart(2, "0");
  if (is_return_object) {
    return { year, month, d, hour, minute, second };
  }
  return (
    year + "-" + month + "-" + d + " " + hour + ":" + minute + ":" + second
  );
};
module.exports = {
  get_formdata,
  get_current_datetime,
};

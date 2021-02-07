const mysqlConnection = require("./connection");

const login = express();

// login.get("/user", (req, res) => {
//   var username = req.body.username;
//   var password = req.body.password;
//   mysqlConnection.query("SELECT * FROM database_1.`users` WHERE username = ?", [
//     username
//   ]);
// });

// // anichi sethu
// register.get("/register", (req, res) => {
//   mysqlConnection.query(
//     "SELECT * FROM database_1.`users`;",
//     (err, rows, fields) => {
//       if (!err) {
//         res.send(rows);
//       } else {
//         console.log(err);
//       }
//     }
//   );
// });

// coy from browser

exports.login = async function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  mysqlConnection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async function(error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred"
        });
      } else {
        if (results.length > 0) {
          const comparision = await bcrypt.compare(
            password,
            results[0].password
          );
          if (comparision) {
            res.send({
              code: 200,
              success: "login sucessfull"
            });
          } else {
            res.send({
              code: 204,
              success: "Email and password does not match"
            });
          }
        } else {
          res.send({
            code: 206,
            success: "Email does not exits"
          });
        }
      }
    }
  );
};

const User = require("../models/User");
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");

module.exports = {
  async auth(req, res) {
    try {
      const { username, password } = req.body;
      // const key = crypto
      //   .createHash("sha512")
      //   .update(process.env.SECRET)
      //   .digest("hex")
      //   .substring(0, 32);
      // const encryptionIV = crypto
      //   .createHash("sha512")
      //   .update('a')
      //   .digest("hex")
      //   .substring(0, 16);

      const user = await User.findOne({
        where: {
          username: username,
        },
      }).catch();

      // const cipher = crypto.createCipheriv('aes-256-cbc', key, []);
      // const buf_result = Buffer.from(
      //   cipher.update(password, "utf8", "hex") + cipher.final("hex")
      // ).toString("base64");

      var key = CryptoJS.enc.Hex.parse(process.env.KEY);
      console.log(process.env.KEY);
      
      var iv = CryptoJS.enc.Hex.parse(process.env.IV);
      console.log(process.env.IV);
      var encrypted = CryptoJS.AES.encrypt(user.password, key, { iv: iv }).toString();

      console.log("der   ", password);
      console.log(user.password);
      console.log(encrypted);
      //esse teste abaixo deve ser feito no seu banco de dados
      if (password == encrypted) {
        //auth ok
        const id = 1; //esse id viria do banco de dados
        const token = jwt.sign({ id }, process.env.SECRET, {
          expiresIn: 300, // expires in 5min
        });
        return res.json({ auth: true, token: token });
      } else {
        res.status(500).json({ message: "Login inválido!" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Login inválido!" });
    }
  },
};

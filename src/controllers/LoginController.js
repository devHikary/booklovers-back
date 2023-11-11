const User = require("../models/User");
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

module.exports = {
  async auth(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({
        where: {
          username: username,
        },
      }).catch();

      // var key = CryptoJS.enc.Hex.parse(process.env.KEY);
      // var iv = CryptoJS.enc.Hex.parse(process.env.IV);
      // var encrypted = CryptoJS.AES.encrypt(user.password, key, { iv: iv }).toString();

      //esse teste abaixo deve ser feito no seu banco de dados
      if (password == user.password) {
        //auth ok

        const role = await Role.findOne({
          where: {
            id: user.role_id,
          }, include:{
            model: Permission,
            attributes: ["name", "url"],
            through:{
              attributes: [],
            }
          }
        }).catch();

        const id = user.id;
        const token = jwt.sign({ 
          "id": id,
          "username": username,
          "permissions": role.Permissions

          }, process.env.SECRET, {
          expiresIn: 21600, // expires in 5min = 300 6h = 21600
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

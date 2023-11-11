const Role = require("../models/Role");
const User = require("../models/User");

const crypto = require("crypto");

module.exports = {
  async getAll(req, res) {
    try {
      const users = await User.findAll({
          attributes:["username"],
      });

      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id,{
        attributes:["username", "name", "email"],
      }).catch(()=>{
        return res.status(404).json({ error: "Cadastro não encontrado" });
      });

      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async create(req, res) {
    try {
      const { username, role_id, name, email, password } = req.body;
      const id = crypto.randomUUID();

      const email_aux = await User.findOne({
        where: {
          email: email,
        },
      }).catch();

      if (email_aux)
        return res.status(400).json({ error: "E-mail já cadastrado" });

      const username_aux = await User.findOne({
        where: {
          username: username,
        },
      }).catch();

      if (username_aux)
        return res.status(400).json({ error: "Username já cadastrado" });

      const role = await Role.findByPk(role_id);

      if (!role) {
        return res.status(400).json({ error: "Perfil inválido" });
      }

      await User.create({
        id,
        role_id,
        username,
        name,
        email,
        password,
      });

      return res.json({ msg: "Registro criado" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async update(req, res) {
    try {
      const { id, username, role_id, name, email, password } = req.body;

      const email_aux = await User.findOne({
        where: {
          email: email,
        },
      }).catch ((err) =>{
        console.log(err);
      })

      if (email_aux && email_aux.id != id)
        return res.status(400).json({ error: "E-mail já cadastrado" });

      const username_aux = await User.findOne({
        where: {
          username: username,
        },
      }).catch ((err) =>{
        console.log(err);
      })

        if (username_aux && username_aux.id != id)
          return res.status(400).json({ error: "Username já cadastrado" });


      const role = await Role.findByPk(role_id);

      if (!role) {
        return res.status(400).json({ error: "Perfil inválido" });
      }

      const user = await User.findByPk(id);

      await user.update({
        username,
        name,
        email,
      });

      

      return res.json({ msg: "Registro atualizado" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;


      const user = await User.findByPk(id).catch((err) => {
        return res.status(400).json({ error: "Registro não existe" });
      });

      await user.destroy({ where: {id} });

      return res.json({ msg: "Cadastro excluído" });
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },

  async updatePwd(req, res) {
    try {
      const { id, passCurrent, passNew } = req.body;

      const user = await User.findByPk(id).catch(() =>{
        return res.status(404).json({ error: "Registro não encontrado" });
      });

      if(passCurrent === user.password){
        await user.update({
          password: passNew
        });
      }else{
        return res.status(400).json({ error: "Senha atual incorreta" });
      }
      
      return res.json({ msg: "Registro atualizado" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Cadastro incorreto" });
    }
  },
};

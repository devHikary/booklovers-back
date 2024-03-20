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
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36) {
        return res.status(404).json({ error: "Cadastro não encontrado" });
      }

      const user = await User.findByPk(id,{
        attributes:["username", "name", "email"],
      }).catch(()=>{
        return res.status(404).json({ error: "Cadastro não encontrado" });
      });

      if(user === null) {
        return res.status(404).json({ error: "Cadastro não encontrado" });
      }

      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async create(req, res) {
    try {
      const { username, role_id, name, email, password } = req.body;
      const id = crypto.randomUUID(); 

      if(role_id.length != 36) {
        return res.status(404).json({ error: "Perfil inválido" });
      }

      const email_aux = await User.findOne({
        where: {
          email: email,
        },
      }).catch();

      if (email_aux)
        return res.status(400).json({ error: "E-mail já cadastrado"});

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
      }).catch((err) => {
        return res.status(400).json({ error: "Cadastro incorreto" });
      });

      return res.json({ msg: "Registro criado" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async update(req, res) {
    try {
      const { id, username, role_id, name, email} = req.body;

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

      if(user === null) {
        return res.status(400).json({ error: "ID do usuário inválido" });
      }
      await user.update({
        username,
        name,
        email,
      }).catch((err) => {
        return res.status(400).json({ error: "Cadastro incorreto" });
      });

      return res.json({ msg: "Registro atualizado" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      if(id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const user = await User.findByPk(id).catch((err) => {
        return res.status(404).json({ error: "Registro não encontrado" });
      });

      if(user == null ) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      await user.destroy({ where: {id} });

      return res.json({ msg: "Cadastro excluído" });
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },

  async updatePwd(req, res) {
    try {
      const { id, passCurrent, passNew } = req.body;

      if(id.length != 36) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const user = await User.findByPk(id).catch(() =>{
        return res.status(404).json({ error: "Registro não encontrado" });
      });

      if(user === null)
        return res.status(404).json({ error: "Registro não encontrado" });
      if(passCurrent === user.password){
        await user.update({
          password: passNew
        }).catch((err) => {
          return res.status(400).json({ error: "Cadastro incorreto" });
        });
      }else{
        return res.status(400).json({ error: "Senha atual incorreta" });
      }
      
      return res.json({ msg: "Registro atualizado" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro no servidor! Tente mais tarde' });
    }
  },
};

const { response } = require('express');
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const { jwtGenerate } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
    try {
        const { email, password } = req.body;

        let user = await Users.findOne({ email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo',
            });
        }
        const userCreate = new Users(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        userCreate.password = bcrypt.hashSync(password, salt);
        await userCreate.save();

        const token = await jwtGenerate(userCreate.id, userCreate.name);

        res.status(201).json({
            ok: true,
            uid: userCreate.id,
            name: userCreate.name,
            token,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador',
        });
    }
};

const loginUsuario = async (req, res = response) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese correo',
            });
        }
        //Confirmar password

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto',
            });
        }

        //Generar JWT
        const token = await jwtGenerate(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador',
        });
    }
};

const revalidarToken = async (req, res = response) => {
    const uid = req.uid;
    const name = req.name;
    const token = await jwtGenerate(uid, name);
    res.json({
        ok: true,
        msg: 'renew',
        uid,
        name,
        token,
    });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };

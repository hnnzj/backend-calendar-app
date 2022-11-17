const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearUsuario,
    loginUsuario,
    revalidarToken,
} = require('../controllers/auth');
const { fieldValidate } = require('../middlewares/fieldValidators');
const { jwtValidator } = require('../middlewares/jwtValidation');

const router = Router();

router.post(
    '/register',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check(
            'password',
            'El password debe de ser 6 caracteres o mas'
        ).isLength({
            min: 6,
        }),
        fieldValidate,
    ],
    crearUsuario
);
router.post(
    '/',
    [
        check('email', 'El email es incorrecto').isEmail(),
        check(
            'password',
            'El password debe ser de 6 caracteres o mas'
        ).isLength({
            min: 6,
        }),
        fieldValidate,
    ],
    loginUsuario
);
router.get('/renew', jwtValidator, revalidarToken);

module.exports = router;

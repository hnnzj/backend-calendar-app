const { Router } = require('express');
const { jwtValidator } = require('../middlewares/jwtValidation');
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/events');
const { check } = require('express-validator');
const { fieldValidate } = require('../middlewares/fieldValidators');
const isDate = require('../helpers/isDate');

const router = Router();
router.use(jwtValidator);

router.get('/', getEvents);
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        fieldValidate,
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        fieldValidate,

        check('end', 'Fecha de finalizacion es obligatorio').custom(isDate),
        fieldValidate,
    ],
    createEvent
);
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        fieldValidate,
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        fieldValidate,

        check('end', 'Fecha de finalizacion es obligatorio').custom(isDate),
        fieldValidate,
    ],
    updateEvent
);
router.delete('/:id', deleteEvent);

module.exports = router;

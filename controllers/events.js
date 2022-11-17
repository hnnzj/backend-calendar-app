const { response } = require('express');
const Events = require('../models/Events');

const getEvents = async (req, res = response) => {
    const events = await Events.find().populate('user', 'name');
    res.json({
        ok: true,
        msg: 'getEvents',
        events,
    });
};
const createEvent = async (req, res = response) => {
    const event = new Events(req.body);
    try {
        event.user = req.uid;
        const saveEvent = await event.save();
        res.json({
            ok: true,
            saveEvent,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'sos un culo roto uwu',
        });
    }
};
const updateEvent = async (req, res = response) => {
    const idEvent = req.params.id;
    const uid = req.uid;
    try {
        const event = await Events.findById(idEvent);

        if (!event) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id',
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento',
            });
        }

        const newEvent = {
            ...req.body,
            user: uid,
        };

        const updatedEvent = await Events.findByIdAndUpdate(idEvent, newEvent);
        res.json({
            ok: true,
            event: updatedEvent,
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};
const deleteEvent = async (req, res = response) => {
    const idEvent = req.params.id;
    const uid = req.uid;
    try {
        const event = await Events.findById(idEvent);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id',
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento',
            });
        }

        await Events.findByIdAndDelete(idEvent);
        res.json({
            ok: true,
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};

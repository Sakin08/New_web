import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const event = await Event.create({ title, description, date, location });
  res.status(201).json(event);
};

export const getEvents = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};
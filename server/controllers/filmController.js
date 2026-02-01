import Film from "../models/Film.js";

export const getAllFilms = async (req, res) => {
    try {
        const films = await Film.find().sort({ createdAt: -1 });
        res.json(films);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createFilm = async (req, res) => {
    try {
        const film = new Film(req.body);
        await film.save();
        res.status(201).json(film);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateFilm = async (req, res) => {
    try {
        const film = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!film) return res.status(404).json({ message: "Film not found" });
        res.json(film);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFilm = async (req, res) => {
    try {
        const film = await Film.findByIdAndDelete(req.params.id);
        if (!film) return res.status(404).json({ message: "Film not found" });
        res.json({ message: "Film deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

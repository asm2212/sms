const Complain = require("../models/complainSchema.js");

/**
 * Create a new complain.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const createComplain = async (req, res) => {
  try {
    const newComplain = new Complain(req.body);
    const result = await newComplain.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get list of complains for a specific school.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const listComplains = async (req, res) => {
  try {
    const complains = await Complain.find({ school: req.params.id }).populate(
      "user",
      "name"
    );
    if (complains.length > 0) {
      res.json(complains);
    } else {
      res.status(404).json({ message: "No complains found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createComplain, listComplains };

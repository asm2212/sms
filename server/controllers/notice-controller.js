const Notice = require("../models/noticeSchema.js");

/**
 * Create a new notice.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const createNotice = async (req, res) => {
  try {
    const notice = new Notice({
      ...req.body,
      school: req.body.adminID,
    });
    const result = await notice.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get list of notices for a specific school.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const listNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ school: req.params.id });
    if (notices.length > 0) {
      res.json(notices);
    } else {
      res.status(404).json({ message: "No notices found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update an existing notice.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const updateNotice = async (req, res) => {
  try {
    const result = await Notice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete a notice by ID.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const deleteNotice = async (req, res) => {
  try {
    const result = await Notice.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete all notices for a specific school.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const deleteNotices = async (req, res) => {
  try {
    const result = await Notice.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      res.json({ message: "No notices found to delete" });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createNotice,
  listNotices,
  updateNotice,
  deleteNotice,
  deleteNotices,
};

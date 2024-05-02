const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Student = require("../models/studentSchema.js");


const subjectCreate = async (req, res) => {
  try {
    const subjectsData = req.body.subjects.map((subject) => ({
      subName: subject.subName,
      subCode: subject.subCode,
      sessions: subject.sessions,
      sclassName: req.body.sclassName,
      school: req.body.adminID,
    }));

    const existingSubjectBySubCode = await Subject.findOne({
      "subjects.subCode": subjectsData[0].subCode,
      school: req.body.adminID,
    });

    if (existingSubjectBySubCode) {
      return res.status(400).json({
        message: "Sorry, this subcode must be unique as it already exists",
      });
    }

    const createdSubjects = await Subject.insertMany(subjectsData);
    res.json(createdSubjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const allSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ school: req.params.id }).populate(
      "sclassName",
      "sclassName"
    );

    if (subjects.length === 0) {
      return res.json({ message: "No subjects found" });
    }

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const classSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ sclassName: req.params.id });

    if (subjects.length === 0) {
      return res.json({ message: "No subjects found" });
    }

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const freeSubjectList = async (req, res) => {
  try {
    const subjects = await Subject.find({
      sclassName: req.params.id,
      teacher: { $exists: false },
    });

    if (subjects.length === 0) {
      return res.json({ message: "No subjects found" });
    }

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSubjectDetail = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("sclassName", "sclassName")
      .populate("teacher", "name");

    if (!subject) {
      return res.json({ message: "No subject found" });
    }

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

    await Promise.all([
      Teacher.updateOne(
        { teachSubject: deletedSubject._id },
        { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
      ),
      Student.updateMany(
        {},
        { $pull: { examResult: { subName: deletedSubject._id } } }
      ),
      Student.updateMany(
        {},
        { $pull: { attendance: { subName: deletedSubject._id } } }
      ),
    ]);

    res.json(deletedSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteSubjects = async (req, res) => {
  try {
    const deletedSubjects = await Subject.deleteMany({ school: req.params.id });

    await Promise.all([
      Teacher.updateMany(
        { teachSubject: { $in: deletedSubjects.map((subject) => subject._id) } },
        { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
      ),
      Student.updateMany({}, { $set: { examResult: null, attendance: null } }),
    ]);

    res.json(deletedSubjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteSubjectsByClass = async (req, res) => {
  try {
    const deletedSubjects = await Subject.deleteMany({
      sclassName: req.params.id,
    });

    await Promise.all([
      Teacher.updateMany(
        { teachSubject: { $in: deletedSubjects.map((subject) => subject._id) } },
        { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
      ),
      Student.updateMany({}, { $set: { examResult: null, attendance: null } }),
    ]);

    res.json(deletedSubjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  subjectCreate,
  freeSubjectList,
  classSubjects,
  getSubjectDetail,
  deleteSubjectsByClass,
  deleteSubjects,
  deleteSubject,
  allSubjects,
};

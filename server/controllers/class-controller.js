const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

const sclassCreate = async (req, res) => {
    try {
        const { sclassName, adminID } = req.body;
        const existingSclass = await Sclass.findOne({ sclassName, school: adminID });
        if (existingSclass) {
            return res.status(400).json({ message: 'Class name already exists' });
        }

        const sclass = new Sclass({ sclassName, school: adminID });
        const result = await sclass.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const sclassList = async (req, res) => {
    try {
        const sclasses = await Sclass.find({ school: req.params.id });
        if (sclasses.length === 0) {
            return res.status(404).json({ message: 'No classes found' });
        }
        res.json(sclasses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getSclassDetail = async (req, res) => {
    try {
        const sclass = await Sclass.findById(req.params.id).populate('school', 'schoolName');
        if (!sclass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.json(sclass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getSclassStudents = async (req, res) => {
    try {
        const students = await Student.find({ sclassName: req.params.id });
        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }
        const modifiedStudents = students.map(student => ({ ...student._doc, password: undefined }));
        res.json(modifiedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        await Promise.all([
            Student.deleteMany({ sclassName: req.params.id }),
            Subject.deleteMany({ sclassName: req.params.id }),
            Teacher.deleteMany({ teachSclass: req.params.id })
        ]);
        res.json(deletedClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
        if (deletedClasses.deletedCount === 0) {
            return res.status(404).json({ message: 'No classes found to delete' });
        }
        await Promise.all([
            Student.deleteMany({ school: req.params.id }),
            Subject.deleteMany({ school: req.params.id }),
            Teacher.deleteMany({ school: req.params.id })
        ]);
        res.json(deletedClasses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };

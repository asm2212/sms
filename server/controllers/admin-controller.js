const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');

/**
 * Register a new admin.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const adminRegister = async (req, res) => {
    try {
        const { email, password, schoolName } = req.body;

        const existingAdminByEmail = await Admin.findOne({ email });
        const existingSchool = await Admin.findOne({ schoolName });

        if (existingAdminByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (existingSchool) {
            return res.status(400).json({ message: 'School name already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new Admin({
            email,
            password: hashedPassword,
            schoolName
        });

        const result = await admin.save();
        result.password = undefined; 
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Log in admin.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const adminLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, admin.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        admin.password = undefined;
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Get admin details.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const getAdminDetail = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({ message: 'No admin found' });
        }

        admin.password = undefined;
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };

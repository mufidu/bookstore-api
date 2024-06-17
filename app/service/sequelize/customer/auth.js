const validator = require('validator');
const { BadRequestError, NotFoundError } = require('../../../errors');
const { sequelize } = require('../../../../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const Customer = require('../../../../models').Customer;
const config = require('../../../../config/environment-config');
config.loadEnvironmentVariables();

// const createStudent = async (email, password, fullName, phoneNumber, superAdminId, instanceId) => {
//     let sequelizeUser;
//     try {
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         const result = await sequelize.transaction(async (t) => {
//             sequelizeUser = await Student.create(
//                 {
//                     email: email,
//                     fullName: fullName,
//                     password: hashedPassword,
//                     phoneNumber: phoneNumber,
//                     instanceId: instanceId,
//                     superAdminId: superAdminId
//                 },
//                 {
//                     transaction: t,
//                 }
//             );
//             return sequelizeUser;
//         });
//         return result;
//     } catch (err) {
//         console.log(err);
//         return false;
//     }
// };

// const registerStudent = async (req) => {
//     const { fullName, email, password, phoneNumber, instanceName } = req.body;

//     if (!fullName || !email || !password || !phoneNumber) {
//         throw new BadRequestError('Fullname, email, and password is required');
//     }

//     // Check if email exists in PostgreSQL database
//     const student = await Student.findOne({ where: { email } });
//     if (student) {
//         throw new BadRequestError('Email already exists');
//     }

//     // Validate email
//     const isEmail = await validator.isEmail(email);
//     if (!isEmail) {
//         throw new BadRequestError('Invalid Email');
//     }

//     // Validate phone number
//     if (phoneNumber) {
//         const isPhoneNumber = validator.isMobilePhone(phoneNumber, 'any');
//         if (!isPhoneNumber) {
//             throw new BadRequestError('Invalid Phone Number');
//         }
//     }

//     // Validate password
//     const strongPassword = await validator.isStrongPassword(password);
//     if (!strongPassword) {
//         throw new BadRequestError('Weak Password');
//     }

//     let superAdminId = null;
//     let instanceId = null;
//     if (!instanceName) {
//         // If instanceName is not provided, link the student to the super admin
//         const superAdmin = await SuperAdmin.findOne({ where: { email: process.env.SUPER_ADMIN_EMAIL } });
//         if (superAdmin) {
//             superAdminId = superAdmin.id;
//         }
//     } else {
//         // If instanceName is provided, find the instance and get its id
//         const instance = await Instance.findOne({ where: { name: instanceName } });
//         if (instance) {
//             instanceId = instance.id;
//         } else {
//             throw new BadRequestError('Institution not found');
//         }
//     }

//     // Create student in PostgreSQL database
//     const studentCreated = await createStudent(email, password, fullName, phoneNumber, superAdminId, instanceId);

//     if (!studentCreated) {
//         throw new Error();
//     }

//     // Create token
//     const token = jwt.sign({ student: studentCreated },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: parseInt(process.env.JWT_EXPIRATION, 10) });

//     return { student: studentCreated, token };
// };

// const loginStudent = async (req) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         throw new BadRequestError('Email and password is required');
//     }

//     const student = await Student.findOne({ where: { email } });
//     if (!student) {
//         throw new NotFoundError('Student not found');
//     }

//     const match = await bcrypt.compare(password, student.password);
//     if (!match) {
//         throw new BadRequestError('Incorrect password');
//     }

//     // Student is authenticated, generate a JWT
//     const token = jwt.sign({ student: student },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: parseInt(process.env.JWT_EXPIRATION, 10) });

//     return { student, token };
// };

// const forgotPassword = async (req) => {
//     const { email } = req.body;

//     if (!email) {
//         throw new BadRequestError('Email is required');
//     }

//     // Check if email exists in PostgreSQL database
//     const student = await Student.findOne({ where: { email } });

//     if (!student) {
//         throw new NotFoundError('Student not found');
//     }

//     // Generate a random 4 digit OTP
//     const otp = Math.floor(1000 + Math.random() * 9000);

//     // Set OTP and expiry date
//     student.otp = otp;
//     student.otpExpiredAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

//     await student.save();

//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_SERVER,
//         port: process.env.SMTP_PORT,
//         auth: {
//             user: process.env.SMTP_LOGIN,
//             pass: process.env.SMTP_PASSWORD,
//         },
//         secure: false,
//         requireTLS: true,
//     });

//     // Send OTP email
//     const mailOptions = {
//         from: process.env.SMTP_LOGIN,
//         to: email,
//         subject: 'OTP for Password Reset',
//         text: `Your OTP is: ${otp}`
//     };

//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.response);
//     } catch (err) {
//         console.error('Error sending email:', err);
//         throw new Error('Failed to send OTP email');
//     }

//     return { message: 'OTP sent to email' };
// };

// const verifyOTP = async (req) => {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//         throw new BadRequestError('Email and OTP is required');
//     }

//     // Check if email exists in PostgreSQL database
//     const student = await Student.findOne({ where: { email } });
//     if (!student) {
//         throw new NotFoundError('Student not found');
//     }

//     // Check if OTP matches and is not expired
//     if (student.otp !== otp || student.otp_expires_at < new Date()) {
//         throw new BadRequestError('Invalid or expired OTP');
//     }

//     // OTP is valid, return the student object without clearing the OTP
//     return student;
// };

// const resetPassword = async (req) => {
//     const { email, newPassword, otp } = req.body;
//     if (!email || !newPassword || !otp) {
//         throw new BadRequestError('Email, new password, and OTP are required');
//     }

//     // Check if email exists in PostgreSQL database
//     const student = await Student.findOne({ where: { email } });
//     if (!student) {
//         throw new NotFoundError('Student not found');
//     }

//     // Verify the OTP
//     if (student.otp !== otp) {
//         throw new BadRequestError('Invalid OTP');
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
//     student.password = hashedPassword;

//     // Clear the OTP from the database after successful password reset
//     student.otp = null;
//     student.otpExpiredAt = null;
//     await student.save();

//     return student;
// };

const registerCustomer = async (req) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError('Username and password is required');
    }

    // Check if username exists in PostgreSQL database
    const customer = await Customer.findOne({ where: { username } });
    if (customer) {
        throw new BadRequestError('Username already exists');
    }

    // Validate username
    const isUsername = await validator.isAlphanumeric(username);
    if (!isUsername) {
        throw new BadRequestError('Invalid Username');
    }

    // Validate password
    const strongPassword = await validator.isStrongPassword(password);
    if (!strongPassword) {
        throw new BadRequestError('Weak Password');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await sequelize.transaction(async (t) => {
        const sequelizeCustomer = await Customer.create(
            {
                username: username,
                password: hashedPassword
            },
            {
                transaction: t,
            }
        );
        return sequelizeCustomer;
    });

    return result;
};

const loginCustomer = async (req) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError('Username and password is required');
    }

    const customer = await Customer.findOne({ where: { username } });
    if (!customer) {
        throw new NotFoundError('Customer not found');
    }

    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
        throw new BadRequestError('Incorrect password');
    }

    // Customer is authenticated, generate a JWT
    const token = jwt.sign({ customer: customer },
        process.env.JWT_SECRET_KEY,
        { expiresIn: parseInt(process.env.JWT_EXPIRATION, 10) });

    return { customer, token };
}

module.exports = {
    registerCustomer,
    loginCustomer,
};

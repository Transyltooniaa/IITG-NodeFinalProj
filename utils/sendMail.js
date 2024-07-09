const nodemailer = require('nodemailer');
const { emailUser, emailPass } = require('../config');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: emailUser,
        pass: emailPass
    } 
});


module.exports.sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: emailUser,
        to,
        subject,
        text
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Error sending email ${error}`);
    }
};

require("dotenv").config();
const { EMAIL_USER, EMAIL_PASS } = process.env;
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL_USER ,
        pass: EMAIL_PASS
    }
});


const emailNotification = async (req, res) => {
    const { userMail, contenido, titulo } = req.body;

    try {
        if(!userMail || !contenido || !titulo){
            const error = "Faltan Datos";
            throw new Error(error)
        }
        const mailOptions = {
            from: "stringsandkeysmusicstore@gmail.com",
            to: userMail,
            subject: titulo,
            // text: contenido,
            html: contenido,
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error(error.message);
            } else {
                res.status(200).send("Email Sent" + info)
            }
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    emailNotification,
}


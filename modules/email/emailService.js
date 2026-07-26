const transporter =
require("./smtpProvider");

async function sendEmail({

    to,

    subject,

    html

}){

    return transporter.sendMail({

        from:
            process.env.EMAIL_FROM,

        to,

        subject,

        html

    });

}

module.exports={

    sendEmail

};
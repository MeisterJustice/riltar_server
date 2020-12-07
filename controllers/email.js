const sgMail = require("@sendgrid/mail");
const { sendgridKey } = require("../config/index");

sgMail.setApiKey(sendgridKey);

exports.sendEmail = (data) => {
    return new Promise((fulfill, reject) => {
        const msg = {
            to: data.to,
            from: `riltar <justiceeziefule@gmail.com>`,
            templateId: data.templateId,
            subject: data.subject,
            dynamic_template_data: data.info // this will be an object containing information like name, product, etc
        }
        sgMail.send(msg)
            .then((res) => {
                fulfill(res);
            })
            .catch((err) => {
                reject(err);
            });
    }
    )
}

exports.sendEmailWithoutTemplate = async (data) => {
    const msg = {
        to: data.to,
        from: `riltar <justiceeziefule@gmail.com>`,
        subject: data.subject,
        html: data.body,
    };
    await sgMail.send(msg);
}
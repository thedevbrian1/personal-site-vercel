// import Mailjet from 'node-mailjet';
import { Resend } from "resend";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { createHash } from "node:crypto";

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX
});

// export async function createContact(email) {
//     // const Mailjet = require('node-mailjet');
//     const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

//     let res = null;
//     try {
//         res = await mailjet
//             .post("contact", { 'version': 'v3' })
//             .request({
//                 "IsExcludedFromCampaigns": "true",
//                 "Email": `${email}`
//             });
//         console.log('New contact: ', res.body);
//     } catch (err) {
//         throw new Response(err, { status: err.statusCode })
//     }
//     return res.body;
// }

// export async function addContactToList(contactEmail) {
//     // const Mailjet = require('node-mailjet');
//     const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

//     try {
//         const res = await mailjet
//             .post("listrecipient", { 'version': 'v3' })
//             .request({
//                 "IsUnsubscribed": "false",
//                 // "ContactID": "478938490",
//                 "ContactAlt": `${contactEmail}`,
//                 "ListID": "47814",
//                 // "ListAlt": "abcdef123"
//             });
//         console.log('New subscriber: ', res.body);
//     } catch (err) {
//         throw new Response(err, { status: err.statusCode });
//     }
// }

// export async function sendEmail({ name, email, message }) {
//     // const Mailjet = require('node-mailjet');
//     const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

//     try {
//         const res = await mailjet
//             .post("send", { 'version': 'v3' })
//             .request({
//                 "FromEmail": "bhello@brianmwangi.co.ke",
//                 "FromName": "thedevbrian Website",
//                 "Recipients": [
//                     {
//                         "Email": "mwangib041@gmail.com",
//                         "Name": "Brian Mwangi"
//                     }
//                 ],
//                 "Subject": "Test email",
//                 "Text-part": "This is the text part of this email",
//                 "Html-part": `
//             <h3>Message from website</h3>
//             <p>${message}</p>
//             <p>Here are my contact details: </p>
//             <p>Name: ${name} </p>
//             <p>Email: ${email} </p>
//             `
//             });
//         console.log('Email response: ', res.body);
//     } catch (err) {
//         throw new Response(err, { status: err.statusCode })
//     }

// }

export async function sendEmail(name, email, phone, message) {
    let resend = new Resend(process.env.RESEND_API_KEY);
    let { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: [process.env.TO_EMAIL],
        subject: "Message from Brian Mwangi contact form",
        html: `<div>
                    <p>Hi, I contacted you from Brian Mwangi website. Here are my details:</p>
                    <p>Name: ${name}</p>
                    <p>Email: ${email}</p>
                    <p>Phone: ${phone}</p>
                    <p>Message: ${message}</p>
                </div>
                `
    });

    if (error) {
        throw new Error(error);
    }

    return data;
}

export async function subscribe(name, email) {

    function generateMD5(input) {
        return createHash('md5').update(input).digest('hex');
    }

    let subscriberHash = generateMD5(email.toLowerCase());

    let nameArray = name.split(' ');

    let res = await mailchimp.lists.setListMember(process.env.MAILCHIMP_AUDIENCE_ID, subscriberHash, {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
            FNAME: nameArray[0],
            ...(nameArray[1] && { LNAME: nameArray[1] })
        }
    });

    return res;
}
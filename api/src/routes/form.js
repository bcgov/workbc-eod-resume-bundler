var express = require('express');
var router = express.Router();
const yup = require('yup')
const yupPhone = require('yup-phone')

var { check, validationResult, matchedData } = require('express-validator')
var nodemailer = require("nodemailer");
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var { saveSent } = require('../utils/mongoOperations')


async function sendEmails(values) {
  try {
    let transporter = nodemailer.createTransport({
      host: "apps.smtp.gov.bc.ca",
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized: false
      } // true for 465, false for other ports
    });
    return await transporter.verify()
      .then(function (r) {
        console.log(r)
        console.log("Transporter connected.")
        // send mail with defined transport object
        let message1 = {
          from: 'Someone <donotreply@gov.bc.ca>', // sender address
          to: values.emailTo,// list of receivers
          cc: values.emailCC,
          bcc: values.emailBCC,
          subject: values.emailSubject, // Subject line
          html: values // html body
        };

        let info = transporter.sendMail(message1, (error, info) => {
          if (error) {
            console.log("Error sending confirmation for " + values._id)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        return true
      }).catch(function (e) {
        console.log(e)
        console.log("Error connecting to transporter")
        return false
      })
  } catch (error) {
    console.log(error)
    return false
  }
}


router.post('/', async (req, res) => {
  //clean the body
  console.log("POST received to save send")
  console.log(req.body)
  try {
    await sendEmails(req.body)
      .then(function (sent) {
        if (sent) {
          res.send({
            ok: "ok"
          })
        } else if (!sent) {
          res.send({
            err: "emailErr"
          })
        }
      }).catch(function (e) {
        console.log(e)
      })

  } catch (error) {
    console.log(error)
    res.send({
      err: "someErr"
    })
  }
})

module.exports = router;
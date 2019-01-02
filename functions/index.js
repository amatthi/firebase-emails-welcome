/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/Snippets/Users/{uid}').onWrite(async (change) => {
  const snapshot = change.after;
  const val = snapshot.val();

  //if (!snapshot.changed('subscribedToMailingList')) {
    //return null;
  //}

  const mailOptions = {
    from: '"Alek Matthiessen" <alek@snippetsla.com>',
    to: val.email,
  };

  //const subscribed = val.subscribedToMailingList;

  // Building Email message.
  mailOptions.subject = 'Welcome to the Snippets community!';  //for example
  mailOptions.text = "Hey there,\n\nWelcome to Snippets–we’re so glad to have you. My name is Alek and I'm the CEO and co-founder of Snippets. We built Snippets to make it easier for people to experience the magic of reading.\n\nWe're still early on in our journey, so please reach out directly to me if you have any feedback, concerns, or questions about your experience. I can promise you we will take them to heart.\n\nEnjoy the Snippets!\n\nAlek Matthiessen";


  try {
    await mailTransport.sendMail(mailOptions);
    console.log('email sent to:', val.email);
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }
  return null;
});

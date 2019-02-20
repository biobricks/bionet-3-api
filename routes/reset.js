//const Config = require('../config');
const User = require('../models/User');
const userRequired = require('../modules/apiAccess').userRequired;
const shortid = require('shortid');
const sgMail = require('@sendgrid/mail');
require("../config/env.js");


sgMail.setApiKey(process.env.SENDGRID_KEY);

module.exports = function(router) { 

// post resetToken and newPassword - if valid then save and return current user
router.post('/reset-password/validate', (req, res) => {
  let resetToken = req.body.resetToken && req.body.resetToken.length > 5 ? req.body.resetToken : false;
  let newPassword = req.body.newPassword && req.body.newPassword.length > 5 ? req.body.newPassword : false;
  if (resetToken && newPassword) {
    User.findOne({resetToken: req.body.resetToken}, (error, currentUser) => {
      if (error) {
        res.status(400).json({
          success: false,
          message: 'There was an error while trying to find the User in the database.',
          user: {},
          error
        });
      } else if (!currentUser) {   
        res.status(400).json({
          success: false,
          message: 'User not found in the database.',
          user: {},
          error: new Error('User not found in the database.')
        });
      } else {   
        if (String(resetToken) === String(currentUser.resetToken)) {
          currentUser.password = newPassword;
          currentUser.save((error, savedUser) => {
            if (error) {
              res.status(400).json({
                success: false,
                message: "User password change failed.",
                user: currentUser || {},
                error
              });
            } else {
              res.status(200).json({
                success: true,
                message: "Users password successfully changed.",
                user: savedUser || {},
                error: {}
              });
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: "User password change failed - Invalid Reset Token.",
            user: currentUser || {},
            error: new Error('Invalid Reset Token')
          });          
        }  
      }  
    });  
  } else {
    res.status(400).json({
      success: false,
      message: "User password change failed.",
      user: {},
      error: new Error('User ID, Reset Token was missing from the request or the User was not found.')
    });
  }  
});

// post user account email address and receive reset password token by email
router.post('/reset-password', (req, res) => {
  let email = req.body.email && req.body.email.length > 9 ? req.body.email : false;
  if (email) {
    User.findOne({'email': email}, (error, currentUser) => {
      if (error) {
        res.status(400).json({
          success: false,
          message: 'There was an error while making the User query to the database.',
          user: {},
          error
        });
      } else if (!currentUser) {   
        res.status(400).json({
          success: false,
          message: 'User not found.',
          user: {},
          error: new Error('User not found.')
        });
      } else {
        const resetToken = shortid.generate();
        currentUser.resetToken = resetToken;
        currentUser.save((error, savedUser) => {
          if (error) {
            res.status(400).json({
              success: false,
              message: 'There was an error while saving the reset token to the database.',
              user: {},
              error
            });
          } else if (!savedUser) {   
            res.status(400).json({
              success: false,
              message: 'User not found.',
              user: {},
              error: new Error('User not found.')
            });
          } else {
            const domainPrefix = process.env.SSL_ENABLED === true ? 'https://' : 'http://';
            const domain = process.env.DOMAIN === 'localhost:3001' ? 'example.com' : process.env.DOMAIN;
            const url = `${domainPrefix}${domain}`;
            const appName = process.env.APP_NAME;
            const messageText = `Hello ${currentUser.username},\nIf you recently requested an account password change please visit ${url}/password-reset/verify and enter in the code '${resetToken}', otherwise disregard this message.\n - The ${appName} Team`;
            let messageHtml = `<p>Hello ${currentUser.username},<br/><br/>`;
            messageHtml += `If you recently requested an account password change please visit <a href="${url}/password-reset/verify">${url}/password-reset/verify</a>`;
            messageHtml += ` and enter in the code '${resetToken}', otherwise disregard this message.<br/> - The ${appName} Team</p>`;
            const msg = {
              to: currentUser.email,
              from: `donotreply@${domain}`,
              subject: `Reset ${appName} Password`,
              text: messageText,
              html: messageHtml
            };
            console.log('sending message:', msg);
            sgMail.send(msg);
            res.status(200).json({
              success: true,
              message: `Password recovery instructions being sent to ${currentUser.email}.`,
              user: currentUser || {},
              error: {}
            });
          }
        });     
      }
    });
  } else {
    res.status(400).json({
      message: "User password change failed.",
      user: {},
      error: Error('Email was not provided.')
    });    
  }  
});

};
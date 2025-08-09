exports.otpEmailTemplate = (name, otp) => {
  return `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>OTP Verification</title>
      <style>
          body {
              background-color: #ffffff;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.4;
              color: #333333;
              margin: 0;
              padding: 0;
          }

          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
          }

          .logo {
              max-width: 200px;
              margin-bottom: 20px;
          }

          .message {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
          }

          .body {
              font-size: 16px;
              margin-bottom: 20px;
          }

          .otp-box {
              font-size: 24px;
              font-weight: bold;
              color: black;
              background-color: #FFD60A;
              padding: 10px 20px;
              display: inline-block;
              border-radius: 5px;
              letter-spacing: 3px;
              margin: 20px 0;
          }

          .support {
              font-size: 14px;
              color: #999999;
              margin-top: 20px;
          }

          .highlight {
              font-weight: bold;
          }
      </style>
  </head>

  <body>
      <div class="container">
          <a href="#"><img class="logo" src="" alt="StudyBuddy Logo"></a>
          <div class="message">Email Verification Code</div>
          <div class="body">
              <p>Dear ${name},</p>
              <p>Use the OTP below to verify your email address:</p>
              <div class="otp-box">${otp}</div>
              <p>This code is valid for the next 10 minutes.</p>
          </div>
          <div class="support">If you didn't request this OTP or need help, please contact us at <a href="mailto:info@studybuddy.com">info@studybuddy.com</a>.</div>
      </div>
  </body>
  </html>`;
};

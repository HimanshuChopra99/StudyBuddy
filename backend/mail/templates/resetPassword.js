exports.passwordResetEmail = (email, name, resetLink) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8">
    <title>Password Reset Request</title>
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

      .highlight {
        font-weight: bold;
      }

      .reset-button {
        display: inline-block;
        padding: 12px 24px;
        margin-top: 20px;
        background-color: #FFD60A;
        color: #000000 !important;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      }

      .support {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <a href="#"><img class="logo" src="" alt="StudyBuddy Logo"></a>
      <div class="message">Reset Your Password</div>
      <div class="body">
        <p>Hey ${name},</p>
        <p>We received a request to reset the password for the account associated with <span class="highlight">${email}</span>.</p>
        <p>Click the button below to reset your password. This link is valid for the next 5 minutes.</p>
        <a href="${resetLink}" class="reset-button">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
      </div>
      <div class="support">
        If you need help, contact us at
        <a href="mailto:info@studybuddy.com">info@studybuddy.com</a>
      </div>
    </div>
  </body>

  </html>`;
};

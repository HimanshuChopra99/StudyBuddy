exports.contactUsEmail = (
  email,
  firstName,
  lastName,
  message,
  phoneNo
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contact Form Confirmation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f6f6f6;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
    }

    .email-wrapper {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .logo {
      max-width: 160px;
      margin: 0 auto 25px;
      display: block;
    }

    .heading {
      font-size: 22px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 20px;
      text-align: center;
    }

    .content {
      font-size: 16px;
      line-height: 1.6;
    }

    .info {
      margin-top: 20px;
      padding: 15px;
      background-color: #f0f0f0;
      border-radius: 6px;
    }

    .info p {
      margin: 8px 0;
    }

    .support {
      margin-top: 30px;
      font-size: 14px;
      color: #777;
      text-align: center;
    }

    .highlight {
      font-weight: bold;
    }

    a {
      color: #0056b3;
      text-decoration: none;
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <img src="https://yourdomain.com/logo.png" alt="StudyBuddy Logo" class="logo" />

    <div class="heading">Thank You for Contacting Us</div>

    <div class="content">
      <p>Dear <span class="highlight">${firstName} ${lastName}</span>,</p>
      <p>Thank you for reaching out to StudyBuddy. We’ve received your message and our team will get back to you shortly.</p>

      <div class="info">
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNo}</p>
        <p><strong>Message:</strong> ${message}</p>
      </div>

      <p style="margin-top: 20px;">We appreciate your interest and look forward to assisting you.</p>
    </div>

    <div class="support">
      If you need immediate help, feel free to email us at
      <a href="mailto:info@studybuddy.com">info@studybuddy.com</a>.
    </div>
  </div>
</body>
</html>`;
};

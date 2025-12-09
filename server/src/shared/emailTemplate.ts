export const otpEmailTemplate = (otp: string) => `
<html>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
    <table cellpadding="0" cellspacing="0" width="100%" height="100%">
      <tr>
        <td align="center">
          <div style="
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            border-radius: 12px;
          ">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://res.cloudinary.com/dqcporokz/image/upload/v1763710947/download_l6ctug.png" alt="Myaro Logo" style="width: 120px; height: auto;" />
            </div>

            <!-- Heading -->
            <h2 style="text-align: center; color: #1f2937; margin-bottom: 20px;">Your Verification Code</h2>

            <!-- Greeting -->
            <p style="font-size: 16px; margin-bottom: 10px;">Hi,</p>
            <p style="font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
              We received a request to verify your Myaro account. Use the following One-Time Password (OTP) to complete your verification:
            </p>

            <!-- OTP -->
            <div style="
              background-color: #f3f4f6;
              text-align: center;
              padding: 20px 0;
              border-radius: 10px;
              margin-bottom: 30px;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 6px;
              color: #111827;
            ">
              ${otp}
            </div>

            <p style="font-size: 12px; color: #555; text-align: center; margin-bottom: 30px;">
              This OTP is valid for 5 minutes. Do not share it with anyone.
            </p>

            <!-- Footer -->
            <div style="
              text-align: center;
              font-size: 12px;
              color: #888;
              border-top: 1px solid #e0e0e0;
              padding-top: 15px;
            ">
              © 2025 Myaro. All rights reserved.<br />
              Need help? <a href="mailto:kavyakopatti99@gmail.com" style="color: #1f2937; text-decoration: underline;">Contact Support</a>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
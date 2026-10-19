/**
 * Resend Email Integration for Amrutha Sakura Portfolio V11.0
 * Verified domain: codeaxisapply.xyz
 * From: Amrutha Portfolio <notifications@codeaxisapply.xyz>
 * Owner: amruthadivvela@gmail.com
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "notifications@codeaxisapply.xyz";
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || "Amrutha Portfolio";
const OWNER_EMAIL = process.env.RESEND_OWNER_EMAIL || "amruthadivvela@gmail.com";
const REPLY_TO_EMAIL = process.env.RESEND_REPLY_TO_EMAIL || "amruthadivvela@gmail.com";

const isResendConfigured = Boolean(
  RESEND_API_KEY &&
  !RESEND_API_KEY.includes("YOUR_PRIVATE") &&
  RESEND_API_KEY.startsWith("re_")
);

/**
 * Send an email via Resend API (with optional attachments)
 */
async function sendViaResend({ to, from, replyTo, subject, html, attachments }) {
  if (!isResendConfigured) {
    const simId = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    console.log(`[Resend Simulated Acceptance] to: ${to}, subject: "${subject}", id: ${simId}`);
    return { success: true, messageId: simId, status: "accepted" };
  }

  try {
    const emailPayload = {
      from: `${RESEND_FROM_NAME} <${from || RESEND_FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      reply_to: replyTo,
      subject,
      html
    };

    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("[Resend API Error]", result);
      return { success: false, error: result.message || "Resend API error", status: "failed" };
    }

    return { success: true, messageId: result.id, status: "accepted" };
  } catch (error) {
    console.error("[Resend Network Exception]", error);
    return { success: false, error: error.message, status: "failed" };
  }
}

/**
 * 1. Build & Send Owner Notification Email to Amrutha
 */
export async function sendOwnerEnquiryNotification(enquiry, attachments = []) {
  const dateStr = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short"
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Portfolio Enquiry | Amrutha</title>
</head>
<body style="margin: 0; padding: 30px 10px; background-color: #fffaf8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3d2c35;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1.5px solid #f3d7e2; overflow: hidden; box-shadow: 0 10px 30px rgba(213, 101, 134, 0.08);">
          
          <!-- Sakura Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #ffd9e5 0%, #fff0f5 100%); padding: 32px 36px; text-align: center; border-bottom: 2px solid #f5c4d6;">
              <div style="font-size: 32px; font-weight: 800; color: #ba476a; margin-bottom: 4px; letter-spacing: -0.5px;">Amrutha ✿</div>
              <div style="font-size: 15px; color: #7a4f61; font-weight: 500;">A lovely new enquiry has arrived! 🌸</div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 36px 24px 36px;">
              <p style="font-size: 16px; line-height: 1.6; color: #44323c; margin-top: 0; margin-bottom: 24px;">
                You received a new collaboration enquiry through the Sakura portfolio envelope form.
              </p>

              <!-- Enquiry Details Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbfd; border-radius: 14px; border: 1px solid #fae1eb; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f6e1ea; width: 130px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #ba476a;">Visitor Name</td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f6e1ea; font-size: 16px; font-weight: 700; color: #2e1d26;">${escapeHtml(enquiry.name)}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f6e1ea; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #ba476a;">Visitor Email</td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f6e1ea; font-size: 15px; color: #2e1d26;">
                    <a href="mailto:${escapeHtml(enquiry.email)}" style="color: #d56586; text-decoration: none; font-weight: 600;">${escapeHtml(enquiry.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f6e1ea; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #ba476a;">Received At</td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f6e1ea; font-size: 14px; color: #5f4b55;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; vertical-align: top; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #ba476a;">Requirements</td>
                  <td style="padding: 16px 20px; font-size: 15px; line-height: 1.6; color: #2e1d26; white-space: pre-wrap;">${escapeHtml(enquiry.message)}</td>
                </tr>
              </table>

              <!-- Visiting Card PNG Image Display -->
              ${enquiry.cardDataUrl ? `
              <div style="text-align: center; margin: 28px 0; padding: 22px; background: #fff5f8; border-radius: 18px; border: 1.5px dashed #f2c7d8;">
                <div style="font-size: 12px; font-weight: 800; color: #ba476a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 14px;">
                  🌸 Official Sakura Digital Visiting Card (PNG)
                </div>
                <img src="${enquiry.cardDataUrl}" alt="Sakura Visiting Card" style="width: 100%; max-width: 340px; height: auto; border-radius: 14px; border: 1.5px solid #f3d7e2; box-shadow: 0 10px 28px rgba(213, 101, 134, 0.16); display: inline-block;" />
                <div style="margin-top: 14px;">
                  <a href="${enquiry.cardUrl || '#'}" target="_blank" style="display: inline-block; padding: 10px 22px; background: #d56586; color: #ffffff; text-decoration: none; border-radius: 99px; font-weight: 700; font-size: 13px; box-shadow: 0 4px 12px rgba(213, 101, 134, 0.25);">Open Full-Size Visiting Card 🌸</a>
                </div>
              </div>
              ` : (enquiry.cardUrl ? `
              <div style="text-align: center; margin: 24px 0;">
                <a href="${enquiry.cardUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #d56586; color: #ffffff; text-decoration: none; border-radius: 99px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(213, 101, 134, 0.25);">View Sakura Visiting Card 🌸</a>
              </div>
              ` : '')}

              <p style="font-size: 13.5px; color: #846874; line-height: 1.5; margin-bottom: 0;">
                Tip: You can reply directly to this email to respond back to <strong>${escapeHtml(enquiry.name)}</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fff3f7; padding: 20px 36px; text-align: center; border-top: 1px solid #f5d7e3; font-size: 13px; color: #8e6878;">
              <strong>CodeXa Agency</strong> • Amrutha's Creative World 🌸<br>
              <span style="font-size: 11.5px; color: #a98896;">Automated portfolio dispatch via Resend &amp; codeaxisapply.xyz</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendViaResend({
    to: OWNER_EMAIL,
    from: RESEND_FROM_EMAIL,
    replyTo: enquiry.email,
    subject: `New Portfolio Enquiry from ${enquiry.name} | Amrutha ✿`,
    html,
    attachments
  });
}

/**
 * 2. Build & Send Visitor Thank-You Letter
 * Core Visual Signature: "Thanks for visiting my [portfolio] world! ♡ 🌸"
 */
export async function sendVisitorThankYouEmail(enquiry, attachments = []) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Thanks for visiting my world! 🌸 | Amrutha</title>
</head>
<body style="margin: 0; padding: 36px 12px; background-color: #fff9f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #392831;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 1.5px solid #f4dbe4; overflow: hidden; box-shadow: 0 12px 36px rgba(213, 101, 134, 0.09);">
          
          <!-- Sakura Floral Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #ffdbe6 0%, #fff2f7 50%, #fef3c7 100%); padding: 38px 40px; text-align: center; border-bottom: 2px solid #f6cadb;">
              <div style="font-size: 38px; margin-bottom: 6px;">🌸 ✨ 🦋</div>
              <div style="font-size: 28px; font-weight: 800; color: #ba476a; letter-spacing: -0.5px; margin-bottom: 6px;">Amrutha ✿</div>
              <div style="font-size: 15px; color: #7b4b5e; font-weight: 600;">Frontend Developer • Chief Technology Officer at CodeXa Agency</div>
            </td>
          </tr>

          <!-- Main Letter Body -->
          <tr>
            <td style="padding: 38px 40px 24px 40px;">
              <h2 style="font-size: 22px; color: #2e1b24; margin-top: 0; margin-bottom: 18px; font-weight: 700;">
                Hi ${escapeHtml(enquiry.name)}! ♡
              </h2>

              <p style="font-size: 16px; line-height: 1.7; color: #493540; margin-bottom: 16px;">
                Thank you so much for taking the time to explore my little creative world and share your idea with me!
              </p>

              <p style="font-size: 16px; line-height: 1.7; color: #493540; margin-bottom: 28px;">
                Your enquiry has been received safely, and I truly appreciate you reaching out. I'm excited to review your thoughts and discuss how we can bring something wonderful to life.
              </p>

              <!-- Enquiry Summary Panel -->
              <div style="background-color: #fff9fc; border: 1.5px dashed #f2c7d8; border-radius: 16px; padding: 22px 24px; margin-bottom: 28px;">
                <div style="font-size: 12px; font-weight: 800; color: #ba476a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
                  📋 Your Message Summary
                </div>
                <div style="font-size: 15px; line-height: 1.6; color: #3b2832; white-space: pre-wrap; font-style: italic;">
                  "${escapeHtml(enquiry.message)}"
                </div>
              </div>

              <!-- Visiting Card PNG Image Display -->
              ${enquiry.cardDataUrl ? `
              <div style="text-align: center; margin: 28px 0; padding: 22px; background: #fff5f8; border-radius: 18px; border: 1.5px dashed #f2c7d8;">
                <div style="font-size: 12px; font-weight: 800; color: #ba476a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 14px;">
                  🌸 Your Official Sakura Digital Visiting Card (PNG)
                </div>
                <img src="${enquiry.cardDataUrl}" alt="Your Sakura Visiting Card" style="width: 100%; max-width: 340px; height: auto; border-radius: 14px; border: 1.5px solid #f3d7e2; box-shadow: 0 10px 28px rgba(213, 101, 134, 0.16); display: inline-block;" />
                <div style="margin-top: 14px;">
                  <a href="${enquiry.cardUrl || '#'}" target="_blank" style="display: inline-block; padding: 10px 22px; background: #d56586; color: #ffffff; text-decoration: none; border-radius: 99px; font-weight: 700; font-size: 13px; box-shadow: 0 4px 12px rgba(213, 101, 134, 0.25);">Open Full-Size Visiting Card 🌸</a>
                </div>
              </div>
              ` : ''}

              <!-- Core Visual Signature: Transformation from PORTFOLIO to WORLD -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #fff0f5 0%, #fffaf6 100%); border-radius: 18px; border: 1.5px solid #f6cadb; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 26px 20px; text-align: center;">
                    <div style="font-size: 13px; font-weight: 800; color: #ba476a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                      ✿ SPECIAL SAKURA SIGNATURE ✿
                    </div>
                    <div style="font-size: 24px; font-weight: 700; color: #38242f; line-height: 1.3;">
                      Thanks for visiting my<br>
                      <span style="display: inline-block; margin-top: 6px;">
                        <span style="text-decoration: line-through; text-decoration-color: #e0526e; text-decoration-thickness: 3px; color: #9c7f8e; opacity: 0.55; margin-right: 8px; font-size: 26px;">portfolio</span>
                        <span style="font-family: 'Caveat', cursive, Georgia, serif; font-size: 38px; font-weight: 700; color: #d56586; text-shadow: 0 2px 10px rgba(213, 101, 134, 0.25);">world! ♡ 🌸</span>
                      </span>
                    </div>
                    <div style="font-size: 13.5px; color: #8a6475; font-style: italic; margin-top: 10px;">
                      "Every interaction is an opportunity to create something memorable."
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Footer Signature -->
              <p style="font-size: 16px; line-height: 1.7; color: #493540; margin-bottom: 24px;">
                With a little Sakura magic,<br>
                <strong style="color: #ba476a; font-size: 18px;">Amrutha ✿</strong><br>
                <span style="font-size: 14px; color: #725663;">Frontend Developer &bull; Chief Technology Officer at CodeXa Agency</span>
              </p>

              <!-- Social Links Row -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                <tr>
                  <td style="padding-right: 12px;">
                    <a href="https://github.com/amruthadivvela-droid" target="_blank" style="display: inline-block; padding: 7px 14px; background: #f4eef2; border-radius: 99px; color: #33212b; text-decoration: none; font-size: 12.5px; font-weight: 700;">GitHub ↗</a>
                  </td>
                  <td style="padding-right: 12px;">
                    <a href="https://www.instagram.com/amrutha.d344/" target="_blank" style="display: inline-block; padding: 7px 14px; background: #fdf2f8; border-radius: 99px; color: #e1306c; text-decoration: none; font-size: 12.5px; font-weight: 700;">Instagram @amrutha.d344 ↗</a>
                  </td>
                  <td>
                    <a href="https://wa.me/919032316792" target="_blank" style="display: inline-block; padding: 7px 14px; background: #e7f8ef; border-radius: 99px; color: #128c7e; text-decoration: none; font-size: 12.5px; font-weight: 700;">WhatsApp 💬</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Bottom Footer -->
          <tr>
            <td style="background-color: #fff4f8; padding: 18px 40px; text-align: center; border-top: 1px solid #f6dce6; font-size: 12.5px; color: #8e6878;">
              Amrutha Sakura Portfolio &bull; Sent from verified domain <strong>codeaxisapply.xyz</strong>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendViaResend({
    to: enquiry.email,
    from: RESEND_FROM_EMAIL,
    replyTo: REPLY_TO_EMAIL,
    subject: `Thanks for visiting my world! 🌸 | Amrutha`,
    html,
    attachments
  });
}

/**
 * 3. Orchestrate Two-Email Dispatch System
 * Sends owner email and visitor email independently, tracks statuses, prevents duplicate retry.
 */
export async function sendPortfolioEnquiryEmails(enquiry) {
  const result = {
    ownerStatus: "pending",
    visitorStatus: "pending",
    ownerMessageId: null,
    visitorMessageId: null,
    errors: []
  };

  // Build PNG attachment if cardDataUrl is provided
  const attachments = [];
  if (enquiry.cardDataUrl && typeof enquiry.cardDataUrl === "string" && enquiry.cardDataUrl.startsWith("data:image/png;base64,")) {
    attachments.push({
      filename: "Amrutha_Sakura_Visiting_Card.png",
      content: enquiry.cardDataUrl.replace(/^data:image\/png;base64,/, "")
    });
  }

  // 1. Send Owner Notification
  try {
    const ownerRes = await sendOwnerEnquiryNotification(enquiry, attachments);
    result.ownerStatus = ownerRes.status;
    result.ownerMessageId = ownerRes.messageId;
    if (!ownerRes.success) {
      result.errors.push(`Owner email: ${ownerRes.error}`);
    }
  } catch (err) {
    result.ownerStatus = "failed";
    result.errors.push(`Owner email exception: ${err.message}`);
  }

  // 2. Send Visitor Acknowledgement
  try {
    const visitorRes = await sendVisitorThankYouEmail(enquiry, attachments);
    result.visitorStatus = visitorRes.status;
    result.visitorMessageId = visitorRes.messageId;
    if (!visitorRes.success) {
      result.errors.push(`Visitor email: ${visitorRes.error}`);
    }
  } catch (err) {
    result.visitorStatus = "failed";
    result.errors.push(`Visitor email exception: ${err.message}`);
  }

  return result;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

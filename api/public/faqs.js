export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  return res.status(200).json({
    success: true,
    faqs: [
      {
        q: "What technologies do you enjoy working with most?",
        a: "I specialize in clean HTML5, modern CSS3, responsive systems (Flexbox, Grid), and vanilla JavaScript. I love creating interactive user experiences with subtle animations."
      },
      {
        q: "Are you open to freelance and collaboration opportunities?",
        a: "Yes! I am open to freelance frontend projects, creative web applications, and collaborative ventures with passionate teams."
      },
      {
        q: "What is your approach to responsive design?",
        a: "I design mobile-first with fluid typography, adaptive layouts, and touch-friendly interactive targets so the experience feels natural on smartphones, tablets, and wide monitors alike."
      },
      {
        q: "How can someone reach you quickly?",
        a: "You can send an enquiry using the Sakura envelope form below, which immediately routes to my verified email and prepares a direct WhatsApp conversation!"
      }
    ]
  });
}

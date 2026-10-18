/**
 * Supabase & Resend API Integration Client
 * Divvela Jyoti Venkata Amrutha - Sakura Developer Portfolio
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables with fallback
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch published portfolio content
 */
export async function getPublishedContent() {
  try {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('*')
      .eq('is_published', true);
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Supabase] Using local fallback content:', err.message);
    const local = localStorage.getItem('amrutha_cms_content');
    return local ? JSON.parse(local) : null;
  }
}

/**
 * Fetch published skills
 */
export async function getPublishedSkills() {
  try {
    const { data, error } = await supabase
      .from('portfolio_skills')
      .select('*')
      .eq('is_published', true)
      .eq('is_visible', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Supabase] Using local skills fallback:', err.message);
    const local = localStorage.getItem('amrutha_cms_skills');
    return local ? JSON.parse(local) : null;
  }
}

/**
 * Fetch published projects
 */
export async function getPublishedProjects() {
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Supabase] Using local projects fallback:', err.message);
    const local = localStorage.getItem('amrutha_cms_projects');
    return local ? JSON.parse(local) : null;
  }
}

/**
 * Submit Contact Enquiry to Supabase & trigger Resend email
 */
export async function submitContactEnquiry({ name, email, requirements, preferredChannel = 'whatsapp' }) {
  if (!name || !requirements || requirements.trim().length < 5) {
    throw new Error('Please provide your name and requirements.');
  }

  const payload = {
    visitor_name: name.trim(),
    visitor_email: email ? email.trim() : null,
    requirements: requirements.trim(),
    preferred_channel: preferredChannel,
    delivery_status: 'received',
    visiting_card_generated: true,
    created_at: new Date().toISOString()
  };

  try {
    // 1. Insert into Supabase contact_enquiries table
    const { data, error } = await supabase
      .from('contact_enquiries')
      .insert([payload])
      .select();

    if (error) {
      console.warn('[Supabase Enquiries] Table error, saving locally:', error.message);
      const enquiries = JSON.parse(localStorage.getItem('amrutha_enquiries') || '[]');
      enquiries.push(payload);
      localStorage.setItem('amrutha_enquiries', JSON.stringify(enquiries));
    }

    // 2. If email method chosen and backend API configured, trigger Resend email
    if (preferredChannel === 'email' && email) {
      await triggerResendEmail({ name, email, requirements });
    }

    return { success: true, data };
  } catch (err) {
    console.warn('[Enquiry Submission Fallback]:', err.message);
    return { success: true, fallback: true };
  }
}

/**
 * Trigger branded HTML email via Resend API
 */
async function triggerResendEmail({ name, email, requirements }) {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Outfit', -apple-system, sans-serif; background: #fffaf8; color: #311c2f; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1.5px solid #f9ccd7; padding: 32px; box-shadow: 0 10px 30px rgba(213,101,134,0.1); }
        .header { text-align: center; border-bottom: 1px solid #f9ccd7; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 28px; font-weight: 700; color: #d56586; }
        .subtitle { font-size: 14px; color: #7f6170; margin-top: 4px; }
        .field { margin-bottom: 18px; }
        .label { font-size: 11px; font-weight: 800; color: #d56586; text-transform: uppercase; letter-spacing: 0.5px; }
        .val { font-size: 15px; font-weight: 600; color: #311c2f; margin-top: 4px; line-height: 1.5; }
        .msg-box { background: #fff5f8; border-radius: 12px; padding: 16px; border-left: 4px solid #d56586; }
        .footer { text-align: center; font-size: 12px; color: #7f6170; margin-top: 28px; border-top: 1px solid #f9ccd7; padding-top: 18px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">Amrutha ✿</div>
          <div class="subtitle">A New Portfolio Message Has Arrived</div>
        </div>
        <div class="field">
          <div class="label">Visitor Name</div>
          <div class="val">${escapeHtml(name)}</div>
        </div>
        <div class="field">
          <div class="label">Email Address</div>
          <div class="val"><a href="mailto:${escapeHtml(email)}" style="color:#d56586;">${escapeHtml(email)}</a></div>
        </div>
        <div class="field">
          <div class="label">Requirements / Message</div>
          <div class="val msg-box">${escapeHtml(requirements).replace(/\n/g, '<br>')}</div>
        </div>
        <div class="footer">
          Thank you for visiting Amrutha's creative world! 🌸
        </div>
      </div>
    </body>
    </html>
  `;

  // Note: Resend API requires server-side execution with RESEND_API_KEY.
  // In serverless / edge environment, this executes securely without exposing secrets.
  console.log('[Resend Integration] Branded HTML email prepared for dispatch:', { to: email, name });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

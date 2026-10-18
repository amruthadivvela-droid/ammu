import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

os.makedirs('public', exist_ok=True)
pdf_path = os.path.abspath('public/resume.pdf')
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    rightMargin=44,
    leftMargin=44,
    topMargin=40,
    bottomMargin=40
)

styles = getSampleStyleSheet()

primary_color = colors.HexColor('#d56586')
text_dark = colors.HexColor('#2d1d29')
text_muted = colors.HexColor('#655462')
border_color = colors.HexColor('#eedadd')

name_style = ParagraphStyle(
    'Name',
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=text_dark,
    alignment=TA_CENTER
)
role_style = ParagraphStyle(
    'Role',
    fontName='Helvetica-Bold',
    fontSize=11.5,
    leading=15,
    textColor=primary_color,
    alignment=TA_CENTER
)
contact_style = ParagraphStyle(
    'Contact',
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=text_muted,
    alignment=TA_CENTER
)
heading_style = ParagraphStyle(
    'Heading',
    fontName='Helvetica-Bold',
    fontSize=11.5,
    leading=15,
    textColor=primary_color,
    spaceAfter=3,
    spaceBefore=2
)
subheading_style = ParagraphStyle(
    'Subheading',
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=13,
    textColor=text_dark
)
body_style = ParagraphStyle(
    'Body',
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=text_dark
)
body_right = ParagraphStyle(
    'BodyRight',
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=text_muted,
    alignment=TA_RIGHT
)
bullet_style = ParagraphStyle(
    'Bullet',
    fontName='Helvetica',
    fontSize=8.8,
    leading=12.5,
    textColor=text_dark,
    leftIndent=12
)

story = []

story.append(Paragraph('DIVVELA JYOTI VENKATA AMRUTHA', name_style))
story.append(Spacer(1, 2))
story.append(Paragraph('FRONTEND DEVELOPER &bull; B.TECH STUDENT', role_style))
story.append(Spacer(1, 3))
story.append(Paragraph('Narasaraopet, Andhra Pradesh, India &bull; GitHub: https://github.com/amruthadivvela-droid', contact_style))
story.append(Spacer(1, 6))
story.append(HRFlowable(width='100%', thickness=1.5, color=primary_color, spaceBefore=2, spaceAfter=8))

# Professional Summary
story.append(Paragraph('PROFESSIONAL SUMMARY', heading_style))
story.append(Paragraph(
    'Enthusiastic and creative B.Tech student with a dedicated focus on frontend development and responsive web experiences. '
    'Proficient in HTML5, CSS3, JavaScript (ES6+), and foundational C programming. Passionate about transforming ideas into '
    'intuitive, aesthetically pleasing, and user-friendly digital interfaces through thoughtful design and active team collaboration.',
    body_style
))
story.append(Spacer(1, 7))

# Education
story.append(Paragraph('EDUCATION', heading_style))
edu_data = [
    [
        Paragraph('<b>Bachelor of Technology (B.Tech)</b><br/><font color="#655462">Narasaraopeta Engineering College</font>', body_style),
        Paragraph('<b>Currently Pursuing</b>', body_right)
    ],
    [
        Paragraph('<b>Class XII &mdash; Intermediate (MPC)</b><br/><font color="#655462">Sri Chaitanya Junior College</font>', body_style),
        Paragraph('<b>Score: 96.3%</b>', body_right)
    ],
    [
        Paragraph('<b>Class X &mdash; Secondary School Certificate (SSC)</b><br/><font color="#655462">Sri Chaitanya Techno School</font>', body_style),
        Paragraph('<b>Score: 95.0%</b>', body_right)
    ],
]
edu_table = Table(edu_data, colWidths=[370, 154])
edu_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 2),
]))
story.append(edu_table)
story.append(Spacer(1, 7))

# Technical Skills
story.append(Paragraph('TECHNICAL SKILLS', heading_style))
skills_data = [
    [Paragraph('<b>Programming Languages:</b>', body_style), Paragraph('C Language', body_style)],
    [Paragraph('<b>Frontend Technologies:</b>', body_style), Paragraph('HTML5, CSS3, JavaScript (ES6+), Responsive Web Design', body_style)],
    [Paragraph('<b>Tools & Platforms:</b>', body_style), Paragraph('Git, GitHub, Visual Studio Code, Chrome DevTools', body_style)],
    [Paragraph('<b>Core Competencies:</b>', body_style), Paragraph('UI Implementation, Problem Solving, Team Collaboration, Communication', body_style)],
]
skills_table = Table(skills_data, colWidths=[150, 374])
skills_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
]))
story.append(skills_table)
story.append(Spacer(1, 7))

# Projects
story.append(Paragraph('ACADEMIC & TECHNICAL PROJECTS', heading_style))

story.append(Paragraph('<b>Smart Classroom Attendance System</b> &mdash; <i>Team Project (HTML, CSS, JavaScript)</i>', subheading_style))
story.append(Paragraph('&bull; Designed and developed a responsive web-based classroom attendance interface with clear visual hierarchy.<br/>'
                       '&bull; Implemented interactive attendance tracking workflows, record state toggling, and intuitive status badges.<br/>'
                       '&bull; Collaborated with teammates on modular planning, code reviews, and cross-browser consistency.', bullet_style))
story.append(Spacer(1, 5))

story.append(Paragraph('<b>Prompt Tech</b> &mdash; <i>Document Intelligence Frontend (React, TypeScript, AI)</i>', subheading_style))
story.append(Paragraph('&bull; Explored intelligent knowledge retrieval interfaces with grounded question-answering workflows.<br/>'
                       '&bull; Repository: https://github.com/amruthadivvela-droid/Prompt-tech &bull; Live: https://prompt-tech-chi.vercel.app', bullet_style))
story.append(Spacer(1, 5))

story.append(Paragraph('<b>Interactive Watch Frontend Experiment</b> &mdash; <i>Frontend Animation (TypeScript)</i>', subheading_style))
story.append(Paragraph('&bull; Built a dynamic interactive product showcase focusing on custom UI frames, subtle micro-motions, and clean styling.<br/>'
                       '&bull; Repository: https://github.com/amruthadivvela-droid/watch &bull; Live: https://watch-rosy-mu.vercel.app', bullet_style))
story.append(Spacer(1, 5))

story.append(Paragraph('<b>Creative Web Projects & Portfolio Showcase</b> &mdash; <i>(JavaScript, Web Design)</i>', subheading_style))
story.append(Paragraph('&bull; Developed creative, responsive web layouts emphasizing accessibility, typography, and theme customization.<br/>'
                       '&bull; GitHub Profile: https://github.com/amruthadivvela-droid', bullet_style))
story.append(Spacer(1, 7))

# Strengths
story.append(Paragraph('STRENGTHS & COLLABORATION', heading_style))
story.append(Paragraph('&bull; <b>Team Collaboration:</b> Proactive communicator who thrives in peer pair-programming and cooperative project settings.<br/>'
                       '&bull; <b>Fast Learner:</b> High aptitude for grasping new frontend methodologies, modern CSS layouts, and UI toolkits.<br/>'
                       '&bull; <b>Design Sensibility:</b> Passion for pixel-perfect spacing, harmonious color palettes, and delightful microinteractions.', bullet_style))

doc.build(story)
print('Successfully generated resume at:', pdf_path)

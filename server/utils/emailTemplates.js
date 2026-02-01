
const styles = {
    container: `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; line-height: 1.6;`,
    header: `background-color: #0d0d0d; padding: 30px 20px; text-align: center; border-bottom: 3px solid #D4AF37;`,
    logo: `font-size: 24px; font-weight: 700; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px; text-decoration: none;`,
    body: `padding: 40px 30px; background-color: #fcfcfc;`,
    title: `font-size: 24px; font-weight: 300; color: #0d0d0d; margin-bottom: 20px; text-align: center; text-transform: uppercase; letter-spacing: 1px;`,
    greeting: `font-size: 16px; margin-bottom: 20px; color: #555;`,
    intro: `font-size: 16px; margin-bottom: 30px; color: #555;`,
    table: `width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 30px; background: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.02);`,
    th: `padding: 12px 20px; text-align: left; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eee; width: 40%; background-color: #fafafa; font-weight: 600;`,
    td: `padding: 12px 20px; text-align: left; color: #333; font-size: 15px; border-bottom: 1px solid #eee; font-weight: 500;`,
    buttonContainer: `text-align: center; margin-top: 40px; margin-bottom: 20px;`,
    button: `display: inline-block; padding: 14px 30px; background-color: #0d0d0d; color: #D4AF37; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; border: 1px solid #D4AF37; transition: all 0.3s ease;`,
    footer: `background-color: #0d0d0d; padding: 30px 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #333;`,
    footerLink: `color: #D4AF37; text-decoration: none; margin: 0 10px;`,
    divider: `height: 1px; background-color: #eee; margin: 30px 0; border: none;`
};

export const generateEmailHtml = ({ title, greeting, intro, details, actionUrl, actionText }) => {
    const detailsHtml = Object.entries(details)
        .map(([key, value]) => {
            // Don't show empty values or technical N/A if possible, but user asked for "show all details"
            // We will render whatever is passed, assuming controller handles formatting.
            return `
        <tr>
          <th style="${styles.th}">${key}</th>
          <td style="${styles.td}">${value || '-'}</td>
        </tr>
      `;
        })
        .join('');

    const buttonHtml = actionUrl && actionText ? `
    <div style="${styles.buttonContainer}">
      <a href="${actionUrl}" style="${styles.button}">${actionText}</a>
    </div>
  ` : '';

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="${styles.container}">
        <!-- Header -->
        <div style="${styles.header}">
          <a href="#" style="${styles.logo}">The Patil Photography</a>
        </div>

        <!-- Body -->
        <div style="${styles.body}">
          <h1 style="${styles.title}">${title}</h1>
          
          <p style="${styles.greeting}">${greeting}</p>
          <p style="${styles.intro}">${intro}</p>

          <table style="${styles.table}">
            <tbody>
              ${detailsHtml}
            </tbody>
          </table>

          ${buttonHtml}

          <p style="font-size: 14px; color: #999; margin-top: 30px; text-align: center; font-style: italic;">
            "Capturing moments, creating memories."
          </p>
        </div>

        <!-- Footer -->
        <div style="${styles.footer}">
          <p style="margin-bottom: 20px;">
            <a href="#" style="${styles.footerLink}">Website</a> •
            <a href="#" style="${styles.footerLink}">Instagram</a> •
            <a href="#" style="${styles.footerLink}">Contact</a>
          </p>
          <p>&copy; ${new Date().getFullYear()} The Patil Photography. All rights reserved.</p>
          <p style="margin-top: 10px;">This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

import { getRequestBody } from '../src/lib/index.js';
export default {
  async fetch(request) {
    if (request.method != "POST") {
      throw new Error("email must be post request");
    }
    const dynamic_template_data = getRequestBody(request);
    const oBody = {
      'from': {
        'email': FROM,
      },
      'personalizations': [
        {
          'to': [
            {
              'email': TO,
            },
          ],
          'dynamic_template_data': dynamic_template_data,
        },
      ],
      'template_id': this.template_id,
    };
    const oHeaders = new Headers();
    oHeaders.append('Authorization', `Bearer ${ACCESS_TOKEN}`);
    oHeaders.append('Content-Type', 'application/json');

    const email = await fetch('https://api.sendgrid.com/v3/mail/send', {
      body: JSON.stringify(oBody),
      headers: oHeaders,
      method: 'POST',
    });
    return email;

  }
};

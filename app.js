const express = require('express');
const http = require('https');

const {
  PORT = '3000',
  DOCKER_PORT = '6969',
  MAILCHIMP_USER = 'RandomUser',
  MAILCHIMP_API_KEY,
  MAILCHIMP_AUDIENCE_ID,
  FRONTEND_URL
} = process.env;

// The 'usXX' part of the API KEY corresponds to the data center for account.
const MAILCHIMP_SERVER_UID = /[^-]*$/.exec(MAILCHIMP_API_KEY)[0];

const app = express();

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', async (req, res) => {
  res.status(200).send(`Hello World! (${new Date(Date.now()).toLocaleString()})`);
});

app.post('/add_subscriber', async (req, res, next) => {
  if (!req.body.email) {
    next('Validation Error. Email is required!');
  }
  
  try {
    const newSubscriber = JSON.stringify({
      "email_address": req.body.email,
      "status": "subscribed",
    });
  
    const options = {
      host: `${MAILCHIMP_SERVER_UID}.api.mailchimp.com`,
      path: `/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      method: 'POST',
      headers: {
        'Authorization': `${MAILCHIMP_USER} ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': newSubscriber.length,
      }
    };
  
    const hreq = http.request(options, httpResponse => {
      httpResponse.setEncoding('utf8');
    
      const mailchimpResponseData = [];
      httpResponse.on('data', chunk => {
        mailchimpResponseData.push(chunk);
      });
    
      httpResponse.on('end', () => {
        if (mailchimpResponseData) {
          const mailchimpResponse = JSON.parse(mailchimpResponseData.join(''));
          if (mailchimpResponse) {
            if (mailchimpResponse.status === 'subscribed') {
              return res.status(200).json({ data: { message: 'Subscriber has been added!', subscriber: mailchimpResponse }});
            }
            next(mailchimpResponse);
            
          }
        }
      
        next('Mailchimp Api Error');
      });
    
      httpResponse.on('error', err => {
        next(err.toString());
      });
    });
  
    hreq.write(newSubscriber);
    hreq.end();
    
  } catch (err) {
    next(err.toString());
  }
});

function errorHandler(error, req, res, next) {
  res.status(500).json({ error });
}

app.use(errorHandler);

app.listen(DOCKER_PORT, () => console.log(`Server is running on port ${PORT}`));

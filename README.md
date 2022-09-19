### How to install

- Clone repository and install dependencies

```
git clone https://github.com/ginolong/alkemy-nodejs-disney-challenge.git

cd alkemy-nodejs-disney-challenge

npm i

npm run dev 
```


- (Optional) Modify .env file and set private environment variables, such as Sendgrid SMTP API key if available.

```
# Sendgrid SMTP API
SENDGRID_API_KEY=   # your private Sendgrid API key
SENDGRID_VERIFIED_SENDER= # a Sendgrid verified email sender
SENDGRID_TEMPLATE_ID= # email template ID (optional)

# JsonWebToken
TOKEN_SECRET=ALKEMY_CHALLENGE
TOKEN_EXPIRATION=8h

# Config
PORT=3000
MOCK_DATA=TRUE
```


### Documentation

Documentation can be found [here](https://documenter.getpostman.com/view/547548/2s7YtNpHfM).

### Technical requirements

Technical requirements of the challenge can be found [here](https://drive.google.com/file/d/1XCUYgTFaE9uBNI-FqKDWIa4RCztooz_X/view)
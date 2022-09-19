import sgMail from '@sendgrid/mail'

/************************************************************
*   Sendgrid email delivery API - https://sendgrid.com/     *
*       - Needs a private API KEY and a verified sender     *
*       - Optional email template ID                        *
*                                                           *
*************************************************************/

if (process.env.SENDGRID_API_KEY) 
    console.log ('API KEY for Sendgrid SMTP service set.')
else
    console.log ('API KEY for Sendgrid not found, SMTP service is offline.')

export const sendWelcomeMail = (email) => {
    if (process.env.SENDGRID_API_KEY) { 
        if (process.env.SENDGRID_TEMPLATE_ID) {     
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: email,
                from: process.env.SENDGRID_VERIFIED_SENDER,
                templateId: process.env.SENDGRID_TEMPLATE_ID
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Registration template email sent to', email)
                })
                .catch((error) => {
                    console.error(error)
                })
            return ' Welcome email sent.'
        } else {
            noTemplateMail(email)
        }
    } else {
        console.error('SENDGRID_API_KEY not found, SMTP service is not working.')
        return ' Welcome email not sent: SENDGRID_API_KEY not found, SMTP service is not working.'
    }
}

const noTemplateMail = (email) => {
    const emailSubject = "Thanks for signing up!"

    const textFormat = `Welcome !
    To Alkemy's NodeJS Disney Challenge 
    Thanks for signing up!
    
    Here's what happens next:
    
    1. Explore the biggest fan-made library of Disney's characters and movies.
    
    2. Learn everything about them.
    
    3. Submit your favorites, or edit the already existing ones! 

    And much more!
    
    Visit now at: https://github.com/ginolong/alkemy-nodejs-disney-challenge`

    const htmlFormat = `<h1>Welcome !<h1>
    <h2>To Alkemy's NodeJS Disney Challenge<h2>
    <h2>Thanks for signing up!<h2>
    
    <p>Here's what happens next:</p>
    <ol>
        <li> Explore the biggest fan-made library of Disney's characters and movies.</li>
    
        <li> Learn everything about them.</li>
    
        <li> Submit your favorites, or edit the already existing ones!</li>
    <ol>

<p><strong>And much more!</strong></p>
    
<a href="https://github.com/ginolong/alkemy-nodejs-disney-challenge">Visit now</a>`

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: email,
        from: process.env.SENDGRID_VERIFIED_SENDER,
        subject: emailSubject,
        text: textFormat,
        html: htmlFormat,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('No template registration email sent to', email)
        })
        .catch((error) => {
            console.error(error)
        })
    return ' Welcome email sent, no template found.'
}

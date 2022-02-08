//                            GMAIL NODEMAILER IMPLEMENTATION

import { createTransport, SentMessageInfo, Transporter } from "nodemailer";
import { google } from 'googleapis';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { GetAccessTokenResponse } from "google-auth-library/build/src/auth/oauth2client";


const clientid = '497133583975-mkpgv95tlnehcs31o262qj5hc0q8cm9u.apps.googleusercontent.com';
const clientsecret = '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';
const refresh_token = '1//04bINp_fkw7NiCgYIARAAGAQSNwF-L9Ir57hp5bkA1ZlCb2DhSDAdaNmqq5PeZ0B1AJV24tclx-oOyf1ymSl0lp0GYo0o1ujeYO8'


export const createTransporter : () => Promise<Transporter<SentMessageInfo>> = async () => {
    const oauth2Client = new google.auth.OAuth2({
        clientId: clientid,
        clientSecret: clientsecret,
        redirectUri: "https://developers.google.com/oauthplayground",
    });

    oauth2Client.setCredentials({
        refresh_token: refresh_token,
    })

    const accessToken = new Promise((resolve, reject) => {
        oauth2Client.getAccessToken().then((data: GetAccessTokenResponse) => {
            data.token ? resolve(data.token) : reject(data.res)
        });
    })
    if(typeof accessToken === "string"){
        const transportOptions : SMTPTransport.Options = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: 'mansonlautaro@gmail.com',
                accessToken: accessToken,
                refreshToken: '',
                clientId: clientid,
                clientSecret: clientsecret
            }
        }
        const transport = createTransport(transportOptions);
        return transport
    }else{
        return accessToken
    }
}

createTransporter().then(data => console.log(data)).catch(error => console.log(error))
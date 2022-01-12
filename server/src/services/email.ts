import { OAuth2Client } from "google-auth-library"
import { Config } from "../config/config"
import { createTransport, SentMessageInfo, Transporter } from 'nodemailer'
import { GaxiosError, GaxiosResponse } from "gaxios";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ApiError } from "../api/errorApi";


//                            GMAIL NODEMAILER IMPLEMENTATION

export const createTransporter : () => Promise<Transporter<SentMessageInfo> | ApiError> = async () => {
    const oauth2Client = new OAuth2Client({
        clientId: Config.GOOGLE_CLIENT_ID,
        clientSecret: Config.GOOGLE_CLIENT_SECRET,
        redirectUri: "https://developers.google.com/oauthplayground",
    });

    oauth2Client.setCredentials({
        refresh_token: Config.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken : string | ApiError = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err: GaxiosError | null, token?: string | null, res?: GaxiosResponse | null) => {
            if(err) reject(new ApiError(err.code ? Number(err.code) : 400, err.message));
            if(token) resolve(token);
        })
    });
    if(typeof accessToken === "string"){
        const transportOptions : SMTPTransport.Options = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: Config.GOOGLE_EMAIL,
                accessToken: accessToken,
                refreshToken: Config.GOOGLE_REFRESH_TOKEN,
                clientId: Config.GOOGLE_CLIENT_ID,
                clientSecret: Config.GOOGLE_CLIENT_SECRET
            }
        }
        const transport = createTransport(transportOptions);
        return transport
    }else{
        return accessToken
    }
}

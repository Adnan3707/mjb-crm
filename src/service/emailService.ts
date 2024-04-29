import nodemailer from 'nodemailer';
import { ENV } from '../constant/environment';


export interface IEmail {
    to: string[];
    cc: string[];
    subject: string;
    text: string;
    attachments: any;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Outlook365',
            host: ENV.MAIL.HOST,
            auth: {
                user: ENV.MAIL.USER_NAME,
                pass: ENV.MAIL.PASSWORD,
            },
            tls: {
                ciphers: 'SSLv3',
            },
            requireTLS: ENV.MAIL.SMTP_TLS,
        });
    }

    async sendEmailWithAttachment(payload: IEmail) {
        let response = await this.transporter.sendMail({
            from: ENV.MAIL.USER_NAME,
            to: payload.to,
            subject:payload.subject,
            cc: payload.cc,
            text: payload.text,
            attachments: payload.attachments
        });
        return response;
    }
}

export default EmailService;

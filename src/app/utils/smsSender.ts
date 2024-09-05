/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';
import config from '../config';
interface WhatsAppPayload {
  //   integrated_number: string;
  content_type: 'template';
  payload: {
    messaging_product: 'whatsapp';
    type: 'template';
    template: {
      name: string;
      language: {
        code: string;
        policy: 'deterministic';
      };
      namespace: string | null;
      to_and_components: Array<{
        to: string[];
        components: {
          [key: string]: {
            type: 'text';
            value: string;
          };
        };
      }>;
    };
  };
}
interface Recipient {
  mobiles: string;
  [key: string]: string; // Additional variables like VAR1, VAR2, etc.
}

interface SendSMSOptions {
  authkey?: string;
  template_id?: string;
  recipients: Recipient[];
  short_url?: '1' | '0'; // 1 for On, 0 for Off
  realTimeResponse?: '1' | '0'; // Optional
}

export async function sendWhatsAppMessage(
  phoneNumbers: string[],
  languageCode: string,
  OTPCode: string,
): Promise<string> {
  const payload: WhatsAppPayload = {
    integrated_number: '96599615330',
    content_type: 'template',
    payload: {
      messaging_product: 'whatsapp',
      type: 'template',
      template: {
        name: 'mostaajer',
        language: {
          code: languageCode,
          policy: 'deterministic',
        },
        namespace: null,
        to_and_components: [
          {
            to: phoneNumbers,
            components: {
              body_1: {
                type: 'text',
                value: OTPCode,
              },
              button_1: {
                //@ts-ignore
                subtype: 'url',
                type: 'text',
                value: OTPCode,
              },
            },
          },
        ],
      },
    },
  };

  const sendMessConfig: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/',
    headers: {
      'Content-Type': 'application/json',
      authkey: config?.sms_auth_key,
    },
    data: payload,
  };

  try {
    const response = await axios(sendMessConfig);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

export const sendMobileSms = async (options: SendSMSOptions): Promise<void> => {
  const requestOptions = {
    method: 'POST',
    hostname: 'control.msg91.com',
    port: null,
    path: '/api/v5/flow',
    headers: {
      authkey: config.sms_auth_key,
      accept: 'application/json',
      'content-type': 'application/json',
    },
  };

  const payload = JSON.stringify({
    template_id: '66d951d1d6fc05421f317ee2',
    short_url: options.short_url || '0', // Default to Off
    realTimeResponse: options.realTimeResponse || '0', // Default to Off
    recipients: options.recipients,
  });

  return new Promise<void>((resolve, reject) => {
    try {
      const req = https.request(requestOptions, res => {
        const chunks: Buffer[] = [];

        res.on('data', chunk => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          console.log('SMS Response:', body);
          resolve(); // Resolve the promise on success
        });
      });

      req.write(payload);
      req.end();

      req.on('error', e => {
        console.error(`Problem with SMS request: ${e.message}`);
        reject(e); // Reject the promise on error
      });
    } catch (error) {
      console.error('Unexpected error occurred:', error);
      reject(error); // Reject the promise if an unexpected error occurs
    }
  });
};

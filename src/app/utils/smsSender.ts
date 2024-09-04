import axios, { AxiosRequestConfig } from 'axios';
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

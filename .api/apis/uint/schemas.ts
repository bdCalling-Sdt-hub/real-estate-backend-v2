const AddCard = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const AddCharge = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: { '201': { $schema: 'http://json-schema.org/draft-04/schema#' } },
} as const;
const AutoDeduct = {
  response: {
    '200': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '422': { $schema: 'http://json-schema.org/draft-04/schema#' },
  },
} as const;
const CheckDepositStatus = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          track_id: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The track_id',
          },
        },
        required: ['track_id'],
      },
    ],
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CheckPaymentStatus = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          track_id: {
            type: 'integer',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'The track_id',
          },
        },
        required: ['track_id'],
      },
    ],
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CheckRefundStatus = {
  metadata: {
    allOf: [
      {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            $schema: 'http://json-schema.org/draft-04/schema#',
            description: 'Pass the order id',
          },
        },
        required: ['order_id'],
      },
    ],
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CreateCustomerUniqueToken = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const CreateTokenFromCard = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const DeleteMultiVendorRefund = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const DeleteRefund = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const MultiVendorRefund = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const PaymentButtonAvailabilityStatus = {
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const Refund = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
const RetrieveCustomerCards = {
  body: {
    type: 'object',
    additionalProperties: true,
    $schema: 'http://json-schema.org/draft-04/schema#',
  },
  response: {
    '201': { $schema: 'http://json-schema.org/draft-04/schema#' },
    '401': {
      properties: {
        message: { type: 'string', examples: ['Not a valid API request'] },
      },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
    '403': {
      properties: { message: { type: 'string', examples: ['Forbidden'] } },
      type: 'object',
      $schema: 'http://json-schema.org/draft-04/schema#',
    },
  },
} as const;
export {
  AddCard,
  AddCharge,
  AutoDeduct,
  CheckDepositStatus,
  CheckPaymentStatus,
  CheckRefundStatus,
  CreateCustomerUniqueToken,
  CreateTokenFromCard,
  DeleteMultiVendorRefund,
  DeleteRefund,
  MultiVendorRefund,
  PaymentButtonAvailabilityStatus,
  Refund,
  RetrieveCustomerCards,
};

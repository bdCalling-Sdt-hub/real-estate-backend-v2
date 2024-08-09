import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'uint/1.0.0 (api/6.1.1)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * It will return payment link
   *
   * @summary Make charge
   */
  addCharge(body?: types.AddChargeBodyParam): Promise<FetchResponse<201, types.AddChargeResponse201>> {
    return this.core.fetch('/api/v1/charge', 'post', body);
  }

  /**
   * Create an invoice and auto deduct the payment
   *
   * @summary Create Auto Deduct Request
   * @throws FetchError<401, types.AutoDeductResponse401> Unauthorized
   * @throws FetchError<422, types.AutoDeductResponse422> Unprocessable Entity
   */
  autoDeduct(): Promise<FetchResponse<200, types.AutoDeductResponse200>> {
    return this.core.fetch('/api/v1/auto-deduct', 'post');
  }

  /**
   * Add card
   *
   * @summary Add card
   * @throws FetchError<401, types.AddCardResponse401> Unauthenticated
   * @throws FetchError<403, types.AddCardResponse403> Forbidden
   */
  addCard(body?: types.AddCardBodyParam): Promise<FetchResponse<201, types.AddCardResponse201>> {
    return this.core.fetch('/api/v1/add-card', 'post', body);
  }

  /**
   * Users can create the token from a Credit/Debit card for a faster checkout process
   *
   * @summary Add cards
   * @throws FetchError<401, types.CreateTokenFromCardResponse401> Unauthenticated
   * @throws FetchError<403, types.CreateTokenFromCardResponse403> Forbidden
   */
  createTokenFromCard(body?: types.CreateTokenFromCardBodyParam): Promise<FetchResponse<201, types.CreateTokenFromCardResponse201>> {
    return this.core.fetch('/api/v1/create-token-from-card', 'post', body);
  }

  /**
   * Users can create customer unique token for saving Credit/Debit cards
   *
   * @summary Create token
   * @throws FetchError<401, types.CreateCustomerUniqueTokenResponse401> Unauthenticated
   * @throws FetchError<403, types.CreateCustomerUniqueTokenResponse403> Forbidden
   */
  createCustomerUniqueToken(body?: types.CreateCustomerUniqueTokenBodyParam): Promise<FetchResponse<201, types.CreateCustomerUniqueTokenResponse201>> {
    return this.core.fetch('/api/v1/create-customer-unique-token', 'post', body);
  }

  /**
   * Retrieve customer cards from token
   *
   * @summary Retrieve cards
   * @throws FetchError<401, types.RetrieveCustomerCardsResponse401> Unauthenticated
   * @throws FetchError<403, types.RetrieveCustomerCardsResponse403> Forbidden
   */
  retrieveCustomerCards(body?: types.RetrieveCustomerCardsBodyParam): Promise<FetchResponse<201, types.RetrieveCustomerCardsResponse201>> {
    return this.core.fetch('/api/v1/retrieve-customer-cards', 'post', body);
  }

  /**
   * Get payment status
   *
   * @throws FetchError<401, types.CheckPaymentStatusResponse401> Unauthenticated
   * @throws FetchError<403, types.CheckPaymentStatusResponse403> Forbidden
   */
  checkPaymentStatus(metadata: types.CheckPaymentStatusMetadataParam): Promise<FetchResponse<201, types.CheckPaymentStatusResponse201>> {
    return this.core.fetch('/api/v1/get-payment-status/{track_id}', 'get', metadata);
  }

  /**
   * Get payment button availability status
   *
   * @throws FetchError<401, types.PaymentButtonAvailabilityStatusResponse401> Unauthenticated
   * @throws FetchError<403, types.PaymentButtonAvailabilityStatusResponse403> Forbidden
   */
  paymentButtonAvailabilityStatus(): Promise<FetchResponse<201, types.PaymentButtonAvailabilityStatusResponse201>> {
    return this.core.fetch('/api/v1/check-payment-button-status', 'get');
  }

  /**
   * Get deposit status
   *
   * @throws FetchError<401, types.CheckDepositStatusResponse401> Unauthenticated
   * @throws FetchError<403, types.CheckDepositStatusResponse403> Forbidden
   */
  checkDepositStatus(metadata: types.CheckDepositStatusMetadataParam): Promise<FetchResponse<201, types.CheckDepositStatusResponse201>> {
    return this.core.fetch('/api/v1/get-deposit-status/{track_id}', 'get', metadata);
  }

  /**
   * Single refund from order id
   *
   * @summary Single refund
   * @throws FetchError<401, types.RefundResponse401> Unauthenticated
   * @throws FetchError<403, types.RefundResponse403> Forbidden
   */
  refund(body?: types.RefundBodyParam): Promise<FetchResponse<201, types.RefundResponse201>> {
    return this.core.fetch('/api/v1/create-refund', 'post', body);
  }

  /**
   * Get refund status
   *
   * @throws FetchError<401, types.CheckRefundStatusResponse401> Unauthenticated
   * @throws FetchError<403, types.CheckRefundStatusResponse403> Forbidden
   */
  checkRefundStatus(metadata: types.CheckRefundStatusMetadataParam): Promise<FetchResponse<201, types.CheckRefundStatusResponse201>> {
    return this.core.fetch('/api/v1/check-refund-status/{order_id}', 'get', metadata);
  }

  /**
   * Single delete refund from order id
   *
   * @summary Single delete refund
   * @throws FetchError<401, types.DeleteRefundResponse401> Unauthenticated
   * @throws FetchError<403, types.DeleteRefundResponse403> Forbidden
   */
  deleteRefund(body?: types.DeleteRefundBodyParam): Promise<FetchResponse<201, types.DeleteRefundResponse201>> {
    return this.core.fetch('/api/v1/delete-refund', 'post', body);
  }

  /**
   * Multi vendor refund
   *
   * @summary Multi vendor refund
   * @throws FetchError<401, types.MultiVendorRefundResponse401> Unauthenticated
   * @throws FetchError<403, types.MultiVendorRefundResponse403> Forbidden
   */
  multiVendorRefund(body?: types.MultiVendorRefundBodyParam): Promise<FetchResponse<201, types.MultiVendorRefundResponse201>> {
    return this.core.fetch('/api/v1/create-multivendor-refund', 'post', body);
  }

  /**
   * Multi vendor delete refund
   *
   * @summary Multi vendor delete refund
   * @throws FetchError<401, types.DeleteMultiVendorRefundResponse401> Unauthenticated
   * @throws FetchError<403, types.DeleteMultiVendorRefundResponse403> Forbidden
   */
  deleteMultiVendorRefund(body?: types.DeleteMultiVendorRefundBodyParam): Promise<FetchResponse<201, types.DeleteMultiVendorRefundResponse201>> {
    return this.core.fetch('/api/v1/delete-multivendor-refund', 'post', body);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { AddCardBodyParam, AddCardResponse201, AddCardResponse401, AddCardResponse403, AddChargeBodyParam, AddChargeResponse201, AutoDeductResponse200, AutoDeductResponse401, AutoDeductResponse422, CheckDepositStatusMetadataParam, CheckDepositStatusResponse201, CheckDepositStatusResponse401, CheckDepositStatusResponse403, CheckPaymentStatusMetadataParam, CheckPaymentStatusResponse201, CheckPaymentStatusResponse401, CheckPaymentStatusResponse403, CheckRefundStatusMetadataParam, CheckRefundStatusResponse201, CheckRefundStatusResponse401, CheckRefundStatusResponse403, CreateCustomerUniqueTokenBodyParam, CreateCustomerUniqueTokenResponse201, CreateCustomerUniqueTokenResponse401, CreateCustomerUniqueTokenResponse403, CreateTokenFromCardBodyParam, CreateTokenFromCardResponse201, CreateTokenFromCardResponse401, CreateTokenFromCardResponse403, DeleteMultiVendorRefundBodyParam, DeleteMultiVendorRefundResponse201, DeleteMultiVendorRefundResponse401, DeleteMultiVendorRefundResponse403, DeleteRefundBodyParam, DeleteRefundResponse201, DeleteRefundResponse401, DeleteRefundResponse403, MultiVendorRefundBodyParam, MultiVendorRefundResponse201, MultiVendorRefundResponse401, MultiVendorRefundResponse403, PaymentButtonAvailabilityStatusResponse201, PaymentButtonAvailabilityStatusResponse401, PaymentButtonAvailabilityStatusResponse403, RefundBodyParam, RefundResponse201, RefundResponse401, RefundResponse403, RetrieveCustomerCardsBodyParam, RetrieveCustomerCardsResponse201, RetrieveCustomerCardsResponse401, RetrieveCustomerCardsResponse403 } from './types';

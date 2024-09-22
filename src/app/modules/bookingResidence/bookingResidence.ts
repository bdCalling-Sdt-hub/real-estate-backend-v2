export const formatAddress = address => {
  return `
     ${address?.governorate},
     ${address?.area},
 ${address?.street},
  ${address?.block},
   ${address?.house},
    ${address?.floor},
    ${address?.apartment},
 ${address?.avenue},
   ${address?.additionalDirections || 'N/A'}
  `;
};

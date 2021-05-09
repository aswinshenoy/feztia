export const RESEND_OTP_MUTATION = `
mutation ($phone: String){
  resendOTP(phone: $phone)
}`;

export const VERIFY_OTP_MUTATION = `
mutation ($otp: String!){
  verifyOTP(otp: $otp)
}`;

export const RESEND_EMAIL_MUTATION = `
mutation {
  resendConfirmationEmail
}`;

export const VERIFY_EMAIL_MUTATION = `
mutation ($otp: String!){
  verifyEmail(otp: $otp)
}`;

export const SEND_BULK_EMAIL_MUTATION = `
mutation ($eventID: ID!, $image: Upload!, $status: Int, $type: Int, $subject: String!, $url: String){
  sendBulkEmails(eventID: $eventID, image: $image, status: $status, type: $type, subject: $subject, url: $url)
}`;

export const GENERATE_MY_PARTICIPATION_CERTIFICATE = `
mutation ($eventID: ID!){
  generateParticipationCertificate(eventID: $eventID){
    file
  }
}`;
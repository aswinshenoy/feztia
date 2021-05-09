export const REVIEW_PARTICIPANT_MUTATION = `
mutation ($approve: Boolean!, $participantID: ID!, $form: JSONString, $update: UserUpdationInput, $remarks: String) {
  reviewParticipant(
    approve: $approve
    participantID: $participantID
    formUpdate: $form
    profileUpdate: $update
    remarks: $remarks
  )
}`
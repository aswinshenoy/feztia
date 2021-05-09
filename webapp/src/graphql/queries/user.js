export const MY_PROFILE_QUERY = `
query {
  me{
    username
    title
    name
    email
    phone
    city
    state
    country
    gender
    type
    affiliationTitle {
         value: id
         label: name
    }
    affiliationBody {
         value: id
         label: name
    }
    IDCardURL
    emailVerified: isEmailVerified
    phoneVerified: isPhoneVerified
  }
}`;

export const REGISTER_MUTATION = `
mutation ($input: UserCreationInput!){
  register(input: $input){
    success
  }
}`;

export const LOGIN_MUTATION = `
mutation ($username: String!, $password: String!){
  authenticateUser(username: $username, password: $password){
    success
    user
    {
      id
      title
      username
      name
      email
      phone
      type
      gender
      city
      state
      country
      isProfileComplete
      affiliationTitle {
         value: id
         label: name
      }
      affiliationBody {
         value: id
         label: name
      }
      emailVerified: isEmailVerified
      phoneVerified: isPhoneVerified
    }
  }
}`;

export const REQUEST_PASSWORD_RESET =
`mutation ($email: String!){
  requestPasswordReset(email: $email)
}`;

export const RESET_PASSWORD__MUTATION =
`mutation ($email: String!, $password: String!, $otp: String!){
  resetPassword(email: $email,newPassword: $password, otp: $otp)
}`;

export const UPDATE_MUTATION = `
mutation ($update: UserUpdationInput!){
  updateProfile(update: $update){
    success
  }
}`;

export const MY_REGISTRATION_QUERY =
`{
  me{
    isProfileComplete
    isIDVerified
    requiresCorrection
    remarks
  }
}`;

export const PROFILES_QUERY = `
query ($eventID: ID!, $search: String, $count: Int, $after: String, $publicListing: Boolean, $filters: ParticipantQueryFilters) {
  participants(
    eventID: $eventID
    search: $search
    count: $count
    after: $after
    publicListing: $publicListing,
    filters: $filters
  ) {
    hasNext
    totalCount
    lastCursor
    participants {
      uuid
      id
      remarks
      isApproved
      team{
        id
        name
        leader {
            title
            name
            affiliationBody {
              value: id
              label: name
            }
        }
        members{
          id
          title
          name
          phone
          email
        }
      }
      profile {
        id
        title
        name
        email
        isEmailVerified
        phone
        isPhoneVerified
        city
        state
        country
        gender
        type
        affiliationTitle {
          value: id
          label: name
        }
        affiliationBody {
          value: id
          label: name
        }
        dateJoined
        IDCardURL
      }
      submissions {
        id
        url
        fileURL
        key
      }
      formData {
        label: key
        value
      }
    }
  }
}`;


export const JUDGE_PROFILES_QUERY = `
query ($eventID: ID!, $search: String, $count: Int, $after: String, $publicListing: Boolean, $judgeListing: Boolean, $eliminatorListing: Boolean, $filters: ParticipantQueryFilters) {
  participants(
    eventID: $eventID
    search: $search
    count: $count
    after: $after
    publicListing: $publicListing,
    eliminatorListing: $eliminatorListing,
    judgeListing: $judgeListing,
    filters: $filters
  ) {
    hasNext
    totalCount
    lastCursor
    participants {
      uuid
      id
      remarks
      isApproved
      myPoints
      team{
        id
        name
        members{
          title
          name
        }
      }
      profile {
        id
        title
        name
        type
      }
      submissions {
        id
        url
        fileURL
        key
      }
      formData {
        label: key
        value
      }
    }
  }
}`;


export const JUDGE_SCORES_QUERY = `
query ($eventID: ID!){
  scores(eventID: $eventID){
    avgPoints
    noOfJudges
    highScore
    lowScore
    stdDiv
    variance
    participant{
      id
      prize
      profile{
        id
        title
        name
        type
      }
      team{
        id
        name
        members{
          name
        }
      }
    }
  }
}`;
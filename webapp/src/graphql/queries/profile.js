export const VIEW_PROFILE_QUERY = `
query ($key: String, $id: ID){
  profile(key: $key, id: $id){
    id
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
    affiliationTitle{
      id
      name
    }
    affiliationBody{
      id
      name
    }
    dateJoined
    registrations{
      id
      isApproved
      remarks
      timestampRegistered
      event{
        id
        name
      }
    }
  }
}`;
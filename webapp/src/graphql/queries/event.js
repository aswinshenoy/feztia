export const EVENT_QUERY = `
query ($eventID: ID!){
  event(eventID: $eventID){
    name
    isTeamEvent
    formFields{
      type
      label
      key
      options
      {
        value
        label
        allowedUserTypes
      }
      formats
      maxSelections
    }
    postApprovalFields{
      type
      label
      key
      options
      {
        value
        label
        allowedUserTypes
      }
      formats
      maxSelections
    }
  }
}`;

export const EVENT_DETAILS_QUERY = `
query ($parentID: ID, $slug: String) {
  event(parentID: $parentID, slug: $slug) {
    id
    name
    slug
    shortDescription
    coverURL
    acceptRegistrations
    isUserAllowedToRegister
    registrationCloseTimestamp
    details
    isTeamEvent
    minTeamSize
    maxTeamSize
    hasGallery
    hasWinners
  }
}
`;

export const EVENT_REG_FORM_QUERY = `
query ($parentID: ID, $slug: String, $eventID: ID) {
  event(parentID: $parentID, slug: $slug, eventID: $eventID) {
    name
    slug
    id
    requireApproval
    isTeamEvent
    minTeamSize
    maxTeamSize
    postApprovalFields{
      type
      label
      key
      options
      {
        value
        label
        allowedUserTypes
      }
      charLimit
      maxSelections
      isPublic
      isURL
      formats
    }
    formFields{
      type
      label
      key
      options
      {
        value
        label
        allowedUserTypes
      }
      charLimit
      maxSelections
      isPublic
      isURL
      formats
    }
  }
}
`;

export const EVENTS_QUERY = `
query ($parentID: ID, $eventType: Int){
  events(parentID: $parentID, eventType: $eventType){
    totalCount
    events{
      name
      slug
      id
      acceptRegistrations
      isUserAllowedToRegister
      shortDescription
      registrationCloseTimestamp
      startTimestamp
      endTimestamp
      posterURL
      webinarLink
    }
  }
}`;

export const MY_EVENT_PROFILE_QUERY = `
query ($eventID: ID!){
  myEventProfile(eventID: $eventID){
    id
    uuid
    formData{
      key
      value
    }
    isApproved
    remarks
    profile {
        title
        name
        type
        gender
        city
        state
        country
        email
    }
    event{
      name
      formFields{
        type
        label
        key
        maxSelections
        options{
          value
          label
          allowedUserTypes
        }
      }
    }
  }
}`;

export const PARTICIPATE_MUTATION = `
mutation ($eventID: ID!, $teamID: ID, $data: JSONString, $postApprovalData: JSONString){
  participate(eventID: $eventID, teamID: $teamID, data: $data, postApprovalData: $postApprovalData){
    uuid
    id
    formData{
      key
      value
    }
    postApprovalData{
      key
      value
    }
    event{
      name
      formFields{
        type
        label
        key
        maxSelections
        options{
          value
          label
        }
      }
    }
  }
}`;

export const SUBMIT_MUTATION = `
mutation ($file: Upload, $url: String, $key: String!, $participantID: ID!) {
  submit(file: $file, url: $url, key: $key, participantID: $participantID){
    id
  }
}`;

export const MY_BASIC_EVENT_PROFILE_QUERY = `
query ($eventID: ID!){
  myEventProfile(eventID: $eventID){
    isApproved
    timestampRegistered
    remarks
    formData{
      key
      value
    }
    postApprovalData{
      key
      value
    }
    submissions{
      url
      fileURL
      key
    }
  }
}`;

export const MY_EVENT_REGS = `
query ($eventID: ID!){
  myEvents(parentID: $eventID){
    isApproved
    prize
    isCertificateAvailable
    event{
      id
      name
      slug
      postApprovalFields{
        key
      }
    }
    timestampRegistered
  }
}`;

export const EVENT_GALLERY_QUERY = `
query ($eventID: ID, $count: Int, $after: String) {
  event(eventID: $eventID) {
    name
    formFields {
      formats
      key
      label
    }
    postApprovalFields {
      formats
      key
      label
    }
  }
  gallery(eventID: $eventID, count: $count, after: $after) {
    hasNext
    lastCursor
    posts {
      participant {
        profile {
          title
          name
        }
        timestampApproved
      }
      submissions {
        fileURL
        url
        key
      }
    }
  }
}`;



export const GALLERY_QUERY = `
query ($eventID: ID, $count: Int, $after: String) {
  gallery(eventID: $eventID, count: $count, after: $after) {
    hasNext
    lastCursor
    posts {
      event {
        name
        formFields {
          formats
          key
          label
        }
        postApprovalFields {
          formats
          key
          label
        }
      }
      participant {
        profile {
          title
          name
        }
        timestampApproved
      }
      submissions {
        fileURL
        url
        key
      }
    }
  }
}`;

export const UPCOMING_EVENTS_QUERY = `
query ($eventType: Int, $parentID: ID){
  upcomingEvents(eventType: $eventType, parentID: $parentID){
    name
    startTimestamp
    shortDescription
    webinarLink
    webinarPlatform
  }
}`;

export const LIVE_EVENTS_QUERY = `
query ($eventType: Int, $parentID: ID){
  liveEvents(eventType: $eventType, parentID: $parentID){
    name
    shortDescription
    startTimestamp
    webinarLink
    webinarPlatform
  }
}`;

export const EVENT_WINNERS_QUERY = `
query ($eventID: ID!){
  event(eventID: $eventID) {
    name
    formFields {
      formats
      key
      label
    }
    postApprovalFields {
      formats
      key
      label
    }
    winners{
      name
      prize
      submissions{
        key
        fileURL
        url
      }
    }
  }
}`;
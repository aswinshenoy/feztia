export const CREATE_TEAM_MUTATION = `
mutation ($name: String!){
  createTeam(name: $name){
    id
    name
    inviteCode
  }
}`;

export const JOIN_TEAM_MUTATION = `
mutation ($code: String!){
  joinTeam(inviteCode: $code){
    id
    name
  }
}`;
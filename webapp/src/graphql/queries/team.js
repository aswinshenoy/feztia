
export const MY_TEAMS_QUERY = `
{
  myTeams{
    id
    name
    inviteCode
    members{
      id
      name
    }
  }
}`;
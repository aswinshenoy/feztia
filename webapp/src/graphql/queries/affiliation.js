
export const AFFILIATION_TITLES_QUERY = `
query ($keyword: String){
affiliationTitles(keyword: $keyword){
    value: id
    label: name
  }
}`;

export const AFFILIATION_BODY_QUERY = `
query ($keyword: String){
affiliationBodies(keyword: $keyword){
    value: id
    label: name
  }
}`;

export const ADD_AFFILIATION_TITLE = `
mutation ($name: String!){
  addAffiliationTitle(name: $name){
    value: id
    label: name
  }
}`;

export const ADD_AFFILIATION_BODY = `
mutation ($name: String!){
  addAffiliationBody(name: $name){
    value: id
    label: name
  }
}`;
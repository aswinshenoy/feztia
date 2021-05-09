import GraphQLFetch from './GraphQLFetch';
import {setUserInfo} from "../states";

const graphQLEndpoint = process.env.GRAPHQL_SERVER_ENDPOINT || '/api/graphql/';

const LOGOUT_CODES = [
    'INVALID_REFRESH_TOKEN', 'AUTHENTICATION_REQUIRED', 'REFRESH_TOKEN_NOT_FOUND',
    'REFRESH_TOKEN_EXPIRED', 'INVALID_TOKEN_PAYLOAD', 'INVALID_REFRESH_TOKEN_FINGERPRINT'
];

const APIFetch = async ({ query, variables = null, endpoint = graphQLEndpoint }) => {
    return await GraphQLFetch({ query, variables, endpoint }).then((r) => {
        if (r && !Object.prototype.hasOwnProperty.call(r, 'errors')) return { success: true, data: r.data };
        if (r?.errors && r?.errors?.length > 0 && LOGOUT_CODES.includes(r.errors[0]?.code)) setUserInfo(null);
        return { success: false, response: r, errors: r ? r.errors : null };
    });
};

export default APIFetch;

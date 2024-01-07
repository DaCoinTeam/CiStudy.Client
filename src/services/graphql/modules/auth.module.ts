import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
    gql,
} from "@apollo/client"
import { endpointConfig } from "@config"
import { UserDto } from "../dto"
export default class AuthGraphQL {
    private client: ApolloClient<NormalizedCacheObject>

    constructor() {
        this.client = new ApolloClient({
            uri: endpointConfig().graphQL,
            cache: new InMemoryCache(),
        })
    }

    async signIn(
        email: string,
        password: string
    ): Promise<Partial<UserDto> | null> {
        console.log(this.client)
        try {
            const res = await this.client.query({
                query: gql`
          query SignIn($email: String!, $password: String!) {
            signIn(input: { email: $email, password: $password }) {
              firstName
              lastName
              userId
            }
          }
        `,
                variables: {
                    email,
                    password,
                },
            })

            const { data } = res
            return data.signIn
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async signUp(params: SignUpParams): Promise<Partial<UserDto> | null> {
        try {
            const { data } = await this.client.mutate({
                mutation: gql`
          mutation SignUp(
            $email: String!
            $password: String!
            $firstName: String!
            $lastName: String!
            $birthday: Date!
          ) {
            signUp(
              input: {
                email: $email
                password: $password
                firstName: $firstName
                lastName: $lastName
                birthday: $birthday
              }
            ) {
              firstName
              lastName
            }
          }
        `,
                variables: {
                    email: params.email,
                    password: params.password,
                    firstName: params.firstName,
                    lastName: params.lastName,
                    birthday: params.birthday,
                },
            })
            return data.signUp
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
}

import http from 'request'
import moment from 'moment-timezone';
import { ExecutionContext } from "toto-api-controller/dist/model/ExecutionContext";
import { UserContext } from "toto-api-controller/dist/model/UserContext";

export class KudAPI {

    endpoint: string;
    userEmail: string;
    cid: string;
    authorizationHeader: string;

    constructor(userContext: UserContext, execContext: ExecutionContext, authorizationHeader: string) {
        this.endpoint = process.env["KUD_API_ENDPOINT"]!
        this.userEmail = userContext.email
        this.cid = String(execContext.cid);
        this.authorizationHeader = authorizationHeader;
    }

    async restore(date: string): Promise<KudRestoreResponse> {

        return new Promise((success, failure) => {

            http({
                uri: this.endpoint + `/restore`,
                method: 'POST',
                headers: {
                    'x-correlation-id': this.cid,
                    'Authorization': this.authorizationHeader, 
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    date: date
                })
            }, (err: any, resp: any, body: any) => {

                if (err) {
                    console.log(err)
                    failure(err);
                }
                else success(JSON.parse(body));

            })
        })
    }

}

export interface KudRestoreResponse {
    restore: string
    date: string
}


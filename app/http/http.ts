import { Injectable } from '../../core/modularization';

@Injectable()
export class Http {

    handleErrors(response: Response) {
        if (!response.ok) {
            throw response.statusText;
        }
        return response;
    }

    get(url: string, params: { key: string | number }, type = 'json') {

        if (params) {
            const serializedParams = Object.keys(params).map((key) => key +'='+ params[key]).join('&');
            url = `${url}?${serializedParams}`;
        }

        return fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => this.handleErrors(response))
            .then(response => {
                if (type =='text') {
                    return response.text();
                }
                return response.json();
            });
    }

    post(url: string, body: any, type = 'json') {

        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-type' : 'application/json'},
            body: JSON.stringify(body)
        })
            .then(response => this.handleErrors(response))
            .then(response => {
                if (type == 'text') {
                    return response.text();
                }
                return response.json();
            });
    }
}
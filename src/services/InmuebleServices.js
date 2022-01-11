import {environment} from '../environment'

export class InmuebleServices {

    getInmueblesFind(body, params = null) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
    
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : ''; 
        return fetch(environment.baseUrl +'/Property/datatable?' + queryParams, requestOptions).then(res => res.json())
    }

    guardarInmuebles(body, method = null, id = null) {
        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        if(method === 'POST'){
            return fetch(environment.baseUrl +'/Property', requestOptions).then(res => res.json())
        }else{
            return fetch(environment.baseUrl +'/Property/' + id, requestOptions).then(res => res.json())
        }
    }

    eliminarInmuebles(id = null) {
        const requestOptions = {
            method: 'DELETE'
        };
        return fetch(environment.baseUrl +'/Property/' + id, requestOptions).then(res => res.json())
    }


     uploadFiles(file) {
        let formData = new FormData();
        formData.append("PropertyId", 1);
        formData.append("Enabled", true);
        formData.append("File", file);

        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: new Headers({
                'Authorization': 'Bearer '+environment.token, 
            }), 
        };

        return fetch(environment.baseUrl +'/PropertyImage', requestOptions).then(res => res.json())
    }

}
     
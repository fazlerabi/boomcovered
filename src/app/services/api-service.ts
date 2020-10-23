import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) {
  }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private static extractData(res: Response) {
    return res || {};
  }

  getZillow(data): Observable<any> {
    return this.http.post('/api/get_zillow', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  bindNow(data): Observable<any> {
    return this.http.get('/api/bind_now/' + data['uniqueId'], httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  saveUserData(data): Observable<any> {
    return this.http.post('/api/save_user_data', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  addCarData(data): Observable<any> {
    return this.http.post('/api/add_car_data', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  saveMortgage(data): Observable<any> {
    return this.http.post('/api/save_mortgage', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  getQuoteData(data): Observable<any> {

    return this.http.post('/api/get_quote_data', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  bundleAuto(data): Observable<any> {
    return this.http.post('/api/bundle_auto', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  checkValid(data): Observable<any> {
    return this.http.post('/api/check_valid', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }
  getWeatherData(url): Observable<any> {

    return this.http.get(url, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  sendDemoEmail(data): Observable<any> {
    return this.http.post('/api/send_demo_email', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  sendDetailsEmail(data): Observable<any> {
    return this.http.post('/api/send_details_email', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError));
  }

  getPdfLink(data): Observable<any> {
    return this.http.post('/api/get_pdf_link', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError)
    );
  }

  getPlymouthData(data): Observable<any> {
    return this.http.post('/api/get_plymouth_pricing', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError)
    );
  }

  getStillwaterData(data): Observable<any> {
    return this.http.post('/api/get_stillwater_pricing', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError)
    );
  }

  getUniversalData(data): Observable<any> {
    return this.http.post('/api/get_universal_pricing', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError)
    );
  }

  getNeptuneData(data): Observable<any> {
    return this.http.post('/api/get_neptuneflood', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError)
    );
  }

  getHippoData(data): Observable<any> {
    return this.http.post('/api/get_hippo', data, httpOptions).pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError)
    );
  }
  getHavenLife(data): Observable<any> {
    return this.http.post('/api/get_havenlife', data, httpOptions)
      .pipe(
        map(ApiService.extractData),
        catchError(ApiService.handleError));
  }
  getPdfDownloaded(data): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post('api/downlod_pdf', data, { headers: headers, responseType: 'blob' });
  }
}

/*comment*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IComment } from 'app/shared/model/comment.model';

type EntityResponseType = HttpResponse<IComment>;
type EntityArrayResponseType = HttpResponse<IComment[]>;

@Injectable({ providedIn: 'root' })
export class CommentService {
    private resourceUrl = SERVER_API_URL + 'api/comments';

    constructor(private http: HttpClient) {}

    create(comment: IComment): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(comment);
        return this.http
            .post<IComment>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    update(comment: IComment): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(comment);
        return this.http
            .put<IComment>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IComment[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(comment: IComment): IComment {
        const copy: IComment = Object.assign({}, comment, {
            creationDate: comment.creationDate != null && comment.creationDate.isValid() ? comment.creationDate.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.creationDate = res.body.creationDate != null ? moment(res.body.creationDate) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((comment: IComment) => {
            comment.creationDate = comment.creationDate != null ? moment(comment.creationDate) : null;
        });
        return res;
    }
}
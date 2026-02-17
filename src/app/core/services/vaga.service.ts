import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vaga, FiltrosBusca, Page } from '../models/vaga.models';

export type ApiErrorTipo = 'SERVIDOR_OFFLINE' | 'ERRO_SERVIDOR' | 'ERRO_DESCONHECIDO';

export interface ApiError {
  tipo: ApiErrorTipo;
  mensagem: string;
  status?: number;
}

@Injectable({ providedIn: 'root' })
export class VagaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/vagas';

  listarVagas(filtros: FiltrosBusca, page: number = 0, size: number = 12): Observable<Page<Vaga>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'id,desc');

    if (filtros.termo) params = params.set('titulo', filtros.termo);
    if (filtros.empresa) params = params.set('empresa', filtros.empresa);

    if (filtros.modalidade && filtros.modalidade !== 'TODAS') {
      params = params.set('modalidade', filtros.modalidade);
    }

    if (filtros.regime && filtros.regime !== 'TODOS') {
      params = params.set('regime', filtros.regime);
    }

    if (filtros.fonte && filtros.fonte !== 'TODAS') {
      params = params.set('fonte', filtros.fonte);
    }

    const temFiltros =
      !!filtros.termo ||
      !!filtros.empresa ||
      filtros.modalidade !== 'TODAS' ||
      filtros.regime !== 'TODOS' ||
      filtros.fonte !== 'TODAS';

    const url = temFiltros ? `${this.apiUrl}/filtro` : this.apiUrl;

    return this.http.get<Page<Vaga>>(url, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = this.handleError(error);
        console.error('Erro ao buscar vagas:', apiError);
        return throwError(() => apiError);
      }),
    );
  }

  testarConexao(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = this.handleError(error);
        return throwError(() => apiError);
      }),
    );
  }

  private handleError(error: HttpErrorResponse): ApiError {
    if (error.status === 0) {
      return {
        tipo: 'SERVIDOR_OFFLINE',
        mensagem: 'Não foi possível conectar ao servidor.',
        status: error.status,
      };
    }

    if (error.status >= 500) {
      return {
        tipo: 'ERRO_SERVIDOR',
        mensagem: 'O servidor encontrou um erro interno.',
        status: error.status,
      };
    }

    return {
      tipo: 'ERRO_DESCONHECIDO',
      mensagem: 'Ocorreu um erro inesperado.',
      status: error.status,
    };
  }
}

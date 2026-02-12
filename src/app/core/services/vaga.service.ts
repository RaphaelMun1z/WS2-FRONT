import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vaga, FiltrosBusca, Page } from '../models/vaga.models';

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
      filtros.termo ||
      filtros.empresa ||
      filtros.modalidade !== 'TODAS' ||
      filtros.regime !== 'TODOS' ||
      filtros.fonte !== 'TODAS';

    const url = temFiltros ? `${this.apiUrl}/filtro` : this.apiUrl;

    return this.http.get<Page<Vaga>>(url, { params }).pipe(
      catchError((err) => {
        console.error('Erro ao buscar vagas', err);
        return of({
          content: [],
          page: {
            size: size,
            number: 0,
            totalElements: 0,
            totalPages: 0,
          },
        } as Page<Vaga>);
      }),
    );
  }
}

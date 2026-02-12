export interface Vaga {
  id: string;
  codigoVaga: string;
  titulo: string;
  empresa: string;
  salario: string;
  local: string;
  modalidade: string;
  regime: string;
  linkCandidatura: string;
  descricao: string;
  fonte: string;
  dataAnuncio?: string;
}

export interface FiltrosBusca {
  termo: string;
  modalidade: string;
  regime: string;
  fonte: string;
  empresa: string;
}

export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

import { Injectable } from '@angular/core';

export type Term = {
  t: string;
}

export type Language = {
  definition?: string;
  label: string,
  terms?: [Term];
}

export type Concept = {
  id: string,
  languages: {[id: string]: Language}
};

export type Summary = {
  fileSize: number;
  variant: string;
  numberOfTerms: number;
  numberOfConcepts: number;
  languages: string[];
}

export type Resource = {
  id: string;
  summary: Summary;
  concepts: {[id: string]: Concept};
  sparql?: String;
}
@Injectable({
  providedIn: 'root'
})
export class RutService {
  restApi: string = 'http://localhost:8080/resources';
  mimetype = {json: 'application/json', sparql: 'application/sparql-query'};

  constructor() { }

  private buildFilterQuery(languages: string[]):  URLSearchParams {
    let query = new URLSearchParams();
    for (let language of languages)
      query.append('languages', language);
    return query;
  }

  async createResource(tbx: string): Promise<Resource> {
    let response : Response = await fetch(this.restApi, {
      method: 'POST',
      headers: {'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
      body: JSON.stringify({tbx})
    });
    return response.json();
  }

  async filterResource(id: string, languages: string[]): Promise<Resource> {
    let query = this.buildFilterQuery(languages);
    let response = await fetch(`${this.restApi}/${id}?${query}`, {
      method: 'GET',
      headers: {'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
    });
    return response.json();
  }

  async assembleResource(id: string, languages: string[]): Promise<string> {
    let query = this.buildFilterQuery(languages);
    return fetch(`${this.restApi}/${id}/sparql?${query}`, {
      method: 'GET',
      headers: { 'Accept': this.mimetype.sparql, 'Content-Type': this.mimetype.json},
    })
    .then(response => response.text())
  }

  async submitResource(id: string, repository: string): Promise<void> {
    await fetch(`${this.restApi}/${id}/submit`, {
      method: 'POST',
      headers: { 'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
      body: JSON.stringify({ repository })
    })
  }

}

import { Injectable } from '@angular/core';

export type Term = {
  t: string;
}

export type Language = {
  definition?: string;
  terms: [Term];
}

export type Concept = {
  id: string,
  description: string,
  languages: {string: Language}
};

export type Resource = {
  id: string;
  fileSize: number;
  variant: string;
  concepts: {[id: string]: Concept};
  numberOfTerms: number;
  numberOfConcepts: number;
  languages: string[];
  sparql?: String;
}
@Injectable({
  providedIn: 'root'
})
export class RutService {
  restApi: string = 'http://localhost:8080/resources';
  mimetype = {json: 'application/json', sparql: 'application/sparql-query'};

  constructor() { }

  async createResource(tbx: string): Promise<Resource> {
    let response : Response = await fetch(this.restApi, {
      method: 'POST',
      headers: {'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
      body: JSON.stringify({tbx})
    });
    return response.json();
  }

  async filterResource(id: string, languages: string[]): Promise<Resource> {
    let query = new URLSearchParams();
    for (let language in languages)
      query.append('languages', language);

    let response = await fetch(`${this.restApi}/${id}?${query}`, {
      method: 'GET',
      headers: {'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
    });
    return response.json();
  }

  async assembleResource(id: string): Promise<string> {
    return fetch(`${this.restApi}/${id}/sparql`, {
      method: 'GET',
      headers: { 'Accept': this.mimetype.sparql, 'Content-Type': this.mimetype.json},
    })
    .then(response => response.text())
  }

  async submitResource(id: string, repository: string): Promise<void> {
    fetch(`${this.restApi}/${id}/submit`, {
      method: 'POST',
      headers: { 'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
      body: JSON.stringify({ repository })
    })
  }

}

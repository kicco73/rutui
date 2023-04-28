import { query } from '@angular/animations';
import { Injectable } from '@angular/core';

export type Term = {
  t: string;
  p?: string;
  l?: string;
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
  languages: {[lang: string]: number};
  dates?: string[];
  subjectFields?: string[];
  polysemic?: Term[];
}

export type Resource = {
  id: string;
  summary: Summary;
  concepts: {[id: string]: Concept};
  sparql?: String;
}

export type Filter = {
  languages: string[];
  dates: string[];
  subjectFields: string[];
  noConcepts: boolean;
  noSenses: boolean;
  translateTerms: boolean;
  translateSenses: boolean;
  synonyms: boolean;
}

export type GraphDbResultValue = {
  type: string;
  value: string;
  "xml:lang"?: string;
}

export type GraphDbResult = {
  head: {
    vars: string[],
  },
  results: {
    bindings: {[key:string]: GraphDbResultValue}[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class RutService {
  restApi: string = 'http://localhost:8080/resources';
  mimetype = {json: 'application/json', sparql: 'application/sparql-query'};

  constructor() { }

  private buildFilterQuery(filter: Filter):  URLSearchParams {
    let { languages, dates, subjectFields, noConcepts, noSenses, synonyms, translateTerms, translateSenses } = filter;
    let query = new URLSearchParams();
    for (let language of languages)
      query.append('languages', language);
    for (let date of dates)
      query.append('dates', date);
      for (let subjectField of subjectFields)
      query.append('subjectFields', subjectField);
    query.append('noConcepts', `${noConcepts}`);
    query.append('noSenses', `${noSenses}`);
    query.append('translateTerms', `${translateTerms}`);
    query.append('translateSenses', `${translateSenses}`);
    query.append('synonyms', `${synonyms}`);
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

  async filterResource(id: string, filter: Filter): Promise<Resource> {
    let query = this.buildFilterQuery(filter);
    let response = await fetch(`${this.restApi}/${id}?${query}`, {
      method: 'GET',
      headers: {'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
    });
    return response.json();
  }

  async assembleResource(id: string, filter: Filter): Promise<string> {
    let query = this.buildFilterQuery(filter);
    return fetch(`${this.restApi}/${id}/sparql?${query}`, {
      method: 'GET',
      headers: { 'Accept': this.mimetype.sparql, 'Content-Type': this.mimetype.json},
    })
    .then(response => response.text())
  }

  async submitResource(id: string, repository: string): Promise<void> {
    await fetch(`${this.restApi}/${id}/graphdb`, {
      method: 'PUT',
      headers: { 'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
      body: JSON.stringify({ repository })
    })
  }

  async queryResource(id: string, repository: string): Promise<GraphDbResult> {
    return fetch(`${this.restApi}/${id}/graphdb?repository=${repository}`, {
      method: 'GET',
      headers: { 'Accept': this.mimetype.json, 'Content-Type': this.mimetype.json},
    })
    .then(response => response.json())
  }

}

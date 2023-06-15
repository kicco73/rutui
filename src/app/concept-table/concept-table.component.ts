import { Component, Input, SimpleChanges } from '@angular/core';
import { Concept, Filter, Language, Resource } from '../rut/rut.service';

@Component({
  selector: 'app-concept-table',
  templateUrl: './concept-table.component.html',
  styleUrls: ['./concept-table.component.css']
})
export class ConceptTableComponent {
  defaultNamespace: string = "http://txt2rdf/test#";
  conceptMapping: string = 'skos';
  seeAlso: string = 'See also';
  terms: {[id: string] : string} = {};

  @Input() filter!: Filter;
  @Input() resource? : Resource;


  private prepareTable(): void {
    let keys = Object.keys(this.resource!.concepts);
    keys.sort();
    for (let key of keys) {
      let concept : Concept = this.resource!.concepts[key];
      let terms : string[] = [];
      for (let languageKey in concept.languages) {
        let language : Language = concept.languages[languageKey];
        for (let term of language.terms!) {
          terms.push(term.t);
        }
      }
      this.terms[key] = terms.join(' ; ');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filter = changes['filter'].currentValue;
    this.resource = changes['resource'].currentValue;
    this.prepareTable();
  }
}

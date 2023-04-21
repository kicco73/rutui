import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

import { RutService } from './rut.service';
import type { Resource, Concept, Term } from './rut.service';

enum ConversionType {
  automatic = 'automatic',
  interactive = 'interactive'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title : string = 'rutui';
  tbx : string = '';
  resource : Resource | null = null;
  filterMetadata : Resource | null = null;
  conversionType : ConversionType = ConversionType.automatic;
  repository : string = 'LexO';
  loading : boolean = false;
  filterLanguage : {[language:string] : boolean} = {};
  concepts: TreeNode[] = [];
  filteredConcepts: TreeNode[] = [];

  constructor(private rutService: RutService) { }

  async onUpload(event: FileUpload) {
    for(let file of event.files) {
      this.tbx = await file.text();
      await this.onCreate();
    }
  }

  prepareTreeNode(concepts: {[id: string] : Concept}) {
    let conceptNodes : TreeNode[] = [];

    for (let concept of Object.values(concepts)) {
      let { id, description } = concept;
      let label = `${description} (${id})`;

      let languageNodes : object[] = [];
      for (let [langId, language] of Object.entries(concept.languages)) {
        let termNodes: object[] = [];

        if (language.definition) {
          let descriptionNode = {
            key: `${id}_${langId}_definition`, label: `${language.definition}`, icon: 'pi pi-fw pi-info-circle',
          };
          termNodes.push(descriptionNode);
        }

        language.terms.forEach((term: Term, i: number) => {
          let termNode = {
            key: `${id}_${langId}_term${i}`, label: `${term.t}`, icon: 'pi pi-fw pi-list',
          };
          termNodes.push(termNode);
        });

        let languageNode : TreeNode = {
          key: `${id}_${langId}`, label: langId, icon: 'pi pi-fw pi-language',
          children: termNodes,
        };
        languageNodes.push(languageNode);
      }

      let node : TreeNode = {
          key: id, label, icon: 'pi pi-fw pi-sitemap',
          children: languageNodes,
        };
      conceptNodes.push(node);
    }
    return conceptNodes;
  }


  prepareTreeTableNode(concepts: {[id: string] : Concept}) {
    let conceptNodes : TreeNode[] = [];

    for (let concept of Object.values(concepts)) {
      let { id, description } = concept;
      let label = `${description} (${id})`;

      let languageNodes : object[] = [];
      for (let [langId, language] of Object.entries(concept.languages)) {
        let termNodes: object[] = [];

        if (language.definition) {
          let descriptionNode = {
            key: `${id}_${langId}_definition`, label: `${language.definition}`, icon: 'pi pi-fw pi-info-circle',
            data: {id: language.definition, description: null}
          };
          termNodes.push(descriptionNode);
        }

        language.terms.forEach((term: Term, i: number) => {
          let termNode = {
            key: `${id}_${langId}_term${i}`, label: `${term.t}`, icon: 'pi pi-fw pi-list',
            data: {id: term.t, description: null}
          };
          termNodes.push(termNode);
        });

        let languageNode : TreeNode = {
          key: `${id}_${langId}`, label: langId, icon: 'pi pi-fw pi-language',
          children: termNodes,
          data: {id: langId, description: null}
        };
        languageNodes.push(languageNode);
      }

      let node : TreeNode = {
        children: languageNodes,
        data: {id: label, description}
      };
      conceptNodes.push(node);
    }
    return conceptNodes;
  }

  async onCreate() {
    this.loading = true;
    try {
      this.resource = await this.rutService.createResource(this.tbx);
      this.filterLanguage = {};
      this.filterMetadata = this.resource;
      for (let language of this.resource!.languages)
        this.filterLanguage[language] = true;

      this.concepts = this.prepareTreeNode(this.filterMetadata!.concepts);
      this.filteredConcepts = this.prepareTreeTableNode(this.filterMetadata!.concepts);
    }

    catch(fail) {
      console.error(fail);
    }
    finally {
      this.loading = false;
    }
  }

  async onConvert() {
    this.loading = true;
    try {
      this.resource!.sparql = await this.rutService.assembleResource(this.resource!.id);
    }
    catch(fail) {
      console.error(fail);
    }
    finally {
      this.loading = false;
    }
  }

  async onFilter() {
    this.loading = true;
    try {
      let languages : string[] = [];
      for (let [language, enabled] of Object.entries(this.filterLanguage))
        if (enabled) languages.push(language);

      this.filterMetadata = await this.rutService.filterResource(this.resource!.id, languages);
      this.filteredConcepts = this.prepareTreeNode(this.filterMetadata!.concepts);
    }
    catch(fail) {
      console.error(fail);
    }
    finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    this.loading = true;
    try {
      await this.rutService.submitResource(this.resource!.id, this.repository);
      this.resource = null;
    }
    catch(fail) {
      console.error(fail);
    }
    finally {
      this.loading = false;
    }
  }

  async onChangeTab(e: any) {
    if (e.index == 4 && this.resource?.sparql == null) {
      await this.onConvert();
    } else if (e.index == 1 && this.filterMetadata == null) {
      await this.onFilter();
    }
  }

  async onChangeLanguage(e: any, language: string) {
    this.filterLanguage[language] = e.checked;
    await this.onFilter();
  }

}

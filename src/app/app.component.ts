import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

import { RutService } from './rut/rut.service';
import type { Resource, Concept, Term } from './rut/rut.service';

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
  resource? : Resource;
  filteredResource? : Resource;
  conversionType : ConversionType = ConversionType.automatic;
  repository : string = 'LexO';
  loading : boolean = false;
  filterLanguage : {[language:string] : boolean} = {};
  concepts: TreeNode[] = [];

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

        if (language.terms) {
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
      }
      let node : TreeNode = {
        key: id, label, icon: 'pi pi-fw pi-sitemap',
        children: languageNodes,
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
      this.filteredResource = this.resource;
      for (let language of this.resource!.languages)
        this.filterLanguage[language] = true;

      this.concepts = this.prepareTreeNode(this.resource.concepts);
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

      this.filteredResource = await this.rutService.filterResource(this.resource!.id, languages);
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
      this.resource = undefined;
      this.filteredResource = undefined;
      this.concepts = [];
    }
    catch(fail) {
      console.error(fail);
    }
    finally {
      this.loading = false;
    }
  }

  async onChangeTab(e: any) {
    if (e.index == 4 && !this.resource?.sparql) {
      await this.onConvert();
    } else if (e.index == 1 && this.filteredResource) {
      await this.onFilter();
    }
  }

  async onChangeLanguage(e: any, language: string) {
    this.filterLanguage[language] = e.checked;
    await this.onFilter();
  }

}

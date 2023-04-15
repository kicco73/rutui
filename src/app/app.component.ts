import { Component, Output } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';

type Resource = {
  id: string;
  metadata: {
    fileSize: number;
    variant: string;
    concepts: {string: string[]};
    numberOfTerms: number;
    numberOfConcepts: number;
    languages: string[];
  };
  sparql?: String;
}

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
  restApi: string = 'http://localhost:8080/resources';

  title : string = 'rutui';
  tbx : string = '';
  resource : Resource | null = null;
  conversionType : ConversionType = ConversionType.automatic;
  repository : String = 'LexO';
  loading : boolean = false;

  async onUpload(event: FileUpload) {
    for(let file of event.files) {
      this.tbx = await file.text();
      await this.onCreate();
    }
  }

  async onCreate() {
    this.loading = true;
    fetch(this.restApi, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'tbx': this.tbx })
    })
    .then(response => response.json())
    .then(resource => this.resource = resource)
    .catch(fail => console.error(fail))
    .finally(() => this.loading = false)
  }

  async onConvert() {
    this.loading = true;
    fetch(`${this.restApi}/${this.resource!.id}/sparql`, {
      method: 'GET',
      headers: {
        'Accept': 'application/sparql-query',
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.text())
    .then(sparql => this.resource!.sparql = sparql)
    .catch(fail => console.error(fail))
    .finally(() => this.loading = false)
  }

  async onSubmit() {
    this.loading = true;
    fetch(`${this.restApi}/${this.resource!.id}/submit`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'repository': this.repository })
    })
    .then(response => response.json())
    .then(json => this.resource = null)
    .catch(fail => console.error(fail))
    .finally(() => this.loading = false)
  }

  async onChangeTab(e: any) {
    if (e.index == 4 && this.resource?.sparql == null) {
      await this.onConvert();
      console.log('ho finito')
    }
  }

}

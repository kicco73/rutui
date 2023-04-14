import { Component, Output } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';

type Resource = {
  metadata: {
    id: string;
    fileSize: number;
    tbxType: string;
    numberOfConcepts: number;
    numberOfTerms: number;
    numberOfLanguages: number;
  };
  sparql: String;
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
      this.onConvert();
    }
  }

  async onConvert() {
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
    .then(sparql => this.resource = sparql)
    .catch(fail => console.error(fail))
    .finally(() => this.loading = false)
  }

  async onSubmit() {
    this.loading = true;
    fetch(`${this.restApi}/${this.resource!.metadata.id}/submit`, {
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

}

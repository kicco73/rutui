import { Component, Output } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';

type Sparql = {
  fileSize: number;
  tbxType: string;
  numberOfConcepts: number;
  numberOfTerms: number;
  numberOfLanguages: number;
  content: String;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title : string = 'rutui';
  tbx : string = '';
  sparql : Sparql | null = null;

  async onUpload(event: FileUpload) {
    for(let file of event.files) {
      this.tbx = await file.text();
      this.onConvert();
    }
  }

  async onConvert() {
    console.log('ciao');
    fetch("http://localhost:8080/convert", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "tbx": this.tbx })
    })
    .then(response => response.json())
    .then(sparql => this.sparql = sparql)
    .catch(fail => console.error(fail));
  }
}

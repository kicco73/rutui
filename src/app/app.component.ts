import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

import { RutService } from './rut/rut.service';
import { NotificationService } from './rut/notification.service';
import type { Resource, Filter } from './rut/rut.service';
import type { Notification, JobUpdate } from './rut/notification.service';
import { MessageService } from 'primeng/api';

enum ConversionType {
  automatic = 'automatic',
  interactive = 'interactive'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})

export class AppComponent {
  title : string = 'rutui';
  tbx : string = '';
  resource? : Resource;
  filteredResource? : Resource;
  conversionType : ConversionType = ConversionType.automatic;
  repository : string = 'LexO';
  loading : boolean = false;
  progress: number = 0;
  conceptMapping: string = 'skos';
  defaultNamespace: string = "http://txt2rdf/test#";
  filter: Filter;

  constructor(public messageService: MessageService, private rutService: RutService, private notificationService: NotificationService) {
    this.filter = this.newFilter();
    this.notificationService.addNotificationListener((msg: Notification) => {
      let message : Message = { severity: msg.severity, summary: msg.summary, detail: msg.detail };
      this.messageService.add(message);
    })

    this.notificationService.addJobUpdateListener((msg: JobUpdate) => {
      this.progress = msg.progress;
    })
  }

  newFilter(): Filter {
    return {
      dates: [],
      subjectFields: [],
      languages: [],
      noConcepts: false,
    };
  }

  async onUpload(event: FileUpload) {
    for(let file of event.files) {
      this.tbx = await file.text();
      await this.onCreate();
    }
  }

  async onCreate() {
    this.loading = true;
    try {
      this.resource = await this.rutService.createResource(this.tbx);
      this.filter = this.newFilter();
      this.filteredResource = this.resource;
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
      this.filteredResource = await this.rutService.filterResource(
        this.resource!.id,
        this.filter,
      );
    }
    catch(fail) {
      console.error(fail);
    }
    finally {
      this.loading = false;
    }
  }

  async onAssemble() {
    this.loading = true;
    this.resource!.sparql = undefined;
    try {
      this.resource!.sparql = await this.rutService.assembleResource(
        this.resource!.id,
        this.filter,
      );
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
    }
    catch(fail) {
      console.error(fail);
    }
    finally {
      this.loading = false;
    }
  }

  async onChangeTab(e: any) {
    if (e.index == 4) {
      await this.onAssemble();
    }
  }

  async onChangeLanguage(e: any) {
    this.filter.languages = e.value;
    await this.onFilter();
  }
  async onChangeDates(e: any) {
    this.filter.dates = e.value;
    await this.onFilter();
  }

  async onChangeSubjectField(event: any) {
    this.filter.subjectFields = event.value;
    await this.onFilter();
  }

}

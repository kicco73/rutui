import { Component, Input } from '@angular/core';
import { Summary } from '../rut/rut.service';

@Component({
  selector: 'app-tbx-summary',
  templateUrl: './tbx-summary.component.html',
  styleUrls: ['./tbx-summary.component.css']
})
export class TbxSummaryComponent {
  @Input() summary?: Summary;
}

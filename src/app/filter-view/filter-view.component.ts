import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Concept, Resource } from '../rut/rut.service';

@Component({
  selector: 'app-filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.css'],
})
export class FilterViewComponent implements OnChanges {
  @Input() resource?: Resource;
  treeNodes: TreeNode[] = [];

  prepareTreeTableNode(): void {
    this.treeNodes = [];

    for (let concept of Object.values(this.resource!.concepts)) {
      let { id, description } = concept;
      let label = `${description} (${id})`;

      let descriptionNode: TreeNode = {
        data: {
          id: 'Definition',
          definitions: [],
          terms: [],
        }
      };

      let conceptNode: TreeNode = {
        data: {
          id: label,
          definitions: [],
          terms: [],
        },
        children: [descriptionNode],
      };

      for (let language of this.resource!.languages) {
        let x = [];
        if (concept.languages[language]?.terms) {
          for (let term of concept.languages[language].terms!) {
            x.push(term.t);
          }
        }
        conceptNode.data.terms.push(x);

        if (concept.languages[language]?.definition) {
          descriptionNode.data.definitions.push(
            concept.languages[language].definition!
          );
        } else {
          descriptionNode.data.definitions.push('');
        }
      }

      this.treeNodes.push(conceptNode);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.resource = changes['resource'].currentValue;
    this.prepareTreeTableNode();
  }
}

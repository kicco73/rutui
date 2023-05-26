import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptTableComponent } from './concept-table.component';

describe('ConceptTableComponent', () => {
  let component: ConceptTableComponent;
  let fixture: ComponentFixture<ConceptTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConceptTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

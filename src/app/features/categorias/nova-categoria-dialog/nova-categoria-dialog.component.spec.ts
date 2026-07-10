import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaCategoriaDialogComponent } from './nova-categoria-dialog.component';

describe('NovaCategoriaDialogComponent', () => {
  let component: NovaCategoriaDialogComponent;
  let fixture: ComponentFixture<NovaCategoriaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaCategoriaDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NovaCategoriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
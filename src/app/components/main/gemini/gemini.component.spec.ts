import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeminiComponent } from './gemini.component';

describe('GeminiComponent', () => {
  let component: GeminiComponent;
  let fixture: ComponentFixture<GeminiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeminiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeminiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentModelComponent } from './sentiment-model.component';

describe('SentimentModelComponent', () => {
  let component: SentimentModelComponent;
  let fixture: ComponentFixture<SentimentModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit{
  visualisationForm !: FormGroup;
  isDescriptionVisible = false;
  isActive = false;


  constructor(private formBuilder: FormBuilder){

  }
  ngOnInit(): void {

  }
  toggleDescription(): void {
    this.isDescriptionVisible = !this.isDescriptionVisible;
  }

  toggleActiveState(): void {
    this.isActive = !this.isActive;
  }

 
 
}

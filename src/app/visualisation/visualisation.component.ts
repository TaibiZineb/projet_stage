import { Component,OnInit,AfterViewInit } from '@angular/core';
import {  FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit,AfterViewInit{
  visualisationForm !: FormGroup;
 



  constructor(private formBuilder: FormBuilder){

  }
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    const addButton = document.getElementById("addButton");
    if (addButton) {
      addButton.addEventListener("click", this.ajouterBloc.bind(this));
    }
  }

  ajouterBloc() {
    const blocExistant = document.querySelector(".blocks") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const container = document.getElementById("container");
      if (container) {
        container.appendChild(nouveauBloc);
      }
    }
  }
  ajouterBlocEdu() {
    const blocExistant = document.querySelector(".blocksEdu") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const containerEdu = document.getElementById("containerEdu");
      if (containerEdu) {
        containerEdu.appendChild(nouveauBloc);
      }
    }
  }
  ajouterBlocLang() {
    const blocExistant = document.querySelector(".blocksLang") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const containerLang = document.getElementById("containerLang");
      if (containerLang) {
        containerLang.appendChild(nouveauBloc);
      }
    }
  }
  ajouterBlocCertif() {
    const blocExistant = document.querySelector(".blocksCertif") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const containerCertif = document.getElementById("containerCertif");
      if (containerCertif) {
        containerCertif.appendChild(nouveauBloc);
      }
    }
  }
  ajouterBlocCopet() {
    const blocExistant = document.querySelector(".blocksCopet") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const containerCopet = document.getElementById("containerCopet");
      if (containerCopet) {
        containerCopet.appendChild(nouveauBloc);
      }
    }
  }
}
  




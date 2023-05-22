import { Component,OnInit } from '@angular/core';
@Component({
  selector: 'app-importer',
  templateUrl: 'importer.component.html',
  styleUrls: ['importer.component.css']
})
export class ImporterComponent implements OnInit {
  
  uploadedFileName!: string;
  imageSrc!: string;
  constructor() {}

  ngOnInit(): void {}
  

  triggerFileInput() {
    const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
    fileInput.click();
  }

  readURL(input: any) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const imageUploadWrap = document.querySelector('.image-upload-wrap');
        const fileUploadContent = document.querySelector('.file-upload-content');

        if (imageUploadWrap) {
          imageUploadWrap.classList.add('hidden');
        }

        if (fileUploadContent) {
          fileUploadContent.classList.remove('hidden');
        }

        this.imageSrc = e.target.result;
        this.uploadedFileName = input.files[0].name;
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      this.removeUpload();
    }
  }

  removeUpload() {
    const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
    fileInput.value = '';

    const fileUploadContent = document.querySelector('.file-upload-content');
    const imageUploadWrap = document.querySelector('.image-upload-wrap');

    if (fileUploadContent) {
      fileUploadContent.classList.add('hidden');
    }

    if (imageUploadWrap) {
      imageUploadWrap.classList.remove('hidden');
    }

    this.uploadedFileName = '';
    this.imageSrc = '';
  }

 
}


 


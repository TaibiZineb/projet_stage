import { Component,OnInit } from '@angular/core';
@Component({
  selector: 'app-importer',
  templateUrl: 'importer.component.html',
  styleUrls: ['importer.component.css']
})
export class ImporterComponent implements OnInit {
  
  uploadedFileName!: string;
  isFileUploaded: boolean = false;
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
      
        const fileUploadContent = document.querySelector('.file-upload-content');

       

        if (fileUploadContent) {
          fileUploadContent.classList.remove('hidden');
        }

        this.isFileUploaded = true;
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
 

    if (fileUploadContent) {
      fileUploadContent.classList.add('hidden');
    }
    this.isFileUploaded = false;
   

    this.uploadedFileName = '';
   
  }

 
}


 


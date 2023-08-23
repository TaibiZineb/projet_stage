import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CvParserService } from '../services/cv-parser.service';

@Component({
  selector: 'app-importer',
  templateUrl: 'importer.component.html',
  styleUrls: ['importer.component.css']
})
export class ImporterComponent implements OnInit {
  uploadedFileName!: string;
  isFileUploaded: boolean = false;
  constructor(private router: Router, private cvParserService: CvParserService) {}
  ngOnInit(): void {}
  triggerFileInput() {
    const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
    fileInput.click();
  }
  readURL(input: any) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const file = input.files[0];
        const base64File = await this.cvParserService.encodeFileToBase64(file); // Utilisez votre fonction d'encodage
        const cvDetails = {
          fileName: file.name,
          data: base64File,
          // Autres détails du CV que vous pourriez avoir
        };
        // Ajoutez les détails du CV dans la base de données
        this.cvParserService.addCV(cvDetails);

        this.router.navigate(['/admin/visualisation'], {
          queryParams: { fileName: file.name }
        });
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


 


import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-importer',
  templateUrl: './importer.component.html',
  styleUrls: ['./importer.component.css']
})
export class ImporterComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  file: File | undefined;

  browseFile() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.uploadFile();
    }
  }

  uploadFile() {
    const dropArea = document.querySelector(".drag-area");
    const dragText = dropArea?.querySelector("header");
    if (dropArea && dragText) {
      dropArea.classList.add("active");
      dragText.textContent = "Release to Upload File";
    }

    const fileType = this.file?.type;
    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (fileType && validExtensions.includes(fileType)) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileURL = fileReader.result as string;
        const imgTag = `<img src="${fileURL}" alt="">`;
        if (dropArea) {
          dropArea.innerHTML = imgTag;
        }
      };
      fileReader.readAsDataURL(this.file as Blob);
    } else {
      alert("This is not an Image File!");
      if (dropArea && dragText) {
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
      }
    }
  }
}

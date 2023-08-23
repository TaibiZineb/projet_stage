import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CvParserService {

  constructor(private http: HttpClient) { }
  async parseResume(file: any): Promise<string> {
    try {
      const response = await fetch('https://eu-rest.resumeparsing.com/v10/parser/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Sovren-AccountId': '17097504',
          'Sovren-ServiceKey': 'i8Stm46FEsltKLqQ2VNz1MzhCnlHORAYnOUO/dP7'
        },
        body: JSON.stringify({
          DocumentAsBase64String: file,
          DocumentLastModified: (new Date()).toISOString().substring(0, 10)
        })
      });

      const data = await response.json();
      return data.Value?.ResumeData;

    } catch (error) {
      console.log(`Error when parsing resume: ${error}`);
      return "Something went wrong";
    }
  }
  addCV(cvDetails: any) {
    return this.http.post('/api/add-cv', cvDetails); // Remplacez par votre endpoint
  }
  encodeFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error("Unable to read file as base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }
}

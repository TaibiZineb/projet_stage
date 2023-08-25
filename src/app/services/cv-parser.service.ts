import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root'
})
export class CvParserService {
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  constructor(private http: HttpClient) {
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
   }
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
  async addCV(cvDetails: any) {
    try {
      const { data, error } = await this.supabase.from('CV').insert([cvDetails]);
      if (error) {
        console.error('Error adding CV to Supabase:', error);
      } else {
        console.log('CV added successfully:', data);
      }
    } catch (error) {
      console.error('Error adding CV to Supabase:', error);
    }
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

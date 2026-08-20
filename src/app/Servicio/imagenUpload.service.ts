// Servicio: imagen-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Imagen } from '../Modelo/imagen';

@Injectable({
  providedIn: 'root'
})
export class ImagenUploadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<Imagen> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    return this.http.post<Imagen>(
      `${this.apiUrl}/auth/upload/imagen`,
      formData
    );
  }
}
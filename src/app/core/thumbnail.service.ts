import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {
  private apiKey = environment.thumbnailApiKey;
  private apiUrl = 'https://api.thumbnail.ws/api'

  getThumbnail(url: string): string {
    const thumbnailUrl = `${this.apiUrl}/${this.apiKey}/thumbnail/get?url=${encodeURIComponent(url)}&width=400`;
    return thumbnailUrl;
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonResults {
  results: Pokemon[];
}

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  private http = inject(HttpClient);
  urlApi = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0'

  getPokemonList(): Observable<PokemonResults> {
    return this.http.get<PokemonResults>(this.urlApi);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Interfaces
export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDB {
  name: string;
  alias: string;
  sprite: string;
  actualSprite: string;
  actualLevel: number;
  secondFormLevel: number;
  secondFormSprite: string;
  thirdFormLevel: number;
  thirdFormSprite: string;
}

export interface PokemonResults {
  results: Pokemon[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private baseUrl = 'https://pokeapi.co/api/v2';

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  // Método para obtener la lista de Pokémon filtrada
  getPokemonList(): Observable<Pokemon[]> {
    return this.http.get<PokemonResults>(`${this.baseUrl}/pokemon?limit=151&offset=0`).pipe(
      switchMap((data: PokemonResults) => {
        const pokemonList = data.results;

        // Filtrar los Pokémon que son etapa base o no tienen evolución
        const filteredPokemon$ = pokemonList.map((pokemon: Pokemon) =>
          this.isBaseOrNoEvolution(pokemon.name).pipe(
            map(isValid => (isValid ? pokemon : null))
          )
        );

        // Combinar todas las verificaciones y filtrar los resultados válidos
        return forkJoin(filteredPokemon$).pipe(
          map(results => results.filter(pokemon => pokemon !== null))
        );
      })
    );
  }

   // Método auxiliar para obtener los detalles de un Pokémon por nombre
   private getPokemonDetailsByName(pokemonName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${pokemonName}`);
  }

   // Método para obtener la cadena evolutiva de un Pokémon
   getEvolutionChain(pokemonName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${pokemonName}`).pipe(
      switchMap((species: any) => {
        const evolutionChainUrl = species.evolution_chain?.url;

        // Si no hay cadena de evolución, retornar un objeto con valores nulos
        if (!evolutionChainUrl) {
          return this.getPokemonDetailsByName(pokemonName).pipe(
            map(details => ({
              basePokemon: {
                name: pokemonName,
                sprite: details.sprites.front_default
              },
              firstEvolution: null,
              secondEvolution: null
            }))
          );
        }

        // Obtener la cadena de evolución
        return this.http.get<any>(evolutionChainUrl).pipe(
          switchMap((chain: any) => {
            const basePokemonName = chain.chain.species.name;

            // Obtener los detalles del Pokémon base
            const basePokemon$ = this.getPokemonDetailsByName(basePokemonName);

            // Obtener los detalles de la primera evolución (si existe)
            const firstEvolution$ = chain.chain.evolves_to[0]
              ? this.getPokemonDetailsByName(chain.chain.evolves_to[0].species.name)
              : of(null);

            // Obtener los detalles de la segunda evolución (si existe)
            const secondEvolution$ = chain.chain.evolves_to[0]?.evolves_to[0]
              ? this.getPokemonDetailsByName(chain.chain.evolves_to[0].evolves_to[0].species.name)
              : of(null);

            // Combinar todas las llamadas
            return forkJoin([basePokemon$, firstEvolution$, secondEvolution$]).pipe(
              map(([basePokemon, firstEvolution, secondEvolution]) => ({
                basePokemon: {
                  name: basePokemonName,
                  sprite: basePokemon.sprites.other.showdown.front_default
                },
                firstEvolution: firstEvolution
                  ? {
                      name: chain.chain.evolves_to[0].species.name,
                      sprite: firstEvolution.sprites.other.showdown.front_default,
                      level: chain.chain.evolves_to[0].evolution_details[0]?.min_level || 25,
                      trigger: chain.chain.evolves_to[0].evolution_details[0]?.trigger?.name || null
                    }
                  : null,
                secondEvolution: secondEvolution
                  ? {
                      name: chain.chain.evolves_to[0].evolves_to[0].species.name,
                      sprite: secondEvolution.sprites.other.showdown.front_default,
                      level: chain.chain.evolves_to[0].evolves_to[0].evolution_details[0]?.min_level || 37,
                      trigger: chain.chain.evolves_to[0].evolves_to[0].evolution_details[0]?.trigger?.name || null
                    }
                  : null
              }))
            );
          })
        );
      })
    );
  }

  // Método auxiliar para verificar si un Pokémon es etapa base o sin evolución
  private isBaseOrNoEvolution(pokemonName: string): Observable<boolean> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${pokemonName}`).pipe(
      switchMap((species: any) => {
        const evolutionChainUrl = species.evolution_chain?.url;
  
        // Si no hay cadena de evolución, significa que no tiene evolución
        if (!evolutionChainUrl) {
          return of(true); // Envolver el valor `true` en un Observable
        }
  
        // Si tiene cadena de evolución, verificar si es la etapa base
        return this.isBasePokemon(evolutionChainUrl, pokemonName);
      })
    );
  }

  // Método auxiliar para verificar si un Pokémon es la etapa base
  private isBasePokemon(evolutionChainUrl: string, pokemonName: string): Observable<boolean> {
    return this.http.get<any>(evolutionChainUrl).pipe(
      map((chain: any) => {
        const basePokemonName = chain.chain.species.name;
        return basePokemonName === pokemonName;
      })
    );
  }
}
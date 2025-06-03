import { Component, inject, OnInit } from '@angular/core';
import { Pokemon, PokemonService } from '../../data-access/pokemon.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-choose-pokemon',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './choose-pokemon.component.html',
  styleUrl: './choose-pokemon.component.css'
})
export default class ChoosePokemonComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  selectedPokemonUrl: string = ''; // URL del Pokémon seleccionado
  pokemons: Pokemon[] = []; // Lista de Pokémon
  selectedPokemonDetails: any; // Detalles del Pokémon seleccionado
  cadenaDeEvoluciones: any; // Detalles del Pokémon seleccionado
  mostrarBase: boolean = false;
  mostrarPrimeraEvo: boolean = false;
  mostrarSegundaEvo: boolean = false;
  rutaEevee = 'https://pokeapi.co/api/v2/pokemon/133/'

  ngOnInit(): void {
    // Obtener la lista de Pokémon
    this.pokemonService.getPokemonList().subscribe({
      next: (pokemonList) => {
        this.pokemons = pokemonList; // Asignar directamente la lista de Pokémon
      },
      error: (err) => {
        console.error('Error al obtener la lista de Pokémon:', err);
      }
    });
  }

  onPokemonSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPokemonUrl = selectElement.value;

    if (this.selectedPokemonUrl) {

      // Validamos si no es eevee ya que el tiene una forma distina de evolucionar
      if (this.selectedPokemonUrl != this.rutaEevee) {
        // Limpiar los datos previos
        this.selectedPokemonDetails = null;
        this.cadenaDeEvoluciones = {
          basePokemon: null,
          firstEvolution: null,
          secondEvolution: null
        };

        // Obtener los detalles del Pokémon seleccionado
        this.pokemonService.getPokemonDetails(this.selectedPokemonUrl).subscribe({
          next: (details) => {
            this.selectedPokemonDetails = details;
            this.mostrarBase = true;

            // Obtener la cadena evolutiva del Pokémon seleccionado
            this.pokemonService.getEvolutionChain(details.name).subscribe({
              next: (evolutionChain) => {
                this.cadenaDeEvoluciones = evolutionChain; // Asignar la nueva cadena evolutiva
                if (evolutionChain.firstEvolution) {
                  this.mostrarPrimeraEvo = true;
                }
                else {
                  this.mostrarPrimeraEvo = false;
                }
                if (evolutionChain.secondEvolution) {
                  this.mostrarSegundaEvo = true;
                }
                else {
                  this.mostrarSegundaEvo = false;
                }
                //)
                console.log('Cadena evolutiva:', this.cadenaDeEvoluciones);
              },
              error: (err) => {
                console.error('Error al obtener la cadena evolutiva:', err);
              }
            });
          },
          error: (err) => {
            // TODO: Caso Eevee
            console.error('Error al obtener los detalles del Pokémon:', err);
          }
        });
      }
      else {
        console.log("Elegiste a Eevee, se esta trabajando en el modulo para su evolucion en particular")
      }
    } else {
      // Si no se selecciona un Pokémon, limpiar todos los datos
      this.selectedPokemonDetails = null;
      this.cadenaDeEvoluciones = {
        basePokemon: null,
        firstEvolution: null,
        secondEvolution: null
      };
    }
  }
}
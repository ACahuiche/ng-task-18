import { Component, inject, OnInit } from '@angular/core';
import { Pokemon, PokemonService } from '../../data-access/pokemon.service';

@Component({
  selector: 'app-choose-pokemon',
  standalone: true,
  imports: [],
  templateUrl: './choose-pokemon.component.html',
  styleUrl: './choose-pokemon.component.css'
})
export default class ChoosePokemonComponent implements OnInit{
  private pokemonService = inject(PokemonService)
  selectedPokemonUrl: string;
  pokemons: Pokemon[];
  selectedPokemonDetails: any;

  constructor() {
    this.pokemons = [];
    this.selectedPokemonUrl = '';
  }

  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe((result) => {
      this.pokemons = result.results;
    });
  }

  onPokemonSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPokemonUrl = selectElement.value;
    
    if(this.selectedPokemonUrl){
      this.pokemonService.getPokemonDetails(this.selectedPokemonUrl).subscribe((result) => {
        this.selectedPokemonDetails = result;
        console.log(this.selectedPokemonDetails);
      });
    }
    
  }


}

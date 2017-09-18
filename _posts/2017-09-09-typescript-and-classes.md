---
layout: post
title: Typescript And Classes
---

## Private Methods and Properties

```typescript
class Pokemon {

    public name: string;
    private _area: string;

    constructor(name, area) {

        this.name = name
        this._area = area
    }

    // methods
    public sayArea(): string {

        return `Hey I'm ${this._shoutName}, and I'm from ${this._area}`
        // _area and _shoutName() are accessible from within the class
        // but not outside (see below)
    }

    private _shoutName(): string {
        return this.name + "!!!!"
    }
}

let pikachu = new Pokemon("Pikachu", "Kanto")

console.log(pikachu.name) // Pikachu
console.log(pikachu.sayArea()) // Hey I'm Pikachu and I'm from Kanto

console.log(pikachu._area) // Error
console.log(pikachu._shoutName()) // Error
```

```bash
classes.ts(65,21): error TS2341: Property '_area' is private and only accessible
within class 'Pokemon'.
classes.ts(66,21): error TS2341: Property '_shoutName' is private and only
accessible within class 'Pokemon'.
```

## Constructor Properties

```typescript
class Pokemon {

    public name: string;
    private _area: string;

    constructor(name, area, public level?: string) {

        this.name = name
        this._area = area
        // notice we don't need to set this.level = level in the constructor
    }

    // methods

    public sayLevel(): string {

        if(!this.level) {
            return "I don't even know man"
        }

        return `I am level ${this.level}`
    }

    // other methods ...

}

let pikachu = new Pokemon("Pikachu", "Kanto")
let natu    = new Pokemon("Natu", "Johto", 23)

console.log(pikachu.sayLevel()) // I don't even know man
console.log(natu.sayLevel()) // I am level 23
```

## Static Methods and Properties

Methods and properties only accessible by the class itself and not its
instances

```typescript
class Pokemon {

    public name: string;
    private _area: string;
    public static TOTAL_POKEMONS: number = 0

    constructor(name, area, public level?: string) {

        this.name = name
        this._area = area
        Pokemon.TOTAL_POKEMONS++ // We increase the total number of pokemon each time a new pokemon is created
    }

    // methods
    // ...
}

let pikachu = new Pokemon("Pikachu", "Kanto")
console.log(Pokemon.TOTAL_POKEMONS) // 1

let natu    = new Pokemon("Natu", "Johto", 23)
console.log(Pokemon.TOTAL_POKEMONS) // 2

console.log(pikachu.TOTAL_POKEMONS) // error
console.log(natu.TOTAL_POKEMONS) // error
```

```bash
classes.ts(81,21): error TS2339: Property 'TOTAL_POKEMONS' does not exist on
type 'Pokemon'.
```

## Getters and Setters

```typescript
class Pokemon {

    public name: string;
    private _area: string;
    private _trainerName: string;

    constructor(name, area, trainerName?) {

        this.name = name
        this._area = area
        this._trainerName = trainerName
    }

    public get trainerName(): string {
        if (!this._trainerName) {
            return "New phone, who dis ?"
        }
        return this._trainerName
    }

    public set trainerName(newTrainerName: string) {
        this._trainerName = newTrainerName
    }
}

let pikachu = new Pokemon("Pikachu", "Kanto", "Ash")
console.log("My trainer ? ", pikachu.trainerName) // Ash
pikachu.trainerName = "Brock" // setter
console.log("My trainer ? ", pikachu.trainerName) // Brock (this would never happen but let's just pretend)
```

# React-2048

Implementation of the game 2048, using Parcel, React and react-spring. 

https://2048.undo76.net

## Background

Originally developed with Riot.js and then ported to Typescript and React in order to experiment with Parcel, react-spring, gestures and react-hooks.

## Installation and build

 1. Clone the repository
 2. Install dependencies: 
  ```npm install```
 3. Start development server:
 ``` npm run dev ```
 4. Build for production into `dist`: ```npm run build```

## TO DO

 - Some animations are not implemented yet.
 - The state of the game is ported from the original Riot.js implementation in a mutable fashion, it would be nicer to implement as a state reducer.
 - The game engine wasn't prepared for animations, they are an afterthought that adds complexity to the implementation. It should be reimplemented with animations in mind.
 - The end screen is ugly.

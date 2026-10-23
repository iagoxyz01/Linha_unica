'use strict';
// Funções utilitárias
const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[rand(0, a.length - 1)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const tier = p => p <= CONFIG.TIER_LIMITS[0] ? 0 : p <= CONFIG.TIER_LIMITS[1] ? 1 : 2;
const key = (a, b) => a < b ? a + '-' + b : b + '-' + a;   // identificador não direcionado da aresta

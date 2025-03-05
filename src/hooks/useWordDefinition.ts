'use client';

import { useState, useEffect } from 'react';

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

export interface WordDefinition {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text: string;
    audio?: string;
  }>;
  origin?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }>;
  }>;
  etymology?: string;
}

// Mock data for development purposes
const mockDefinitions: Record<string, WordDefinition> = {
  urban: {
    word: 'urban',
    phonetic: '/ˈɜːbən/',
    phonetics: [{ text: '/ˈɜːbən/' }],
    origin: 'early 17th century: from Latin urbanus, from urbs, urb- "city"',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Relating to, situated in, or characteristic of a town or city.',
            example: 'the urban population',
            synonyms: ['built-up', 'town', 'city', 'metropolitan', 'suburban'],
            antonyms: ['rural', 'country']
          },
          {
            definition: '(of popular dance music) performed or produced by Black artists.',
            example: 'urban radio stations',
            synonyms: [],
            antonyms: []
          }
        ]
      }
    ],
    etymology: 'From Latin urbanus ("of or pertaining to a city"), from urbs ("city")'
  },
  expansion: {
    word: 'expansion',
    phonetic: '/ɪkˈspanʃ(ə)n/',
    phonetics: [{ text: '/ɪkˈspanʃ(ə)n/' }],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The action of becoming larger or more extensive.',
            example: 'the rapid expansion of suburban Washington',
            synonyms: ['growth', 'enlargement', 'extension', 'increase', 'spread'],
            antonyms: ['contraction', 'shrinkage']
          },
          {
            definition: 'The increase in the volume of fuel on combustion in the cylinder of an engine.',
            example: '',
            synonyms: [],
            antonyms: []
          }
        ]
      }
    ],
    etymology: 'From Latin expansio, from expandere ("to spread out")'
  },
  land: {
    word: 'land',
    phonetic: '/land/',
    phonetics: [{ text: '/land/' }],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The part of the earth\'s surface that is not covered by water.',
            example: 'the reptiles lay their eggs on land',
            synonyms: ['ground', 'earth', 'terrain', 'soil'],
            antonyms: ['sea', 'water']
          },
          {
            definition: 'An area of ground, especially in terms of its ownership or use.',
            example: 'my family owned a lot of land',
            synonyms: ['property', 'real estate', 'grounds', 'territory'],
            antonyms: []
          }
        ]
      },
      {
        partOfSpeech: 'verb',
        definitions: [
          {
            definition: 'Arrive at a place, especially after a journey by sea or air.',
            example: 'the plane landed at Cairo',
            synonyms: ['arrive', 'touch down', 'come down', 'alight'],
            antonyms: ['take off', 'depart']
          }
        ]
      }
    ],
    etymology: 'From Old English land, from Proto-Germanic *landą'
  }
};

interface CachedDefinition {
  definition: WordDefinition;
  timestamp: number;
}

export function useWordDefinition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [definition, setDefinition] = useState<WordDefinition | null>(null);

  // Check if a cached definition is still valid
  const isCacheValid = (cachedData: CachedDefinition): boolean => {
    const now = Date.now();
    return now - cachedData.timestamp < CACHE_EXPIRATION;
  };

  // Get definition from cache if available
  const getFromCache = (word: string): WordDefinition | null => {
    try {
      const cachedData = localStorage.getItem(`word_definition_${word.toLowerCase()}`);
      if (cachedData) {
        const parsedData: CachedDefinition = JSON.parse(cachedData);
        if (isCacheValid(parsedData)) {
          return parsedData.definition;
        } else {
          // Remove expired cache
          localStorage.removeItem(`word_definition_${word.toLowerCase()}`);
        }
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    return null;
  };

  // Save definition to cache
  const saveToCache = (word: string, def: WordDefinition) => {
    try {
      const cacheData: CachedDefinition = {
        definition: def,
        timestamp: Date.now()
      };
      localStorage.setItem(`word_definition_${word.toLowerCase()}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const fetchDefinition = async (word: string) => {
    if (!word) return;
    
    // First check if we have a cached definition
    const cachedDefinition = getFromCache(word);
    if (cachedDefinition) {
      console.log('Using cached definition for:', word);
      setDefinition(cachedDefinition);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Normalize the word to lowercase for consistent lookup
      const normalizedWord = word.toLowerCase();
      
      // For development, use mock data
      if (mockDefinitions[normalizedWord]) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const def = mockDefinitions[normalizedWord];
        setDefinition(def);
        saveToCache(word, def);
      } else {
        // In a real implementation, we would fetch from an API
        // const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        // if (!response.ok) throw new Error('Failed to fetch definition');
        // const data = await response.json();
        // setDefinition(data[0]);
        // saveToCache(word, data[0]);
        
        // For now, return a generic definition for words not in our mock data
        await new Promise(resolve => setTimeout(resolve, 300));
        const genericDef = {
          word: word,
          phonetic: `/ˈ${word}/`,
          meanings: [
            {
              partOfSpeech: 'noun',
              definitions: [
                {
                  definition: `Definition for "${word}" would appear here.`,
                  example: `Example using "${word}" would appear here.`,
                  synonyms: ['similar1', 'similar2'],
                  antonyms: ['opposite1', 'opposite2']
                }
              ]
            }
          ],
          etymology: 'Etymology information would appear here.'
        };
        setDefinition(genericDef);
        saveToCache(word, genericDef);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setDefinition(null);
    } finally {
      setLoading(false);
    }
  };

  const clearDefinition = () => {
    setDefinition(null);
    setError(null);
  };

  return {
    definition,
    loading,
    error,
    fetchDefinition,
    clearDefinition
  };
}

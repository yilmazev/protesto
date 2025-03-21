export function getRandomUsername() {
  const adjectives = [
    "Swift", "Mysterious", "Red", "Infinite", "Lonely", "Dark",
    "Brave", "Silent", "Electric", "Rapid", "Shadowy", "Stormy",
    "Wild", "Fierce", "Fearless", "Golden", "Thunderous", "Savage",
    "Clever", "Phantom", "Blazing", "Cunning", "Wandering", "Frozen",
    "Nocturnal", "Hidden", "Eternal", "Cosmic", "Invisible", "Daring"
  ]

  const nouns = [
    "Eagle", "Shadow", "Warrior", "Wind", "Captain", "Lion",
    "Wolf", "Hawk", "Tiger", "Phoenix", "Rogue", "Nomad",
    "Hunter", "Gladiator", "Knight", "Rider", "Falcon", "Guardian",
    "Vortex", "Sorcerer", "Sailor", "Drifter", "Mystic", "Seeker",
    "Ranger", "Traveler", "Specter", "Striker", "Enigma", "Explorer"
  ]

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${randomAdjective}${randomNoun}${Math.floor(1000 + Math.random() * 9000)}` // 4 haneli numara
}
import { emotes } from "@/data/emotes"

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
  return `${randomAdjective}${randomNoun}${Math.floor(1000 + Math.random() * 9000)}`
}

export const formatDate = (timestamp: number, type: number = 0) => {
  if (!timestamp) return "Bilinmiyor";
  const date = new Date(timestamp);

  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  if (type === 1) return `${day} ${month}`;
  if (type === 2) return `${hours}:${minutes}`;
  if (type === 3) return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  if (type === 4) return getTimeDifference(date);

  return `${day} ${month}, ${hours}:${minutes}`;
};

export const getTimeDifference = (date: Date): string => {
  const now = new Date();
  const differenceInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (differenceInSeconds < 60) return "Az önce";
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  if (differenceInMinutes < 60) return `${differenceInMinutes} dakika önce`;
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) return `${differenceInHours} saat önce`;
  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays === 1) return "Dün";
  if (differenceInDays < 7) return `${differenceInDays} gün önce`;
  const differenceInWeeks = Math.floor(differenceInDays / 7);
  if (differenceInWeeks < 4) return `${differenceInWeeks} hafta önce`;
  const differenceInMonths = Math.floor(differenceInDays / 30);
  if (differenceInMonths < 12) return `${differenceInMonths} ay önce`;
  const differenceInYears = Math.floor(differenceInDays / 365);
  return `${differenceInYears} yıl önce`;
};

export const emoteConvert = (message: string) => {
  const emoteRegex = new RegExp(
    Object.keys(emotes)
      .map((emote) => emote.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('|'),
      'g'
  );

  return message.replace(emoteRegex, (match) => {
    return emotes[match] || match;
  });
};

export const utmRemover = (message: string) => {
  return message.replace(/(\?|\&)(utm_(source|medium|campaign|term|content|id|name|adset|creative|placement|audience|keyword|matchtype|network|device|target|position|feeditemid|loc_physical_ms|loc_interest_ms|dev|mob|ga_source|ga_medium|ga_campaign|ga_term|ga_content|ga_id|ga_name|ga_adset|ga_creative|ga_placement|ga_audience|ga_keyword|ga_matchtype|ga_network|ga_device|ga_target|ga_position|ga_feeditemid|ga_loc_physical_ms|ga_loc_interest_ms|ga_dev|ga_mob|rcm)|rcm)=[^&]*/gi, '')
}

export const convertMessage = (message: string) => {
  // Protect against XSS attacks
  const escapeHtml = (str: string) => 
    str
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/`/g, "&#x60;")

      // Url encode :)
      //.replace(/\//g, "&#x2F;")
      //.replace(/\\/g, "&#x5C;")
      //.replace(/=/g, "&#x3D;")
      //.replace(/&/g, "&amp;")

  // XSS defense
  message = escapeHtml(message)

  // Emote Convert
  message = emoteConvert(message)

  // Hyperlink convert
  message = utmRemover(message)

  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
  const url = message.match(urlRegex)
  if (url) {
    url.forEach(link => {
      message = message.replace(link, `<a href="${link}" target="_blank" rel="noopener noreferrer" style="text-decoration-line: underline;">${link}</a>`)
    })
  }

  return message
}
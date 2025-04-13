// note: import lyrics file here
import lyrics from '../magnets_and_dust_lyrics.json'

export function getLyric(t, i) {
  try {
    if (t >= lyrics.lyrics[i]["time"]){
      if (t < lyrics.lyrics[i + 1]["time"]) {
        return lyrics.lyrics[i]["line"]
      } else {
        return false
      }
    }
    return null
  } catch (error) {
    console.error(error)
  }
}
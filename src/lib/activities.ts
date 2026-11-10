export interface Activity {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: "tranquilas" | "diversion" | "romanticos" | "aventuras" | "espontaneos";
}

export const activities: Activity[] = [
  // Categoría A: Citas tranquilas
  { id: "cafe", emoji: "☕", title: "Una cita por un café", description: "Conversar con calma y una buena taza", category: "tranquilas" },
  { id: "helado", emoji: "🍦", title: "Salir por un helado", description: "Dulce, simple y perfecto para charlar", category: "tranquilas" },
  { id: "atardecer", emoji: "🌅", title: "Ver el atardecer", description: "Contemplar el cielo juntos en silencio", category: "tranquilas" },
  { id: "picnic", emoji: "🌳", title: "Un picnic al aire libre", description: "Comida rica, naturaleza y buena compañía", category: "tranquilas" },
  { id: "caminata", emoji: "🚶", title: "Una caminata sin afanes", description: "Pasear sin rumbo y sin prisa", category: "tranquilas" },
  { id: "cena", emoji: "🍽️", title: "Una cena bonita", description: "Comer rico y disfrutar el momento", category: "tranquilas" },
  { id: "jardin", emoji: "🌸", title: "Visitar un jardín o lugar especial", description: "Flores, paz y un rato de tranquilidad", category: "tranquilas" },
  { id: "historias", emoji: "📚", title: "Una tarde compartiendo historias", description: "Contarnos cosas y conocernos más", category: "tranquilas" },

  // Categoría B: Diversión y aventuras
  { id: "karaoke", emoji: "🎤", title: "Una noche de karaoke", description: "Cantar sin vergüenza y reír mucho", category: "diversion" },
  { id: "bolos", emoji: "🎳", title: "Ir a jugar bolos", description: "Competencia amistosa y risas", category: "diversion" },
  { id: "juegos", emoji: "🎮", title: "Una tarde de juegos", description: "Videojuegos, mesa o lo que surja", category: "diversion" },
  { id: "parque", emoji: "🎡", title: "Ir a un parque de diversiones", description: "Adrenalina, algodón de azúcar y fotos", category: "diversion" },
  { id: "patinar", emoji: "🛼", title: "Una experiencia diferente, como patinar", description: "Algo nuevo y divertido juntos", category: "diversion" },
  { id: "karts", emoji: "🏎️", title: "Ir a los karts", description: "Velocidad y un poco de competencia", category: "diversion" },
  { id: "escape", emoji: "🧩", title: "Escape room o algún reto divertido", description: "Resolver misterios en equipo", category: "diversion" },
  { id: "creativa", emoji: "🎨", title: "Una actividad creativa juntos", description: "Pintar, cocinar o crear algo", category: "diversion" },

  // Categoría C: Planes románticos
  { id: "cine", emoji: "🎬", title: "Una película en el cine", description: "Palomitas, oscuridad y cercanía", category: "romanticos" },
  { id: "cena-especial", emoji: "🕯️", title: "Una cena especial", description: "Ambiente íntimo y buena conversación", category: "romanticos" },
  { id: "estrellas", emoji: "🌌", title: "Una noche para contemplar las estrellas", description: "El cielo nocturno como testigo", category: "romanticos" },
  { id: "fotos", emoji: "📸", title: "Tomarnos algunas fotografías bonitas", description: "Capturar el momento para siempre", category: "romanticos" },
  { id: "sorpresa", emoji: "🌷", title: "Una sorpresa preparada especialmente para ti", description: "Algo pensado solo para ti", category: "romanticos" },
  { id: "sin-reloj", emoji: "💌", title: "Una cita en la que no miremos el reloj", description: "Tiempo infinito solo para nosotros", category: "romanticos" },

  // Categoría D: Pequeñas aventuras
  { id: "pueblito", emoji: "🚗", title: "Conocer un pueblito", description: "Calles nuevas y descubrimientos", category: "aventuras" },
  { id: "natural", emoji: "🏞️", title: "Visitar un lugar natural", description: "Naturaleza, aire fresco y paz", category: "aventuras" },
  { id: "escapada", emoji: "🌊", title: "Una escapada a algún lugar bonito", description: "Salir de la rutina por un rato", category: "aventuras" },
  { id: "carretera", emoji: "🛣️", title: "Un pequeño viaje por carretera", description: "Música, paisajes y conversación", category: "aventuras" },
  { id: "restaurante-nuevo", emoji: "🍃", title: "Descubrir un restaurante o lugar nuevo", description: "Probar algo diferente juntos", category: "aventuras" },
  { id: "fin-semana", emoji: "🏕️", title: "Una aventura de fin de semana", description: "Más tiempo, más recuerdos", category: "aventuras" },

  // Categoría E: Planes espontáneos
  { id: "sorprendeme", emoji: "🎲", title: "Sorpréndeme, tú decides", description: "Confío en tu buen gusto", category: "espontaneos" },
  { id: "tu-organizas", emoji: "💗", title: "Tú organiza algo para nosotros", description: "Me dejo llevar por ti", category: "espontaneos" },
  { id: "improvisado", emoji: "🌧️", title: "Un plan improvisado, sin importar cuál", description: "Lo que surja en el momento", category: "espontaneos" },
  { id: "descanso", emoji: "🛋️", title: "Un día de descanso, películas y comida rica", description: "Comodidad y buena compañía", category: "espontaneos" },
  { id: "cocinar", emoji: "🧁", title: "Preparar algo de comer juntos", description: "Cocinar, reír y comer lo que salga", category: "espontaneos" },
  { id: "musica", emoji: "🎧", title: "Compartir música y conversar", description: "Playlists, historias y conexión", category: "espontaneos" },
];

export const categoryLabels: Record<string, string> = {
  tranquilas: "Citas tranquilas",
  diversion: "Diversión y aventuras",
  romanticos: "Planes románticos",
  aventuras: "Pequeñas aventuras",
  espontaneos: "Planes espontáneos",
};

export const moodOptions = [
  { id: "romantico", label: "Algo romántico", emoji: "💕" },
  { id: "divertido", label: "Algo divertido", emoji: "😄" },
  { id: "diferente", label: "Algo diferente", emoji: "✨" },
  { id: "tranquilo", label: "Algo tranquilo", emoji: "🌿" },
  { id: "aventura", label: "Una pequeña aventura", emoji: "🗺️" },
  { id: "sorpresa", label: "Me gustaría que me sorprendas", emoji: "🎁" },
];

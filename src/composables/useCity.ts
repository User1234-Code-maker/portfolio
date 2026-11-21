import { computed } from 'vue'
import { useTheme } from './useTheme'
import day from '../assets/img/city.webp'
import daySm from '../assets/img/city-xs.webp'
import dusk from '../assets/img/city-dusk.webp'
import duskSm from '../assets/img/city-dusk-xs.webp'
import night from '../assets/img/city-night.webp'
import nightSm from '../assets/img/city-night-xs.webp'

export type CityMood = 'day' | 'dusk'

// Один арт города в трёх состояниях: день и вечер для светлой темы, ночь для тёмной.
// Вечер и ночь сделаны из того же рисунка скриптом scripts/city-variants.py.
const set = { day: [day, daySm], dusk: [dusk, duskSm], night: [night, nightSm] } as const

export function useCity(mood: () => CityMood = () => 'day') {
  const { theme } = useTheme()
  return computed(() => {
    const [src, sm] = set[theme.value === 'dark' ? 'night' : mood()]
    return { src, sm }
  })
}

import { ref } from 'vue'
import type { HubSpotData } from './types'
import hubspotData from '../public/data.json'

export default function useHubSpotData() {
  const data = ref<HubSpotData>(hubspotData)
  const loading = ref(false)
  const error = ref<string | null>(null)

  return {
    data,
    loading,
    error
  }
}
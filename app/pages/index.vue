<script setup lang="ts">
import { ref, computed } from 'vue'
import useHubSpotData from '~/composables/useHubSpotData'
import FilterPanel from '~/components/FilterPanel.vue'
import ChartComponent from '~/components/ChartComponent.vue'

const { data, loading } = useHubSpotData()

const filters = ref({
  companySize: [],
  industry: [],
  quarter: []
})

const currentQuestion = computed(() => data.value?.questions?.[0]);
const uniqueValues = computed(() => data.value?.uniqueValues);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl text-center my-6 font-bold">HubSpot Marketing Hub Insights</h1>
    <div v-if="loading" class="flex items-center justify-center h-64">
      <p class="text-gray-500">Loading data...</p>
    </div>
    <div class="flex flex-col lg:flex-row gap-6">
        <!-- Filter Panel -->
      <div class="lg:w-64 flex-shrink-0 bg-white p-6 rounded-lg shadow">
        <FilterPanel
          :unique-values="uniqueValues"
          v-model:selected-company-size="filters.companySize"
          v-model:selected-industry="filters.industry"
          v-model:selected-quarter="filters.quarter"
        />
      </div>
      <!-- Chart -->
      <div class="flex-grow">
        <div class="bg-white shadow rounded-lg p-6">
          <ChartComponent
            :question="currentQuestion"
            :filters="filters"
          />
        </div>
      </div>
    </div>
  </div>
</template>
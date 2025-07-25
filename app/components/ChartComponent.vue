<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { ChartConfiguration } from 'chart.js'
import type { Question, DataEntry } from '~/types'

// Register Chart.js components
Chart.register(...registerables)

const props = defineProps<{
  question?: Question;
  filters: {
    companySize: string[];
    industry: string[];
    quarter: string[];
  };
}>();

const chartRef = ref<HTMLCanvasElement | null>(null)
const chart = shallowRef<Chart | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const isUpdating = ref(false)

// Process data for the chart
const processChartData = (question: Question, filters: typeof props.filters) => {
  try {
    // Filter data - empty arrays mean "show all"
    const filtered = question.data.filter((entry: DataEntry) => {
      const matchesCompanySize =
        !filters.companySize?.length || filters.companySize.includes(entry.companySize);

      const matchesIndustry =
        !filters.industry?.length || filters.industry.includes(entry.industry);

      const matchesQuarter =
        !filters.quarter?.length || filters.quarter.includes(entry.quarter);

      return matchesCompanySize && matchesIndustry && matchesQuarter;
    });

    type Breakdown = Record<string, number>;
    type AggregatedEntry = {
      total: number;
      byCompanySize: Breakdown;
      byIndustry: Breakdown;
      byQuarter: Breakdown;
    };

    function increment(group: Breakdown, key: string, amount: number) {
      group[key] = (group[key] || 0) + amount;
    }

    const aggregated = filtered.reduce((acc: Record<string, AggregatedEntry>, entry: DataEntry) => {
      const { responseValue, numResponses, companySize, industry, quarter } = entry;

      if (!acc[responseValue]) {
        acc[responseValue] = {
          total: 0,
          byCompanySize: {},
          byIndustry: {},
          byQuarter: {}
        };
      }

      const target = acc[responseValue];
      target.total += numResponses;
      increment(target.byCompanySize, companySize, numResponses);
      increment(target.byIndustry, industry, numResponses);
      increment(target.byQuarter, quarter, numResponses);

      return acc;
    }, {} as Record<string, AggregatedEntry>);

    // Sort by total responses
    const sortedEntries = Object.entries(aggregated)
      .sort(([, a], [, b]) => b.total - a.total)

    // Generate filter summary
    const filterParts = []
    if (filters.companySize.length) filterParts.push(`Company Size: ${filters.companySize.join(', ')}`)
    if (filters.industry.length) filterParts.push(`Industry: ${filters.industry.join(', ')}`)
    if (filters.quarter.length) filterParts.push(`Quarter: ${filters.quarter.join(', ')}`)
    
    const subtitle = filterParts.length 
      ? `Filtered by: ${filterParts.join(' | ')}` 
      : 'All Data'

    return {
      labels: sortedEntries.map(([label]) => label),
      values: sortedEntries.map(([, data]) => data.total),
      title: question.question,
      subtitle
    }
  } catch (e) {
    error.value = 'Error processing chart data'
    console.error('Error in processChartData:', e)
    return null
  }
}

// Create or update chart
const updateChart = async () => {
  if (!props.question || isUpdating.value) return

  isUpdating.value = true
  loading.value = true
  error.value = null

  try {
    const chartData = processChartData(props.question, props.filters)
    if (!chartData || !chartRef.value) return

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Mentions',
          data: chartData.values,
          backgroundColor: '#d8d4ff',
          borderColor: '#8259ff',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartData.title,
            color: '#141314',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              bottom: 10
            }
          },
          subtitle: {
            display: true,
            text: chartData.subtitle,
            font: {
              size: 14
            },
            padding: {
              bottom: 20
            }
          },
          legend: {
            display: false // Hide legend since we only have one dataset
          }
        },
        scales: {
          x: {
            grid: {
              color: '#f0f0f0'
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              display: false // Remove horizontal grid lines
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    }

    if (!chart.value) {
      chart.value = new Chart(chartRef.value, config)      
    } else {
      chart.value.data.labels = chartData.labels
      
      if (chart.value.options.plugins?.subtitle) {
        chart.value.options.plugins.subtitle.text = chartData.subtitle
      }

      if (chart.value.data.datasets.length > 0 && chart.value.data.datasets[0]) {
        chart.value.data.datasets[0].data = chartData.values
      }
      chart.value.update();
    }

  } catch (e) {
    error.value = 'Error creating chart'
    console.error('Error in updateChart:', e)
  } finally {
    loading.value = false
    isUpdating.value = false
  }
}

// Watch for changes in filters only
watch(() => props.filters, () => {
  if (props.question) {
    updateChart()
  }
}, { deep: true })

// Initialize chart on mount
onMounted(() => {
  if (props.question) {
    updateChart()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy()
    chart.value = null
  }
})
</script>

<template>
  <div class="relative w-full h-[500px]">
    <div v-if="loading || isUpdating" class="absolute inset-0 flex items-center justify-center">
      <p class="text-gray-500">{{ isUpdating ? 'Updating chart...' : 'Loading chart data...' }}</p>
    </div>
    <div v-else-if="error" class="absolute inset-0 flex items-center justify-center">
      <p class="text-red-500">{{ error }}</p>
    </div>
    <canvas v-else ref="chartRef" class="w-full h-full"></canvas>
  </div>
</template>


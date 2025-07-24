
<script setup lang="ts">

type FilterType = 'companySize' | 'industry' | 'quarter'

const props = defineProps<{
  uniqueValues?: Record<FilterType, string[]>
  selectedCompanySize: string[]
  selectedIndustry: string[]
  selectedQuarter: string[]
}>()

const emit = defineEmits<{
  'update:selectedCompanySize': [value: string[]]
  'update:selectedIndustry': [value: string[]]
  'update:selectedQuarter': [value: string[]]
}>()

const selectedMap: Record<FilterType, () => string[]> = {
  companySize: () => props.selectedCompanySize,
  industry: () => props.selectedIndustry,
  quarter: () => props.selectedQuarter
}

const emitMap: Record<FilterType, (val: string[]) => void> = {
  companySize: val => emit('update:selectedCompanySize', val),
  industry: val => emit('update:selectedIndustry', val),
  quarter: val => emit('update:selectedQuarter', val)
}

function updateFilter(type: FilterType, value: string, checked: boolean) {
  const current = [...selectedMap[type]()]
  if (checked && !current.includes(value)) {
    current.push(value)
  } else if (!checked) {
    const index = current.indexOf(value)
    if (index > -1) current.splice(index, 1)
  }
  emitMap[type](current)
}

const clearFilters = () => {
  (Object.keys(emitMap) as FilterType[]).forEach(type => emitMap[type]([]))
}

const filterLabels: Record<FilterType, string> = {
  companySize: 'Company Size',
  industry: 'Industry',
  quarter: 'Quarter'
}

const filterTypes = ['companySize', 'industry', 'quarter'] as const
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Filters</h2>

    <div v-for="type in filterTypes" :key="type" class="space-y-2">
      <h3 class="font-medium">{{ filterLabels[type] }}</h3>
      <div class="space-y-2">
        <div
          v-for="option in uniqueValues?.[type]"
          :key="option"
          class="flex items-center"
        >
          <input
            :id="`${type}-${option}`"
            type="checkbox"
            :value="option"
            :checked="selectedMap[type]().includes(option)"
            class="h-4 w-4 text-blue-600 rounded border-gray-300"
            @change="(e) => updateFilter(type, option, (e.target as HTMLInputElement).checked)"
          />
          <label :for="`${type}-${option}`" class="ml-2 text-sm text-gray-700">{{ option }}</label>
        </div>
      </div>
    </div>

    <button
      class="w-full mt-4 px-4 py-2 bg-purple text-white uppercase font-bold rounded hover:bg-purple-600 transition-colors"
      @click="clearFilters"
    >
      Clear All Filters
    </button>
  </div>
</template>
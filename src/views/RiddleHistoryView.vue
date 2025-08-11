<template>
    <div>
        <h1>なぞかけ履歴</h1>
        <ul>
            <li v-for="r in riddles" :key="r.id">
                {{ r.topic }}: {{ r.content }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const riddles = ref<{ id: number; topic: string; content: string }[]>([])

onMounted(async () => {
    const { data, error } = await supabase.from('riddles').select('*').order('id', { ascending: false })
    if (error) console.error(error)
    else riddles.value = data ?? []
})
</script>
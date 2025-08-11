<template>
    <div>
        <h1>なぞかけ投稿</h1>
        <select v-model="topic">
            <option disabled value="">お題を選択</option>
            <option v-for="t in topics" :key="t.id" :value="t.name">{{ t.name }}</option>
        </select>
        <textarea v-model="riddle" placeholder="なぞかけを入力"></textarea>
        <button @click="postRiddle">投稿</button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const topics = ref<{ id: number; name: string }[]>([])
const topic = ref('')
const riddle = ref('')

onMounted(async () => {
    const { data, error } = await supabase.from('topics').select('*')
    if (error) console.error(error)
    else topics.value = data ?? []
})

async function postRiddle() {
    const { error } = await supabase.from('riddles').insert([
        { topic: topic.value, content: riddle.value }
    ])
    if (error) alert(error.message)
    else {
        alert('投稿完了')
        riddle.value = ''
    }
}
</script>
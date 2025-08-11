<template>
    <div>
        <h1>お題投稿</h1>
        <input v-model="topic" placeholder="お題を入力" />
        <button @click="postTopic">投稿</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const topic = ref('')

async function postTopic() {
    const { error } = await supabase.from('topics').insert([{ name: topic.value }])
    if (error) alert(error.message)
    else {
        alert('お題投稿完了')
        topic.value = ''
    }
}
</script>
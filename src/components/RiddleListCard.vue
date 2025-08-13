<template>
  <v-card elevation="6" class="pa-6 mb-6">
    <v-card-title class="text-h5 text-center mb-4 d-flex align-center justify-space-between">
      <span>なぞかけ一覧</span>
      <v-checkbox v-if="showAll !== undefined" v-model="showAll" label="全てのお題のなぞかけを表示" hide-details density="compact"
        class="ml-4" style="min-width:220px;" />
    </v-card-title>
    <v-card-text>
      <v-alert v-if="riddles.length === 0" type="info">なぞかけがありません</v-alert>
      <v-list v-else>
        <v-list-item v-for="riddle in riddles" :key="riddle.id" class="mb-4"
          :class="{ 'my-riddle': riddle.user_id === currentUserId }">
          <div class="riddle-sentence">
            <span class="font-weight-bold">{{ riddle.topics?.title || riddle.topic_id }}</span>とかけて<br>
            <span class="font-weight-bold">{{ riddle.toku }}</span>ととく。<br>
            その心は、どちらも<span class="font-weight-bold">{{ riddle.kokoro }}</span>
          </div>
          <div class="riddle-meta mt-2">
            <span class="font-weight-bold">【投稿者】</span>
            <span
              class="author-link"
              @click="goToProfile(riddle.user_id)"
            >{{ riddle.profiles?.name || riddle.user_id }}</span>
            ／<span class="font-weight-bold">【投稿日時】</span>{{ formatDate(riddle.created_at) }}
          </div>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-end" style="flex-wrap: wrap;">
      <v-btn v-if="hasMore" color="secondary" variant="outlined" @click="$emit('fetch-more')"
        class="mr-2 mb-2">もっと見る</v-btn>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Riddle } from '@/models/riddle';
const router = useRouter();

function goToProfile(id?: string) {
  if (id) router.push(`/profile/${id}`);
}

const props = defineProps<{
  riddles: Riddle[];
  hasMore: boolean;
  showAll?: boolean;
  currentUserId?: string;
}>();
const emit = defineEmits(['fetch-more', 'update:showAll']);

const showAll = computed({
  get: () => props.showAll,
  set: v => emit('update:showAll', v)
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('ja-JP');
};
</script>

<style scoped>
.font-weight-bold {
  font-weight: bold;
}

.riddle-sentence {
  white-space: pre-line;
  word-break: break-all;
  font-size: 1.1em;
  line-height: 2;
}

.riddle-meta {
  font-size: 0.95em;
  color: #666;
}

.my-riddle {
  background: linear-gradient(90deg, #fffde7 60%, #fff9c4 100%);
  border-left: 6px solid #ffe082;
  border-radius: 8px;
}

.author-link {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  font-weight: bold;
}
</style>

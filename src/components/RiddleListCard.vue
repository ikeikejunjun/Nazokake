<template>
  <v-row>
    <v-col cols="12">
      <v-alert v-if="props.riddles.length === 0" type="info">なぞかけがありません</v-alert>
      <v-card v-else v-for="riddle in props.riddles" :key="riddle.id" class="mb-4"
        :class="{ 'my-riddle': riddle.user_id === props.currentUserId }">

        <v-card-title class="wrap-title">
          <span class="font-weight-bold">{{ riddle.topics?.title || riddle.topic_id }}</span>　とかけて<br>
          <span class="font-weight-bold">{{ riddle.toku }}</span>　ととく。<br>
          その心は、どちらも　<span class="font-weight-bold">{{ riddle.kokoro }}</span>
        </v-card-title>
        <PostSubtitleInfo :user_id="riddle.user_id" :user_name="riddle.profiles?.name" :created_at="riddle.created_at" />
      </v-card>
    </v-col>
  </v-row>

  <v-col cols="12" class="d-flex justify-end mb-4">
    <v-btn v-if="props.hasMore" color="secondary" variant="outlined" @click="$emit('fetch-more')"
      class="mr-2 mb-2">もっと見る</v-btn>
  </v-col>
</template>

<script setup lang="ts">
import type { Riddle } from '@/models/riddle';
import PostSubtitleInfo from './PostSubtitleInfo.vue';

const props = defineProps<{
  riddles: Riddle[];
  hasMore: boolean;
  currentUserId?: string;
}>();
const emit = defineEmits(['fetch-more']);
</script>

<style scoped>
.font-weight-bold {
  font-weight: bold;
}

.my-riddle {
  background: #fff9c5;
}

.author-link {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  font-weight: bold;
}

.wrap-title {
  white-space: normal !important; /* 折り返しを許可 */
  overflow: visible !important;  /* 隠さない */
  text-overflow: unset !important; /* ... を無効化 */
  line-height: 1.4; /* 行間少し広め */
}
</style>

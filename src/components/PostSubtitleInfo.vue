<template>
    <v-card-subtitle>
        <span class="font-weight-bold">【投稿者】</span>
        <span class="author-link" @click="goToProfile(props.user_id)">{{ props.user_name || props.user_id
            }}</span>
        ／<span class="font-weight-bold">【投稿日時】</span>{{ formatDate(props.created_at) }}
    </v-card-subtitle>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    user_id: string;
    user_name: string | null | undefined;
    created_at: string;
}>();

function goToProfile(id?: string) {
  if (id) router.push(`/profile/${id}`);
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('ja-JP');
};
</script>

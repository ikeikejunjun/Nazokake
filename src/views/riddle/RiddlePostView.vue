<template>
    <v-row justify="center">
        <v-col cols="12" sm="12" md="10" lg="8">
            <v-card elevation="6" class="pa-6">
                <v-card-text>
                    <div v-if="selectedTopicStore.selectedTopic?.topics">
                        <v-alert type="info" class="mb-4">
                            【お題】<span class="font-weight-bold">{{ selectedTopicStore.selectedTopic.topics.title
                            }}</span>
                        </v-alert>
                    </div>
                    <v-form @submit.prevent="submitRiddle">
                        <div class="mb-4" style="font-size:1.1em;">
                            <div><span class="font-weight-bold">{{
                                selectedTopicStore.selectedTopic?.topics?.title || '（未選択）' }}</span> とかけて</div>
                            <div>
                                <v-text-field v-model="toku" label="とく（例：○○）" required hide-details class="block-input"
                                    style="width:100%;max-width:600px;margin:12px 0;" />
                            </div>
                            <div>ととく。</div>
                            <div>その心は、どちらも</div>
                            <div>
                                <v-text-field v-model="kokoro" label="こころ（例：△△）" required hide-details
                                    class="block-input" style="width:100%;max-width:600px;margin:12px 0;" />
                            </div>
                        </div>
                        <v-btn type="submit" color="primary" :loading="loading" @click="playExplosion"
                            :disabled="!toku || !kokoro">投稿する</v-btn>
                        <div ref="explosion" class="explosion-anim" />
                        <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
                        <v-alert v-if="successMessage" type="success" class="mt-2">{{ successMessage }}</v-alert>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import gsap from 'gsap';
import { useRouter } from 'vue-router';
import { RiddleModel } from '@/models/riddle';
import { useSelectedTopicStore } from '@/stores/selected_topic';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const selectedTopicStore = useSelectedTopicStore();
const authStore = useAuthStore();


const toku = ref('');
const kokoro = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const explosion = ref<HTMLElement | null>(null);

const playExplosion = async () => {
    await nextTick();
    if (!explosion.value) return;
    // 画面全体に広がる爆発アニメーション
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    explosion.value.style.width = `${vw * 1.2}px`;
    explosion.value.style.height = `${vh * 1.2}px`;
    explosion.value.style.left = '50%';
    explosion.value.style.top = '50%';
    explosion.value.style.marginLeft = `-${vw * 0.6}px`;
    explosion.value.style.marginTop = `-${vh * 0.6}px`;
    gsap.fromTo(
        explosion.value,
        { scale: 0, opacity: 1, background: 'radial-gradient(circle, #ff5252 60%, #b71c1c 100%)' },
        {
            scale: 1,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out',
            onStart: () => {
                explosion.value!.style.display = 'block';
            },
            onComplete: () => {
                explosion.value!.style.display = 'none';
            },
        }
    );
};

const submitRiddle = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    if (!selectedTopicStore.selectedTopic?.topics?.id) {
        errorMessage.value = 'お題が選択されていません';
        return;
    }
    if (!authStore.user_id) {
        errorMessage.value = 'ユーザー情報が取得できません';
        return;
    }
    loading.value = true;
    const { error } = await RiddleModel.create({
        topic_id: selectedTopicStore.selectedTopic.topics.id,
        user_id: authStore.user_id,
        toku: toku.value,
        kokoro: kokoro.value,
    });
    loading.value = false;
    if (error) {
        errorMessage.value = '投稿に失敗しました';
    } else {
        successMessage.value = '投稿が完了しました';
        toku.value = '';
        kokoro.value = '';
        setTimeout(() => router.push('/riddle'), 1000);
    }
};
</script>

<style scoped>
.explosion-anim {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 100vw;
    height: 100vh;
    margin-left: -50vw;
    margin-top: -50vh;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    display: none;
    will-change: transform, opacity;
}
</style>
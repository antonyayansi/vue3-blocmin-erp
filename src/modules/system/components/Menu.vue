<template>
    <li :id="node.path">
        <div @click="toggle(node)" style="user-select: none;">
            <button :class="
                isOpen 
                    ? node.children?.length 
                        ? 'bg-zinc-200/40 backdrop-blur-sm dark:bg-zinc-800 font-medium' 
                        : 'bg-primary-500/10 dark:bg-primary-500/10 font-medium' 
                    : '',
                    node.url == route.path ? 'bg-primary-500/10 text-primary-500 dark:text-primary-300 dark:bg-primary-500/10 font-medium' : 'text-zinc-800 dark:text-zinc-200'"
                class="w-full flex justify-between items-center cursor-pointer text-sm py-1 px-2 rounded-lg hover:translate-x-1 transition-transform duration-300">
                <div class="flex space-x-2 text-left items-center">
                    <i :class="node.icon" />
                    <span>
                        {{ node.name }}
                    </span>
                </div>
                <i v-if="node.children?.length" class="pi"
                    :class="[isOpen ? 'pi-chevron-down' : 'pi-chevron-right', 'text-xs']"></i>
            </button>
        </div>
        <ul v-if="isOpen && node.children?.length"
            v-motion 
            :initial="{ opacity: 0, y: -30 }" 
            :enter="{ opacity: 1, y: 0 }" 
            :leave="{ opacity: 0, y: -30 }"
            :transition="{ duration: 0.3 }" 
            >
            <TreeNode v-for="child in node.children" :key="child" :node="child" @click="toggle(child)"  />
        </ul>
    </li>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';

export default {
    name: 'TreeNode',
    props: {
        node: {
            type: Object,
            required: true
        }
    },
    emits: ['close-menu'],
    data() {

        const router = useRouter()
        const route = useRoute()

        const CloseMenu = () => {
            this.$emit('close-menu');
        }

        return {
            isOpen: false,
            router,
            route,
            CloseMenu
        }
    },
    methods: {
        toggle(item) {

            if (!item.children?.length) {
                this.router.push({ path: item.url })
                this.CloseMenu();
            } else {
                this.isOpen = !this.isOpen;
            }
        },
    }
};
</script>

<style scoped>
li {
    list-style-type: none;
}

div {
    cursor: pointer;
    padding: 5px;
}

ul {
    margin: 0;
    padding: 0 0 0 20px;
}
</style>
<template>
  <div class="button">
    <button
        class="button__control btn"
        :class="[
        sizeClass,
        variantClass,
        stateClass
      ]"
        type="button"
        :disabled="disabled || loading"
        @click="onClick"
    >
      <slot />
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: { type: String, default: "xl" },         // s, m, l, xl
  variant: { type: String, default: "primary" }, // primary, secondary
  color: { type: String, default: "accent" },    // accent, neutral
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["click"]);

const sizeClass = computed(() => `btn-${props.size}`);
const variantClass = computed(() => `btn-${props.variant} ${props.color}`);

const stateClass = computed(() => {
  if (props.loading) return "btn-loading";
  if (props.disabled) return "btn-disabled";
  return "btn-default"; // базовое состояние
});

function onClick(e) {
  e.preventDefault();
  if (!props.disabled && !props.loading) {
    emit("click", e);
  }
}
</script>

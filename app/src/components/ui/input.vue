<template>
  <div class="input">
    <label
      v-if="label"
      class="input_label heading-h4"
      :class="{ 'input__label--required': required }"
    >
      {{ label }}
    </label>

    <div class="input__wrapper" style="position: relative">
      <input
        :type="type"
        class="input__field body-b3"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="modelValue"
        :class="{ invalid: invalid, 'has-icon': icon }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <i v-if="icon" :class="['input__icon', icon]" />
    </div>

    <p v-if="message" class="input__m essage" :class="{ error: invalid }">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  type?: string;
  icon?: string;
  message?: string;
  modelValue?: string;
}

defineProps<Props>();
defineEmits(["update:modelValue"]);
</script>

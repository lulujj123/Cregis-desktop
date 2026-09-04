<script setup lang="ts">
import { EgContainer, EgTooltip } from '@eds/desktop-components';
import { RouterView } from 'vue-router';
import AppPreviewResizeHandles from '@/app-preview/AppPreviewResizeHandles.vue';
import AppPopupOverlayHost from '@/components/AppPopupOverlayHost.vue';
import MultiSignInvitationFloatHost from '@/scenes/tasks/signing/multiSignInvitation/MultiSignInvitationFloatHost.vue';
</script>

<template>
  <EgTooltip
    panel-kind="container"
    panel-radius="radius-lg"
    :scrollable="true"
    class="app-preview desktopTokens"
  >
    <EgContainer class="app-shell-container">
      <RouterView />
    </EgContainer>
    <AppPopupOverlayHost />
    <MultiSignInvitationFloatHost />
    <AppPreviewResizeHandles />
  </EgTooltip>
</template>

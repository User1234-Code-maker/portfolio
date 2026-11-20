<script setup lang="ts">
import cloudA from '../assets/img/cloud-a.webp'
import cloudASm from '../assets/img/cloud-a-sm.webp'
import cloudB from '../assets/img/cloud-b.webp'
import cloudBSm from '../assets/img/cloud-b-sm.webp'
import cloudC from '../assets/img/cloud-c.webp'
import cloudCSm from '../assets/img/cloud-c-sm.webp'
import character from '../assets/img/character.webp'
import characterSm from '../assets/img/character-sm.webp'
import cat from '../assets/img/cat.png'
import { useLang } from '../composables/useLang'

const { t } = useLang()

import spark from '../assets/img/spark.webp'
</script>

<template>
  <div class="layer l-sky"></div>
  <div class="layer l-cloudback" data-par="3">
    <picture
      ><source media="(max-width: 700px)" :srcset="cloudCSm" />
      <img :src="cloudC" alt="" width="840" height="370"
    /></picture>
  </div>
  <div class="layer l-city" data-par="7"></div>
  <div class="layer l-cloudmid" data-par="12">
    <picture
      ><source media="(max-width: 700px)" :srcset="cloudASm" />
      <img :src="cloudA" alt="" width="1070" height="540"
    /></picture>
  </div>
  <div class="layer l-grid" data-par="11"></div>
  <div class="layer l-moon" data-par="4" aria-hidden="true"><span></span></div>
  <div class="layer l-far" data-par="9" aria-hidden="true"></div>
  <div class="layer l-glow"></div>
  <div class="layer l-wash"></div>
  <div class="layer l-char" data-par="20">
    <picture>
      <source media="(max-width: 700px)" :srcset="characterSm" />
      <img
        class="main"
        :src="character"
        width="2664"
        height="1872"
        fetchpriority="high"
        :alt="t('hero_alt')"
      />
    </picture>
  </div>
  <div class="layer l-cloudfront" data-par="26">
    <picture
      ><source media="(max-width: 700px)" :srcset="cloudBSm" />
      <img :src="cloudB" alt="" width="1100" height="390"
    /></picture>
  </div>
  <div class="layer l-dust" data-par="16" aria-hidden="true"></div>
  <div class="layer l-deco" data-par="30">
    <span class="deco jp" aria-hidden="true"><i class="a"></i>ゲームと音楽<i class="b"></i></span>
    <img class="deco cat" :src="cat" alt="" aria-hidden="true" width="342" height="294" />
    <img class="deco sp1" :src="spark" alt="" aria-hidden="true" width="368" height="368" />
    <img class="deco sp2" :src="spark" alt="" aria-hidden="true" width="368" height="368" />
    <img class="deco sp3" :src="spark" alt="" aria-hidden="true" width="368" height="368" />
  </div>
</template>

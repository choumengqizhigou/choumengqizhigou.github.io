<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true
  }
})

const route = useRoute()
const isOpen = ref(false)
const images = ref([])
const currentIndex = ref(0)
const scale = ref(1)
const rotation = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const closeButton = ref(null)

let previousOverflow = ''
let previousFocus = null
let dragStartX = 0
let dragStartY = 0
let dragOriginX = 0
let dragOriginY = 0

const currentImage = computed(() => images.value[currentIndex.value])
const canNavigate = computed(() => images.value.length > 1)
const imageStyle = computed(() => ({
  transform: `translate3d(${translateX.value}px, ${translateY.value}px, 0) scale(${scale.value}) rotate(${rotation.value}deg)`
}))

function getArticleImages() {
  return Array.from(document.querySelectorAll('.vp-doc img'))
    .filter((image) => !image.closest('.image-viewer') && !image.classList.contains('no-preview'))
    .map((image) => ({
      element: image,
      src: image.currentSrc || image.src,
      alt: image.alt || '文章图片'
    }))
}

function resetTransform() {
  scale.value = 1
  rotation.value = 0
  translateX.value = 0
  translateY.value = 0
}

function openViewer(imageElement) {
  const articleImages = getArticleImages()
  const index = articleImages.findIndex((image) => image.element === imageElement)

  if (index < 0) return

  images.value = articleImages
  currentIndex.value = index
  resetTransform()
  previousFocus = document.activeElement
  previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  isOpen.value = true

  nextTick(() => closeButton.value?.focus())
}

function closeViewer() {
  if (!isOpen.value) return

  isOpen.value = false
  document.documentElement.style.overflow = previousOverflow

  if (previousFocus instanceof HTMLElement) {
    previousFocus.focus()
  }

  previousFocus = null
}

function showImage(offset) {
  if (!canNavigate.value) return

  currentIndex.value = (currentIndex.value + offset + images.value.length) % images.value.length
  resetTransform()
}

function zoomBy(factor) {
  scale.value = Math.min(6, Math.max(0.25, Number((scale.value * factor).toFixed(2))))

  if (scale.value === 1) {
    translateX.value = 0
    translateY.value = 0
  }
}

function rotateBy(degrees) {
  rotation.value = (rotation.value + degrees) % 360
}

function handleArticleClick(event) {
  if (!props.enabled || event.defaultPrevented || event.button !== 0) return

  const target = event.target
  const image = target instanceof HTMLImageElement ? target.closest('.vp-doc img') : null

  if (!image || image.classList.contains('no-preview')) return

  event.preventDefault()
  openViewer(image)
}

function handleKeydown(event) {
  if (!isOpen.value) return

  const actions = {
    Escape: closeViewer,
    ArrowLeft: () => showImage(-1),
    ArrowRight: () => showImage(1),
    '+': () => zoomBy(1.25),
    '=': () => zoomBy(1.25),
    '-': () => zoomBy(0.8),
    '0': resetTransform,
    r: () => rotateBy(90),
    R: () => rotateBy(90),
    l: () => rotateBy(-90),
    L: () => rotateBy(-90)
  }

  const action = actions[event.key]

  if (action) {
    event.preventDefault()
    action()
  }
}

function handleWheel(event) {
  if (!isOpen.value) return

  event.preventDefault()
  zoomBy(event.deltaY < 0 ? 1.12 : 0.89)
}

function handleDoubleClick() {
  if (scale.value === 1) {
    scale.value = 2
  } else {
    resetTransform()
  }
}

function startDrag(event) {
  if (event.button !== 0) return

  isDragging.value = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragOriginX = translateX.value
  dragOriginY = translateY.value
  event.currentTarget.setPointerCapture(event.pointerId)
}

function dragImage(event) {
  if (!isDragging.value) return

  translateX.value = dragOriginX + event.clientX - dragStartX
  translateY.value = dragOriginY + event.clientY - dragStartY
}

function stopDrag(event) {
  if (!isDragging.value) return

  isDragging.value = false

  if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeViewer()
  }
}

onMounted(() => {
  document.documentElement.classList.toggle('article-image-viewer-enabled', props.enabled)
  document.addEventListener('click', handleArticleClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('article-image-viewer-enabled')
  document.removeEventListener('click', handleArticleClick)
  document.removeEventListener('keydown', handleKeydown)
  closeViewer()
})

watch(() => route.path, closeViewer)
watch(() => props.enabled, (enabled) => {
  document.documentElement.classList.toggle('article-image-viewer-enabled', enabled)
  if (!enabled) closeViewer()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen && currentImage" class="image-viewer" role="dialog" aria-modal="true" aria-label="图片查看器"
      @click="handleBackdropClick" @wheel="handleWheel">
      <div class="image-viewer__topbar">
        <span class="image-viewer__caption" :title="currentImage.alt">{{ currentImage.alt }}</span>
        <span class="image-viewer__counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
        <!-- <a
          class="image-viewer__button image-viewer__original"
          :href="currentImage.src"
          target="_blank"
          rel="noopener noreferrer"
          title="在新窗口查看原图"
          @click.stop
        >
          原图
        </a> -->
        <button ref="closeButton" class="image-viewer__button image-viewer__close" type="button" title="关闭（Esc）"
          aria-label="关闭图片查看器" @click="closeViewer">
          ×
        </button>
      </div>

      <button v-if="canNavigate" class="image-viewer__nav image-viewer__nav--previous" type="button" title="上一张（←）"
        aria-label="查看上一张图片" @click.stop="showImage(-1)">
        ‹
      </button>

      <div class="image-viewer__stage" :class="{ 'is-dragging': isDragging }" @click.stop @dblclick="handleDoubleClick"
        @pointerdown="startDrag" @pointermove="dragImage" @pointerup="stopDrag" @pointercancel="stopDrag">
        <img class="image-viewer__image" :src="currentImage.src" :alt="currentImage.alt" :style="imageStyle"
          draggable="false">
      </div>

      <button v-if="canNavigate" class="image-viewer__nav image-viewer__nav--next" type="button" title="下一张（→）"
        aria-label="查看下一张图片" @click.stop="showImage(1)">
        ›
      </button>

      <div class="image-viewer__toolbar" role="toolbar" aria-label="图片工具">
        <button class="image-viewer__button" type="button" title="缩小（-）" aria-label="缩小图片"
          @click.stop="zoomBy(0.8)">−</button>
        <span class="image-viewer__scale">{{ Math.round(scale * 100) }}%</span>
        <button class="image-viewer__button" type="button" title="放大（+）" aria-label="放大图片"
          @click.stop="zoomBy(1.25)">＋</button>
        <span class="image-viewer__divider" aria-hidden="true" />
        <button class="image-viewer__button" type="button" title="向左旋转（L）" aria-label="图片向左旋转"
          @click.stop="rotateBy(-90)">↶</button>
        <button class="image-viewer__button" type="button" title="向右旋转（R）" aria-label="图片向右旋转"
          @click.stop="rotateBy(90)">↷</button>
        <span class="image-viewer__divider" aria-hidden="true" />
        <button class="image-viewer__button image-viewer__reset" type="button" title="重置（0）"
          @click.stop="resetTransform">重置</button>
      </div>
    </div>
  </Teleport>
</template>

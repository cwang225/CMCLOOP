import { supabase } from "./supabaseClient.js"

const HERO_MEDIA_TABLE = "hero_media"
const HERO_MEDIA_URL_COLUMN = "url"

function slots() {
  return [...document.querySelectorAll("[data-media-slot]")]
}

function videoForSlot(slot) {
  let video = slot.querySelector("video")

  if (!video) {
    video = document.createElement("video")
    video.className = "hero-rect-media"
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.setAttribute("playsinline", "")
    video.setAttribute("muted", "")
    slot.appendChild(video)
  }

  return video
}

function mediaUrl(item) {
  if (!item) return ""
  if (typeof item === "string") return item
  return item[HERO_MEDIA_URL_COLUMN] || item.video_url || item.src || ""
}

export function fillHeroMedia(items = []) {
  slots().forEach((slot, index) => {
    const url = mediaUrl(items[index])
    const video = videoForSlot(slot)

    if (!url) {
      video.removeAttribute("src")
      video.load()
      slot.classList.remove("has-media")
      return
    }

    video.src = url
    slot.classList.add("has-media")
    video.play().catch(() => {})
  })
}

async function fetchHeroMediaFromDatabase() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from(HERO_MEDIA_TABLE)
    .select(HERO_MEDIA_URL_COLUMN)
    .limit(5)

  if (error) return []
  return data ?? []
}

export function playHeroMedia() {
  slots().forEach((slot) => {
    const video = slot.querySelector("video")
    if (video?.src) video.play().catch(() => {})
  })
}

export async function initMediaDisplay() {
  const items = await fetchHeroMediaFromDatabase()
  fillHeroMedia(items)
}

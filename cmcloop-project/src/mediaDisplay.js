import { supabase } from "./supabaseClient.js"

const MEDIA_TABLE = "LOOPMedia"

function slots() {
  return [...document.querySelectorAll("[data-media-slot]")]
}

function joinUrl(base, path) {
  const root = String(base || "").trim().replace(/\/+$/, "")
  const objectPath = String(path || "").trim().replace(/^\/+/, "")
  if (!root) return objectPath
  if (!objectPath) return root
  return `${root}/${objectPath}`
}

function mediaUrl(item) {
  if (!item) return ""

  const raw = item.video_url
  if (!raw) return ""

  let url = ""
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw)
      url = joinUrl(
        parsed.url || parsed.publicUrl || parsed.public_url,
        parsed.path || parsed.key || parsed.file || parsed.filename
      ) || raw
    } catch {
      url = raw
    }
  } else {
    url = joinUrl(
      raw.url || raw.publicUrl || raw.public_url,
      raw.path || raw.key || raw.file || raw.filename
    )
  }

  url = String(url).trim()
  if (!url) return ""
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) {
    url = `https://${url}`
  }
  return url
}

function isYoutubeUrl(url) {
  try {
    const host = new URL(url).hostname
    return host.includes("youtube.com") || host.includes("youtu.be")
  } catch {
    return false
  }
}

function youtubeId(url) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0] || ""
    }

    const fromQuery = parsed.searchParams.get("v")
    if (fromQuery) return fromQuery

    const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/)
    return embedMatch?.[1] || ""
  } catch {
    return ""
  }
}

function youtubeEmbedUrl(id) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
  })
  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

function looksLikeVideoFile(url) {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname
    const path = parsed.pathname.toLowerCase()
    if (host.endsWith(".r2.dev") || host.includes("r2.cloudflarestorage.com")) {
      return path.length > 1
    }
    return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(path)
  } catch {
    return false
  }
}

function clearSlotMedia(slot) {
  slot.querySelectorAll("video, iframe").forEach((node) => node.remove())
  slot.classList.remove("has-media")
}

function fillYoutubeSlot(slot, id) {
  const iframe = document.createElement("iframe")
  iframe.className = "hero-rect-media"
  iframe.src = youtubeEmbedUrl(id)
  iframe.allow = "autoplay; encrypted-media"
  iframe.setAttribute("allowfullscreen", "")
  iframe.title = slot.dataset.artist || "LOOP media"
  slot.appendChild(iframe)
  slot.classList.add("has-media")
}

function fillVideoSlot(slot, url) {
  const video = document.createElement("video")
  video.className = "hero-rect-media"
  video.muted = true
  video.loop = true
  video.autoplay = true
  video.playsInline = true
  video.preload = "auto"
  video.setAttribute("playsinline", "")
  video.setAttribute("muted", "")
  video.src = url
  slot.appendChild(video)
  slot.classList.add("has-media")
  video.play().catch(() => {})
}

const ROTATE_MS = 30_000

let mediaLibrary = []
let currentItems = []
let rotateTimer = null
let siteReady = false

function isPlayable(item) {
  const url = mediaUrl(item)
  if (!url) return false
  if (isYoutubeUrl(url)) return Boolean(youtubeId(url))
  return looksLikeVideoFile(url)
}

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const swap = copy[i]
    copy[i] = copy[j]
    copy[j] = swap
  }
  return copy
}

function pickRandomItems(items, count, previous = []) {
  if (!items.length || count <= 0) return []

  if (items.length <= count) {
    const next = shuffle(items)
    if (
      previous.length &&
      next.length > 1 &&
      next.every((item, index) => item.id === previous[index]?.id)
    ) {
      const swap = next[0]
      next[0] = next[1]
      next[1] = swap
    }
    return next
  }

  const previousIds = new Set(previous.map((item) => item.id))
  const unused = items.filter((item) => !previousIds.has(item.id))

  if (unused.length >= count) {
    return shuffle(unused).slice(0, count)
  }

  const used = items.filter((item) => previousIds.has(item.id))
  return [...shuffle(unused), ...shuffle(used)].slice(0, count)
}

export function fillHeroMedia(items = []) {
  slots().forEach((slot, index) => {
    const item = items[index]
    const url = mediaUrl(item)

    clearSlotMedia(slot)

    if (item?.artist_name) {
      slot.dataset.artist = item.artist_name
    } else {
      delete slot.dataset.artist
    }

    if (!url) return

    if (isYoutubeUrl(url)) {
      const id = youtubeId(url)
      if (id) {
        fillYoutubeSlot(slot, id)
        return
      }
    }

    if (!looksLikeVideoFile(url)) {
      console.warn("LOOPMedia row is missing a video file path:", url)
      return
    }

    fillVideoSlot(slot, url)
  })
}

function showRandomHeroMedia() {
  currentItems = pickRandomItems(mediaLibrary, slots().length, currentItems)
  fillHeroMedia(currentItems)
}

function startHeroRotation() {
  if (rotateTimer != null || mediaLibrary.length < 2) return

  rotateTimer = window.setInterval(() => {
    if (document.hidden) return
    showRandomHeroMedia()
  }, ROTATE_MS)
}

async function fetchHeroMediaFromDatabase() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from(MEDIA_TABLE)
    .select("id, video_url, artist_name, created_at")
    .order("id", { ascending: true })

  if (error) {
    console.warn("LOOPMedia could not be loaded:", error.message)
    return []
  }

  return (data ?? []).filter(isPlayable)
}

export function playHeroMedia() {
  siteReady = true

  slots().forEach((slot) => {
    const video = slot.querySelector("video")
    if (video?.src) video.play().catch(() => {})

    const iframe = slot.querySelector("iframe")
    if (iframe?.src) iframe.src = iframe.src
  })

  startHeroRotation()
}

export async function initMediaDisplay() {
  mediaLibrary = await fetchHeroMediaFromDatabase()
  showRandomHeroMedia()
  if (siteReady) startHeroRotation()
}

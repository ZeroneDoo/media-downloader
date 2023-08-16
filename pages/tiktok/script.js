const resultsWrapper = document.getElementById("results")
const formWrapper = document.getElementById("wrapper-form")
const button = document.getElementById("btn-tiktok")

const createElement = async ({ videoId, avatar, nickname, duration, description, likes, comment, views, share, download, save, videoNoWM, videoWM, musicUrl }) => {
    // avatar
    const img = document.createElement("img")
    img.src = avatar
    img.className = "w-[200px] h-[200px] object-cover bg-contain rounded-lg"

    const username = document.createElement("p")
    username.className = "font-bold text-[16px] leading-3 flex items-center gap-1"
    username.innerHTML = `<img src="/assets/icons/user.svg" />`+nickname

    const desc = document.createElement("div")
    desc.className = " items-center w-fit"

    const tag = document.createElement("p")
    tag.innerHTML = `${description}`
    tag.className = "font-[16px] font-semibold text-center"
    
    desc.appendChild(tag)

    // link resource
    const fileVideo = await fetch(videoNoWM)
        .then(res => res.blob())

    const fileMusic = await fetch(musicUrl)
        .then(res => res.blob())

    // blob
    const blobVideo = URL.createObjectURL(fileVideo)
    const blobMusic = URL.createObjectURL(fileMusic)

    const downloadLinkVideo = document.createElement("a")
    downloadLinkVideo.innerHTML = "Download Video"
    downloadLinkVideo.className = "text-center w-full py-2 bg-primary font-semibold text-[14px] rounded-md text-white"
    downloadLinkVideo.href = blobVideo
    downloadLinkVideo.download = `TikTok_${videoId}.mp4`

    const downloadLinkMusic = document.createElement("a")
    downloadLinkMusic.innerHTML = "Download Music mp3"
    downloadLinkMusic.className = "text-center w-full py-2 bg-primary font-semibold text-[14px] rounded-md text-white"
    downloadLinkMusic.href = blobMusic
    downloadLinkMusic.download = `TikTok_${videoId}.mp3`

    resultsWrapper.innerHTML = ''
    button.removeAttribute("disabled")
    button.innerHTML = `Cari`
    resultsWrapper.appendChild(img)
    resultsWrapper.appendChild(username)
    resultsWrapper.appendChild(desc)
    resultsWrapper.appendChild(downloadLinkVideo)
    resultsWrapper.appendChild(downloadLinkMusic)
    resultsWrapper.classList.remove("hidden")
    // formWrapper.classList.add("hidden")
}

const getVideo = async (link) => {


    if(!link){
        alert("Form tidak boleh kosong")
        return
    }
    
    button.setAttribute("disabled", true)
    button.innerHTML = `<img src="https://kiryuu.id/wp-content/themes/mangareader/assets/img/readerarea.svg" class="w-[35px] h-[35px]" alt="">`

    const request = await fetch(`/tiktok/getVideoNoWm?url=${link}`)
        .then(res => res.json())

    const res = await request

    const datas = {
        videoId: res.id,
        avatar: res.thumbnail,
        nickname: res.author.unique_id,
        duration: res.duration,
        description: res.description,
        likes: res.digg_count,
        comment: res.comment_count,
        views: res.play_count,
        share: res.share_count,
        download: res.download_count,
        save: res.saved_count,
        videoNoWM: res.video_nowatermark,
        videoWM: res.video_watermark,
        musicUrl: res.music_url,
    }

    createElement(datas)
}
const getIdVideo = async (link) => {
    const format = link.includes("/video/")
    if (!format) {
        alert("Format link tidak benar")
        return
    }

    const idVideo = link.substring(link.indexOf("/video/") + 7, link.length) // mengambil id video

    return idVideo.length > 19 ? idVideo.substring(0, idVideo.indexOf("?")) : idVideo
}
const initialize = () => {
    const form = document.getElementById("tiktok-form")
    const links = document.getElementById("tiktok-links")

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        await getVideo(links.value)
    })
}
initialize()
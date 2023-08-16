const resultsWrapper = document.getElementById("results")
const formWrapper = document.getElementById("wrapper-form")
const button = document.getElementById("btn-youtube")
const loader = document.getElementById("loader")

const createElement = ({ videoId,detailVideo, format }) => {
    // left
    const leftWrapper = document.createElement("div")
    leftWrapper.className = "w-full"

    const imgWrapper = document.createElement("div")
    imgWrapper.className = "lg:w-[307px] lg:h-[230px] md:w-[257px] md:h-[192px] w-full h-fit bg-black flex items-center justify-center"

    const img = document.createElement("img")
    img.src = detailVideo.thumbnail.url
    img.className = 'lg:w-[307px] lg:h-[230px] md:w-[257px] md:h-[192px] w-full object-contain bg-contain'

    imgWrapper.appendChild(img)
    leftWrapper.appendChild(imgWrapper)

    const title = document.createElement("p")
    title.innerHTML = detailVideo.title
    title.className = "lg:w-[307px] md:w-[257px] w-full font-bold text-[16px]"

    // right
    const rightWrapper = document.createElement("div")
    rightWrapper.className = "w-full"

    // table
    const detailWrapper = document.createElement("table")
    detailWrapper.className = "table w-full border-collapse border border-[#ddd]"
    detailWrapper.cellPadding = "10"
    detailWrapper.cellSpacing = "0"

    const tr = document.createElement("tr")

    const td1 = document.createElement("td")
    td1.className = "border"
    td1.innerHTML = "File type"
    tr.appendChild(td1)

    const td2 = document.createElement("td")
    td2.className = "border flex justify-center items-center"
    td2.innerHTML = "Action"
    tr.appendChild(td2)

    detailWrapper.appendChild(tr)

    format.video.map(async (video) => {

        const tr = document.createElement("tr")

        const td1 = document.createElement("td")
        td1.className = "border"
        td1.innerHTML = video.qualityLabel
        tr.appendChild(td1)

        const td2 = document.createElement("td")
        td2.className = "border"

        // btn
        const a = document.createElement("a")
        a.className = " w-full py-2 text-white bg-primary text-center rounded-md text-[15px] block"
        a.innerHTML = "Download"
        a.download = `${title}.mp4`
        a.href = `/youtube/download?videoUrl=${encodeURIComponent(video.url)}&title=${encodeURIComponent(detailVideo.title)}`
        a.addEventListener("click", (e) => {
            a.innerHTML = "Downloading"
        })

        td2.appendChild(a)
        tr.appendChild(td2)

        detailWrapper.appendChild(tr)
    })

    // end table 

    resultsWrapper.innerHTML = ""
    // append left
    leftWrapper.appendChild(title)
    resultsWrapper.appendChild(leftWrapper)

    // append right
    rightWrapper.appendChild(detailWrapper)
    resultsWrapper.appendChild(rightWrapper)

    loader.classList.add("hidden")
    resultsWrapper.classList.remove("hidden")
    button.removeAttribute("disabled")

}
const getVideoDetail = async (link) => {
    const idVideo = await getIdVideo(link)
    
    if (!idVideo) return
    
    button.setAttribute("disabled", true)
    loader.classList.remove("hidden")
    const response = await fetch(`/youtube/getDetailVideo?link=${idVideo}`)
        .then(res => res.json())

    createElement(response)
}
const getIdVideo = (link) => {
    if (!link) {
        alert("Form link tidak boleh kosong!")
        return
    }

    const format = link.includes("/www.youtube.com/") || link.includes("/youtu.be/")
    if (!format) {
        alert("Format link tidak benar")
        return
    }

    if (link.includes("/live/")) {
        const idVideo = link.substring(link.indexOf("/live/") + 6, link.length)
        return idVideo.length > 11 ? idVideo.substring(0, idVideo.indexOf("?")) : idVideo
    } else if (link.includes("/watch")) {
        const idVideo = link.substring(link.indexOf("/watch?v=") + 9, link.length)
        return idVideo.length > 11 ? idVideo.substring(0, idVideo.indexOf("&")) : idVideo
    }

    const idVideo = link.substring(link.indexOf(".be/") + 4, link.length)

    return idVideo

}
const initialize = () => {
    const form = document.getElementById("youtube-form")
    const links = document.getElementById("youtube-links")

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        await getVideoDetail(links.value)
    })
}
initialize()
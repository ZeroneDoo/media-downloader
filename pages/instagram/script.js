const resultsWrapper = document.getElementById("results")
const formWrapper = document.getElementById("form-wrapper")
const button = document.getElementById("btn-instagram")
const loader = document.getElementById("loader")

const createComponent = ({
    type,
    thumb,
    url
}) => {
    const wrapper = document.createElement("div")
    wrapper.className = "w-full lg:h-[16em] md:h-[16em] h-[15em] relative"

    const img = document.createElement("img")
    img.className = `w-full lg:h-[16em] md:h-[16em] h-[15em] object-cover bg-cover mx-auto my-1 rounded-md`
    img.src = `${thumb}`
    wrapper.appendChild(img)

    const btn = document.createElement("a")
    btn.className = "text-center px-3 py-2 bg-primary rounded-md text-white text-[14px] absolute bottom-1 flex items-center justify-center gap-2 right-1 left-1"
    btn.innerHTML = `<img src='https://saveig.app/imgs/download.svg'/> Download ${type}`
    btn.href = url
    wrapper.appendChild(btn)

    resultsWrapper.appendChild(wrapper)
    loader.classList.add("hidden")
    formWrapper.classList.add("hidden")
}
const getDetail = async (link) => {
    if (!link) {
        alert("Form tidak boleh kosong!")
        return
    }

    button.setAttribute("disabled", true)
    loader.classList.remove("hidden")
    const response = await fetch(`/instagram/detailMedia?url=${encodeURIComponent(link)}`)
        .then(res => res.json())

    response.data.map(data => createComponent(data))
}
const initialize = () => {
    const form = document.getElementById("instagram-form")
    const links = document.getElementById("instagram-links")

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        getDetail(links.value)
    })
}
initialize()
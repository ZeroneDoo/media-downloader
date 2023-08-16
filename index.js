const expres = require("express")
const ytdl = require("ytdl-core")
const ig = require('instagram-url-dl')
const cors = require("cors")
const https = require("https")

require('dotenv').config()

const app = expres()
const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36 Edg/91.0.864.48",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/76.0.4017.154",
    "Mozilla/5.0 (Linux; Android 11; SM-G998U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 EdgA/91.0.864.48",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0.2",
]
const randomIndex = Math.floor(Math.random() * userAgents.length)
const userAgen = userAgents[randomIndex]

// get env 
const tiktok_api_url = process.env.TIKTOK_API_URL
const cookie = process.env.SESSION_ID_COOKIE

app.use(cors())
app.use(expres.static(__dirname + '/pages')) // pages
app.use('/assets/icons', expres.static(__dirname +'/assets/icons')) // icons

// tiktok
app.get("/tiktok/getVideoNoWm", async (req, res) => {
    const { url } = req.query

    const API_URL = `${tiktok_api_url}${url}`
    const request = await fetch(API_URL)
    .then(res => res.json())

    res.json(request)
})

// youtube
app.get("/youtube/getDetailVideo", async (req, res) => {
    const { link } = req.query

    const dataVideo = await ytdl.getInfo(link)
    const formatAudio = ytdl.filterFormats(dataVideo.formats, "audioonly")
    const videos = ytdl.filterFormats(dataVideo.formats, "video")
    const formatVideo = videos.filter(res => res.container === "mp4" && res.audioCodec )

    res.json({
        videoId: link,
        detailVideo: {
            thumbnail: dataVideo.videoDetails.thumbnails[dataVideo.videoDetails.thumbnails.length - 1],
            title: dataVideo.videoDetails.title,
        },
        format : {
            audio: formatAudio,
            video: formatVideo
        }
    })
})

app.get("/youtube/download", async (req, res) => {
    try {
        const { videoUrl, title } = req.query

        const decodeVideoUrl = decodeURIComponent(videoUrl)
        const decodeTitle = decodeURIComponent(title)

        https.get(decodeVideoUrl, (response) => {
            console.log(response.statusCode)

            if (response.statusCode === 302) {
                const redirectedUrl = response.headers.location;
                https.get(redirectedUrl, (response) => {
                    if (response.statusCode === 200) {
                        const headers = {
                            'Content-Disposition': `attachment; filename="${decodeTitle}.mp4"`,
                            'Content-Type': response.headers['content-type']
                        };
                        res.writeHead(200, headers);
                        response.pipe(res);
                    }
                })
            }else if(response.statusCode === 200){
                https.get(decodeVideoUrl, (response) => {
                    const headers = {
                        'Content-Disposition': `attachment; filename="${decodeTitle}.mp4"`,
                        'Content-Type': response.headers['content-type']
                    };
                    res.writeHead(200, headers);
                    response.pipe(res);
                })
            }
        })
    } catch (error) {
        console.log("Error", error)
    }
})

// instagram
app.get("/instagram/detailMedia", async (req, res) => {

    const { url } = req.query

    const response = await ig(url)
    
    res.json(response)
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")
})
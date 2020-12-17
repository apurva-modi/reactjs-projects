const express = require('express')
const axios = require('axios')
const router = express.Router()
const { parseString } = require('xml2js').Parser()


router.get('/',(req,res,next) => {
    res.render('index')
})

router.get('/feed',async (req,res,next) => {
    const url = req.query.url
    const {data} = await axios ({
        url:url,
        method:'get',
    })
    parseString(data, (err, json) => {
        if (err) {
            // handle error
            return
        }
        const {rss} = json
        const {channel} = rss
        const payload = channel[0]
        res.json(payload)
    })
    
    // res.json({
    //     data: 'this is the feed endpoint',
    //     url
    // })
})
// https://itunes.apple.com/search?term=sports&country=US&media=podcast

router.get('/search',async (req,res,next) => {
    const url = 'https://itunes.apple.com/search?term=sports&country=US&media=podcast' 
    const {data} = await axios({
        url,
        method:'get',
        options: {
            header: {Accept: 'application/json'} 
        }
    })
    const  {results} = data
    const podcasts = results.map((podcast,idx) => {
        return {
            id:idx,
            name: podcast.artistName,
            trackName: podcast.trackName,
            icon: podcast.artworkUrl600,
            genres: podcast.genres,
            feed: podcast.feedUrl
        }
    })
    res.json({
        results
    })
})

router.post('/search',async (req,res,next) => {
    const searchTerm = req.body.term
    const url = `https://itunes.apple.com/search?term=${searchTerm}&country=US&media=podcast` 
    const {data} = await axios({
        url,
        method:'get',
        options: {
            header: {Accept: 'application/json'} 
        }
    })
    const  {results} = data
    const podcasts = results.map((podcast, idx) => {
        return {
            id:idx,
            name: podcast.artistName,
            trackName: podcast.trackName,
            image: podcast.artworkUrl600,
            categories: podcast.genres,
            feed: podcast.feedUrl
        }
    })
    res.json({
        podcasts
    })
})
// router.get('/react',(req,res,next)=> {
//     res.render('index')
// })

module.exports = router
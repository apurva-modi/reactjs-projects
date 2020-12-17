import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Header from './components/Header'
import PodcastRow from './components/PostcastRow'
import Episode from './components/Episode'
import axios from 'axios'

const App = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [podcasts, setPodcasts] = useState([])
    const [episodes,setEpisodes] = useState([])
    const [selectedPodcast, setSelectedPodcast] = useState(null)
    // const podcasts = [
    //     {id:0, name:'podcast 1', image:'images/person_1.jpg', categories:['sports', 'entertainment']},
    //     {id:1, name:'podcast 2', image:'images/person_2.jpg', categories:['news','politics']},
    //     {id:2, name:'podcast 3', image:'images/person_3.jpg', categories:['business','economy']},
    //     {id:3, name:'podcast 4', image:'images/person_4.jpg', categories:['lisfestyle','fashion']}
    // ]
    // const episodes = [
    //     {id: 0,title :"track 1", image:"images/img_1.jpg", trackUrl:"http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88"},
    //     {id: 1,title :"track 2", image:"images/img_2.jpg", trackUrl:"http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88" },
    //     {id: 2,title :"track 3", image:"images/img_3.jpg", trackUrl:"http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88"},
    //     {id: 3,title :"track 4", image:"images/img_4.jpg", trackUrl:"http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88"},
    //     {id: 4,title :"track 5", image:"images/img_5.jpg", trackUrl:"http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88"},
    // ]

    const onInputTyped = (event) => {
        // console.log("onInputTyped: " +event.target.value)
        setSearchTerm(event.target.value)
    }

    const onSearchBtnClicked = (event) => {
    // console.log('onSearchBtnClicked: '+ searchTerm)

       axios({
            url: '/search',
            method:'post',
            data: {
                term: searchTerm.trim().toLocaleLowerCase()
            },
            options: {
                header : {Accept: 'application/json'}
            }
        })
        .then(({data}) => {
            // console.log('PODCASTS: '+ JSON.stringify(data))
            setPodcasts(data.podcasts)
        })
        .catch(err => {

        })
    }
    const selectPodcast = (podcast,event) => {
        event.preventDefault()
        console.log('selectPodcast: '+ JSON.stringify(podcast))
        setSelectedPodcast(podcast)
    }
    useEffect (() => {
        console.log('Selected Podcast changed!' + JSON.stringify(selectedPodcast))
        if (!selectedPodcast)
            return

        const url = `/feed?url=${selectedPodcast.feed}`
        axios ({
            url,
            method: 'get',
        })
        .then(({data}) => {
            console.log('FEED: ' +JSON.stringify(data))
            const {item} = data
            const tracks = item.map((t, index) => {
                return {
                    id: index,
                    title: t.title[0],
                    image: selectedPodcast.image,
                    trackUrl: t.enclosure[0]['$'].url,
                }
            })
            setEpisodes(tracks)
        })
        .catch(err => {

        })
    }, [selectedPodcast])
    return (

        <div className="site-wrap">
            <Header/>
            <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className='col-lg-3'>
                            <div className="featured-user mb-5 mb-lg-0">
                                <h3 className="mb-2">Search Podcasts</h3>
                                <div style={{display: "flex"}}>
                                    <input onChange={onInputTyped} type="text" style={{height: 32}} className="form-control mb-4" />
                                    <button onClick={onSearchBtnClicked} className="btn btn-info p-1 ml-2" style={{height: 32}}>GO!</button>
                                </div>
                                <ul className="list-unstyled">
                                    {
                                        podcasts.map(podcasts => {
                                            return <PodcastRow key={podcasts.id} {...podcasts} onSelect={(e) => selectPodcast(podcasts, e)}/>
                                        })
                                    }

                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            {
                                episodes.map(episodes => {
                                    return <Episode key={episodes.id} {...episodes}/>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

ReactDOM.render(<App/> , document.getElementById('root'))
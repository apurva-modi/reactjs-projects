import React from 'react'

const PostcastRow = ({name,image,categories, onSelect}) => {
    // const clickHandler = (e) => {
    //     e.preventDefault()
    //     onSelect({
    //         name
    //     })
    // }
    return (
        <li>
            <a onClick = {onSelect}href="#" className="d-flex align-items-center  p-2">
                <img src={image} alt="Image" className="img-fluid mr-2"/>
                <div className="podcaster">
                    <span className="d-block">{name}</span>
                    <span className="small">{categories.join(', ')}</span>
                </div>
            </a>
        </li>
    )
}

export default PostcastRow

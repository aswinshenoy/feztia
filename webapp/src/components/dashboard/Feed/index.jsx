import React, { useState, useEffect } from 'react';
import {Waypoint} from "react-waypoint";

import APIFetch from "../../../utils/APIFetch";
import {EVENT_GALLERY_QUERY, GALLERY_QUERY} from "../../../graphql/queries/event";
import SubmissionPost from "./Post";

const SubmissionFeed = ({
    eventID = null,
}) => {

    const [posts, setPosts] = useState();
    const [event, setEvent] = useState()
    const [hasNext, setHasNext] = useState(true);
    const [after, setAfter] = useState(null);

    const fetchItems = () => {
        if(hasNext) {
            APIFetch({
                query: eventID ? EVENT_GALLERY_QUERY : GALLERY_QUERY,
                variables: {
                    after,
                    eventID
                }
            }).then(({data, errors, success}) => {
                if (success) {
                    if(posts?.length > 0) {
                        setPosts([...posts, ...data.gallery.posts]);
                    } else {
                        setPosts(data.gallery.posts);
                    }
                    if(eventID) {
                        setEvent(data.event)
                    }
                    setAfter(data.gallery.lastCursor);
                    setHasNext(data.gallery.hasNext)
                }
            })
        }
    };

    useEffect(fetchItems, []);

    return <div>
        {(!eventID || event) && posts?.length > 0 ?
            <div>
                <div className="row mx-0">
                    {posts.map((p) =>
                        <div className="col-md-4 py-2">
                            <SubmissionPost hideEventName event={event} {...p} />
                        </div>
                    )}
                </div>
                <Waypoint onEnter={() => fetchItems()}>
                    <div className="my-3 w-100 p-2">
                        <button onClick={() => fetchItems()} className="btn  w-100 btn-primary p-3">Load More</button>
                    </div>
                </Waypoint>
            </div> :
            <div className="py-3">
                <div>No Submissions Found</div>
            </div>
        }
    </div>

};

export default SubmissionFeed;
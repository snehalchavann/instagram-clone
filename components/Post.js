import { addDoc, doc, collection, onSnapshot, orderBy, query, serverTimestamp, setDoc, deleteDoc } from "@firebase/firestore";
import { async } from "@firebase/util";
import {
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon,
}from "@heroicons/react/outline"

import {HeartIcon as HeartIconFilled} from "@heroicons/react/solid"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Moment from "react-moment";

function Post({id, username, userImg, img, caption}) {
    const {data: session} = useSession();

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);

    // render comments for each post
    useEffect(
        () => 
            onSnapshot(
                query(
                    collection(db,'posts',id,'comments'),
                    orderBy('timestamp','desc')
                    ),
                    (snapshot) => setComments(snapshot.docs)
                    ),
                    [db]
    );

    // update likes count 
    useEffect(
        () => 
        onSnapshot(
            collection(db, 'posts',id, 'likes'),
            (snapshot) => setLikes(snapshot.docs)
        ),
        [db,id]
    );

    // check if user has already liked a post
    useEffect(
    () => 
        setHasLiked(
            likes.findIndex((like) => like.id === session?.user?.uid) !== -1
        ),
        [likes]
    );

    const likePost = async() => {
        if(hasLiked){
            await deleteDoc(doc(db,'posts',id,'likes',session.user.uid))
        }else{
            await setDoc(doc(db, 'posts', id, 'likes' , session.user.uid),{
                username: session.user.username,
            });
        }
        
    }

    const sendComment = async (e) =>{
        e.preventDefault();

        const commentToSend = comment;
        setComment('');

        await addDoc(collection(db,'posts',id,'comments'),{
            comment: commentToSend,
            username: session.user.username,
            userImage: session.user.image,
            timestamp: serverTimestamp(),
        });
    }

    return (
        <div className="bg-white my-7 border rounded-sm">
            {/* header of post */}
            <div className="flex items-center p-5">
                {/* if necessary add object-contain */}
                <img src={userImg}
                className="rounded-full h-12 w-12 border p-0 mr-3" alt=""/> 
                <p className="flex-1 font-bold">{username}</p>
                <DotsHorizontalIcon className="h-5"/>
            </div>

            {/* image */}
            <img src={img} className="object-cover w-full" alt=""/>

            {/* div for buttons in a post*/}
            {session && (
                <div className="flex justify-between px-4 pt-4">
                    <div className="flex space-x-4">
                        {
                            hasLiked ? (
                                <HeartIconFilled onClick={likePost} className="postButton text-red-500"/>
                            ):(
                                <HeartIcon onClick={likePost} className="postButton"/>
                            )
                        }
                        
                        <ChatIcon className="postButton"/>
                        <PaperAirplaneIcon className="postButton"/>
                    </div>
                    <BookmarkIcon className="postButton"/>

            </div>
            )}
            

            {/* caption of a post*/}
            <p className="p-5 truncate">
                {likes.length > 0 && (
                    <p className="font-bold mb-1">{likes.length} likes</p>
                )}
                <span className="font-bold mr-1">{username}</span>
                {caption}
            </p>

            {/* comments */}
            {comments.length > 0 && (
                <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                    {comments.map(comment =>(
                        <div className="flex items-center space-x-2 mb-3" key={comment.id}>
                            <img className="h-7 rounded-full" src={comment.data().userImage} alt=""/>
                            <p className="text-sm flex-1"> 
                            <span className="font-bold">
                                {comment.data().comment}
                            </span> 
                            </p>

                            <Moment fromNow className="pr-5 text-xs">
                                {comment.data().timestamp?.toDate()}
                            </Moment>
                            </div>
                    ))}
                    </div>
            )}

            {/* input box */}
            {session && (
                <form className="flex items-center p-4">
                    <EmojiHappyIcon className="h-7"/>
                    <input type="text" 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="border-none flex-1 focus:ring-0"/>
                    <button type="submit" disabled={!comment.trim()}
                    onClick={sendComment} className="font-semibold text-blue-500">Post</button>
            </form>
            )}
            
            
        </div>
    );
}

export default Post;

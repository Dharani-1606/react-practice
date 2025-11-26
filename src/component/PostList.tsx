import React, { useEffect } from 'react'
import { usePostFetcher, useSwrFetcher } from '../services/useSwrFetcher'

const sampleObj: any = {
    title: "New Post",
    body: "This is a new post created with SWR",
    userId: 1,
}
function PostList() {
    // GET request with swr
    const { data: postList, isLoading } = useSwrFetcher("/posts");

    // POST request hook
    const { trigger, data: newPost, isMutating } = usePostFetcher("/posts");

    useEffect(() => {
        console.log("log postList-data :>>", isLoading, postList);
    }, [postList])

    const handleCreatePost = async () => {
        const result = await trigger(sampleObj);
        console.log("Post created:", result);
    };

    return (
        <div>
            <h1>Posts</h1>
            {/* {isLoading ? <p>Loading...</p> : <pre>{JSON.stringify(postList, null, 2)}</pre>} */}

            <button onClick={handleCreatePost} disabled={isMutating}>
                {isMutating ? "Creating..." : "Create Post"}
            </button>

            {newPost && (
                <pre style={{ color: "green" }}>
                    Created Post: {JSON.stringify(newPost, null, 2)}
                </pre>
            )}
        </div>
    )
}

export default PostList
import { tweetsData } from './data.js'
import { UUID as uuidV4 } from "https://unpkg.com/uuidjs@^5"


let tweets = JSON.parse(localStorage.getItem('tweets')) || tweetsData



document.addEventListener('click', function (e) {
    function handleLike(tweetId) {
        tweets.forEach(function (tweet) {
            if (tweet.uuid === tweetId && !tweet.isLiked) {
                tweet.likes++
                tweet.isLiked = !tweet.isLiked
                render(tweets)
            } else if (tweet.uuid === tweetId && tweet.isLiked) {
                tweet.likes--
                tweet.isLiked = !tweet.isLiked
                render(tweets)
            }
        })
    }
    function handleRetweet(tweetId) {
        tweets.forEach(function (tweet) {
            if (tweet.uuid === tweetId && !tweet.isRetweeted) {
                tweet.retweets++
                tweet.isRetweeted = !tweet.isRetweeted
                render(tweets)
            } else if (tweet.uuid === tweetId && tweet.isRetweeted) {
                tweet.retweets--
                tweet.isRetweeted = !tweet.isRetweeted
                render(tweets)
            }
        })
    }

    function handleReplies(replyId) {
        document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    }

    function handleReply(replyId) {
        const replyInputEl = document.getElementById(`reply-input-${replyId}`)

        if (replyInputEl.value) {

            tweets.forEach(function (tweet) {
                if (tweet.uuid === replyId) {
                    tweet.replies.unshift(
                        {
                            handle: `@RazzwScrimba 👑`,
                            profilePic: `images/scrimbalogo.png`,
                            tweetText: replyInputEl.value,
                            byUser: true,
                            uuid: uuidV4.generate()
                        }
                    )
                }
            })

            localStorage.setItem('tweets', JSON.stringify(tweets))
            render(tweets)
            document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
        }
    }
    handleLike(e.target.dataset.like)
    handleRetweet(e.target.dataset.retweet)
    if (e.target.dataset.reply) {
        handleReplies(e.target.dataset.reply)
    }

    e.target.dataset.replyBtn ? handleReply(e.target.dataset.replyBtn) :
        e.target.dataset.replyEl ? handleReply(e.target.dataset.replyEl) : null

    if (e.target.dataset.replyTrash) {

        const trashId = e.target.dataset.replyTrash
        tweets.forEach(function (tweet) {
            for (let i = 0; i < tweet.replies.length; i++) {
                if (tweet.replies[i].uuid) {
                    if (tweet.replies[i].uuid === trashId) {
                        tweet.replies.splice(i, 1)
                        localStorage.setItem('tweets', JSON.stringify(tweets))
                        render(tweets)
                        document.getElementById(`replies-${tweet.uuid}`).classList.toggle('hidden')
                    }
                }
            }
        })
    }

    if (e.target.dataset.tweetTrash) {
        const trashId = e.target.dataset.tweetTrash
        for (let i = 0; i < tweets.length; i++) {
            if (tweets[i].uuid === trashId) {
                tweets.splice(i, 1)
                localStorage.setItem('tweets', JSON.stringify(tweets))
                setTimeout(() => {
                    render(tweets)
                }, 100);
            }
        }
    }

    if (e.target.id === 'tweet-btn') {

        const inputEl = document.getElementById('tweet-input')
        if (inputEl.value) {
            tweets.unshift(
                {
                    handle: `@RazzwScrimba 👑`,
                    profilePic: `images/scrimbalogo.png`,
                    likes: 0,
                    retweets: 0,
                    tweetText: inputEl.value,
                    replies: [],
                    isLiked: false,
                    isRetweeted: false,
                    uuid: uuidV4.generate(),
                    byUser: true
                }
            )
        }

        localStorage.setItem('tweets', JSON.stringify(tweets))
        render(tweets)
        inputEl.value = ''
    }
})



function render(data) {

    console.log(JSON.parse(localStorage.getItem('tweets')))

    const feedEl = document.getElementById('feed')
    let feedHtml = ''
    data.forEach((tweet) => {

        let likeCls = ''

        if (tweet.isLiked) {
            likeCls = 'liked'
        }

        let retweetCls = ''

        if (tweet.isRetweeted) {
            retweetCls = 'retweeted'
        }

        let repliesHtml = ''
        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function (reply) {
                if (!reply.byUser) {
                    repliesHtml += `
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                    </div>
                            </div>
                        </div>
                    `
                } else {
                    repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner trash">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle} <i class="fa-solid fa-trash fa-xs" data-reply-trash=${reply.uuid}></i></p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            
                        </div>
                    </div>
                    `
                    console.log('byuser')
                }
            })
        }

        let trashHtml = ''
        if (tweet.byUser) {
            trashHtml = `<i class="fa-solid fa-trash fa-sm" data-tweet-trash=${tweet.uuid}></i>`
        }
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <P class="handle">${tweet.handle}
                            
                        </P>
                        <P class="tweet-text">${tweet.tweetText}</P>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeCls}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetCls}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                            ${trashHtml}
                            
                        </div>
                    </div>
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    <div class="tweet-reply-div" id="reply-${tweet.uuid}">
                        <img src="images/scrimbalogo.png" class="profile-pic">
                        <textarea class="reply-area" placeholder="Post your reply" id="reply-input-${tweet.uuid}"></textarea>
                        <button class="reply-btn" data-reply-btn="${tweet.uuid}"><i class="fa-solid fa-reply" data-reply-el="${tweet.uuid}"></i></button>
                    </div>
                    ${repliesHtml}
                </div>
            </div>
        `
    });

    feedEl.innerHTML = feedHtml;
}





render(tweets)
import { Post } from "../types"

export const BlogList = (posts: Post[]) => {
    return `
    <section class="flex flex-col size-full justify-center items-center">
    ${posts.map(post => `
    <div class="post-card">
    <div class="post-image">
    <img src="${post.boritekep}" alt="${post.cim}">
    </div>
    <div class="post-content">
    <h2 class="post-title">
    <a href="#/blog/${post.id}">${post.cim}</a>
    </h2>
    <p class="post-excerpt">${post.kivonat}</p>
    <div class="post-meta">
    <div class="post-author">
    <div class="author-avatar">${post.szerzo.charAt(0).toUpperCase()}</div>
    <span>${post.szerzo}</span>
    </div>
    <span class="post-date">${post.datum}</span>
    </div>
    </div>
    </div>
    `).join('')}
    </section>
    `
}
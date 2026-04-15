import { fetchPosts } from "../api"
import { BlogList } from "../components/bloglist"
import { renderNavbar } from "../components/navbar"
import { Post } from "../types"

export const renderTestPage = async (container: HTMLElement) => {
    const posts = await fetchPosts();
    container.innerHTML = `
    <main class="h-[calc(100vh-5rem)]">
    ${renderNavbar()}
    <section class="flex flex-col size-full justify-center items-center">
    ${BlogList(posts.posts)}
    </section>
    </main>
    `
}
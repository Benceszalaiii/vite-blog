import { Post } from "../types"

export const BlogList = (posts: Post[]) => {
    return `
    <table class="flex w-full pt-24 mx-auto flex-col size-full justify-center items-center">
    ${posts.map(post => `
        <tr class="w-full border border-white/20 rounded-lg h-24 flex flex-row gap-4 font-semibold text-lg items-center justify-evenly">
         <td class="mr-auto">${post.cim}</p>
         <td>${post.szerzo}</p>
         <td>${post.datum}</p>
         <td>${post.kiemelt}</p>
        </tr>
    `).join('')}
    </table>
    `
}
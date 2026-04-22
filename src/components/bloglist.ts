import { Post } from "../types";
import { handleDelete } from "../utils/delete";

export const BlogList = (posts: Post[]) => {
  return {
    content: `
    <section class="w-full max-w-5xl mx-auto flex flex-col gap-16 items-center justify-center">
    <div class="w-full flex justify-between items-center mb-2.5">
    <h2 class="text-2xl mr-auto font-bold text-text-primary dark:text-white">Posztok</h2>
    <button class="bg-violet-700 px-4 py-2 rounded-lg text-white hover:bg-violet-800 transition-colors cursor-pointer">Új poszt</button>
    </div>
    <table class="text-left w-full pt-12 mx-auto p-4 rounded-lg shadow-lg space-y-4">
    <thead>
        <tr>
            <th class="w-1/3">Cím</th>
            <th class="w-1/6">Szerző</th>
            <th class="w-1/6">Dátum</th>
            <th class="w-1/6">Kiemelt</th>
            <th class="w-1/6 text-right">Műveletek</th>
        </tr>
    </thead>
    <tbody>
    ${posts
      .map(
        (post) => `
        <tr class="border-t border-slate-200 dark:border-slate-700">
            <td class="w-1/3">${post.cim}</td>
            <td class="w-1/6">${post.szerzo}</td>
            <td class="w-1/6">${new Date(post.datum).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}</td>
            <td class="w-1/6 pl-4">${post.kiemelt ? `<svg class="size-7 inline stroke-violet-500 stroke-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>` : ""}</td>
            <td class="w-1/6 text-right py-4">
            <button data-id="${post.id}" name="delete" class="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
            <a href="#/edit/${post.id}">
                <button class="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                </button>
                </a>
            </td>
            </tr>
    `,
      )
      .join("")}
    </tbody>
    </table>
    </section>
    `,
    attachEvents: () => {
      const deleteButtons = document.querySelectorAll('button[name="delete"]');
      deleteButtons.forEach((btn) => {
        btn.addEventListener("click",  () => {
          const postId = btn.getAttribute("data-id");
          if (postId) {
            handleDelete(postId);
          }
        });
      });
    },
  };
};

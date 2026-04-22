import { renderNavbar, attachNavbarEvents } from '../components/navbar';
import { getUser, isLoggedIn } from '../store';
import { fetchPost } from '../api';
import { Post } from '../types';
import { renderPost } from './post';
import { renderPreview } from './preview';

const notFoundPage = ({message, errorCode = "404 - Az oldal nem található"} : {message: string, errorCode: string}) => {
    return `
    <main>
    ${renderNavbar()}
    <section class="min-h-[80vh] gap-4 flex flex-col items-center justify-center">
    <h1 class="text-red-500 font-bold text-2xl">${errorCode}</h1>
    <p class="text-lg">${message}</p>
    </section>
    </main>
    `;
}

export const renderEditPage = async (container: HTMLElement, slug?: string) => {
    if (!isLoggedIn()) {
        window.location.hash = '#/login';
        return;
    }

    const user = getUser();
    if (!user || (user?.role !== "admin" && user?.role !== "adminisztrator")){
        window.location.hash = '#/';
        return;
    }

    if (!slug || isNaN(parseInt(slug))) {
        container.innerHTML = notFoundPage({message: `Nincs megadva azonosító: ${slug}`, errorCode: `400 - Rossz kérés`});
        return;
    }
    const postSlug = parseInt(slug);
    const post = await fetchPost(postSlug);

    if (!post) {
        container.innerHTML = notFoundPage({message: `A keresett blog nem létezik ${postSlug} azonosítóval`, errorCode: `404 - Nem található`});
        return;
    }
    let currentData: Post = { cim: post.cim, boritekep: post.boritekep, kivonat: post.kivonat, tartalom: post.tartalom, categoryId: post.categoryId, datum: post.datum, kiemelt: post.kiemelt, id: post.id, szerzo: post.szerzo};
    container.innerHTML = `
    <main>
    <div id="preview" class="hidden fixed top-12 w-full h-screen bg-black/50 z-50 flex-col items-center justify-center"></div>
    ${renderNavbar()}
    <form class="max-w-4xl border rounded-lg p-4 border-neutral-300/30 shadow-inner mx-auto my-4 flex flex-col gap-4" action="">
    <h2 class="text-2xl font-bold">Blogbejegyzés szerkesztése</h2>
    <label class="block mb-2" for="title">Cím</label>
    <input class="block mb-2 w-full border border-neutral-400/30 rounded-sm" type="text" id="title" name="title" value="${currentData.cim}" />
    <label class="block mb-2" for="image">Borítókép</label>
    <img id="imagePreview" src="${currentData.boritekep}" alt="${currentData.cim}" loading="lazy" class="h-44 aspect-auto rounded-lg w-fit" />
    <input id="imageUrl" class="block mb-2 w-full border border-neutral-400/30 rounded-sm p-4" type="text" id="image" name="image" value="${currentData.boritekep}" />
    <label class="block mb-2" for="excerpt">Kivonat</label>
    <input class="block mb-2 w-full border border-neutral-400/30 rounded-sm p-4" type="text" id="excerpt" name="excerpt" value="${currentData.kivonat}" />
    <label class="block mb-2" for="content">Tartalom</label>
    <textarea class="block mb-2 w-full border border-neutral-400/30 rounded-sm p-4 h-[20vh]" id="content" name="content">${currentData.tartalom}</textarea>
    <div class="flex flex-row justify-end w-full gap-4">
    <button class="block bg-violet-700 hover:bg-violet-800 mb-2 w-fit px-8 py-2 bg-primary-color text-white rounded-md hover:opacity-80 transition-all cursor-pointer" type="submit">Mentés</button>
    <button type="button" class="block bg-emerald-700 hover:bg-emerald-800 mb-2 w-fit px-8 py-2 bg-primary-color text-white rounded-md hover:opacity-80 transition-all cursor-pointer">Előnézet</button>
    <button class="block bg-red-700 hover:bg-red-800 mb-2 w-fit px-6 py-2 bg-primary-color text-white rounded-md hover:opacity-80 transition-all cursor-pointer" type="submit">Törlés</button>
    </div>
    </form>
    </main>
    `;
    const input = document.getElementById('imageUrl') as HTMLInputElement;
    const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
    input.addEventListener('input', () => {
        imagePreview.src = input.value;
    });
    const previewBtn = document.querySelector('button[type="button"]');
    const previewDiv = document.getElementById('preview') as HTMLDivElement;
    previewBtn?.addEventListener('click', () => {
        previewDiv.innerHTML = `
        <div class="bg-slate-800 w-full max-w-7xl h-[75vh] mt-[10vh] overflow-y-scroll overflow-x-hidden rounded-lg p-12">
        ${renderPreview(previewDiv, currentData)}
        <button id="close-preview" class="text-white hover:text-red-500 transition-colors fixed bottom-8 z-100 right-8 cursor-pointer">Bezárás</button>
        </div>
        `;

        const closePreviewBtn = document.getElementById('close-preview');
        closePreviewBtn?.addEventListener('click', () => {
            previewDiv.classList.remove('flex');
            previewDiv.classList.add('hidden');
        });
        document.body.style.overflow = 'hidden';
        previewDiv.classList.remove('hidden');
        previewDiv.classList.add('flex');
    });
    attachNavbarEvents();
}
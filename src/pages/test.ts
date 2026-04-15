import { renderNavbar } from "../components/navbar"

export const renderTestPage = (container: HTMLElement) => {
    container.innerHTML = `
    <main class="h-[calc(100vh-5rem)]">
    ${renderNavbar()}
    <section class="flex flex-col size-full justify-center items-center">
    penisman
    </section>
    </main>
    `
}
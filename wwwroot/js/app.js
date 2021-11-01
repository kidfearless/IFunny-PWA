import { AutoPlayImageVideo as AutoPlayImageVideo } from './components/video.js';
import { get, set } from './indexdb.js';
try {
    HTMLVideoElement.prototype.pause = null;
}
catch (error) {
}
let loading = document.getElementById("loading");
loading?.classList.add("solid");
let currentpage = 1;
let session = null;
const rootelement = document.getElementById('container');
let videomap = new Map();
const observer = new IntersectionObserver(onintersection, { root: rootelement, rootMargin: '0px', threshold: 0.2 });
let viewedvideos = new Set();
const VIEWED_VIDEOS = "viewed-items";
const PAGE_LATEST = "page-latest";
export var Type;
(function (Type) {
    Type["Picture"] = "picture";
    Type["Video"] = "video";
})(Type || (Type = {}));
Object.defineProperty(HTMLDivElement.prototype, "autoPlayInstance", {
    get() {
        if (this.parentElement) {
            const inst = videomap.get(this.id);
            if (inst) {
                return inst;
            }
        }
        return undefined;
    }
});
function onintersection(entries) {
    for (let entry of entries) {
        const video = videomap.get(entry.target.id);
        if (!video) {
            continue;
        }
        video.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
            console.info('onintersection::intersecting', entry.target.id);
            console.log(video.id, videomap.size, (videomap.size - 10));
            markVideoAsViewed(video);
            if (video.id > (videomap.size - 10)) {
                loadNextPage();
                console.info('\tonintersection::loading next page');
            }
            if (!video.isVideo || !video.canplay || !video.video) {
                continue;
            }
            if (video.video.paused) {
                video.video.play().catch(x => console.error('onintersection::play', x, video));
                console.log(`[${video.id}] somehow paused itself`, video);
            }
            video.play();
            if (!AutoPlayImageVideo.ismuted) {
                video.volume = 1;
            }
        }
        else if (video.isVideo && video.video) {
            console.info('onintersection::leaving', entry.target.id);
            video.pause();
        }
    }
}
function markVideoAsViewed(video) {
    for (let v of videomap.values()) {
        if (v.id <= video.id) {
            viewedvideos.add(v.isVideo ? v.video.src : v.image.src);
        }
    }
    console.info('onintersection::viewed::set(VIEWED_VIDEOS)', viewedvideos);
    set(VIEWED_VIDEOS, viewedvideos);
}
async function getSessionId() {
    const value = await get('session');
    if (!value || value.message || new Date(Date.parse(value.result.expirationDate)) <= new Date(Date.now() - 1000 * 60 * 60)) {
        const response = await fetch('/IFunny/GetSessionID');
        const prom = response.json();
        prom.then(x => {
            set('session', x);
        });
        return await prom;
    }
    console.info('getSessionId::session', value.result);
    return value;
}
async function retreiveNextPage(session) {
    let page = await fetch(`/IFunny/GetPage/${session.csrf}/${session.clientID}/${currentpage++}`);
    let promise = await page.json();
    promise.result = JSON.parse(promise.result);
    const viewed = await get(VIEWED_VIDEOS);
    if (viewed) {
        for (let url of viewed.values()) {
            viewedvideos.add(url);
        }
    }
    promise.result.items = promise.result.items.filter(x => !viewedvideos.has(x.url));
    set(PAGE_LATEST, promise);
    return promise;
}
async function getFirstPage(session) {
    const page = await get(`page-latest`);
    const viewed = get(VIEWED_VIDEOS);
    if (!page || page.message) {
        return await retreiveNextPage(session);
    }
    console.log(page.result);
    let result = await viewed;
    if (result) {
        console.info('getFirstPage::viewed', result);
        page.result.items = page.result.items.filter(x => !result.has(x.url));
        for (let url of result) {
            viewedvideos.add(url);
        }
    }
    else {
        console.info('getFirstPage::viewed NULL');
    }
    return page;
}
function AddVideo(item) {
    const video = new AutoPlayImageVideo(item);
    videomap.set(video.element.id, video);
    rootelement.appendChild(video.element);
    observer.observe(video.element);
}
async function main() {
    let start = performance.now();
    session = await getSessionId();
    if (!session.result) {
        console.error('main::session', session.message);
        return;
    }
    const page = await getFirstPage(session.result);
    if (!page.result) {
        console.error('main::page', page.message);
        return;
    }
    if (page.result.items.length === 0) {
        await loadNextPage();
    }
    else if (page.result.items.length < 10) {
        loadNextPage();
    }
    let end = performance.now();
    console.info('retreiving data from ifunny took', `${end - start}ms`);
    let once = () => {
        loading?.classList.add("transparent");
        loading?.addEventListener("transitionend", (ev) => {
            loading?.remove();
        });
        loading?.addEventListener("animationcancel", (ev) => {
            loading?.remove();
        });
        setTimeout(() => {
            loading?.remove();
        }, 2000);
        rootelement.classList.add("darkbackground");
        once = null;
    };
    for (let item of page.result.items) {
        AddVideo(item);
        once?.call(undefined);
        PrintLoadTime();
    }
}
main();
async function loadNextPage() {
    console.info('LoadNextPage::loading next page');
    let x = await retreiveNextPage(session.result);
    if (!x || x.message) {
        console.error('LoadNextPage::error', x.message);
        return;
    }
    x.result.items = x.result.items.filter(x => !viewedvideos.has(x.url));
    if (x.result.items.length === 0) {
        return loadNextPage();
    }
    else if (x.result.items.length < 10) {
        loadNextPage();
    }
    for (let item of x.result.items) {
        AddVideo(item);
    }
}
//# sourceMappingURL=app.js.map
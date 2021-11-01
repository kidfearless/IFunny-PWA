class CustomHTMLElement {
    element;
    constructor() {
        this.element = document.createElement("div");
    }
}
const videoattributes = [
    "src",
    "crossorigin",
    "poster",
    "preload",
    "autoplay",
    "playsinline",
    "loop",
    "muted",
    "controls",
    "width",
    "height"
];
const activationevents = [
    "change",
    "click",
    "contextmenu",
    "dblclick",
    "mouseup",
    "pointerup",
    "reset",
    "submit",
    "touchend",
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel"
];
export class AutoPlayImageVideo extends CustomHTMLElement {
    static ismuted = true;
    static MUTED_ICON = "fa-volume-xmark";
    static PLAYING_ICON = "fa-volume-high";
    static #currentId = -1;
    video;
    image;
    isVideo;
    _canplay;
    get canplay() {
        return this._canplay && this.video != null && !this.video.paused;
    }
    set canplay(value) {
        this._canplay = value;
    }
    mutebutton;
    isVisible;
    id;
    mutation;
    get paused() {
        if (this.video) {
            return this.video?.playbackRate <= 0.01;
        }
    }
    get volume() {
        return this.video?.volume;
    }
    set volume(value) {
        if (!this.video || value === undefined || !this.mutebutton) {
            return;
        }
        value = Math.max(0, Math.min(1, value));
        if (value === 0) {
            this.mutebutton.classList.add(AutoPlayImageVideo.MUTED_ICON);
            this.mutebutton.classList.remove(AutoPlayImageVideo.PLAYING_ICON);
            AutoPlayImageVideo.ismuted = true;
        }
        else {
            this.mutebutton.classList.add(AutoPlayImageVideo.PLAYING_ICON);
            this.mutebutton.classList.remove(AutoPlayImageVideo.MUTED_ICON);
            AutoPlayImageVideo.ismuted = false;
            this.video.muted = false;
        }
        this.video.volume = value;
    }
    constructor(item) {
        super();
        this.canplay = false;
        this.isVisible = false;
        this.element.id = `vid_` + ++AutoPlayImageVideo.#currentId;
        this.element.classList.add("autoplay-video");
        this.id = AutoPlayImageVideo.#currentId;
        this.isVideo = item.type === "video";
        if (this.isVideo) {
            this.video = document.createElement('video');
            this.video.id = `video_` + AutoPlayImageVideo.#currentId;
            this.video.playbackRate = 0;
            this.video.volume = 0;
            this.video.muted = true;
            this.video.playsInline = true;
            this.video.loop = true;
            this.video.src = item.url;
            if (this.id != 1) {
                this.video.preload = "metadata";
            }
            else {
                this.video.preload = "auto";
            }
            this.video.addEventListener("click", this.onvideoclicked.bind(this));
            this.element.appendChild(this.video);
            this.mutation = new MutationObserver(this.videomutated.bind(this));
            this.mutation.observe(this.video, { childList: true, subtree: true });
            this.video.play().then(this.attemptedplaycallback.bind(this)).catch((e) => {
                this.canplay = false;
                console.log("could not play video muted", e);
            });
            this.mutebutton = document.createElement('i');
            this.mutebutton.className = 'fa-solid fa-volume-xmark playbutton';
            this.mutebutton.onclick = this.onaudioclicked.bind(this);
            this.element.appendChild(this.mutebutton);
            for (let event of activationevents) {
                document.addEventListener(event, this.oninteraction.bind(this), { passive: true });
                this.element.addEventListener(event, this.oninteraction.bind(this), { passive: true });
                this.mutebutton.addEventListener(event, this.oninteraction.bind(this), { passive: true });
            }
        }
        else {
            this.image = document.createElement('img');
            this.image.id = `image_` + AutoPlayImageVideo.#currentId;
            this.image.src = item.url;
            this.element.appendChild(this.image);
        }
    }
    videomutated(mutations) {
        for (let mutation of mutations) {
            console.log(mutation);
            if (mutation.attributeName === "paused") {
                this.video.play().catch((e) => { console.log("could not play video when browser attempted to pause it.", e); });
            }
        }
    }
    attemptedplaycallback() {
        if (this.isVisible) {
            this.play();
            this.video.muted = false;
        }
        else {
            this.pause();
        }
        this.video.currentTime = 0;
    }
    pause() {
        this.video.playbackRate = 0;
        if (!this.canplay) {
            console.warn("Video is not ready to pause", this, this.video, this.video?.paused, this._canplay);
        }
    }
    play() {
        this.video.playbackRate = 1;
        if (!this.canplay) {
            console.warn("Video is not ready to play... Atempting to play");
            this.video.play().then(this.attemptedplaycallback.bind(this)).catch((e) => { console.log("could not play video", e); });
        }
    }
    async oninteraction(event) {
        if (!this.canplay) {
            let onfulfilled = () => {
                console.log(`[${this.id}] is ready to play`);
                if (this.video.paused) {
                    console.log(`[${this.id}] is paused and not actually able to play like it says it is`, this.video);
                    return;
                }
                this.canplay = true;
                this.video.currentTime = 0;
            };
            let onrejected = (reason) => {
                this.canplay = false;
                console.warn("Video failed to play", event.type, reason, this);
            };
            this.video.play().then(onfulfilled, onrejected).catch((e) => { console.log("could not play video for some reason", e); });
        }
    }
    onvideoclicked(event) {
        if (this.canplay) {
            if (this.paused) {
                this.play();
            }
            else {
                this.pause();
            }
        }
    }
    onaudioclicked(event) {
        if (this.volume <= 0.1) {
            this.video.muted = false;
            this.volume = 1;
        }
        else {
            this.volume = 0;
        }
    }
}
//# sourceMappingURL=video.js.map
class CustomHTMLElement
{
	element: HTMLDivElement;
	constructor()
	{
		this.element = document.createElement("div");
	}
}

const videoattributes = [
	// Address of the resource
	"src",
	// How the element handles crossorigin requests
	"crossorigin",
	// Poster frame to show prior to video playback
	"poster",
	// Hints how much buffering the media resource will likely need
	"preload",
	// Hint that the media resource can be started automatically when the page is loaded
	"autoplay",
	// Encourage the user agent to display video content within the element's playback area
	"playsinline",
	// Whether to loop the media resource
	"loop",
	// Whether to mute the media resource by default
	"muted",
	// Show user agent controls
	"controls",
	// Horizontal dimension
	"width",
	// Vertical dimension
	"height"
];

// https://html.spec.whatwg.org/multipage/interaction.html#activation-notification
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

export class AutoPlayImageVideo extends CustomHTMLElement /* implements HTMLVideoElement */
{
	static ismuted = true;
	static readonly MUTED_ICON = "fa-volume-xmark";
	static readonly PLAYING_ICON = "fa-volume-high";
	static #currentId = -1;
	video: HTMLVideoElement | undefined;
	image: HTMLImageElement | undefined;
	isVideo: boolean;
	_canplay!: boolean;

	get canplay(): boolean
	{
		return this._canplay && this.video != null && !this.video.paused;
	}

	set canplay(value: boolean)
	{
		this._canplay = value;
	}

	mutebutton: HTMLElement | undefined;
	isVisible: boolean;
	id: number;
	mutation: MutationObserver | undefined;

	public get paused(): boolean | undefined 
	{
		if (this.video)
		{
			return this.video?.playbackRate <= 0.01;
		}
	}

	public get volume(): number | undefined
	{
		return this.video?.volume;
	}

	public set volume(value: number | undefined)
	{
		if (!this.video || value === undefined || !this.mutebutton)
		{
			return;
		}
		// math.clamp
		// it checks if the value is greater than 1. If so, it sets the value to 1.
		// it checks if the value is less than 0. If so, it sets the value to 0.
		value = Math.max(0, Math.min(1, value));

		// mute video
		if (value === 0)
		{
			this.mutebutton.classList.add(AutoPlayImageVideo.MUTED_ICON);
			this.mutebutton.classList.remove(AutoPlayImageVideo.PLAYING_ICON);
			AutoPlayImageVideo.ismuted = true;
		}
		else
		{
			this.mutebutton.classList.add(AutoPlayImageVideo.PLAYING_ICON);
			this.mutebutton.classList.remove(AutoPlayImageVideo.MUTED_ICON);
			AutoPlayImageVideo.ismuted = false;
			this.video.muted = false;
		}

		this.video.volume = value;
	}


	constructor(item: Item)
	{
		super();
		this.canplay = false;
		this.isVisible = false;
		// give us a unique id
		this.element.id = `vid_` + ++AutoPlayImageVideo.#currentId;
		this.element.classList.add("autoplay-video");

		this.id = AutoPlayImageVideo.#currentId;

		this.isVideo = item.type === "video";

		if (this.isVideo)
		{
			// create the video element and initialize the properties
			this.video = document.createElement('video');
			this.video.id = `video_` + AutoPlayImageVideo.#currentId;
			this.video.playbackRate = 0;
			this.video.volume = 0;
			this.video.muted = true;
			this.video.playsInline = true;
			this.video.loop = true;
			this.video.src = item.url;
			if (this.id != 1)
			{
				this.video.preload = "metadata";
			}
			else
			{
				this.video.preload = "auto";
			}
			this.video.addEventListener("click", this.onvideoclicked.bind(this));
			this.element.appendChild(this.video);

			this.mutation = new MutationObserver(this.videomutated.bind(this));
			this.mutation.observe(this.video, { childList: true, subtree: true });

			this.video.play().then(this.attemptedplaycallback.bind(this)).catch((e) =>
			{
				this.canplay = false;
				console.log("could not play video muted", e);
			});

			// create the mute button and add the font awesome icons
			this.mutebutton = document.createElement('i');
			this.mutebutton.className = 'fa-solid fa-volume-xmark playbutton';
			this.mutebutton.onclick = this.onaudioclicked.bind(this);
			this.element.appendChild(this.mutebutton);


			for (let event of activationevents)
			{
				document.addEventListener(event, this.oninteraction.bind(this), { passive: true });
				this.element.addEventListener(event, this.oninteraction.bind(this), { passive: true });
				this.mutebutton.addEventListener(event, this.oninteraction.bind(this), { passive: true });
			}
		}
		else
		{
			this.image = document.createElement('img');
			this.image.id = `image_` + AutoPlayImageVideo.#currentId;
			this.image.src = item.url;
			this.element.appendChild(this.image);
		}
	}

	private videomutated(mutations: MutationRecord[])
	{
		for (let mutation of mutations)
		{
			console.log(mutation);
			if (mutation.attributeName === "paused")
			{
				this.video!.play().catch((e) => { console.log("could not play video when browser attempted to pause it.", e); });
			}
		}
	}

	private attemptedplaycallback()
	{
		// let's just double check
		// this.canplay = true;
		if (this.isVisible)
		{
			this.play();
			this.video!.muted = false;
		}
		else
		{
			this.pause();
		}

		// there's a slight delay before this callback is fired and the video is actually playing
		this.video!.currentTime = 0;
	}

	public pause(): void
	{
		this.video!.playbackRate = 0;
		if (!this.canplay)
		{
			console.warn("Video is not ready to pause", this, this.video, this.video?.paused, this._canplay);
		}
	}

	// @ts-ignore override default behavior
	public play(): void
	{
		this.video!.playbackRate = 1;
		if (!this.canplay)
		{
			console.warn("Video is not ready to play... Atempting to play");
			this.video!.play().then(this.attemptedplaycallback.bind(this)).catch((e) => { console.log("could not play video", e); });
		}
	}

	public async oninteraction(event: Event)
	{
		if (!this.canplay)
		{
			let onfulfilled = () =>
			{
				console.log(`[${this.id}] is ready to play`);
				if (this.video!.paused)
				{
					console.log(`[${this.id}] is paused and not actually able to play like it says it is`, this.video);
					return;
				}

				this.canplay = true;
				// for (let event of activationevents)
				// {
				// 	document.removeEventListener(event, this.oninteraction.bind(this));
				// 	this.element.removeEventListener(event, this.oninteraction.bind(this));
				// 	this.mutebutton!.removeEventListener(event, this.oninteraction.bind(this));
				// }

				this.video!.currentTime = 0;
			};

			let onrejected = (reason:any) =>
			{
				this.canplay = false;
				console.warn("Video failed to play", event.type, reason, this);
			};

			this.video!.play().then(onfulfilled, onrejected).catch((e) => { console.log("could not play video for some reason", e); });
		}
	}

	public onvideoclicked(event: Event)
	{
		if (this.canplay)
		{
			if (this.paused)
			{
				this.play();
			}
			else
			{
				this.pause();
			}
		}
	}

	public onaudioclicked(event: Event)
	{
		// muted
		if (this.volume! <= 0.1)
		{
			this.video!.muted = false;
			this.volume = 1;
		}
		else
		{
			this.volume = 0;
		}
	}


	// //#region video mapped properties
	// // @ts-ignore
	// public get onenterpictureinpicture(): ((this: HTMLVideoElement, ev: Event) => any) | null { return this.video.onenterpictureinpicture; }
	// // @ts-ignore
	// public set onenterpictureinpicture(value) { this.video.onenterpictureinpicture = value; }
	// // @ts-ignore
	// public get onleavepictureinpicture(): ((this: HTMLVideoElement, ev: Event) => any) | null { return this.video.onleavepictureinpicture; }
	// // @ts-ignore
	// public set onleavepictureinpicture(value) { this.video.onleavepictureinpicture = value; }
	// getVideoPlaybackQuality(): VideoPlaybackQuality
	// {
	// 	return this.video.getVideoPlaybackQuality();
	// }
	// // @ts-ignore
	// requestPictureInPicture(): Promise<PictureInPictureWindow>
	// {
	// // @ts-ignore
	// 	return this.video.requestPictureInPicture();
	// }
	// public get onencrypted(): ((this: HTMLMediaElement, ev: MediaEncryptedEvent) => any) | null { return this.video.onencrypted; }
	// public set onencrypted(value) { this.video.onencrypted = value; }
	// public get onwaitingforkey(): ((this: HTMLMediaElement, ev: Event) => any) | null { return this.video.onwaitingforkey; }
	// public set onwaitingforkey(value) { this.video.onwaitingforkey = value; }
	// addTextTrack(kind: TextTrackKind, label?: string, language?: string): TextTrack
	// {
	// 	return this.video.addTextTrack(kind, label, language);
	// }
	// canPlayType(type: string): CanPlayTypeResult
	// {
	// 	return this.video.canPlayType(type);
	// }
	// fastSeek(time: number): void
	// {
	// 	return this.video.fastSeek(time);
	// }
	// load(): void
	// {
	// 	return this.video.load();

	// }
	// setMediaKeys(mediaKeys: MediaKeys | null): Promise<void>
	// {
	// 	return this.video.setMediaKeys(mediaKeys);
	// }

	// // @ts-ignore
	// public get disablePictureInPicture(): boolean { return this.video.disablePictureInPicture; }
	// // @ts-ignore
	// public set disablePictureInPicture(value) { this.video.disablePictureInPicture = value; }
	// public get height(): number { return this.video.height; }
	// public set height(value) { this.video.height = value; }
	// public get playsInline(): boolean { return this.video.playsInline; }
	// public set playsInline(value) { this.video.playsInline = value; }
	// public get poster(): string { return this.video.poster; }
	// public set poster(value) { this.video.poster = value; }
	// public get videoHeight(): number { return this.video.videoHeight; }
	// public get videoWidth(): number { return this.video.videoWidth; }
	// public get width(): number { return this.video.width; }
	// public set width(value) { this.video.width = value; }
	// public get autoplay(): boolean { return this.video.autoplay; }
	// public set autoplay(value) { this.video.autoplay = value; }
	// public get buffered(): TimeRanges { return this.video.buffered; }
	// public get controls(): boolean { return this.video.controls; }
	// public set controls(value) { this.video.controls = value; }
	// public get crossOrigin(): string | null { return this.video.crossOrigin; }
	// public set crossOrigin(value) { this.video.crossOrigin = value; }
	// public get currentSrc(): string { return this.video.currentSrc; }
	// public get currentTime(): number { return this.video.currentTime; }
	// public set currentTime(value) { this.video.currentTime = value; }
	// public get defaultMuted(): boolean { return this.video.defaultMuted; }
	// public set defaultMuted(value) { this.video.defaultMuted = value; }
	// public get defaultPlaybackRate(): number { return this.video.defaultPlaybackRate; }
	// public set defaultPlaybackRate(value) { this.video.defaultPlaybackRate = value; }
	// // @ts-ignore
	// public get disableRemotePlayback(): boolean { return this.video.disableRemotePlayback; }
	// // @ts-ignore
	// public set disableRemotePlayback(value) { this.video.disableRemotePlayback = value; }
	// public get duration(): number { return this.video.duration; }
	// public get ended(): boolean { return this.video.ended; }
	// public get error(): MediaError | null { return this.video.error; }
	// public get loop(): boolean { return this.video.loop; }
	// public set loop(value) { this.video.loop = value; }
	// public get mediaKeys(): MediaKeys | null { return this.video.mediaKeys; }
	// public get muted(): boolean { return this.video.muted; }
	// public set muted(value) { this.video.muted = value; }
	// public get networkState(): number { return this.video.networkState; }
	// public get playbackRate(): number { return this.video.playbackRate; }
	// public set playbackRate(value) { this.video.playbackRate = value; }
	// public get played(): TimeRanges { return this.video.played; }
	// // @ts-ignore
	// public get preload(): "" | "none" | "metadata" | "auto" { return this.video.preload; }
	// public set preload(value) { this.video.preload = value; }
	// public get readyState(): number { return this.video.readyState; }
	// // @ts-ignore
	// public get remote(): RemotePlayback { return this.video.remote; }
	// public get seekable(): TimeRanges { return this.video.seekable; }
	// public get seeking(): boolean { return this.video.seeking; }
	// public get src(): string { return this.video.src; }
	// public set src(value) { this.video.src = value; }
	// public get srcObject(): MediaProvider | null { return this.video.srcObject; }
	// public set srcObject(value) { this.video.srcObject = value; }
	// public get textTracks(): TextTrackList { return this.video.textTracks; }
	// public get HAVE_CURRENT_DATA(): number { return this.video.HAVE_CURRENT_DATA; }
	// public get HAVE_ENOUGH_DATA(): number { return this.video.HAVE_ENOUGH_DATA; }
	// public get HAVE_FUTURE_DATA(): number { return this.video.HAVE_FUTURE_DATA; }
	// public get HAVE_METADATA(): number { return this.video.HAVE_METADATA; }
	// public get HAVE_NOTHING(): number { return this.video.HAVE_NOTHING; }
	// public get NETWORK_EMPTY(): number { return this.video.NETWORK_EMPTY; }
	// public get NETWORK_IDLE(): number { return this.video.NETWORK_IDLE; }
	// public get NETWORK_LOADING(): number { return this.video.NETWORK_LOADING; }
	// public get NETWORK_NO_SOURCE(): number { return this.video.NETWORK_NO_SOURCE; }
	// //#endregion
}
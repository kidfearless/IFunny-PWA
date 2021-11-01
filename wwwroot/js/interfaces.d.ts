type int = number;
type long = number;
type double = number;

declare enum Type
{
	Picture = "picture",
	Video = "video",
}

//#region interfaces
interface Session
{
	expirationDate: string;
	clientID: string;
	csrf: string;
}

interface HttpResult<T>
{
	result: T;
	message?: string;
}

interface IntersectionEntry<T extends HTMLElement> extends IntersectionObserverEntry
{
	readonly target: T;
}

interface PageResult
{
	items: Item[];
	pageCount: number;
}

interface Item
{
	bgColor: string;
	canRepublish: boolean;
	canRemove: boolean;
	captionBottomText: string;
	captionText: string;
	comments: number;
	copyright: Copyright | null;
	created: number;
	description: string;
	id: string;
	isAbused: boolean;
	isFeatured: boolean;
	isPinned: boolean;
	isRepublished: boolean;
	isSmiled: boolean;
	isUnsmiled: boolean;
	fixedTitle: string;
	link: string;
	published: number;
	republished: number;
	smiles: number;
	state: string;
	thumb: Thumb;
	title: string;
	url: string;
	canonical: string;
	creator: Creator;
	source: null;
	screen: string;
	shotStatus: string;
	size: Size;
	tags: string[];
	type: Type;
	ocr?: string;
}

interface Copyright
{
}

interface Creator
{
	avatar: Avatar;
	id: string;
	nick: string;
	profileUrl: string;
}

interface Avatar
{
	bgColor: string;
	l: string;
	m: string;
	s: string;
	url: string;
}

interface Size
{
	w: number;
	h: number;
}



interface Thumb
{
	s: string;
	m: string;
	l: string;
	xl: string;
	p: string;
	pSize: Size;
}


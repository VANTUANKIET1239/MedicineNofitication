export class News {
    private _NewsId?: string | undefined;
    private _img?: string | undefined;
    private _title?: string | undefined;
    private _detail?: string | undefined;

    constructor(
    NewsId?: string,
    img?: string,
    title?: string,
    detail?: string
    ) {
    this._NewsId = NewsId;
    this._img = img;
    this._title = title;
    this._detail = detail;
    }
    // Getter và setter cho _NewsId
    get NewsId(): string | undefined {
    return this._NewsId;
    }

    set NewsId(value: string | undefined) {
    this._NewsId = value;
    }

    // Getter và setter cho _img
    get img(): string | undefined {
    return this._img;
    }

    set img(value: string | undefined) {
    this._img = value;
    }

    // Getter và setter cho _title
    get title(): string | undefined {
    return this._title;
    }

    set title(value: string | undefined) {
    this._title = value;
    }

    // Getter và setter cho _detail
    get detail(): string | undefined {
    return this._detail;
    }

    set detail(value: string | undefined) {
    this._detail = value;
    }
}

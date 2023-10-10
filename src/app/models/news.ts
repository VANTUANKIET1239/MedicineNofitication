export class News {
    private _id?: string | undefined;
    private _img?: string | undefined;
    private _title?: string | undefined;
    private _detail?: string | undefined;
    private _like?: number | undefined; // Thêm trường _like

    constructor(
id?: string,
      img?: string,
      title?: string,
      detail?: string,
      like?: number // Thêm tham số like vào constructor
    ) {
      this._id = id;
      this._img = img;
      this._title = title;
      this._detail = detail;
      this._like = like; // Khởi tạo giá trị của _like
    }
  
    // Getter và setter cho _id
    get id(): string | undefined {
      return this._id;
    }
  
    set id(value: string | undefined) {
      this._id = value;
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
  
    // Getter và setter cho _like
    get like(): number | undefined {
      return this._like;
    }
  
    set like(value: number | undefined) {
      this._like = value;
    }
  }
  
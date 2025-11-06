export class DuplicateUserEmailError extends Error {
    errorCode = "U001";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 공통 베이스 에러
export class BaseError extends Error {
    constructor(errorCode, reason, statusCode = 400, data = null) {
        super(reason);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.reason = reason;
        this.statusCode = statusCode;
        this.data = data;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

// 존재하지 않는 데이터
export class NotFoundError extends BaseError {
    constructor(reason = "리소스를 찾을 수 없습니다.", data = null) {
        super("E404", reason, 404, data);
    }
}

// 유효하지 않은 요청
export class BadRequestError extends BaseError {
    constructor(reason = "잘못된 요청입니다.", data = null) {
        super("E400", reason, 400, data);
    }
}

// 서버 내부 오류
export class InternalServerError extends BaseError {
    constructor(reason = "서버 내부 오류가 발생했습니다.", data = null) {
        super("E500", reason, 500, data);
    }
}
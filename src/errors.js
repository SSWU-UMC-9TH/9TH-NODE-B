// 사용자 관련 에러
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  statusCode = 409;

  constructor(reason = "이미 존재하는 이메일입니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidPasswordError extends Error {
  errorCode = "U002";
  statusCode = 400;

  constructor(reason = "비밀번호는 8자 이상이어야 합니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserNotFoundError extends Error {
  errorCode = "U003";
  statusCode = 404;

  constructor(reason = "사용자를 찾을 수 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidProviderError extends Error {
  errorCode = "U004";
  statusCode = 400;

  constructor(reason = "잘못된 로그인 방식입니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 가게 관련 에러
export class StoreNotFoundError extends Error {
  errorCode = "S001";
  statusCode = 404;

  constructor(reason = "가게가 존재하지 않습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidStoreDataError extends Error {
  errorCode = "S002";
  statusCode = 400;

  constructor(reason = "가게 데이터가 유효하지 않습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 미션 관련 에러
export class MissionNotFoundError extends Error {
  errorCode = "M001";
  statusCode = 404;

  constructor(reason = "미션을 찾을 수 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserMissionError extends Error {
  errorCode = "M002";
  statusCode = 409;

  constructor(reason = "이미 도전하고 있는 미션입니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 리뷰 관련 에러
export class ReviewNotFoundError extends Error {
  errorCode = "R001";
  statusCode = 404;

  constructor(reason = "리뷰를 찾을 수 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 일반적인 요청 검증 에러
export class ValidationError extends Error {
  errorCode = "V001";
  statusCode = 400;

  constructor(reason = "요청 데이터가 유효하지 않습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}


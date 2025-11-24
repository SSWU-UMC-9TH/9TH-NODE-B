import { StatusCodes } from "http-status-codes";
import { bodyToReview, responseFromReview, ListUserReviewsRequestDto, UserReviewListResponseDto } from "../dtos/review.dto.js";
import { createReview, listUserReviews } from "../services/review.service.js";

export const handleCreateReview = async (req, res, next) => {
    /*
    #swagger.summary = '리뷰 등록 API';
    #swagger.parameters['storeId'] = {
        in: 'path',
        description: '리뷰를 작성할 가게 ID',
        required: true,
        type: 'integer'
    };

    #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                userId: { type: "number" },
                body: { type: "string" },
                score: { type: "number" },
                images: {
                type: "array",
                items: { type: "string" },
                description: "리뷰 이미지 URL 리스트"
                }
            }
            }
        }
        }
    };

    #swagger.responses[201] = {
        description: "리뷰 등록 성공",
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                success: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    store_id: { type: "number" },
                    user_id: { type: "number" },
                    body: { type: "string" },
                    score: { type: "number" },
                    created_at: { type: "string", format: "date-time" },
                    images: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                        id: { type: "number" },
                        image_url: { type: "string" },
                        created_at: { type: "string", format: "date-time" }
                        }
                    }
                    }
                }
                }
            }
            }
        }
        }
    };

    #swagger.responses[404] = {
        description: "존재하지 않는 가게 ID",
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                type: "object",
                properties: {
                    errorCode: { type: "string", example: "E404" },
                    reason: { type: "string" },
                    data: { type: "object", nullable: true }
                }
                },
                success: { type: "object", nullable: true }
            }
            }
        }
        }
    };
    */
    try {

        const { storeId } = req.params;
        const userId = req.user.id; // JWT 인증된 유저

        // [요청 DTO] body → DB insert용 구조 변환
        const reviewData = bodyToReview(req.body);

        // [Service 호출] 리뷰 등록 및 이미지 추가 처리
        const { review, images } = await createReview(storeId, userId, reviewData);

        // [응답 DTO] DB 결과 → 클라이언트 응답용 변환
        const response = responseFromReview({ review, images });

        res.status(StatusCodes.CREATED);
        res.success(response);
    } catch (error) {
        next(error);
    }
};

// 내가 작성한 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
    /*
    #swagger.summary = '내가 작성한 리뷰 목록 조회 API';
    #swagger.parameters['userId'] = {
        in: 'path',
        description: '리뷰 조회 대상 유저 ID',
        required: true,
        type: 'integer'
    };

    #swagger.parameters['cursor'] = {
        in: 'query',
        description: '다음 페이지(cursor based pagination)',
        required: false,
        type: 'integer'
    };

    #swagger.responses[200] = {
        description: "리뷰 목록 조회 성공",
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                success: {
                type: "object",
                properties: {
                    reviews: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                        id: { type: "number" },
                        userId: { type: "number" },
                        storeId: { type: "number" },
                        body: { type: "string" },
                        score: { type: "number" },
                        createdAt: { type: "string", format: "date-time" },
                        store: {
                            type: "object",
                            properties: {
                            id: { type: "number" },
                            name: { type: "string" }
                            }
                        }
                        }
                    }
                    },
                    nextCursor: {
                    type: "number",
                    nullable: true,
                    description: "다음 페이지 존재 시 반환"
                    }
                }
                }
            }
            }
        }
        }
    };

    #swagger.responses[500] = {
        description: "서버 내부 오류",
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                type: "object",
                properties: {
                    errorCode: { type: "string", example: "E500" },
                    reason: { type: "string" },
                    data: { type: "object", nullable: true }
                }
                },
                success: { type: "object", nullable: true }
            }
            }
        }
        }
    };
    */
    try {
        const requestDto = new ListUserReviewsRequestDto(req.params, req.query);
        const { reviews, nextCursor } = await listUserReviews(requestDto.userId, requestDto.cursor);
        const responseDto = new UserReviewListResponseDto(reviews, nextCursor);

        res.status(StatusCodes.OK);
        res.statuss(requestDto);
    } catch (err) {
        next(err);
    }
};
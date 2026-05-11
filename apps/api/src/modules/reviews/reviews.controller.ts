import { Controller, Get } from '@nestjs/common'
import { ReviewsService, GoogleReview } from './reviews.service'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // GET /api/v1/reviews — público, sin auth
  @Get()
  async getReviews(): Promise<GoogleReview[]> {
    return this.reviewsService.getReviews()
  }
}

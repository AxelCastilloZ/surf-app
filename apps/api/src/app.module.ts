import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { SupabaseModule } from './common/supabase/supabase.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { GalleryModule } from './modules/gallery/gallery.module'
import { PackagesModule } from './modules/packages/packages.module'
import { ReviewsModule } from './modules/reviews/reviews.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    SupabaseModule,
    AuthModule,
    UsersModule,
    GalleryModule,
    PackagesModule,
    ReviewsModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { SupabaseModule } from './common/supabase/supabase.module'
import { GalleryModule } from './modules/gallery/gallery.module'
import { PackagesModule } from './modules/packages/packages.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    SupabaseModule,
    GalleryModule,
    PackagesModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupabaseModule } from './common/supabase/supabase.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { GalleryModule } from './modules/gallery/gallery.module'
import { PackagesModule } from './modules/packages/packages.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { ClientsModule } from './modules/clients/clients.module'
import { InstructorsModule } from './modules/instructors/instructors.module'
import { BookingsModule } from './modules/bookings/bookings.module'
import { PricingModule } from './modules/pricing/pricing.module'
import { SiteSettingsModule } from './modules/site-settings/site-settings.module'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.getOrThrow<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        migrations: [join(__dirname, 'database', 'migrations', '*.{ts,js}')],
        migrationsTableName: 'typeorm_migrations',
        synchronize: false,
      }),
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    GalleryModule,
    PackagesModule,
    ReviewsModule,
    ClientsModule,
    InstructorsModule,
    BookingsModule,
    PricingModule,
    SiteSettingsModule,
  ],
})
export class AppModule {}

export class CreateCarouselBannerDto {
  title!: string;
  imageDesktopUrl!: string;
  imageMobileUrl?: string;
  targetUrl!: string;
  isActive?: boolean;
  displayOrder?: number;
}
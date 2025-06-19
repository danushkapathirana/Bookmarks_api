import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  // create bookmark
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prismaService.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  // get all bookmarks
  async getBookmarks(userId: number) {
    const bookmarks = await this.prismaService.bookmark.findMany({
      where: {
        userId: userId,
      },
    });

    return bookmarks;
  }

  // get single bookmark
  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId: userId,
      },
    });

    return bookmark;
  }

  // edit bookmark
  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const existingBookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!existingBookmark || existingBookmark?.userId !== userId) {
      throw new ForbiddenException('Access to resource denied.');
    }

    const bookmark = await this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });

    return bookmark;
  }

  // delete bookmark
  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const existingBookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!existingBookmark || existingBookmark?.userId !== userId) {
      throw new ForbiddenException('Access to resource denied.');
    }

    await this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}

import request from "@/api/request";
import { IBaseType } from "@/api/modules/types";
import { BookCategoryItem } from "./type";

/**
 * 获取书籍分类列表
 */
export function reqGetBookCategoryList() {
  return request.post<IBaseType<BookCategoryItem[]>>({
    url: "/book-store/categorys",
  });
}

import { EBooStoreCategory } from '@/app/types/boo-store.type'

export async function getBookStoreCategorysService() {
    // 由于数据并不来源本站，所以分类固定，无法更改
    return [
        { id: 1, categoryName: '玄幻', field: EBooStoreCategory.X_H },
        { id: 2, categoryName: '武侠', field: EBooStoreCategory.W_X },
        { id: 3, categoryName: '系统', field: EBooStoreCategory.X_T },
        { id: 4, categoryName: '都市', field: EBooStoreCategory.D_S },
        { id: 5, categoryName: '历史', field: EBooStoreCategory.L_S },
        { id: 6, categoryName: '科幻', field: EBooStoreCategory.K_H },
        { id: 7, categoryName: '言情', field: EBooStoreCategory.Y_Q },
        { id: 8, categoryName: '种田', field: EBooStoreCategory.Z_T },
        { id: 9, categoryName: '其他', field: EBooStoreCategory.Q_T }
    ]
}

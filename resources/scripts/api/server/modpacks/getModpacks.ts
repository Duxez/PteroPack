import http, { PaginationDataSet } from '@/api/http'
import { Modpack } from './Modpack';
import { ModpackSearchFilter } from '@/components/server/modpacks/ModpackContainer';

export default (uuid: string, pageIndex: number = 0, filters: ModpackSearchFilter): Promise<any> => {
    return new Promise((resolve, reject) => {
        let filterQuery = '&';
        if(filters.modloaderType) {
            filterQuery += `modloader=${filters.modloaderType}`;
        } else {
            filterQuery += `modloader=0`;
        }

        http.get(`/api/client/servers/${uuid}/modpacks?pageindex=${pageIndex}${filterQuery}`)
            .then((response) => {
                resolve([(response.data.data || []).map((item: any) => rawDataToModpackData(item)), rawDataToModpackPaginationData(response.data.pagination), {modloaderType: filters.modloaderType}])
            })
            .catch(reject);
    });
}

export const rawDataToModpackPaginationData = (data: any): PaginationDataSet => ({
    total: data.totalCount,
    count: data.resultCount,
    perPage: data.pageSize,
    currentPage: Math.ceil((data.index + data.pageSize) / data.pageSize) == 0 ? 1 : Math.ceil((data.index + data.pageSize) / data.pageSize),
    totalPages: Math.ceil(data.totalCount / data.pageSize)
});

export const rawDataToModpackData = (data: any): Modpack => ({
    id: data.id,
    gameId: data.gameId,
    name: data.name,
    slug: data.slug,
    links: data.links,
    summary: data.summary,
    status: data.status,
    downloadCount: data.downloadCount,
    isFeatured: data.isFeatured,
    primaryCategoryId: data.primaryCategoryId,
    categories: data.categories,
    classId: data.classId,
    authors: data.authors,
    logo: data.logo,
    screenshots: data.screenshots,
    mainFileId: data.mainFileId,
    latestFiles: data.latestFiles,
    latestFileIndexes: data.latestFileIndexes,
    latestEarlyAccessFileIndexes: data.latestEarlyAccessFileIndexes,
    dateCreated: data.dateCreated,
    dateModified: data.dateModified,
    dateReleased: data.dateReleased,
    allowModDistribution: data.allowModDistribution,
    gamePopularityRank: data.gamePopularityRank,
    isAvailable: data.isAvailable,
    thumbsUpCount: data.thumbsUpCount,
});

